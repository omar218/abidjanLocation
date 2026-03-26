"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    // Validation des champs
    if (!role) {
      setError("Veuillez sélectionner un rôle")
      return
    }
    
    if (!email && !phone) {
      setError("Veuillez entrer un email ou un numéro de téléphone")
      return
    }
    
    if (!password) {
      setError("Veuillez entrer un mot de passe")
      return
    }
    
    setLoading(true)
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...(email && { email }),
          ...(phone && { phone }),
          password, 
          role 
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data?.message || "Erreur de connexion")
      }
      
      setSuccess("Connexion réussie")
      
      // Rediriger en fonction du rôle
      if (data.redirectTo) {
        router.push(data.redirectTo)
      } else {
        router.push("/")
      }
      
    } catch (err: any) {
      console.error("Erreur de connexion:", err)
      setError(err.message || "Une erreur est survenue lors de la connexion")
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Connexion</h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Sélection du rôle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner un rôle</option>
            <option value="proprietaire">Propriétaire</option>
            <option value="locataire">Locataire</option>
            <option value="agence">Agence</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        {/* Sélection de la méthode de connexion */}
        <div className="flex space-x-4 mb-2">
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${loginMethod === "email" ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("phone")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${loginMethod === "phone" ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Téléphone
          </button>
        </div>

        {/* Champ email ou téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {loginMethod === "email" ? "Adresse email" : "Numéro de téléphone"}
          </label>
          {loginMethod === "email" ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          ) : (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 XX XX XX XX"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md">
            {success}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>
    </div>
  )
}
