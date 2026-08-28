import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Client Supabase côté navigateur (React Client Components).
 * Utilise createBrowserClient pour maintenir automatiquement la session utilisateur via les cookies du navigateur.
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Si les clés ne sont pas configurées, on loggue un avertissement clair sans faire crasher l'app
    console.warn(
      'Supabase: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant dans .env.local'
    );
  }

  return createBrowserClient<Database>(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
  );
}

/**
 * Singleton client pour utilisation directe dans les composants clients.
 */
export const supabase = createClient();
