export function getInspirationDetailHref(category: string, slug: string) {
  return `/inspiratie/${category}/${slug}`;
}

export type InspirationContext = {
  location?: string;
  nearbyCity?: string;
};

/** Builds the query string that preserves a visitor's inspiration context. */
export function buildInspirationContextQuery(context?: InspirationContext) {
  const params = new URLSearchParams();

  if (context?.location) params.set("location", context.location);
  if (context?.nearbyCity) params.set("nearbyCity", context.nearbyCity);

  return params.toString();
}

/** Appends an already-built inspiration context query without changing the path. */
export function withInspirationContext(href: string, context?: InspirationContext) {
  const query = buildInspirationContextQuery(context);
  return query ? `${href}?${query}` : href;
}
