"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SubscribePage() {
  const [phone, setPhone] = useState("")
  const [operator, setOperator] = useState("ORANGE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const search = useSearchParams()
  const router = useRouter()

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
      <h1 className="text-2xl font-semibold">S'abonner</h1>
      <p className="text-sm text-gray-600">Payez votre abonnement par Mobile Money pour accéder à la plateforme.</p>
      <form onSubmit={startPayment} className="space-y-3">
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          onClick={startPayment}
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Redirection vers CinetPay..." : "Payer l'abonnement"}
        </button>

      </form>
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
