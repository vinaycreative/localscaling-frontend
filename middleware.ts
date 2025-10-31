import { NextResponse, type NextRequest } from "next/server"
import { verifyJwt } from "@/lib/auth/jwt"
import { DefaultRedirectByRole, canAccessPath, type RoleValue } from "@/constants/auth"

const PUBLIC_PATHS = new Set<string>(["/", "/login"])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and all API routes
  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Read token
  const token = request.cookies.get("access_token")?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  const payload = await verifyJwt(token)
  if (!payload) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Enforce role-route access
  const role = payload.role as RoleValue
  if (!canAccessPath(role, pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = DefaultRedirectByRole[role] ?? "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
}
