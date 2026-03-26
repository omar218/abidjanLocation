import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = cookies().get('session')?.value;
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // En production, vous devriez vérifier la validité du token JWT
    // Ici, nous allons simplement retourner les données de session
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
