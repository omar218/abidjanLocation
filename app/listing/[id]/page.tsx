import listings from '@/data/listings.json'
import { formatXOF } from '@/lib/format'
import Link from 'next/link'

export default function ListingPage({ params }: { params: { id: string } }) {
  const listing = listings.find(l => l.id === params.id)

  if (!listing) {
    return (
      <div className="space-y-3">
        <div>Annonce introuvable.</div>
        <Link href="/" className="text-primary">← Retour</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-primary">← Retour aux résultats</Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.images?.[0] || '/placeholder.jpg'} alt={listing.title} className="w-full rounded-lg object-cover" />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{listing.title}</h1>
          <div className="text-xl text-primary font-semibold">{formatXOF(listing.price_xof)} / mois</div>
          <div className="text-gray-700">
            {listing.commune} · {listing.quartier} · {listing.rooms} ch · {listing.type} · {listing.furnished ? 'meublé' : 'non meublé'}
          </div>

          <div className="space-y-2 text-sm">
            <div>Surface: {listing.surface_m2 ?? 'N/A'} m²</div>
            <div>Contact: <a href={`https://wa.me/2250100000000?text=${encodeURIComponent('Bonjour, je suis intéressé par: ' + listing.title)}`} className="text-primary" target="_blank">WhatsApp</a></div>
          </div>
        </div>
      </div>
    </div>
  )
}
