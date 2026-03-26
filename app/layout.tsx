import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'Abidjan Rentals',
  description: 'Recherche de maisons en location à Abidjan',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <NavBar />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500">
              © {new Date().getFullYear()} Abidjan-cote d'ivoire by TNTECH.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

