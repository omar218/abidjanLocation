import { NextResponse } from "next/server"

/**
 * Fonction utilitaire pour récupérer une variable d'environnement ou une valeur par défaut.
 * 
 * @param name - Nom de la variable d'environnement
 * @param fallback - Valeur de repli optionnelle
 */
function envOrDefault(name: string, fallback?: string) {
  return process.env[name] || fallback || ""
}

/**
 * Route API : POST /api/payments/initiate
 * Initialise une session de paiement Mobile Money via l'API CinetPay V2.
 * - Récupère le numéro de téléphone et l'opérateur.
 * - Si les identifiants CinetPay ne sont pas configurés dans l'environnement, renvoie une URL de simulation (mode dev).
 * - Envoie une requête à l'API CinetPay (`/v2/payment`) et retourne l'URL de paiement générée.
 */
export async function POST(request: Request) {
  try {
    const { phone, operator } = await request.json()
    if (!phone || !operator) {
      return NextResponse.json({ message: "Champs manquants" }, { status: 400 })
    }

    // Récupération des paramètres de configuration
    const amount = Number(envOrDefault("SUBSCRIPTION_PRICE_XOF", "3000"))
    const site_id = envOrDefault("CINETPAY_SITE_ID")
    const apikey = envOrDefault("CINETPAY_API_KEY")
    const baseUrl = envOrDefault("CINETPAY_BASE_URL", "https://api-checkout.cinetpay.com")
    const appBase = envOrDefault("APP_BASE_URL", "http://localhost:3000")

    // Génération d'un identifiant de transaction unique
    const transaction_id = `sub_${Date.now()}`

    // Mode simulation / développement en l'absence de clés CinetPay réelles
    if (!site_id || !apikey) {
      const mockUrl = `${appBase}/subscribe?mock=1&tx=${transaction_id}`
      return NextResponse.json({ paymentUrl: mockUrl, transaction_id }, { status: 200 })
    }

    // Préparation du payload de paiement CinetPay
    const payload = {
      apikey,
      site_id,
      transaction_id,
      amount,
      currency: "XOF",
      description: "Abonnement plateforme",
      channels: "MOBILE_MONEY",
      notify_url: `${appBase}/api/payments/webhook`,
      return_url: `${appBase}/subscribe`,
      customer_phone_number: phone,
      customer_name: "client",
      metadata: "subscription"
    }

    // Envoi de la requête d'initialisation à CinetPay
    const url = `${baseUrl}/v2/payment`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ message: data?.message || "Erreur CinetPay" }, { status: 502 })
    }

    // Récupération de l'URL de paiement sécurisée retournée par CinetPay
    const paymentUrl = data?.data?.payment_url || data?.data?.url
    if (!paymentUrl) {
      return NextResponse.json({ message: "Lien de paiement introuvable" }, { status: 500 })
    }

    return NextResponse.json({ paymentUrl, transaction_id }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Erreur serveur" }, { status: 500 })
  }
}

