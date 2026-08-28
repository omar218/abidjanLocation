import Link from 'next/link'
import { formatXOF } from '@/lib/format'

/**
 * Type décrivant la structure complète d'une annonce de location immobilière.
 */
export type Listing = {
  id: string              // Identifiant unique de l'annonce
  title: string           // Titre de l'annonce
  price_xof: number       // Loyer mensuel en Franc CFA (XOF)
  commune: string         // Commune d'Abidjan (ex: Cocody, Marcory, Yopougon...)
  quartier: string        // Quartier spécifique (ex: Angré, Zone 4...)
  rooms: number           // Nombre de pièces / chambres
  type: string            // Type de bien (ex: studio, 2p, 3p, villa...)
  furnished: boolean      // Indique si le logement est meublé (true) ou non (false)
  surface_m2?: number     // Superficie en mètres carrés (optionnelle)
  images: string[]        // Liste des URLs d'images associées au bien
  landlord?: {            // Informations du propriétaire (optionnelles)
    name?: string
  }
}

/**
 * Composant ListingCard : Carte d'affichage résumé d'une annonce immobilière.
 * Utilisé dans les listes de recherche et d'exploration.
 * 
 * @param listing - Données de l'annonce à afficher
 */
export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="block overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Vignette de l'image principale avec image de secours (placeholder) */}
      <div className="aspect-[4/3] w-full bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.images?.[0] || '/placeholder.svg'}
          alt={listing.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Informations textuelles de l'annonce */}
      <div className="p-4">
        {/* Titre et prix mensuel formaté */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 line-clamp-1">{listing.title}</h3>
          <div className="text-primary font-semibold">{formatXOF(listing.price_xof)}</div>
        </div>

        {/* Localisation (Commune et quartier) */}
        <div className="mt-1 text-sm text-gray-600">
          {listing.commune} · {listing.quartier}
        </div>

        {/* Badges de caractéristiques clés (pièces, type, meublé) */}
        <div className="mt-2 flex gap-2 text-xs text-gray-700">
          <span className="rounded bg-gray-100 px-2 py-1">{listing.rooms} ch</span>
          <span className="rounded bg-gray-100 px-2 py-1">{listing.type}</span>
          <span className="rounded bg-gray-100 px-2 py-1">{listing.furnished ? 'meublé' : 'non meublé'}</span>
        </div>
      </div>
    </Link>
  )
}

