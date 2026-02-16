import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr","en","he"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/fr";
    return NextResponse.redirect(url);
  }
  const seg = pathname.split("/")[1];
  if (!locales.includes(seg) && !pathname.startsWith("/admin")) {
    const url = req.nextUrl.clone();
    url.pathname = "/fr" + pathname;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!_next|favicon.ico).*)"],
};
