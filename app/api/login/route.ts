import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

/**
 * Route API : POST /api/login
 * Gère la connexion des utilisateurs.
 * - Valide la présence des champs obligatoires (email/téléphone, mot de passe, rôle).
 * - Vérifie le mot de passe (règle simplifiée pour le POC : longueur >= 6).
 * - Génère un cookie de session HTTP-Only sécurisé d'une durée de 7 jours.
 * - Retourne l'utilisateur connecté et l'URL de redirection adaptée.
 */
export async function POST(request: Request) {
  try {
    const { email, phone, password, role } = await request.json()

    // Vérification de la présence des champs obligatoires
    if ((!email && !phone) || !password || !role) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" }, 
        { status: 400 }
      )
    }

    // Vérification de la validité du rôle soumis
    if (!["agence", "proprietaire", "locataire", "admin"].includes(role)) {
      return NextResponse.json(
        { message: "Rôle invalide" }, 
        { status: 400 }
      )
    }

    // Validation du mot de passe (POC / Simulation : minimum 6 caractères)
    if (String(password).length < 6) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" }, 
        { status: 401 }
      )
    }

    // Construction de l'objet utilisateur de session
    const user = { 
      email: email || phone, 
      role,
      name: email?.split('@')[0] || `Utilisateur ${role}`
    }

    // Enregistrement de la session dans un cookie HTTP-Only
    const session = JSON.stringify(user)
    cookies().set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // Durée de validité : 1 semaine (7 jours)
      path: '/',
    })

    return NextResponse.json({ 
      success: true, 
      user,
      redirectTo: role === 'proprietaire' ? '/dashboard' : '/',
    }, { status: 200 })

  } catch (e) {
    console.error('Erreur de connexion:', e)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la connexion" }, 
      { status: 500 }
    )
  }
}

