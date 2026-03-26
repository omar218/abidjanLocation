import Link from 'next/link'
import { formatXOF } from '@/lib/format'

export type Listing = {
  id: string
  title: string
  price_xof: number
  commune: string
  quartier: string
  rooms: number
  type: string
  furnished: boolean
  surface_m2?: number
  images: string[]
  landlord?: {
    name?: string
  }
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="block overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] w-full bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.images?.[0] || '/placeholder.svg'}
          alt={listing.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 line-clamp-1">{listing.title}</h3>
          <div className="text-primary font-semibold">{formatXOF(listing.price_xof)}</div>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {listing.commune} · {listing.quartier}
        </div>
        <div className="mt-2 flex gap-2 text-xs text-gray-700">
          <span className="rounded bg-gray-100 px-2 py-1">{listing.rooms} ch</span>
          <span className="rounded bg-gray-100 px-2 py-1">{listing.type}</span>
          <span className="rounded bg-gray-100 px-2 py-1">{listing.furnished ? 'meublé' : 'non meublé'}</span>
        </div>
      </div>
    </Link>
  )
}
