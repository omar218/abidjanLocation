"use client"

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import defaultListings from '@/data/listings.json'
import ListingCard, { Listing } from '@/components/ListingCard'
import SearchFilters, { Filters } from '@/components/SearchFilters'
import { normalize } from '@/lib/format'
import { createClient } from '@/lib/supabase/client'

/**
 * Page de recherche et d'exploration des annonces (SearchPage).
 * Connectée à Supabase avec synchronisation temps réel et fallback local.
 */
export default function SearchPage() {
  const [listings, setListings] = useState<Listing[]>(defaultListings as Listing[])
  const [loading, setLoading] = useState(false)

  // État des filtres de recherche
  const [filters, setFilters] = useState<Filters>({
    query: '',
    commune: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    type: '',
    furnished: ''
  })

  // Chargement des annonces depuis Supabase
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setListings(data as Listing[]);
        } else {
          // Fallback via API route
          const res = await fetch('/api/properties');
          if (res.ok) {
            const apiData = await res.json();
            if (apiData.properties && apiData.properties.length > 0) {
              setListings(apiData.properties);
            }
          }
        }
      } catch (err) {
        console.error('Erreur chargement annonces:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [])

  // Extraction unique et triée de toutes les communes
  const communes = useMemo(() => {
    const set = new Set<string>()
    listings.forEach(l => {
      if (l.commune) set.add(l.commune)
    })
    return Array.from(set).sort()
  }, [listings])

  // Filtrage réactif des logements
  const filtered = useMemo(() => {
    return listings.filter(l => {
      // Filtre textuel (insensible à la casse et aux accents)
      if (filters.query) {
        const q = normalize(filters.query)
        const target = normalize(`${l.title || ''} ${l.commune || ''} ${l.quartier || ''} ${l.type || ''}`)
        if (!target.includes(q)) return false
      }
      // Filtre de commune
      if (filters.commune && l.commune !== filters.commune) return false
      // Filtres de prix minimum et maximum
      if (filters.minPrice && l.price_xof < Number(filters.minPrice)) return false
      if (filters.maxPrice && l.price_xof > Number(filters.maxPrice)) return false
      // Filtre de nombre de chambres (gestion de "5+")
      if (filters.rooms) {
        if (filters.rooms === '5+' && l.rooms < 5) return false
        if (filters.rooms !== '5+' && l.rooms !== Number(filters.rooms)) return false
      }
      // Filtre de type de logement
      if (filters.type && l.type !== filters.type) return false
      // Filtre meublé
      if (filters.furnished) {
        const want = filters.furnished === 'oui'
        if (l.furnished !== want) return false
      }
      return true
    })
  }, [filters, listings])

  const updateFilters = (f: Partial<Filters>) => setFilters(prev => ({ ...prev, ...f }))

  return (
    <div className="space-y-6">
      {/* En-tête de la page de recherche */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rechercher un logement à Abidjan</h1>
            <p className="text-sm text-gray-500">{listings.length} annonces répertoriées</p>
          </div>
          <Link href="/" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Accueil
          </Link>
        </div>
        
        {/* Composant de filtres interactifs */}
        <SearchFilters filters={filters} setFilters={updateFilters} communes={communes} />
      </div>

      {/* Grille responsive des résultats d'annonces */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-lg border bg-white p-4 animate-pulse space-y-3">
              <div className="aspect-[4/3] w-full bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      {/* Message d'état vide */}
      {!loading && filtered.length === 0 && (
        <div className="p-8 text-center bg-white rounded-lg border border-dashed text-gray-500">
          <p className="text-base font-medium">Aucun résultat ne correspond à vos filtres.</p>
          <p className="text-sm mt-1">Essayez d'élargir vos critères ou de réinitialiser la recherche.</p>
        </div>
      )}
    </div>
  )
}
