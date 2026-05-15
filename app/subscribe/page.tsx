"use client"

import { useState, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Shield, CreditCard, Smartphone, CheckCircle, XCircle, Loader2 } from "lucide-react"

declare global {
  interface Window {
    CinetPay?: {
      setConfig: (config: {
        apikey: string
        site_id: string
        notify_url: string
        return_url?: string
        mode?: string
        close_after_response?: boolean
        lang?: string
      }) => void
      getCheckout: (data: {
        transaction_id: string
        amount: number
        currency: string
        channels: string
        description: string
        customer_name?: string
        customer_surname?: string
        customer_email?: string
        customer_phone_number?: string
        customer_address?: string
        customer_city?: string
        customer_country?: string
        customer_state?: string
        customer_zip_code?: string
        metadata?: string
      }) => void
      waitResponse: (callback: (data: { status: string; amount: string; currency: string; payment_method: string; description: string; metadata: string; operator_id: string; payment_date: string }) => void) => void
      onClose: (callback: () => void) => void
    }
  }
}

type PaymentStatus = "idle" | "loading" | "processing" | "success" | "failed" | "closed"

function SubscribeContent() {
  const [status, setStatus] = useState<PaymentStatus>("idle")
  const [error, setError] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const search = useSearchParams()
  const router = useRouter()

  const txFromUrl = search.get("tx")

  const verifyPayment = useCallback(
    async (txId: string) => {
      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id: txId }),
        })
        const data = await res.json()
        if (data.status === "ACCEPTED") {
          setStatus("success")
          setTimeout(() => router.push("/"), 2000)
        } else {
          setStatus("failed")
          setError(data.message || "Le paiement n'a pas été confirmé")
        }
      } catch {
        setStatus("failed")
        setError("Impossible de vérifier le paiement")
      }
    },
    [router]
  )

  async function handlePayment() {
    setError("")
    setStatus("loading")

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erreur d'initialisation")

      setTransactionId(data.transaction_id)

      if (data.mock) {
        setStatus("processing")
        return
      }

      if (!window.CinetPay) {
        throw new Error(
          "Le SDK CinetPay n'est pas chargé. Veuillez rafraîchir la page."
        )
      }

      window.CinetPay.setConfig({
        apikey: data.apikey,
        site_id: data.site_id,
        notify_url: data.notify_url,
        return_url: data.return_url,
        mode: "PRODUCTION",
        close_after_response: true,
        lang: "FR",
      })

      window.CinetPay.getCheckout({
        transaction_id: data.transaction_id,
        amount: data.amount,
        currency: data.currency,
        channels: "ALL",
        description: data.description,
        customer_name: "Client",
        customer_surname: "Abidjan Location",
        customer_city: "Abidjan",
        customer_country: "CI",
        customer_state: "CI",
        customer_zip_code: "00225",
        metadata: "subscription",
      })

      window.CinetPay.waitResponse(function (paymentData) {
        if (paymentData.status === "ACCEPTED") {
          setStatus("success")
          verifyPayment(data.transaction_id)
        } else {
          setStatus("failed")
          setError("Le paiement a été refusé. Veuillez réessayer.")
        }
      })

      window.CinetPay.onClose(function () {
        if (status !== "success") {
          setStatus("closed")
        }
      })

      setStatus("processing")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue"
      setError(message)
      setStatus("idle")
    }
  }

  async function confirmMockPayment() {
    setError("")
    setStatus("loading")
    try {
      const txId = transactionId || txFromUrl || ""
      await verifyPayment(txId)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue"
      setError(message)
      setStatus("failed")
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md text-center space-y-4 py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-semibold text-green-700">
          Paiement réussi !
        </h1>
        <p className="text-gray-600">
          Votre abonnement est maintenant actif. Vous allez être redirigé...
        </p>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-md text-center space-y-4 py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-semibold text-red-700">
          Paiement échoué
        </h1>
        <p className="text-gray-600">{error || "Le paiement n'a pas abouti."}</p>
        <button
          onClick={() => {
            setStatus("idle")
            setError("")
          }}
          className="rounded-md bg-primary px-6 py-2 text-white text-sm hover:opacity-90"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">S&apos;abonner</h1>
        <p className="text-gray-600">
          Accédez à toutes les fonctionnalités de la plateforme
        </p>
      </div>

      {/* Pricing card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-primary text-white p-6 text-center">
          <p className="text-sm opacity-90">Abonnement mensuel</p>
          <div className="text-4xl font-bold mt-1">3 000 FCFA</div>
          <p className="text-sm opacity-75 mt-1">/ mois</p>
        </div>

        <div className="p-6 space-y-4">
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              Accès illimité aux annonces
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              Publication d&apos;annonces (propriétaires)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              Contact direct avec les propriétaires
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              Support client prioritaire
            </li>
          </ul>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Paiement sécurisé via CinetPay
        </h2>

        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full">
            <Smartphone className="w-3.5 h-3.5" />
            Orange Money
          </span>
          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full">
            <Smartphone className="w-3.5 h-3.5" />
            MTN MoMo
          </span>
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
            <Smartphone className="w-3.5 h-3.5" />
            Moov Money
          </span>
          <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
            <Smartphone className="w-3.5 h-3.5" />
            Wave
          </span>
          <span className="flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">
            <CreditCard className="w-3.5 h-3.5" />
            Carte bancaire
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </p>
        )}

        <button
          onClick={handlePayment}
          disabled={status === "loading" || status === "processing"}
          className="w-full rounded-lg bg-primary px-6 py-3 text-white font-medium text-sm disabled:opacity-60 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {status === "loading" || status === "processing" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Chargement du guichet de paiement...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Payer 3 000 FCFA
            </>
          )}
        </button>

        {status === "closed" && (
          <p className="text-sm text-amber-600 text-center">
            Le guichet de paiement a été fermé. Cliquez sur le bouton pour
            réessayer.
          </p>
        )}
      </div>

      {/* Mock payment for dev */}
      {status === "processing" && transactionId && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-3">
          <p className="text-sm text-amber-800 font-medium">
            Mode développement
          </p>
          <p className="text-xs text-amber-600">
            Les clés CinetPay ne sont pas configurées. Utilisez le bouton
            ci-dessous pour simuler un paiement réussi.
          </p>
          <p className="text-xs text-gray-500 font-mono">
            TX: {transactionId}
          </p>
          <button
            onClick={confirmMockPayment}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Simuler paiement réussi
          </button>
        </div>
      )}

      {/* Return from CinetPay redirect */}
      {txFromUrl && status === "idle" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
          <p className="text-sm text-blue-800 font-medium">
            Vérification du paiement en cours...
          </p>
          <button
            onClick={() => verifyPayment(txFromUrl)}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Vérifier mon paiement
          </button>
        </div>
      )}

      {/* Security footer */}
      <p className="text-center text-xs text-gray-400">
        Paiement sécurisé par CinetPay. Vos données sont protégées par
        chiffrement SSL.
      </p>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg py-12 text-center text-gray-500">
          Chargement...
        </div>
      }
    >
      <SubscribeContent />
    </Suspense>
  )
}
