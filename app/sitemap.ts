import { newsArticles } from "@/lib/newsArticles";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/ontdek",
  "/zoeken",
  "/faq",
  "/inspiratie",
  "/jaarkalender",
  "/festivals",
  "/festivals/kalender",
  "/inspiratie/snel-ontdekken",
  "/inspiratie/buiten-genieten",
  "/inspiratie/regenproof",
  "/inspiratie/voor-vanavond",
];

export default function sitemap() {
  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  const articleRoutes = newsArticles.map((article) => ({
    url: `${siteUrl}/nieuws/${article.slug}`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    {
      url: `${siteUrl}/nieuws`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...articleRoutes,
  ];
}
