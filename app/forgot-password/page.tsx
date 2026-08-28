"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react"

/**
 * Page Mot de passe oublié (ForgotPasswordPage)
 * Permet de demander un lien de réinitialisation sécurisé via Supabase Auth.
 */
export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Veuillez renseigner votre adresse email")
      return
    }

    setLoading(true)
    try {
      const res = await resetPassword(email)
      if (!res.success) {
        throw new Error(res.error || "Impossible d'envoyer l'email de réinitialisation")
      }
      setSuccess("Un email contenant les instructions de réinitialisation vous a été envoyé.")
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md my-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl text-blue-600 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-sm text-gray-500">
            Saisissez l'adresse email associée à votre compte pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        ) : (
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour à la page de connexion
            </Link>
          </div>
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <Link
            href="/login"
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
