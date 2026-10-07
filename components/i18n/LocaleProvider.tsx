"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { getCommonMessages, translate } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  messages: ReturnType<typeof getCommonMessages>;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const pathname = usePathname();
  const urlLocale = pathname.split("/")[1];
  // The public URL is authoritative after client-side navigation. Middleware
  // rewrites /en/... to an existing unprefixed route, which may otherwise let
  // a preserved App Router layout retain an earlier server prop.
  const activeLocale = isLocale(urlLocale) ? urlLocale : locale;
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: activeLocale,
      messages: getCommonMessages(activeLocale),
      t: (key, values) => translate(activeLocale, key, values),
    }),
    [activeLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider.");
  return context;
}
