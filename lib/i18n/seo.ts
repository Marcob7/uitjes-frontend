import type { Metadata } from "next";

import { localePathname, locales, localeToOpenGraph, withoutLocalePrefix, type Locale } from "./config";

export function getLocaleAlternates(pathname: string, locale: Locale): Metadata["alternates"] {
  const barePathname = withoutLocalePrefix(pathname);
  return {
    canonical: localePathname(barePathname, locale),
    languages: Object.fromEntries(
      locales.map((candidate) => [candidate, localePathname(barePathname, candidate)]),
    ),
  };
}

export function getLocaleOpenGraph(locale: Locale, pathname: string) {
  return {
    locale: localeToOpenGraph[locale],
    url: localePathname(withoutLocalePrefix(pathname), locale),
  };
}
