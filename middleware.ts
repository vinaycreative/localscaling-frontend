import {
  DefaultRedirectByRole,
  Role,
  canAccessPath,
  type RoleValue,
} from "@/constants/auth";
import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "./lib/utils";

const PUBLIC_PATHS = new Set<string>(["/", "/login", "/signup"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyJwt(token);

  console.log("payload is ", payload);

  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const rawRole = payload.role;
  const role =
    rawRole === "authenticated" || !rawRole
      ? Role.CLIENT
      : (rawRole as RoleValue);

  console.log("role is ", role);
  if (!canAccessPath(role, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = DefaultRedirectByRole[role] ?? "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
};
