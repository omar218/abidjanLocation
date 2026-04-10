"use client"
import Link from 'next/link'
import { MapPin, Home, Users, Shield, Search, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Trouvez votre prochain
          <span className="text-primary"> logement</span>
          <br />
          à Abidjan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez les meilleures offres de location dans les quartiers les plus prisés d'Abidjan. 
          Appartements, villas, studios - trouvez exactement ce qu'il vous faut.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/search" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Search className="w-5 h-5 mr-2" />
            Rechercher un logement
          </Link>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 text-lg font-medium text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Déposer une annonce
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">150+</div>
          <div className="text-gray-600">Logements disponibles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">12</div>
          <div className="text-gray-600">Communes couvertes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">98%</div>
          <div className="text-gray-600">Clients satisfaits</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi nous choisir?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La plateforme la plus simple et fiable pour trouver votre logement idéal à Abidjan
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Large couverture</h3>
            <p className="text-gray-600">
              Des logements dans toutes les communes d'Abidjan, de Cocody à Yopougon
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Sécurisé</h3>
            <p className="text-gray-600">
              Annonces vérifiées et transactions sécurisées pour votre tranquillité d'esprit
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Support client</h3>
            <p className="text-gray-600">
              Équipe dédiée pour vous accompagner dans votre recherche de logement
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white rounded-lg p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">
          Prêt à trouver votre prochain logement?
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Rejoignez des milliers d'Abidjanais qui ont trouvé leur logement idéal avec nous
        </p>
        <Link 
          href="/search"
          className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 py-3 text-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Commencer ma recherche
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  )
}
