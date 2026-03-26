import Link from 'next/link'
import { formatXOF } from '@/lib/format'

export type Vehicle = {
  id: string
  title: string
  price_xof_per_day: number
  brand: string
  model: string
  year: number
  seats: number
  transmission: 'manuelle' | 'automatique'
  fuel: 'essence' | 'diesel' | 'hybride' | 'électrique'
  commune: string
  quartier: string
  images: string[]
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/vehicles`} className="block overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] w-full bg-gray-100">
        <img
          src={vehicle.images?.[0] || '/placeholder.svg'}
          alt={vehicle.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 line-clamp-1">{vehicle.title}</h3>
          <div className="text-primary font-semibold">{formatXOF(vehicle.price_xof_per_day)}<span className="text-xs text-gray-600">/jour</span></div>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {vehicle.commune} · {vehicle.quartier}
        </div>
        <div className="mt-2 flex gap-2 text-xs text-gray-700">
          <span className="rounded bg-gray-100 px-2 py-1">{vehicle.seats} places</span>
          <span className="rounded bg-gray-100 px-2 py-1">{vehicle.transmission}</span>
          <span className="rounded bg-gray-100 px-2 py-1">{vehicle.fuel}</span>
        </div>
      </div>
    </Link>
  )
}
