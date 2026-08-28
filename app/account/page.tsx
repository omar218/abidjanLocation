"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { User, Phone, Mail, Shield, CheckCircle2, AlertCircle, KeyRound, Sparkles } from "lucide-react"

/**
 * Page de Gestion du Compte Utilisateur (AccountPage)
 * Permet de visualiser et mettre à jour son profil Supabase (nom, téléphone, mot de passe)
 * et de vérifier le statut de son abonnement.
 */
function AccountContent() {
  const { user, updateProfile, updatePassword } = useAuth()

  const [fullName, setFullName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Mise à jour du profil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg(null)
    setProfileLoading(true)

    try {
      const res = await updateProfile({ full_name: fullName, phone })
      if (!res.success) throw new Error(res.error || "Erreur de mise à jour")
      setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès !' })
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Erreur lors de la mise à jour' })
    } finally {
      setProfileLoading(false)
    }
  }

  // Mise à jour du mot de passe
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Le mot de passe doit comporter au moins 6 caractères.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Les deux mots de passe ne correspondent pas.' })
      return
    }

    setPasswordLoading(true)
    try {
      const res = await updatePassword(newPassword)
      if (!res.success) throw new Error(res.error || "Erreur de modification du mot de passe")
      setPasswordMsg({ type: 'success', text: 'Mot de passe mis à jour avec succès !' })
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Erreur' })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-6">
      {/* En-tête du profil */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name || 'Mon Profil'}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                {user?.role}
              </span>
              {user?.isSubscribed ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  <Sparkles className="w-3 h-3" /> Abonné Actif
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                  Abonnement standard
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Formulaire Informations Personnelles */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Informations personnelles</h2>
          </div>

          {profileMsg && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email (non modifiable)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

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
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all disabled:opacity-60"
            >
              {profileLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>

        {/* Formulaire Sécurité & Mot de passe */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Sécurité & Mot de passe</h2>
          </div>

          {passwordMsg && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm transition-all disabled:opacity-60"
            >
              {passwordLoading ? "Mise à jour..." : "Modifier mon mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  )
}
