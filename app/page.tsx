"use client"
import { useMemo, useState } from 'react'
import Link from 'next/link'
import listingsData from '@/data/listings.json'
import ListingCard, { Listing } from '@/components/ListingCard'
import SearchFilters, { Filters } from '@/components/SearchFilters'
import { normalize } from '@/lib/format'

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>({
    query: '',
    commune: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    type: '',
    furnished: ''
  })

  const communes = useMemo(() => {
    const set = new Set<string>()
    listingsData.forEach(l => set.add(l.commune))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    return (listingsData as Listing[]).filter(l => {
      if (filters.query) {
        const q = normalize(filters.query)
        const target = normalize(`${l.title} ${l.commune} ${l.quartier} ${l.type}`)
        if (!target.includes(q)) return false
      }
      if (filters.commune && l.commune !== filters.commune) return false
      if (filters.minPrice && l.price_xof < Number(filters.minPrice)) return false
      if (filters.maxPrice && l.price_xof > Number(filters.maxPrice)) return false
      if (filters.rooms) {
        if (filters.rooms === '5+' && l.rooms < 5) return false
        if (filters.rooms !== '5+' && l.rooms !== Number(filters.rooms)) return false
      }
      if (filters.type && l.type !== filters.type) return false
      if (filters.furnished) {
        const want = filters.furnished === 'oui'
        if (l.furnished !== want) return false
      }
      return true
    })
  }, [filters])

  const updateFilters = (f: Partial<Filters>) => setFilters(prev => ({ ...prev, ...f }))

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90">
            Louer-Rechercher 
          </Link>
        </div>
        <SearchFilters filters={filters} setFilters={updateFilters} communes={communes} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-gray-600">Aucun résultat. Essayez d’élargir vos filtres.</div>
      )}
    </div>
  )
}
