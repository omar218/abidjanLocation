import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

/**
 * Middleware Next.js pour le contrôle d'accès et la gestion des sessions Supabase.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Définition des routes publiques accessibles sans restriction
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/subscribe") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/listing") ||
    pathname === "/"

  // 1. Rafraîchissement des tokens Supabase
  const { response, user } = await updateSession(req)

  // Si la route est publique, autoriser l'accès en propageant les cookies rafraîchis
  if (isPublic) {
    return response
  }

  // 2. Vérification d'abonnement ou d'authentification propriétaire
  const subscribed = req.cookies.get("subscribed")?.value === "true"
  const localSession = req.cookies.get("session")?.value

  // Si l'utilisateur est connecté via Supabase ou possède un abonnement / session locale
  if (user || subscribed || localSession) {
    return response
  }

  // Redirection vers login ou subscribe si non connecté
  const url = req.nextUrl.clone()
  url.pathname = "/login"
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*']
}
