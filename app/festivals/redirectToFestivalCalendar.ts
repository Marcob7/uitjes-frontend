import { redirect } from "next/navigation";

export type FestivalRedirectSearchParams = Record<
  string,
  string | string[] | undefined
>;

export function redirectToFestivalCalendar(
  searchParams: FestivalRedirectSearchParams = {}
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

  redirect(
    queryString
      ? `/festivals/kalender?${queryString}`
      : "/festivals/kalender"
  );
}
