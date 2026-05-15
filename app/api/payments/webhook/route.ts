import { NextResponse } from "next/server"
import { cookies } from "next/headers"

function daysToSeconds(days: number) {
  return days * 24 * 60 * 60
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const status = body?.status || body?.payment_status || body?.code
    const accepted = ["ACCEPTED", "SUCCEEDED", 201, "00"].includes(status)

    if (!accepted) {
      return NextResponse.json(
        { message: "Paiement non confirmé" },
        { status: 400 }
      )
    }

    const periodDays = Number(process.env.SUBSCRIPTION_PERIOD_DAYS || 30)

    cookies().set("subscribed", "true", {
      httpOnly: true,
      path: "/",
      maxAge: daysToSeconds(periodDays),
    })

    return NextResponse.json({ message: "ok" }, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: "Erreur webhook" },
      { status: 500 }
    )
  }
}
