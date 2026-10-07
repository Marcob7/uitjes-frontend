"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { useLocale } from "./LocaleProvider";
import { localeCookieName, localePathname, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, messages } = useLocale();
  const nextLocale: Locale = locale === "nl" ? "en" : "nl";
  const query = searchParams.toString();
  const href = `${localePathname(pathname, nextLocale)}${query ? `?${query}` : ""}`;

  function rememberPreference() {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <Link
      href={href}
      onClick={rememberPreference}
      aria-label={messages.language.switchTo.replace("{language}", messages.language[nextLocale])}
      className={compact
        ? "inline-flex min-h-11 items-center rounded-[0.95rem] px-4 text-[15px] font-medium text-white/82 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/90"
        : "inline-flex h-[38px] items-center justify-center rounded-full border border-current/20 px-2.5 text-[12px] font-bold tracking-[0.08em] outline-none transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/60"}
    >
      {nextLocale.toUpperCase()}
    </Link>
  );
}
