import { NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * Convertit une durée exprimée en jours en nombre de secondes.
 * 
 * @param days - Nombre de jours
 * @returns Équivalent en secondes
 */
function daysToSeconds(days: number) { 
  return days * 24 * 60 * 60 
}

/**
 * Route API : POST /api/payments/webhook
 * Point d'entrée Webhook / Notification IPN (Instant Payment Notification) de CinetPay.
 * - Reçoit le statut du paiement transmis par la passerelle de paiement.
 * - Vérifie si le statut correspond à une transaction confirmée ("ACCEPTED", "SUCCEEDED", "00", 201).
 * - Définit le cookie HTTP-Only 'subscribed' d'une durée paramétrable (ex: 30 jours) pour débloquer l'accès.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation du statut de la transaction transmise par CinetPay
    const status = body?.status || body?.payment_status || body?.code
    const accepted = ["ACCEPTED", "SUCCEEDED", 201, "00"].includes(status)

    if (!accepted) {
      return NextResponse.json({ message: "Paiement non confirmé" }, { status: 400 })
    }

    // Durée de validité de l'abonnement en jours (par défaut 30 jours)
    const periodDays = Number(process.env.SUBSCRIPTION_PERIOD_DAYS || 30)

    // Enregistrement de l'état d'abonnement via un cookie sécurisé (POC)
    // Note : Pour un environnement de production, enregistrer également l'abonnement en base de données
    cookies().set("subscribed", "true", {
      httpOnly: true,
      path: "/",
      maxAge: daysToSeconds(periodDays)
    })

    return NextResponse.json({ message: "ok" }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: "Erreur webhook" }, { status: 500 })
  }
}

