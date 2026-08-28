'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Building2, User, LogOut, LayoutDashboard, PlusCircle, Search } from 'lucide-react';

/**
 * Composant NavBar : Barre de navigation supérieure moderne
 */
export default function NavBar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isOwnerOrAdmin = user && ['proprietaire', 'agence', 'admin'].includes(user.role);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="mx-auto max-w-6xl px-4 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg hover:opacity-90">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <span>Abidjan <span className="text-blue-600">Location</span></span>
        </Link>
        
        {/* Liens de navigation */}
        <nav className="text-sm flex items-center gap-4">
          <Link 
            href="/search" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/search' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Explorer</span>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              {/* Accès réservé aux propriétaires / agences */}
              {isOwnerOrAdmin && (
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    pathname === '/dashboard' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </Link>
              )}

              {/* Badge utilisateur vers /account */}
              <Link 
                href="/account"
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
                  pathname === '/account' ? 'bg-blue-100 text-blue-900 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Gérer mon compte"
              >
                <User className="w-3 h-3 text-gray-500" />
                <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase text-[9px]">
                  {user.role}
                </span>
              </Link>

              {/* Bouton de déconnexion */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Connexion
              </Link>
              <Link 
                href="/dashboard" 
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Déposer une annonce
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
