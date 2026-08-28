import defaultListings from '@/data/listings.json'
import { formatXOF } from '@/lib/format'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { MapPin, Home, CheckCircle, PhoneCall, ArrowLeft } from 'lucide-react'

/**
 * Page de détail d'une annonce immobilière (`/listing/[id]`).
 * Récupère le logement depuis Supabase (ou fallback local).
 */
export default async function ListingPage({ params }: { params: { id: string } }) {
  let listing: any = null

  // 1. Essai de récupération depuis Supabase
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*, profiles(full_name, phone)')
      .eq('id', params.id)
      .single()

    if (!error && data) {
      listing = data
    }
  } catch (err) {
    console.warn('Erreur Supabase detail listing:', err)
  }

  // 2. Fallback vers le fichier de mock local si introuvable dans Supabase
  if (!listing) {
    listing = defaultListings.find(l => String(l.id) === String(params.id))
  }

  // Gestion du cas où l'annonce n'existe pas
  if (!listing) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 bg-white p-8 rounded-xl border">
        <div className="text-gray-900 font-semibold text-xl">Annonce introuvable</div>
        <p className="text-gray-500 text-sm">Le bien que vous cherchez n'existe pas ou a été retiré.</p>
        <Link href="/search" className="inline-flex items-center text-blue-600 font-medium hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux annonces
        </Link>
      </div>
    )
  }

  const phoneContact = listing.profiles?.phone || '2250747643420'
  const cleanPhone = String(phoneContact).replace(/[^0-9]/g, '')

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Lien de retour aux résultats */}
      <Link href="/search" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux résultats
      </Link>

      <div className="grid gap-8 md:grid-cols-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Galerie / Image principale de l'annonce */}
        <div className="space-y-3">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={listing.images?.[0] || '/placeholder.svg'} 
              alt={listing.title} 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Miniatures d'images si multiples */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img: string, idx: number) => (
                <div key={idx} className="w-20 h-16 rounded-lg overflow-hidden shrink-0 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails et informations du bien */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              <MapPin className="w-3.5 h-3.5" />
              {listing.commune} · {listing.quartier}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {listing.title}
            </h1>

            <div className="text-2xl font-bold text-blue-600">
              {formatXOF(listing.price_xof)} <span className="text-sm font-normal text-gray-500">/ mois</span>
            </div>

            {/* Grille des caractéristiques */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Home className="w-4 h-4 text-gray-400" />
                <span>Type: <strong className="capitalize">{listing.type}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-4 h-4 text-center font-bold text-gray-400">#</span>
                <span>Pièces: <strong>{listing.rooms} ch</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span>Meublé: <strong>{listing.furnished ? 'Oui' : 'Non'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-4 h-4 text-center font-bold text-gray-400">m²</span>
                <span>Surface: <strong>{listing.surface_m2 ? `${listing.surface_m2} m²` : 'Non précisée'}</strong></span>
              </div>
            </div>
          </div>

          {/* Contact Direct & WhatsApp */}
          <div className="space-y-3 pt-4">
            <a 
              href={`https://wa.me/${cleanPhone.startsWith('225') ? cleanPhone : '225' + cleanPhone}?text=${encodeURIComponent('Bonjour, je suis intéressé par votre annonce sur Abidjan Location : ' + listing.title)}`} 
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium py-3.5 px-4 shadow-md transition-all text-sm"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <PhoneCall className="w-4 h-4" />
              Contacter le propriétaire sur WhatsApp
            </a>

            <p className="text-xs text-center text-gray-500">
              Transaction sécurisée et vérifiée par la plateforme Abidjan Location.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
