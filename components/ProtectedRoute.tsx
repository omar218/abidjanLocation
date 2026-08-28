'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import type { UserRole } from '@/lib/supabase/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

/**
 * Composant d'ordre supérieur pour sécuriser l'accès aux pages.
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (requiredRole) {
        const allowed = Array.isArray(requiredRole) 
          ? requiredRole.includes(user.role as UserRole)
          : user.role === requiredRole;

        if (!allowed) {
          router.push('/');
        }
      }
    }
  }, [user, loading, router, requiredRole]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.role as UserRole)
      : user.role === requiredRole;

    if (!allowed) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
