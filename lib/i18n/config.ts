export const locales = ["nl", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nl";
export const localeCookieName = "uitjes_locale";

export const localeToIntl: Record<Locale, string> = {
  nl: "nl-NL",
  en: "en-GB",
};

export const localeToOpenGraph: Record<Locale, string> = {
  nl: "nl_NL",
  en: "en_GB",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function withoutLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/(nl|en)(?=\/|$)/);
  if (!match) return pathname || "/";

  return pathname.slice(match[0].length) || "/";
}

export function localePathname(pathname: string, locale: Locale) {
  const path = withoutLocalePrefix(pathname);
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
