import type { Config } from 'tailwindcss'

/**
 * Configuration de Tailwind CSS pour l'application Abidjan Location.
 * Définit les chemins des fichiers sources analysés et personnalise la palette de couleurs.
 */
export default {
  // Chemins des composants et pages contenant des classes Tailwind
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Couleur primaire de la charte graphique (Teal / Cyan foncé)
        primary: '#0e7490'
      }
    },
  },
  plugins: [],
} satisfies Config

