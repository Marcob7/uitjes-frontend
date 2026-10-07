import { headers } from "next/headers";

import { defaultLocale, isLocale, type Locale } from "./config";

/** Reads the locale supplied by middleware for the current request. */
export function getRequestLocale(): Locale {
  const locale = headers().get("x-uitjes-locale");
  return locale && isLocale(locale) ? locale : defaultLocale;
}

/** The public, locale-prefixed pathname supplied by middleware. */
export function getRequestPathname() {
  return headers().get("x-uitjes-pathname") ?? "/";
}
