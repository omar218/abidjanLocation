"use client"
import { useMemo, useState } from 'react'
import vehiclesData from '@/data/vehicles.json'
import VehicleCard, { Vehicle } from '@/components/VehicleCard'
import VehicleFilters, { VehicleFilters as Filters } from '@/components/VehicleFilters'
import { normalize } from '@/lib/format'

export default function VehiclesPage() {
  const [filters, setFilters] = useState<Filters>({
    query: '',
    commune: '',
    minPrice: '',
    maxPrice: '',
    seats: '',
    transmission: '',
    fuel: ''
  })

  const communes = useMemo(() => {
    const set = new Set<string>()
    ;(vehiclesData as Vehicle[]).forEach(v => set.add(v.commune))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    return (vehiclesData as Vehicle[]).filter(v => {
      if (filters.query) {
        const q = normalize(filters.query)
        const target = normalize(`${v.title} ${v.brand} ${v.model} ${v.commune} ${v.quartier}`)
        if (!target.includes(q)) return false
      }
      if (filters.commune && v.commune !== filters.commune) return false
      if (filters.minPrice && v.price_xof_per_day < Number(filters.minPrice)) return false
      if (filters.maxPrice && v.price_xof_per_day > Number(filters.maxPrice)) return false
      if (filters.seats) {
        if (filters.seats === '7+' && v.seats < 7) return false
        if (filters.seats !== '7+' && v.seats !== Number(filters.seats)) return false
      }
      if (filters.transmission && v.transmission !== filters.transmission) return false
      if (filters.fuel && v.fuel !== filters.fuel) return false
      return true
    })
  }, [filters])

  const updateFilters = (f: Partial<Filters>) => setFilters(prev => ({ ...prev, ...f }))

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Louer un véhicule à Abidjan</h1>
        <VehicleFilters filters={filters} setFilters={updateFilters} communes={communes} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-gray-600">Aucun résultat. Essayez d’élargir vos filtres.</div>
      )}
    </div>
  )
}
