"use client"
import { useMemo } from 'react'

export type Filters = {
  query: string
  commune: string
  minPrice: string
  maxPrice: string
  rooms: string
  type: string
  furnished: string
}

export default function SearchFilters({
  filters,
  setFilters,
  communes
}: {
  filters: Filters
  setFilters: (f: Partial<Filters>) => void
  communes: string[]
}) {
  const roomOptions = ["", "1", "2", "3", "4", "5+"]
  const typeOptions = ["", "studio", "3p", "villa", "duplex","chambre-salon"]
  const furnishedOptions = ["", "oui", "non"]

  const communeOptions = useMemo(() => ["", ...communes], [communes])

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <input
        value={filters.query}
        onChange={(e) => setFilters({ query: e.target.value })}
        placeholder="Rechercher (quartier, mot-clé)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        value={filters.commune}
        onChange={(e) => setFilters({ commune: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {communeOptions.map((c) => (
          <option key={c} value={c}>{c === '' ? 'Toutes communes' : c}</option>
        ))}
      </select>

      <input
        type="number"
        inputMode="numeric"
        value={filters.minPrice}
        onChange={(e) => setFilters({ minPrice: e.target.value })}
        placeholder="Prix min (XOF)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="number"
        inputMode="numeric"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ maxPrice: e.target.value })}
        placeholder="Prix max (XOF)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        value={filters.rooms}
        onChange={(e) => setFilters({ rooms: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {roomOptions.map((r) => (
          <option key={r} value={r}>{r === '' ? 'Chambres' : r}</option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters({ type: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {typeOptions.map((t) => (
          <option key={t} value={t}>{t === '' ? 'Type' : t}</option>
        ))}
      </select>

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
