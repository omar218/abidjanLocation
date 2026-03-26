"use client"
import { useMemo } from 'react'

export type VehicleFilters = {
  query: string
  commune: string
  minPrice: string
  maxPrice: string
  seats: string
  transmission: string
  fuel: string
}

export default function VehicleFilters({
  filters,
  setFilters,
  communes
}: {
  filters: VehicleFilters
  setFilters: (f: Partial<VehicleFilters>) => void
  communes: string[]
}) {
  const transmissionOptions = ["", "manuelle", "automatique"]
  const fuelOptions = ["", "essence", "diesel", "hybride", "électrique"]
  const seatOptions = ["", "2", "4", "5", "7+"]

  const communeOptions = useMemo(() => ["", ...communes], [communes])

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <input
        value={filters.query}
        onChange={(e) => setFilters({ query: e.target.value })}
        placeholder="Rechercher (marque, modèle, quartier)"
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
        placeholder="Prix min/jour (XOF)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="number"
        inputMode="numeric"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ maxPrice: e.target.value })}
        placeholder="Prix max/jour (XOF)"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        value={filters.seats}
        onChange={(e) => setFilters({ seats: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {seatOptions.map((s) => (
          <option key={s} value={s}>{s === '' ? 'Places' : s}</option>
        ))}
      </select>

      <select
        value={filters.transmission}
        onChange={(e) => setFilters({ transmission: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {transmissionOptions.map((t) => (
          <option key={t} value={t}>{t === '' ? 'Boîte' : t}</option>
        ))}
      </select>

      <select
        value={filters.fuel}
        onChange={(e) => setFilters({ fuel: e.target.value })}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2 md:col-span-3 lg:col-span-6"
      >
        {fuelOptions.map((f) => (
          <option key={f} value={f}>{f === '' ? 'Carburant' : f}</option>
        ))}
      </select>
    </div>
  )
}
