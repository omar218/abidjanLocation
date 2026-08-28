"use client"
import { useMemo } from 'react'

/**
 * Structure de données représentant l'état des filtres de recherche.
 */
export type Filters = {
  query: string      // Terme de recherche libre (mots-clés, quartier, etc.)
  commune: string    // Commune ciblée (ex: Cocody, Marcory, etc.)
  minPrice: string   // Prix minimum en XOF
  maxPrice: string   // Prix maximum en XOF
  rooms: string      // Nombre de pièces/chambres
  type: string       // Type d'habitation (studio, villa, etc.)
  furnished: string  // État meublé ("oui", "non" ou indifférent "")
}

/**
 * Composant SearchFilters : Barre de filtres interactive pour affiner la recherche de biens immobiliers.
 * Permet de filtrer en temps réel par mot-clé, commune, budget, typologie et aménagement.
 * 
 * @param filters - État actuel des filtres
 * @param setFilters - Fonction de mise à jour partielle des filtres
 * @param communes - Liste dynamique des communes disponibles issues des annonces
 */
export default function SearchFilters({
  filters,
  setFilters,
  communes
}: {
  filters: Filters
  setFilters: (f: Partial<Filters>) => void
  communes: string[]
}) {
  // Options prédéfinies pour les menus déroulants
  const roomOptions = ["", "1", "2", "3", "4", "5+"]
  const typeOptions = ["", "studio", "3p", "villa", "duplex", "chambre-salon"]
  const furnishedOptions = ["", "oui", "non"]

  // Construction mémoïsée de la liste des options de communes avec l'option par défaut
  const communeOptions = useMemo(() => ["", ...communes], [communes])

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {/* Filtre textuel libre */}
      <input
        value={filters.query}
        onChange={(e) => setFilters({ query: e.target.value })}
        placeholder="Rechercher (quartier, mot-clé)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Sélection de la commune */}
      <select
        value={filters.commune}
        onChange={(e) => setFilters({ commune: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {communeOptions.map((c) => (
          <option key={c} value={c}>{c === '' ? 'Toutes communes' : c}</option>
        ))}
      </select>

      {/* Filtre de prix minimum */}
      <input
        type="number"
        inputMode="numeric"
        value={filters.minPrice}
        onChange={(e) => setFilters({ minPrice: e.target.value })}
        placeholder="Prix min (XOF)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Filtre de prix maximum */}
      <input
        type="number"
        inputMode="numeric"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ maxPrice: e.target.value })}
        placeholder="Prix max (XOF)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Filtre par nombre de chambres */}
      <select
        value={filters.rooms}
        onChange={(e) => setFilters({ rooms: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {roomOptions.map((r) => (
          <option key={r} value={r}>{r === '' ? 'Chambres' : r}</option>
        ))}
      </select>

      {/* Filtre par type de logement */}
      <select
        value={filters.type}
        onChange={(e) => setFilters({ type: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {typeOptions.map((t) => (
          <option key={t} value={t}>{t === '' ? 'Type' : t}</option>
        ))}
      </select>

      {/* Filtre meublé / non meublé */}
      <select
        value={filters.furnished}
        onChange={(e) => setFilters({ furnished: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2 md:col-span-3 lg:col-span-6"
      >
        {furnishedOptions.map((f) => (
          <option key={f} value={f}>{f === '' ? 'Meublé ?' : f}</option>
        ))}
      </select>
    </div>
  )
}

