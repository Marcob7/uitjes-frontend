const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/ontdek",
  "/zoeken",
  "/faq",
  "/inspiratie",
  "/jaarkalender",
  "/festivals/lijst",
  "/festivals/kalender",
  "/festivals/kaart",
  "/inspiratie/snel-ontdekken",
  "/inspiratie/buiten-genieten",
  "/inspiratie/regenproof",
  "/inspiratie/voor-vanavond",
];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));
}
