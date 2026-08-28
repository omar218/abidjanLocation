"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

/**
 * Page d'abonnement (SubscribePage) : Permet aux utilisateurs de souscrire à la plateforme
 * via un paiement Mobile Money (Orange Money, MTN Mobile Money, Moov Money) intégré avec la passerelle CinetPay.
 * Inclut également un mode de simulation (mock) pour les tests en environnement de développement local.
 */
export default function SubscribePage() {
  const [phone, setPhone] = useState("")
  const [operator, setOperator] = useState("ORANGE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const search = useSearchParams()
  const router = useRouter()

  /**
   * Initialise le processus de paiement CinetPay en appelant l'API backend /api/payments/initiate
   * et redirige l'utilisateur vers la passerelle de paiement sécurisée.
   */
  async function startPayment(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, operator })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Impossible d'initialiser le paiement")
      
      // Redirection vers l'URL de paiement fournie par CinetPay ou le mock
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else if (data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        throw new Error("Lien de paiement introuvable")
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fonction de test (mode dev) simulant la notification webhook de paiement réussi.
   * Active le cookie de souscription et redirige vers l'accueil.
   */
  async function confirmMockPayment() {
    console.log("confirmMockPayment")
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED", code: "00" })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Webhook échec")
      }
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* En-tête et description de l'abonnement */}
      <h1 className="text-2xl font-semibold">S'abonner</h1>
      <p className="text-sm text-gray-600">Payez votre abonnement par Mobile Money pour accéder à la plateforme.</p>
      
      {/* Formulaire de paiement Mobile Money */}
      <form onSubmit={startPayment} className="space-y-3">
        {/* Saisie du numéro Mobile Money */}
        <div>
          <label className="block text-sm mb-1">Numéro Mobile Money</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ex: 0701020304"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Choix de l'opérateur Mobile Money */}
        <div>
          <label className="block text-sm mb-1">Opérateur</label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ORANGE">Orange Money</option>
            <option value="MTN">MTN Mobile Money</option>
            <option value="MOOV">Moov Money</option>
          </select>
        </div>

        {/* Message d'erreur éventuel */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Bouton de déclenchement du paiement */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Redirection vers CinetPay..." : "Payer l'abonnement"}
        </button>
      </form>

      {/* Bloc de simulation de paiement en environnement de développement (?mock=1) */}
      {search.get("mock") === "1" && (
        <div className="pt-4 space-y-2">
          <p className="text-xs text-gray-500">Mode développement: paiement simulé et valide. Cliquez pour confirmer.</p>
          <button
            onClick={confirmMockPayment}
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Confirmation..." : "Simuler paiement réussi"}
          </button>
        </div>
      )}
    </div>
  )
}

