"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import type { UserRole } from "@/lib/supabase/types"
import { Lock, Mail, Phone, User, Building2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

/**
 * Page de Connexion & Inscription Complète Supabase Auth
 * Supporte : Email/Mot de passe, Inscription avec rôle, Connexion Google OAuth, Magic Link.
 */
export default function LoginPage() {
  const router = useRouter()
  const { login, signUp, signInWithGoogle, signInWithMagicLink } = useAuth()

  const [mode, setMode] = useState<"login" | "signup" | "magiclink">("login")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("locataire")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Soumission formulaire Email / Mot de passe ou Magic Link
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Veuillez renseigner votre adresse email")
      return
    }

    setLoading(true)

    try {
      if (mode === "magiclink") {
        const res = await signInWithMagicLink(email)
        if (!res.success) throw new Error(res.error || "Impossible d'envoyer le lien de connexion")
        setSuccess("Lien magique envoyé ! Consultez votre boîte de réception pour vous connecter d'un clic.")
      } else if (mode === "login") {
        if (!password) {
          throw new Error("Veuillez renseigner votre mot de passe")
        }
        const res = await login(email, password, role)
        if (!res.success) throw new Error(res.error || "Erreur de connexion")
        setSuccess("Connexion réussie !")
        router.push(res.redirectTo || (role === "proprietaire" ? "/dashboard" : "/"))
      } else {
        if (!password || password.length < 6) {
          throw new Error("Le mot de passe doit comporter au moins 6 caractères")
        }
        const res = await signUp(email, password, role, fullName, phone)
        if (!res.success) throw new Error(res.error || "Erreur lors de l'inscription")
        setSuccess("Compte créé avec succès ! Bienvenue sur Abidjan Location.")
        router.push(role === "proprietaire" ? "/dashboard" : "/")
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  // Connexion Google OAuth
  async function handleGoogleLogin() {
    setError("")
    setGoogleLoading(true)
    try {
      const res = await signInWithGoogle()
      if (!res.success) {
        throw new Error(res.error || "Échec de l'authentification Google")
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue avec Google")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md my-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl text-blue-600 mb-1">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "login" && "Connexion à votre compte"}
            {mode === "signup" && "Créer votre compte"}
            {mode === "magiclink" && "Connexion par lien magique"}
          </h1>
          <p className="text-xs text-gray-500">
            {mode === "login" && "Accédez à votre espace Abidjan Location sécurisé"}
            {mode === "signup" && "Rejoignez la plateforme immobilière de référence à Abidjan"}
            {mode === "magiclink" && "Connectez-vous instantanément sans mot de passe via un lien email"}
          </p>
        </div>

        {/* Bouton Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors shadow-2xs disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          {googleLoading ? "Connexion Google..." : "Continuer avec Google"}
        </button>

        {/* Séparateur */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">ou par email</span>
        </div>

        {/* Onglets de sélection de mode */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl text-xs font-medium text-center">
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setError("")
              setSuccess("")
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === "login"
                ? "bg-white text-gray-900 shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup")
              setError("")
              setSuccess("")
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === "signup"
                ? "bg-white text-gray-900 shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magiclink")
              setError("")
              setSuccess("")
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              mode === "magiclink"
                ? "bg-white text-gray-900 shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Lien Magique
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Sélection du rôle (pour inscription ou connexion) */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Type de profil
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "locataire", label: "Locataire" },
                  { value: "proprietaire", label: "Propriétaire" },
                  { value: "agence", label: "Agence" },
                  { value: "admin", label: "Admin" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value as UserRole)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      role === item.value
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nom complet pour inscription */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Jean Dupont"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Email */}
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

          {/* Téléphone pour inscription */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 XX XX XX XX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Mot de passe (masqué si mode lien magique) */}
          {mode !== "magiclink" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mot de passe
                </label>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={mode !== "magiclink"}
                />
              </div>
            </div>
          )}

          {/* Alertes d'état */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Traitement en cours...</span>
              </>
            ) : mode === "login" ? (
              "Se connecter"
            ) : mode === "signup" ? (
              "Créer mon compte"
            ) : (
              "Envoyer le lien magique"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
