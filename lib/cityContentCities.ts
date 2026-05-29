export const CITY_CONTENT_CITY_SLUGS = [
  "amersfoort",
  "harderwijk",
  "lelystad",
  "nijmegen",
] as const;

const CITY_CONTENT_CITIES = new Set<string>(CITY_CONTENT_CITY_SLUGS);

export function isCityContentCity(city: string | null | undefined): city is string {
  return Boolean(city && CITY_CONTENT_CITIES.has(city));
}
