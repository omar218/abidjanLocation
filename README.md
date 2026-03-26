# Abidjan Location Web App version 1.0

Application web (Next.js) pour rechercher des maisons en location à Abidjan. Données mock en JSON, filtres côté client, pages liste et détail.

## Démarrage

```bash
pnpm i # ou npm i / yarn
pnpm dev # ou npm run dev / yarn dev
```

Ouvrir http://localhost:3000

## Structure
- app/: App Router
- components/: composants UI
- data/: données JSON mock
- lib/: utilitaires
- public/: assets

## Personnalisation
- Ajoutez de nouvelles annonces dans `data/listings.json`
- Ajustez les filtres dans `components/SearchFilters.tsx`
