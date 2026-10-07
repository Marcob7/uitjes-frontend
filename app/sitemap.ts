import { newsArticles } from "@/lib/newsArticles";
import { CITY_CONTENT_CITY_SLUGS } from "@/lib/cityContentCities";
import { localePathname, locales } from "@/lib/i18n/config";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/ontdek",
  "/faq",
  "/inspiratie",
  "/jaarkalender",
  "/festivals/kalender",
  "/inspiratie/snel-ontdekken",
  "/inspiratie/buiten-genieten",
  "/inspiratie/regenproof",
  "/inspiratie/voor-vanavond",
];

export default function sitemap() {
  const localized = (route: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly") =>
    locales.map((locale) => ({
    url: `${siteUrl}${localePathname(route, locale)}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(locales.map((candidate) => [candidate, `${siteUrl}${localePathname(route, candidate)}`])) },
  }));

  const staticRoutes = routes.flatMap((route) => localized(route, route === "/" ? 1 : 0.7, "weekly"));

  const articleRoutes = newsArticles.flatMap((article) => locales.map((locale) => ({
    url: `${siteUrl}${localePathname(`/nieuws/${article.slug}`, locale)}`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })));

  // These are the city pages that are backed by the city-content API.  Their
  // query parameter is intentional: it is part of the canonical URL and the
  // page content changes by city.
  const cityRoutes = CITY_CONTENT_CITY_SLUGS.flatMap((city) => locales.map((locale) => ({
    url: `${siteUrl}${localePathname("/ontdek", locale)}?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  })));

  return [
    ...staticRoutes,
    ...localized("/nieuws", 0.7, "weekly"),
    ...articleRoutes,
    ...cityRoutes,
  ];
}
