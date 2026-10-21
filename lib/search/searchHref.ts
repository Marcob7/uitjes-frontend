import { localePathname, type Locale } from "@/lib/i18n/config";

export type SearchHrefParams = {
  query?: string;
  when?: string;
  category?: string;
  free?: boolean;
};

export function buildSearchHref(locale: Locale, params: SearchHrefParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("query", params.query);
  if (params.when) searchParams.set("when", params.when);
  if (params.category) searchParams.set("category", params.category);
  if (params.free) searchParams.set("free", "1");

  const queryString = searchParams.toString();
  const pathname = localePathname("/zoeken", locale);

  return queryString ? `${pathname}?${queryString}` : pathname;
}
