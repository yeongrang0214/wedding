import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, constantTimeEqual, createAccessToken } from "./lib/site-auth";

const PUBLIC_PATHS = new Set([
  "/login",
  "/api/auth/login",
  "/favicon.ico",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/sw.js",
]);

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/wedding-editorial-hero.png") ||
    pathname.startsWith("/og.png")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const configuredPassword = process.env.SITE_PASSWORD;
  const currentToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (configuredPassword && currentToken) {
    const expectedToken = await createAccessToken(configuredPassword);
    if (constantTimeEqual(currentToken, expectedToken)) return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const returnTo = `${pathname}${search}`;
  if (returnTo !== "/") loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/favicon.ico).*)"],
};
