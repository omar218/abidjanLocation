import { NextResponse } from "next/server"
import { cookies } from "next/headers"

function envOrDefault(name: string, fallback?: string) {
  return process.env[name] || fallback || ""
}

function daysToSeconds(days: number) {
  return days * 24 * 60 * 60
}

export async function POST(request: Request) {
  try {
    const { transaction_id } = await request.json()
    if (!transaction_id) {
      return NextResponse.json(
        { message: "transaction_id manquant" },
        { status: 400 }
      )
    }

    const site_id = envOrDefault("CINETPAY_SITE_ID")
    const apikey = envOrDefault("CINETPAY_API_KEY")
    const baseUrl = envOrDefault(
      "CINETPAY_BASE_URL",
      "https://api-checkout.cinetpay.com"
    )

    if (!site_id || !apikey) {
      const periodDays = Number(process.env.SUBSCRIPTION_PERIOD_DAYS || 30)
      cookies().set("subscribed", "true", {
        httpOnly: true,
        path: "/",
        maxAge: daysToSeconds(periodDays),
      })
      return NextResponse.json(
        { status: "ACCEPTED", message: "Paiement simulé (mode dev)" },
        { status: 200 }
      )
    }

    const res = await fetch(`${baseUrl}/v2/payment/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apikey, site_id, transaction_id }),
    })

    const data = await res.json()

    const paymentStatus = data?.data?.status
    if (paymentStatus === "ACCEPTED") {
      const periodDays = Number(process.env.SUBSCRIPTION_PERIOD_DAYS || 30)
      cookies().set("subscribed", "true", {
        httpOnly: true,
        path: "/",
        maxAge: daysToSeconds(periodDays),
      })
    }

    return NextResponse.json(
      {
        status: paymentStatus || "UNKNOWN",
        amount: data?.data?.amount,
        currency: data?.data?.currency,
        payment_method: data?.data?.payment_method,
        payment_date: data?.data?.payment_date,
        message:
          paymentStatus === "ACCEPTED"
            ? "Paiement confirmé"
            : "Paiement non confirmé",
      },
      { status: 200 }
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur"
    return NextResponse.json({ message }, { status: 500 })
  }
}
