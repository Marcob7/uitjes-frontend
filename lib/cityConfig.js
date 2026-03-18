export const cityConfig = {
  apeldoorn: {
    slug: "apeldoorn",
    label: "Apeldoorn",
    description:
      "Ontdek de leukste restaurants, kroegen, uitjes en activiteiten in Apeldoorn.",
    accentClass: "bg-emerald-500",
    accentSoftClass: "border-emerald-500 text-emerald-600",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/julianatoren.jpg",
  },
  deventer: {
    slug: "deventer",
    label: "Deventer",
    description:
      "Ontdek de leukste evenementen, hotspots en uitjes in Deventer.",
    accentClass: "bg-amber-500",
    accentSoftClass: "border-amber-500 text-amber-600",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/apeldoorn_img.jpg",
  },
};

export function getCityConfig(city) {
  const fallback = {
    slug: city,
    label: city
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    description: `Ontdek wat er te doen is in ${city}.`,
    accentClass: "bg-emerald-500",
    accentSoftClass: "border-emerald-500 text-emerald-600",
    fallbackImage: "/images/apeldoorn_img.jpg",
    heroImage: "/images/apeldoorn_img.jpg",
  };

  return cityConfig[city] || fallback;
}