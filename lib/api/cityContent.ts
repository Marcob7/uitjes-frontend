import { getApiBase } from "@/lib/config";

// City-content API helpers. These functions are intentionally not wired into
// pages yet; callers can pass `{ fallback: existingDummyItems }` to keep the UI
// usable when the backend is offline or still warming up.
export type CityContentType = "outings" | "food_drink" | string;

export type CityContentParams = {
  city?: string | null;
  type?: CityContentType | null;
  query?: string | null;
  limit?: number | null;
  offset?: number | null;
};

export type CityContentItem = {
  id: number | null;
  slug: string | null;
  title: string | null;
  city: string | null;
  cityName: string | null;
  kind: string | null;
  category: string | null;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  priorityScore: number | null;
  ratingValue: number | null;
  reviewCount: number | null;
  ratingSource: string | null;
  ratingMax: number | null;
  featured: boolean;
  editorsPick: boolean;
  hiddenGem: boolean;
  statusOverride: string | null;
  venue: string | null;
  venueAddress: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  priceMin: number | null;
  priceMax: number | null;
  priceNote: string | null;
  isFree: boolean;
  startAt: string | null;
  endAt: string | null;
  dateText: string | null;
  rawDateText: string | null;
  openingHoursText: string | null;
  status: string | null;
  sourceUrl: string | null;
  ticketUrl: string | null;
  reservationUrl: string | null;
  tags: string[];
  practicalInfo: string | null;
};

type BackendCityContentItem = {
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  city?: unknown;
  city_name?: unknown;
  kind?: unknown;
  category?: unknown;
  category_label?: unknown;
  summary?: unknown;
  description?: unknown;
  image_url?: unknown;
  image_alt?: unknown;
  priority_score?: unknown;
  rating_value?: unknown;
  review_count?: unknown;
  rating_source?: unknown;
  rating_max?: unknown;
  featured?: unknown;
  is_featured?: unknown;
  editors_pick?: unknown;
  hidden_gem?: unknown;
  is_hidden_gem?: unknown;
  status_override?: unknown;
  venue?: unknown;
  venue_address?: unknown;
  address?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  price_min?: unknown;
  price_max?: unknown;
  price_note?: unknown;
  is_free?: unknown;
  start_at?: unknown;
  end_at?: unknown;
  date_text?: unknown;
  raw_date_text?: unknown;
  opening_hours_text?: unknown;
  status?: unknown;
  source_url?: unknown;
  ticket_url?: unknown;
  reservation_url?: unknown;
  tags?: unknown;
  practical_info?: unknown;
};

type CityContentApiResponse = {
  results?: BackendCityContentItem[];
  count?: number;
  limit?: number;
  offset?: number;
  next_offset?: number | null;
  has_more?: boolean;
};

type CityContentFetchOptions = {
  fallback?: CityContentItem[];
};

const DEFAULT_LIMIT = 100;
const SEARCH_LIMIT = 24;

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return value == null ? null : String(value);
  }

  const cleaned = value.trim();
  if (!cleaned) return null;

  if (["nan", "none", "null", "n/a", "na"].includes(cleaned.toLowerCase())) {
    return null;
  }

  return cleaned;
}

function normalizeNumber(value: unknown): number | null {
  if (value == null || value === "") return null;

  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeRatingNumber(value: unknown, maxValue: number | null = 5): number | null {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    return value > 0 && value <= (maxValue ?? 5) ? value : null;
  }

  if (typeof value !== "string") return null;

  const cleaned = value.trim();
  if (!cleaned) return null;

  const match = cleaned.match(/\d+(?:[,.]\d+)?/);
  if (!match) return null;

  const numericValue = Number(match[0].replace(",", "."));
  if (!Number.isFinite(numericValue)) return null;

  return numericValue > 0 && numericValue <= (maxValue ?? 5) ? numericValue : null;
}

function normalizeReviewCount(value: unknown): number | null {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return null;
    return Math.floor(value);
  }

  if (typeof value !== "string") return null;

  const cleaned = value.trim();
  if (!/^\d+(?:[.\s]\d{3})*$/.test(cleaned)) return null;

  const numericValue = Number(cleaned.replace(/[.\s]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    return ["1", "true", "yes", "ja"].includes(value.trim().toLowerCase());
  }
  return false;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((tag) => {
      if (tag && typeof tag === "object" && "slug" in tag) {
        return normalizeString((tag as { slug?: unknown }).slug);
      }

      return normalizeString(tag);
    })
    .filter((tag): tag is string => Boolean(tag));
}

export function normalizeCityContentItem(
  item: BackendCityContentItem
): CityContentItem {
  const ratingMax = normalizeRatingNumber(item.rating_max, Number.POSITIVE_INFINITY) ?? 5;

  return {
    id: normalizeNumber(item.id),
    slug: normalizeString(item.slug),
    title: normalizeString(item.title),
    city: normalizeString(item.city),
    cityName: normalizeString(item.city_name),
    kind: normalizeString(item.kind),
    category: normalizeString(item.category_label) ?? normalizeString(item.category),
    summary: normalizeString(item.summary),
    description: normalizeString(item.description),
    imageUrl: normalizeString(item.image_url),
    imageAlt: normalizeString(item.image_alt),
    priorityScore: normalizeNumber(item.priority_score),
    ratingValue: normalizeRatingNumber(item.rating_value, ratingMax),
    reviewCount: normalizeReviewCount(item.review_count),
    ratingSource: normalizeString(item.rating_source),
    ratingMax,
    featured: normalizeBoolean(item.featured) || normalizeBoolean(item.is_featured),
    editorsPick: normalizeBoolean(item.editors_pick),
    hiddenGem: normalizeBoolean(item.hidden_gem) || normalizeBoolean(item.is_hidden_gem),
    statusOverride: normalizeString(item.status_override),
    venue: normalizeString(item.venue),
    venueAddress: normalizeString(item.venue_address),
    address: normalizeString(item.address),
    latitude: normalizeNumber(item.latitude),
    longitude: normalizeNumber(item.longitude),
    priceMin: normalizeNumber(item.price_min),
    priceMax: normalizeNumber(item.price_max),
    priceNote: normalizeString(item.price_note),
    isFree: normalizeBoolean(item.is_free),
    startAt: normalizeString(item.start_at),
    endAt: normalizeString(item.end_at),
    dateText: normalizeString(item.date_text),
    rawDateText: normalizeString(item.raw_date_text),
    openingHoursText: normalizeString(item.opening_hours_text),
    status: normalizeString(item.status),
    sourceUrl: normalizeString(item.source_url),
    ticketUrl: normalizeString(item.ticket_url),
    reservationUrl: normalizeString(item.reservation_url),
    tags: normalizeTags(item.tags),
    practicalInfo: normalizeString(item.practical_info),
  };
}

function buildCityContentUrl(params: CityContentParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.city) searchParams.set("city", params.city);
  if (params.type) searchParams.set("type", params.type);
  if (params.query) searchParams.set("query", params.query);
  if (typeof params.limit === "number") searchParams.set("limit", String(params.limit));
  if (typeof params.offset === "number") searchParams.set("offset", String(params.offset));

  const queryString = searchParams.toString();
  const path = queryString ? `/api/city-content/?${queryString}` : "/api/city-content/";

  return `${getApiBase()}${path}`;
}

function buildCityContentPath(params: CityContentParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.city) searchParams.set("city", params.city);
  if (params.type) searchParams.set("type", params.type);
  if (params.query) searchParams.set("query", params.query);
  if (typeof params.limit === "number") searchParams.set("limit", String(params.limit));
  if (typeof params.offset === "number") searchParams.set("offset", String(params.offset));

  const queryString = searchParams.toString();
  return queryString ? `/api/city-content/?${queryString}` : "/api/city-content/";
}

function getCityContentRequestUrls(params: CityContentParams = {}) {
  const path = buildCityContentPath(params);
  const primaryUrl = buildCityContentUrl(params);

  if (typeof window !== "undefined") {
    return [path.replace("/api/city-content/?", "/api/city-content?")];
  }

  const urls = [primaryUrl];

  if (
    process.env.NODE_ENV !== "production" &&
    !primaryUrl.startsWith("http://127.0.0.1:8000") &&
    !primaryUrl.startsWith("http://localhost:8000")
  ) {
    urls.push(`http://127.0.0.1:8000${path}`);
  }

  return urls;
}

function getEventBySlugRequestUrls(slug: string) {
  const path = `/api/events/by-slug/${encodeURIComponent(slug)}/`;
  const primaryUrl = `${getApiBase()}${path}`;
  const urls = [primaryUrl];

  if (
    process.env.NODE_ENV !== "production" &&
    !primaryUrl.startsWith("http://127.0.0.1:8000") &&
    !primaryUrl.startsWith("http://localhost:8000")
  ) {
    urls.push(`http://127.0.0.1:8000${path}`);
  }

  return urls;
}

function logCityContentError(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("City content API fallback gebruikt:", error);
  }
}

async function fetchCityContentPage(
  params: CityContentParams = {}
): Promise<CityContentApiResponse> {
  let lastError: unknown = null;

  for (const url of getCityContentRequestUrls(params)) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as CityContentApiResponse | null;

      if (!response.ok) {
        throw new Error(`GET ${url} failed: ${response.status}`);
      }

      return payload ?? { results: [] };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("GET /api/city-content/ failed");
}

// Public helper for list/cards. Pass `fallback` when a caller wants to keep
// existing dummy data visible while the backend is offline or still warming up.
export async function getCityContent(
  params: CityContentParams = {},
  options: CityContentFetchOptions = {}
): Promise<CityContentItem[]> {
  try {
    const payload = await fetchCityContentPage(params);
    return (payload.results ?? []).map(normalizeCityContentItem);
  } catch (error) {
    logCityContentError(error);
    return options.fallback ?? [];
  }
}

async function getAllCityContent(
  params: CityContentParams,
  options: CityContentFetchOptions = {}
): Promise<CityContentItem[]> {
  const limit = params.limit ?? DEFAULT_LIMIT;
  let offset = params.offset ?? 0;
  const items: CityContentItem[] = [];

  try {
    for (;;) {
      const payload = await fetchCityContentPage({ ...params, limit, offset });
      items.push(...(payload.results ?? []).map(normalizeCityContentItem));

      if (!payload.has_more || payload.next_offset == null) {
        return items;
      }

      offset = payload.next_offset;
    }
  } catch (error) {
    logCityContentError(error);
    return options.fallback ?? [];
  }
}

export async function getCityContentByCity(
  city: string,
  options: CityContentFetchOptions = {}
) {
  return getAllCityContent({ city }, options);
}

export async function getCityContentBySlug(slug: string) {
  let lastError: unknown = null;
  let foundNotFound = false;

  for (const url of getEventBySlugRequestUrls(slug)) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | BackendCityContentItem
        | null;

      if (response.status === 404) {
        foundNotFound = true;
        continue;
      }

      if (!response.ok) {
        throw new Error(`GET ${url} failed: ${response.status}`);
      }

      return payload ? normalizeCityContentItem(payload) : null;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError || !foundNotFound) {
    logCityContentError(lastError ?? new Error(`GET /api/events/by-slug/${slug}/ failed`));
  }

  return null;
}

export async function getCityOutings(
  city: string,
  options: CityContentFetchOptions = {}
) {
  return getAllCityContent({ city, type: "outings" }, options);
}

export async function getCityFoodDrink(
  city: string,
  options: CityContentFetchOptions = {}
) {
  return getAllCityContent({ city, type: "food_drink" }, options);
}

export async function searchCityContent(
  query: string,
  options: CityContentFetchOptions = {}
) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  return getCityContent({ query: trimmedQuery, limit: SEARCH_LIMIT }, options);
}
