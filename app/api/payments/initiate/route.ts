import { NextResponse } from "next/server"

function envOrDefault(name: string, fallback?: string) {
  return process.env[name] || fallback || ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount: customAmount, description: customDescription } = body

    const amount = Number(
      customAmount || envOrDefault("SUBSCRIPTION_PRICE_XOF", "3000")
    )
    const site_id = envOrDefault("CINETPAY_SITE_ID")
    const apikey = envOrDefault("CINETPAY_API_KEY")
    const appBase = envOrDefault("APP_BASE_URL", "http://localhost:3000")
    const transaction_id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    if (!site_id || !apikey) {
      return NextResponse.json(
        {
          transaction_id,
          amount,
          currency: "XOF",
          site_id: "DEMO_SITE_ID",
          apikey: "DEMO_API_KEY",
          notify_url: `${appBase}/api/payments/webhook`,
          return_url: `${appBase}/subscribe?tx=${transaction_id}`,
          description:
            customDescription || "Abonnement Abidjan Location",
          mock: true,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        transaction_id,
        amount,
        currency: "XOF",
        site_id,
        apikey,
        notify_url: `${appBase}/api/payments/webhook`,
        return_url: `${appBase}/subscribe?tx=${transaction_id}`,
        description:
          customDescription || "Abonnement Abidjan Location",
        mock: false,
      },
      { status: 200 }
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur"
    return NextResponse.json({ message }, { status: 500 })
  }
}
