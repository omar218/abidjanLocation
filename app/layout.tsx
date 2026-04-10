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
          <footer className="border-t bg-white mt-16">
            <div className="mx-auto max-w-6xl px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium">Téléphone:</span>
                      <a href="tel:+2250747643420" className="ml-2 text-primary hover:underline">00225 07 47 64 34 20</a>
                    </p>
                    <p>Email: omar@abidjan-location.ci</p>
                    <p>Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>

                {/* Partenaires */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Partenaires</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Orange CI</li>
                    <li>• Société Générale CI</li>
                    <li>• Cinet Pay</li>
                    <li>• Code Ivoire</li>
                    <li>• Bow Framework</li>
                  </ul>
                </div>

                
                {/* Légal */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Légal</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>© {new Date().getFullYear()} Abidjan Location</p>
                    <p>Tous droits réservés</p>
                    <p className="text-xs">Propriété intellectuelle déposée</p>
                    <p className="text-xs">Marque commerciale protégée</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
                <p>Abidjan-cote d'ivoire by TNTECH | Plateforme de location immobilière leader à Abidjan</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

