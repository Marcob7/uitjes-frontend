const WIKIMEDIA = "https://upload.wikimedia.org/wikipedia/commons";

const DEFAULT_COLORS = {
  pageBackground: "#f7f8fa",
  accent: "#10b981",
  accentText: "#ffffff",
  mutedSurface: "#ffffff",
  softSurface: "#f3f4f6",
  heading: "#111827",
  text: "#374151",
};

const COLOR_THEMES = {
  playful: {
    pageBackground: "#f7f8fa",
    accent: "#10b981",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#f3f4f6",
    heading: "#111827",
    text: "#374151",
  },
  warm: {
    pageBackground: "#fff7ed",
    accent: "#ea580c",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#ffedd5",
    heading: "#111827",
    text: "#4b5563",
  },
  modern: {
    pageBackground: "#f4f7fb",
    accent: "#2563eb",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dbeafe",
    heading: "#0f172a",
    text: "#334155",
  },
  editorial: {
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
  canal: {
    pageBackground: "#f3f7fb",
    accent: "#0f766e",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dff6f2",
    heading: "#0f172a",
    text: "#334155",
  },
  night: {
    pageBackground: "#eef2ff",
    accent: "#4338ca",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#e0e7ff",
    heading: "#111827",
    text: "#374151",
  },
  burgundy: {
    pageBackground: "#fdf2f8",
    accent: "#be185d",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#fce7f3",
    heading: "#111827",
    text: "#374151",
  },
};

function buildCityConfig({
  slug,
  label,
  description,
  heroImage,
  fallbackImage,
  layout = "default",
  contentStyle = "default",
  theme = "playful",
  colors,
  discovery,
}) {
  return {
    slug,
    label,
    description,
    fallbackImage: fallbackImage || heroImage,
    heroImage: heroImage || fallbackImage,
    layout,
    contentStyle,
    colors: {
      ...DEFAULT_COLORS,
      ...(COLOR_THEMES[theme] || {}),
      ...(colors || {}),
    },
    ...(discovery ? { discovery } : {}),
  };
}

export function normalizeCitySlug(city) {
  return (city || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019.]/g, "")
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const cityConfig = {
  apeldoorn: buildCityConfig({
    slug: "apeldoorn",
    label: "Apeldoorn",
    description:
      "Ontdek de leukste restaurants, kroegen, uitjes en activiteiten in Apeldoorn.",
    heroImage: `${WIKIMEDIA}/9/94/Oranjepark01_Apeldoorn.jpg`,
    contentStyle: "playful",
    theme: "playful",
  }),

  amersfoort: buildCityConfig({
    slug: "amersfoort",
    label: "Amersfoort",
    description:
      "Van de Koppelpoort tot creatieve adressen en fijne terrassen: ontdek Amersfoort.",
    heroImage: `${WIKIMEDIA}/e/e3/Amersfoort_Zuidsingel.JPG`,
    contentStyle: "warm",
    theme: "warm",
  }),

  amsterdam: buildCityConfig({
    slug: "amsterdam",
    label: "Amsterdam",
    description:
      "Ontdek grachten, musea, buurtrestaurants, nachtleven en events in Amsterdam.",
    heroImage: `${WIKIMEDIA}/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png`,
    contentStyle: "canal",
    theme: "canal",
  }),

  almere: buildCityConfig({
    slug: "almere",
    label: "Almere",
    description:
      "Verken moderne architectuur, waterfront hotspots en family-proof uitjes in Almere.",
    heroImage: `${WIKIMEDIA}/b/bc/Skyline_Almere.jpg`,
    contentStyle: "modern",
    theme: "modern",
  }),

  arnhem: buildCityConfig({
    slug: "arnhem",
    label: "Arnhem",
    description:
      "Ontdek mode, stadsparken, cultuur en verrassende plekken in Arnhem.",
    heroImage: `${WIKIMEDIA}/c/c2/The_Musis_Sacrum%2C_late_afternoon_-_panoramio.jpg`,
    contentStyle: "night",
    theme: "night",
  }),

  breda: buildCityConfig({
    slug: "breda",
    label: "Breda",
    description:
      "Ontdek bourgondische pleinen, historische straten en gezellige avonden in Breda.",
    heroImage: `${WIKIMEDIA}/2/2d/2010-05-21-breda-by-RalfR-06.jpg`,
    contentStyle: "warm",
    theme: "warm",
  }),

  delft: buildCityConfig({
    slug: "delft",
    label: "Delft",
    description:
      "Verken historische pleinen, Delftse grachten, cultuur en gezellige cafes in Delft.",
    heroImage: `${WIKIMEDIA}/c/c2/Delft_Blick_von_der_Nieuwe_Kerk_auf_die_Oude_Kerk_1.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
  }),

  "den-bosch": buildCityConfig({
    slug: "den-bosch",
    label: "Den Bosch",
    description:
      "Ontdek de Binnendieze, bourgondische horeca en historische charme in Den Bosch.",
    heroImage: `${WIKIMEDIA}/f/f1/St._Jans_cathedral_%27s-Hertogenbosch.jpg`,
    contentStyle: "warm",
    theme: "warm",
  }),

  "den-haag": buildCityConfig({
    slug: "den-haag",
    label: "Den Haag",
    description:
      "Ontdek musea, politiek Den Haag, stijlvolle hotspots en stranddagen aan zee.",
    heroImage: `${WIKIMEDIA}/c/ce/Den_Haag_Skyline_1.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
  }),

  deventer: buildCityConfig({
    slug: "deventer",
    label: "Deventer",
    description:
      "Ontdek de leukste evenementen, hotspots en uitjes in het historische Deventer.",
    heroImage: `${WIKIMEDIA}/7/7d/Deventer%2C_straatzicht_de_Brink_positie1_foto7_2012-02-05_11.49.JPG`,
    contentStyle: "warm",
    theme: "warm",
  }),

  dordrecht: buildCityConfig({
    slug: "dordrecht",
    label: "Dordrecht",
    description:
      "Ontdek havens, monumentale binnenstad en culturele uitjes in Dordrecht.",
    heroImage: `${WIKIMEDIA}/f/fa/Augustijnenkamp%2C_3311_Dordrecht%2C_Netherlands_-_panoramio_%282%29.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
  }),

  eindhoven: buildCityConfig({
    slug: "eindhoven",
    label: "Eindhoven",
    description:
      "Ontdek design, lichtkunst, tech-hotspots en creatieve events in Eindhoven.",
    heroImage: `${WIKIMEDIA}/0/07/Lichttoren_Eindhoven_1_-_Cropped.jpg`,
    contentStyle: "modern",
    theme: "modern",
  }),

  enschede: buildCityConfig({
    slug: "enschede",
    label: "Enschede",
    description:
      "Ontdek Twentse gastvrijheid, cultuur, horeca en events in Enschede.",
    heroImage: `${WIKIMEDIA}/6/63/Enschede_Rijksmuseum_Twenthe.jpg`,
    contentStyle: "playful",
    theme: "playful",
  }),

  groningen: buildCityConfig({
    slug: "groningen",
    label: "Groningen",
    description:
      "Van studentenleven en live muziek tot verborgen hofjes en terrassen: ontdek Groningen.",
    heroImage: `${WIKIMEDIA}/3/35/Grote_markt_zuidzijde.jpg`,
    contentStyle: "night",
    theme: "night",
  }),

  haarlem: buildCityConfig({
    slug: "haarlem",
    label: "Haarlem",
    description:
      "Verken boetieks, musea, mooie hofjes en fijne restaurants in Haarlem.",
    heroImage: `${WIKIMEDIA}/1/19/HaarlemGroteMarkt1.JPG`,
    contentStyle: "editorial",
    theme: "editorial",
  }),

  hilversum: buildCityConfig({
    slug: "hilversum",
    label: "Hilversum",
    description:
      "Ontdek mediacultuur, architectuur, heide in de buurt en fijne hotspots in Hilversum.",
    heroImage: `${WIKIMEDIA}/f/fa/Gemeentehuishilversum.jpg`,
    contentStyle: "modern",
    theme: "modern",
  }),

  leeuwarden: buildCityConfig({
    slug: "leeuwarden",
    label: "Leeuwarden",
    description:
      "Ontdek Friese cultuur, grachten, goede koffie en bijzondere events in Leeuwarden.",
    heroImage: `${WIKIMEDIA}/8/88/Nieuwestad-_Leeuwarden.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
  }),

  leiden: buildCityConfig({
    slug: "leiden",
    label: "Leiden",
    description:
      "Verken grachten, musea, universiteitssfeer en historische hotspots in Leiden.",
    heroImage: `${WIKIMEDIA}/b/b8/Rapenburg_Leiden_Centrum.jpg`,
    contentStyle: "canal",
    theme: "canal",
  }),

  maastricht: buildCityConfig({
    slug: "maastricht",
    label: "Maastricht",
    description:
      "Ontdek bourgondische pleinen, kunst, cafes en weekendtips in Maastricht.",
    heroImage: `${WIKIMEDIA}/e/e1/Maastricht_sunset.jpg`,
    contentStyle: "burgundy",
    theme: "burgundy",
  }),

  nijmegen: buildCityConfig({
    slug: "nijmegen",
    label: "Nijmegen",
    description:
      "Van Waaluitzicht en geschiedenis tot terrassen en festivals: ontdek Nijmegen.",
    heroImage: `${WIKIMEDIA}/e/e5/Skyline_Nijmegen._Gelderland._Netherlands.jpg`,
    contentStyle: "night",
    theme: "night",
  }),

  rotterdam: buildCityConfig({
    slug: "rotterdam",
    label: "Rotterdam",
    description:
      "Van architectuur en foodhallen tot nightlife en festivals: ontdek Rotterdam.",
    heroImage: `${WIKIMEDIA}/e/e3/A_view_of_Rotterdam%2C_taken_from_the_roof_of_the_Maassilo%2C_Rotterdam%2C_The_Netherlands.jpg`,
    contentStyle: "modern",
    theme: "modern",
  }),

  tilburg: buildCityConfig({
    slug: "tilburg",
    label: "Tilburg",
    description:
      "Ontdek rauwe cultuur, poppodia, festivals en verrassende foodspots in Tilburg.",
    heroImage: `${WIKIMEDIA}/3/3f/De_heuvel_in_Tilburg.jpg`,
    contentStyle: "playful",
    theme: "playful",
  }),

  utrecht: buildCityConfig({
    slug: "utrecht",
    label: "Utrecht",
    description:
      "Verken werfkelders, live muziek, goede restaurants en culturele tips in Utrecht.",
    heroImage: `${WIKIMEDIA}/1/14/Sol_Lumen.jpg`,
    contentStyle: "canal",
    theme: "canal",
  }),

  venlo: buildCityConfig({
    slug: "venlo",
    label: "Venlo",
    description:
      "Verken sfeervolle pleinen, Limburgse horeca en grensstad-uitjes in Venlo.",
    heroImage: `${WIKIMEDIA}/7/75/Venlo_%E2%80%93_Parade_-_panoramio.jpg`,
    contentStyle: "warm",
    theme: "warm",
  }),

  zaandam: buildCityConfig({
    slug: "zaandam",
    label: "Zaandam",
    description:
      "Van industrieel erfgoed tot vernieuwde kades en familie-uitjes: ontdek Zaandam.",
    heroImage: `${WIKIMEDIA}/7/7d/Zaanse_Schans_-_Windmills_3.jpg`,
    contentStyle: "playful",
    theme: "playful",
  }),

  zoetermeer: buildCityConfig({
    slug: "zoetermeer",
    label: "Zoetermeer",
    description:
      "Ontdek actieve uitjes, horeca en verrassende hotspots in Zoetermeer.",
    heroImage: `${WIKIMEDIA}/5/55/Zoetermeer_Dobbe.jpg`,
    contentStyle: "modern",
    theme: "modern",
  }),

  zwolle: buildCityConfig({
    slug: "zwolle",
    label: "Zwolle",
    description:
      "Curated culturele tips, hotspots en bijzondere momenten in het hart van Zwolle.",
    heroImage: `${WIKIMEDIA}/1/12/Sassenstraat_1-15%2C_Zwolle.jpg`,
    layout: "discoveryEditorial",
    contentStyle: "editorial",
    theme: "editorial",
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
  }),
};

export const cityOptions = Object.values(cityConfig)
  .map(({ label, slug }) => ({ label, value: slug }))
  .sort((a, b) => a.label.localeCompare(b.label, "nl"));

export function getCityConfig(city) {
  const safeCity = normalizeCitySlug(city);

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
      colors: DEFAULT_COLORS,
    }
  );
}
