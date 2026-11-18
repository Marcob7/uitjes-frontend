"use client";

import Link from "next/link";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname } from "@/lib/i18n/config";

export default function NotFound() {
  const { locale, t } = useLocale();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">404</p>
      <h1 className="mt-3 text-4xl font-bold text-neutral-900">{t("notFound.title")}</h1>
      <p className="mt-4 text-neutral-600">{t("notFound.intro")}</p>
      <nav aria-label={t("notFound.navigation")} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={localePathname("/", locale)}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
        >
          {t("notFound.home")}
        </Link>
        <Link
          href={localePathname("/zoeken", locale)}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
        >
          {t("notFound.search")}
        </Link>
        <Link
          href={localePathname("/ontdek", locale)}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
        >
          {t("notFound.explore")}
        </Link>
      </nav>
    </main>
  );
}
