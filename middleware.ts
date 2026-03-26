import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/subscribe") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/"

  if (isPublic) return NextResponse.next()

  const subscribed = req.cookies.get("subscribed")?.value === "true"

  if (!subscribed) {
    const url = req.nextUrl.clone()
    url.pathname = "/subscribe"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}


  export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*'] // adjust to your private areas

}
