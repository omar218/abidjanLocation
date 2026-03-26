'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-primary text-xl">Abidjan location</a>
        <nav className="text-sm text-gray-600 flex items-center gap-4">
          <span>Trouver votre prochain logement à Abidjan</span>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'proprietaire' && (
                <a 
                  href="/dashboard" 
                  className={`${pathname === '/dashboard' ? 'font-medium text-blue-600' : 'text-primary hover:underline'}`}
                >
                  Tableau de bord
                </a>
              )}
              <button 
                onClick={handleLogout}
                className="text-primary hover:underline"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <a href="/login" className="text-primary hover:underline">Connexion</a>
          )}
        </nav>
      </div>
    </header>
  );
}
