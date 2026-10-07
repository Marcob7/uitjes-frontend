import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale, localeCookieName, localePathname } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(?:.*)$/;

function preferredLocale(request: NextRequest) {
  const saved = request.cookies.get(localeCookieName)?.value;
  return saved && isLocale(saved) ? saved : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const [, prefix] = pathname.match(/^\/(nl|en)(?=\/|$)/) ?? [];
  if (!prefix) {
    const destination = request.nextUrl.clone();
    destination.pathname = localePathname(pathname, preferredLocale(request));
    return NextResponse.redirect(destination);
  }

  const locale = prefix as "nl" | "en";
  // `prefix` excludes the leading slash, so strip both it and that slash.
  // For example, /en/ontdek must become /ontdek; /nl must become /.
  const internalPathname = pathname.slice(prefix.length + 1) || "/";
  const destination = request.nextUrl.clone();
  destination.pathname = internalPathname;
  destination.search = search;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-uitjes-locale", locale);
  requestHeaders.set("x-uitjes-pathname", pathname);

  const response = NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
  const isPrefetch =
    request.headers.get("purpose") === "prefetch" ||
    request.headers.has("next-router-prefetch");

  // A direct, explicitly prefixed URL should become the remembered choice so
  // older unprefixed internal links remain in that locale. Prefetches must
  // never change it: a prefetched NL card must not undo an EN selection.
  if (!isPrefetch) {
    response.cookies.set(localeCookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
