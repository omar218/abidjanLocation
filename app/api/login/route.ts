import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, phone, password, role } = await request.json()

    // Vérification des champs obligatoires
    if ((!email && !phone) || !password || !role) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" }, 
        { status: 400 }
      )
    }

    // Vérification du rôle
    if (!["agence", "proprietaire", "locataire", "admin"].includes(role)) {
      return NextResponse.json(
        { message: "Rôle invalide" }, 
        { status: 400 }
      )
    }

    // Vérification des identifiants (à remplacer par une vraie vérification)
    if (String(password).length < 6) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" }, 
        { status: 401 }
      )
    }

    // Simuler un utilisateur
    const user = { 
      email: email || phone, 
      role,
      name: email?.split('@')[0] || `Utilisateur ${role}`
    }

    // Créer un cookie de session
    const session = JSON.stringify(user)
    cookies().set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
      path: '/',
    })

    return NextResponse.json({ 
      success: true, 
      user,
      redirectTo: role === 'proprietaire' ? '/dashboard/ajouter' : '/',
    }, { status: 200 })

  } catch (e) {
    console.error('Erreur de connexion:', e)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la connexion" }, 
      { status: 500 }
    )
  }
}
