import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import NavBar from '@/components/NavBar';

/**
 * Métadonnées globales de l'application (SEO et titre de page).
 */
export const metadata = {
  title: 'Abidjan Rentals',
  description: 'Recherche de maisons et appartements en location à Abidjan',
};

/**
 * Layout racine (RootLayout) de l'application Next.js (App Router).
 * Enveloppe l'ensemble des pages avec :
 * - Le contexte d'authentification global (`AuthProvider`)
 * - La barre de navigation (`NavBar`)
 * - Le conteneur principal (`<main>`)
 * - Le pied de page (`<footer>`) avec les contacts, partenaires et mentions légales
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {/* Fournisseur d'état d'authentification global */}
        <AuthProvider>
          {/* Barre de navigation supérieure */}
          <NavBar />

          {/* Contenu principal de chaque page */}
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

          {/* Pied de page informatif et institutionnel */}
          <footer className="border-t bg-white mt-16">
            <div className="mx-auto max-w-6xl px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                {/* Section Contact & Assistance */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium">Téléphone:</span>
                      <a href="tel:+2250747643420" className="ml-2 text-primary hover:underline">00225 07 47 64 34 20</a>
                    </p>
                    <p>Email: @abidjan-location.ci</p>
                    <p>Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>

                {/* Section Partenaires technologiques et bancaires */}
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

                {/* Section Informations Légales & Droits */}
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
              
              {/* Mention de bas de page */}
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


