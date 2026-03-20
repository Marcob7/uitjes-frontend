export const cityConfig = {
  apeldoorn: {
    slug: "apeldoorn",
    label: "Apeldoorn",
    description:
      "Ontdek de leukste restaurants, kroegen, uitjes en activiteiten in Apeldoorn.",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/julianatoren.jpg",
    colors: {
      pageBackground: "#f7f8fa",
      accent: "#10b981",
      accentText: "#ffffff",
    },
  },
  deventer: {
    slug: "deventer",
    label: "Deventer",
    description:
      "Ontdek de leukste evenementen, hotspots en uitjes in Deventer.",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/apeldoorn_img.jpg",
    colors: {
      pageBackground: "#fee2e2",
      accent: "#dc2626",
      accentText: "#ffffff",
    },
  },
};

export function getCityConfig(city) {
  const label = city
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    cityConfig[city] || {
      slug: city,
      label,
      description: `Ontdek wat er te doen is in ${label}.`,
      fallbackImage: "/images/apeldoorn_img.jpg",
      heroImage: "/images/apeldoorn_img.jpg",
      colors: {
        pageBackground: "#f7f8fa",
        accent: "#10b981",
        accentText: "#ffffff",
      },
    }
  );
}