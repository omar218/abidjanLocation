import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Route API : GET /api/auth/session
 * Récupère les informations de l'utilisateur actuellement connecté
 * en lisant le cookie HTTP-Only 'session'.
 */
export async function GET() {
  try {
    const session = cookies().get('session')?.value;
    
    // Si aucun cookie de session n'est présent, renvoyer user: null
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Décodage du JSON contenu dans le cookie de session
    const user = JSON.parse(session);
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Erreur de session:', error);
    return NextResponse.json(
      { error: 'Erreur de serveur interne' },
      { status: 500 }
    );
  }
}

