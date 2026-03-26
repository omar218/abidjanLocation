import { NextResponse } from "next/server"

function envOrDefault(name: string, fallback?: string) {
  return process.env[name] || fallback || ""
}

export async function POST(request: Request) {
  try {
    const { phone, operator } = await request.json()
    if (!phone || !operator) {
      return NextResponse.json({ message: "Champs manquants" }, { status: 400 })
    }

    const amount = Number(envOrDefault("SUBSCRIPTION_PRICE_XOF", "3000"))
    const site_id = envOrDefault("CINETPAY_SITE_ID")
    const apikey = envOrDefault("CINETPAY_API_KEY")
    const baseUrl = envOrDefault("CINETPAY_BASE_URL", "https://api-checkout.cinetpay.com")
    const appBase = envOrDefault("APP_BASE_URL", "http://localhost:3000")

    const transaction_id = `sub_${Date.now()}`

    // If no creds, return a mock URL for dev
    if (!site_id || !apikey) {
      const mockUrl = `${appBase}/subscribe?mock=1&tx=${transaction_id}`
      return NextResponse.json({ paymentUrl: mockUrl, transaction_id }, { status: 200 })
    }

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

    // CinetPay returns a payment_url or checkout URL in data
    const paymentUrl = data?.data?.payment_url || data?.data?.payment_url || data?.data?.url
    if (!paymentUrl) {
      return NextResponse.json({ message: "Lien de paiement introuvable" }, { status: 500 })
    }

    return NextResponse.json({ paymentUrl, transaction_id }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Erreur serveur" }, { status: 500 })
  }
}
