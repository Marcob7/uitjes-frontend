export const cityConfig = {
  apeldoorn: {
    slug: "apeldoorn",
    label: "Apeldoorn",
    description:
      "Ontdek de leukste restaurants, kroegen, uitjes en activiteiten in Apeldoorn.",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/julianatoren.jpg",
    layout: "default",
    contentStyle: "playful",
    colors: {
      pageBackground: "#f7f8fa",
      accent: "#10b981",
      accentText: "#ffffff",
      mutedSurface: "#ffffff",
      softSurface: "#f3f4f6",
      heading: "#111827",
      text: "#374151",
    },
  },

  deventer: {
    slug: "deventer",
    label: "Deventer",
    description:
      "Ontdek de leukste evenementen, hotspots en uitjes in Deventer.",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/apeldoorn_img.jpg",
    layout: "default",
    contentStyle: "warm",
    colors: {
      pageBackground: "#fee2e2",
      accent: "#dc2626",
      accentText: "#ffffff",
      mutedSurface: "#ffffff",
      softSurface: "#fff1f2",
      heading: "#111827",
      text: "#374151",
    },
  },

  zwolle: {
    slug: "zwolle",
    label: "Zwolle",
    description:
      "Curated culturele tips, hotspots en bijzondere momenten in het hart van Zwolle.",
    fallbackImage: "/images/zwolle_fallback.jpg",
    heroImage: "/images/zwolle_hero.jpg",
    layout: "discoveryEditorial",
    contentStyle: "editorial",
    colors: {
      pageBackground: "#f5f3ef",
      accent: "#b7df8a",
      accentText: "#111111",
      mutedSurface: "#f7f4ed",
      softSurface: "#ebe0c6",
      heading: "#111111",
      text: "#4b4b4b",
      cardBackground: "#ffffff",
      borderSoft: "#e9e2d6",
    },

    discovery: {
      eyebrow: "Zwolle Discovery",
      intro:
        "Curated culturele momenten in het hart van Overijssel. Van historische straatjes tot moderne hotspots en verrassende events.",
      tabs: ["Evenementen", "Attracties", "Restaurants", "Bars", "Dingen om te doen"],
      newsletterTitle: "Blijf op de hoogte van Zwolle",
      newsletterPlaceholder: "Jouw e-mailadres",
      localSectionTitle: "Iconisch Zwolle",
      localSectionCta: "Ontdek alle lokale tips",
    },
  },
};

export function getCityConfig(city) {
  const safeCity = (city || "").toLowerCase();

  const label = safeCity
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    cityConfig[safeCity] || {
      slug: safeCity,
      label,
      description: `Ontdek wat er te doen is in ${label}.`,
      fallbackImage: "/images/apeldoorn_img.jpg",
      heroImage: "/images/apeldoorn_img.jpg",
      layout: "default",
      contentStyle: "default",
      colors: {
        pageBackground: "#f7f8fa",
        accent: "#10b981",
        accentText: "#ffffff",
        mutedSurface: "#ffffff",
        softSurface: "#f3f4f6",
        heading: "#111827",
        text: "#374151",
      },
    }
  );
}