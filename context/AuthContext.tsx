'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/supabase/types';

/**
 * Type représentant l'utilisateur connecté dans l'application.
 */
export type AuthUser = {
  id: string;
  email: string;
  role: UserRole | string;
  name?: string;
  phone?: string;
  isSubscribed?: boolean;
  avatarUrl?: string;
} | null;

/**
 * Interface complète du contexte d'authentification Supabase Auth.
 */
type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  signUp: (email: string, password: string, role: UserRole | string, fullName?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { full_name?: string; phone?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );

  // Fonction pour charger le profil utilisateur depuis Supabase
  const loadSupabaseUserProfile = async (userId: string, email: string, metadata?: any) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Le profil n'existe pas encore (ex: après OAuth Google) -> Création automatique
        const newRole = (metadata?.role as UserRole) || 'locataire';
        const newName = metadata?.full_name || metadata?.name || email.split('@')[0];
        const newPhone = metadata?.phone || null;

        await supabase.from('profiles').insert({
          id: userId,
          role: newRole,
          full_name: newName,
          phone: newPhone,
          is_subscribed: false
        });

        setUser({
          id: userId,
          email,
          role: newRole,
          name: newName,
          phone: newPhone || undefined,
          isSubscribed: false,
          avatarUrl: metadata?.avatar_url
        });
        return;
      }

      const role = profile?.role || metadata?.role || 'locataire';
      const name = profile?.full_name || metadata?.full_name || email.split('@')[0];
      const phone = profile?.phone || metadata?.phone || undefined;
      const isSubscribed = profile?.is_subscribed || false;

      setUser({
        id: userId,
        email,
        role,
        name,
        phone,
        isSubscribed,
        avatarUrl: metadata?.avatar_url
      });
    } catch (err) {
      console.error('Erreur chargement profil Supabase:', err);
      setUser({
        id: userId,
        email,
        role: metadata?.role || 'locataire',
        name: email.split('@')[0]
      });
    }
  };

  // Initialisation et écoute de session Supabase
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            await loadSupabaseUserProfile(
              session.user.id, 
              session.user.email || '', 
              session.user.user_metadata
            );
            setLoading(false);
            return;
          }
        }

        // Fallback session API locale (cookie de session)
        const res = await fetch('/api/auth/session');
        if (res.ok && mounted) {
          const data = await res.json();
          if (data.user) {
            setUser({
              id: data.user.id || 'mock-user-id',
              email: data.user.email,
              role: data.user.role || 'locataire',
              name: data.user.name || data.user.email?.split('@')[0]
            });
          }
        }
      } catch (error) {
        console.error('Erreur initialisation session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          await loadSupabaseUserProfile(
            session.user.id, 
            session.user.email || '', 
            session.user.user_metadata
          );
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [isSupabaseConfigured]);

  const refreshProfile = async () => {
    if (isSupabaseConfigured && user?.id) {
      await loadSupabaseUserProfile(user.id, user.email);
    }
  };

  /**
   * Connexion avec Email et Mot de passe
   */
  const login = async (email: string, password: string, role?: string) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          await loadSupabaseUserProfile(data.user.id, data.user.email || email, data.user.user_metadata);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const userRole = profile?.role || role || 'locataire';
          const redirectTo = userRole === 'proprietaire' ? '/dashboard' : '/';
          return { success: true, redirectTo };
        }
      }

      // Fallback via /api/login
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: role || 'locataire' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }

      setUser({
        id: data.user.id || 'local-user',
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
      });
      return { success: true, redirectTo: data.redirectTo };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur de connexion' };
    }
  };

  /**
   * Inscription d'un nouvel utilisateur avec rôle
   */
  const signUp = async (
    email: string,
    password: string,
    role: UserRole | string,
    fullName?: string,
    phone?: string
  ) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              full_name: fullName,
              phone: phone,
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            role: role as UserRole,
            full_name: fullName || email.split('@')[0],
            phone: phone || null,
            is_subscribed: false,
          });

          await loadSupabaseUserProfile(data.user.id, email, { role, full_name: fullName, phone });
          return { success: true };
        }
      }

      // Fallback local
      return await login(email, password, role);
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
    }
  };

  /**
   * Connexion OAuth avec Google
   */
  const signInWithGoogle = async () => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase n\'est pas encore configuré avec les clés d\'API');
      }

      const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/auth/callback`,
        },
      });

      if (error) throw new Error(error.message);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur connexion Google' };
    }
  };

  /**
   * Connexion par Magic Link (Lien sécurisé envoyé par email sans mot de passe)
   */
  const signInWithMagicLink = async (email: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase n\'est pas encore configuré dans .env.local');
      }

      const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectOrigin}/auth/callback`,
        },
      });

      if (error) throw new Error(error.message);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur envoi du lien de connexion' };
    }
  };

  /**
   * Réinitialisation de mot de passe par email
   */
  const resetPassword = async (email: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase n\'est pas encore configuré dans .env.local');
      }

      const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${redirectOrigin}/reset-password`,
      });

      if (error) throw new Error(error.message);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur de réinitialisation' };
    }
  };

  /**
   * Mise à jour du mot de passe utilisateur
   */
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur mise à jour mot de passe' };
    }
  };

  /**
   * Mise à jour des informations de profil
   */
  const updateProfile = async (data: { full_name?: string; phone?: string; role?: UserRole }) => {
    try {
      if (!user?.id) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...(data.full_name !== undefined && { full_name: data.full_name }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.role !== undefined && { role: data.role }),
        })
        .eq('id', user.id);

      if (error) throw new Error(error.message);
      await refreshProfile();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur mise à jour profil' };
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        signInWithGoogle,
        signInWithMagicLink,
        resetPassword,
        updatePassword,
        updateProfile,
        logout,
        refreshProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
