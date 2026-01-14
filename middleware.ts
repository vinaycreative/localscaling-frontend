import { DefaultRedirectByRole, Role, canAccessPath, type RoleValue } from "@/constants/auth"
import { NextResponse, type NextRequest } from "next/server"
import { verifyJwt } from "./lib/utils"

const PUBLIC_PATHS = ["/", "/login", "/signup"]

type DecodedToken = {
  id: string
  first_name: string
  last_name: string | null
  email: string
  role: "client" | "admin" | "support_admin" | "support_head_admin"
  exp?: number
}
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  const pathname = request.nextUrl.pathname
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/payment")
  if (!!!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  // Only try to decode token if it exists
  let decoded: DecodedToken | null = null

  if (token) {
    try {
      decoded = (await verifyJwt(token)) as DecodedToken | null
      if (decoded && decoded.exp && decoded.exp < Date.now() / 1000) {
        request.cookies.delete("access_token")
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      request.cookies.delete("access_token")
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  // Exclude Next internals + static files from auth middleware.
  // Without this, requests for public assets (e.g. /webflow.png) can get redirected,
  // and `next/image` will fail with "requested resource isn't a valid image".
  matcher: [
    "/((?!_next|favicon.ico|assets|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)",
  ],
}

