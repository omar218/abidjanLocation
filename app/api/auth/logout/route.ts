import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Route API : POST /api/auth/logout
 * Déconnecte l'utilisateur en supprimant le cookie de session 'session'.
 */
export async function POST() {
  try {
    // Suppression immédiate du cookie de session côté serveur
    cookies().delete('session');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}

