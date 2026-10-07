import { redirect } from "next/navigation";
import { localePathname, type Locale } from "@/lib/i18n/config";

export type FestivalRedirectSearchParams = Record<
  string,
  string | string[] | undefined
>;

export function redirectToFestivalCalendar(
  searchParams: FestivalRedirectSearchParams = {},
  locale: Locale = "nl",
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }

  const queryString = params.toString();

  const pathname = localePathname("/festivals/kalender", locale);
  redirect(queryString ? `${pathname}?${queryString}` : pathname);
}
