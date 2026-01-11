import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role;
  const { pathname } = request.nextUrl;

  if (role === "PRACTITIONER" && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (role === "CLIENT" && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    role !== "PRACTITIONER" &&
    pathname.startsWith("/dashboard/availability")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !token &&
    (pathname.startsWith("/profile") || pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/login", "/"],
};
