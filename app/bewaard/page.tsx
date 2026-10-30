import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale, isLocale, localePathname } from "@/lib/i18n/config";

type BewaardPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function BewaardPage({ searchParams }: BewaardPageProps) {
  const requestedLocale = headers().get("x-uitjes-locale");
  const locale = requestedLocale && isLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;
  const query = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((entry) => query.append(key, entry));
    else if (value !== undefined) query.set(key, value);
  });

  const suffix = query.size ? `?${query}` : "";
  redirect(`${localePathname("/saved", locale)}${suffix}`);
}
