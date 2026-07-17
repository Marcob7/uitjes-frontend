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

const HEX_COLOR_REGEX = /^#?[0-9a-fA-F]{6}$/;

function sanitizeHexColor(value, fallback) {
  const normalized = typeof value === "string" ? value.trim() : "";

  if (!HEX_COLOR_REGEX.test(normalized)) {
    return fallback;
  }

  return normalized.startsWith("#") ? normalized : `#${normalized}`;
}

function hexToRgb(hex) {
  const normalized = sanitizeHexColor(hex, "#000000").replace("#", "");

  return {
    red: parseInt(normalized.slice(0, 2), 16),
    green: parseInt(normalized.slice(2, 4), 16),
    blue: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex({ red, green, blue }) {
  return `#${[red, green, blue]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

function mixHex(colorA, colorB, weight = 0.5) {
  const safeWeight = Math.max(0, Math.min(1, weight));
  const start = hexToRgb(colorA);
  const end = hexToRgb(colorB);

  return rgbToHex({
    red: start.red + (end.red - start.red) * safeWeight,
    green: start.green + (end.green - start.green) * safeWeight,
    blue: start.blue + (end.blue - start.blue) * safeWeight,
  });
}

function buildDefaultLiquidPalette(colors = DEFAULT_COLORS) {
  const accent = sanitizeHexColor(colors.accent, DEFAULT_COLORS.accent);
  const pageBackground = sanitizeHexColor(
    colors.pageBackground,
    DEFAULT_COLORS.pageBackground
  );
  const softSurface = sanitizeHexColor(
    colors.softSurface,
    DEFAULT_COLORS.softSurface
  );
  const heading = sanitizeHexColor(colors.heading, DEFAULT_COLORS.heading);

  return {
    deep: mixHex(accent, heading, 0.72),
    mid: mixHex(accent, softSurface, 0.26),
    highlight: mixHex(mixHex(accent, "#ffffff", 0.62), pageBackground, 0.24),
  };
}

const DEFAULT_LIQUID = buildDefaultLiquidPalette(DEFAULT_COLORS);

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

const CITY_BRAND_COLORS = {
  apeldoorn: {
    pageBackground: "#fff7f2",
    accent: "#e67e22",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#fde6d2",
    heading: "#1f2937",
    text: "#4b5563",
  },

  amersfoort: {
    pageBackground: "#fff7ef",
    accent: "#e40520",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#ef7c00",
    heading: "#111827",
    text: "#374151",
  },

  amsterdam: {
    pageBackground: "#fff5f5",
    accent: "#ec0000",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#111111",
    heading: "#111111",
    text: "#374151",
  },

  almere: {
    pageBackground: "#f2fbfb",
    accent: "#00aeb5",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d7f4f5",
    heading: "#0f172a",
    text: "#334155",
  },

  arnhem: {
    pageBackground: "#f5f7fb",
    accent: "#1f5aa6",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dbe7f7",
    heading: "#0f172a",
    text: "#334155",
  },

  breda: {
    pageBackground: "#fff5f5",
    accent: "#d72638",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#fde2e7",
    heading: "#111827",
    text: "#374151",
  },

  delft: {
    pageBackground: "#f3f8fd",
    accent: "#0076c8",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d9ecfb",
    heading: "#0f172a",
    text: "#334155",
  },

  "den-bosch": {
    pageBackground: "#fff8f1",
    accent: "#c28a2e",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#f4e3c3",
    heading: "#111827",
    text: "#4b5563",
  },

  "den-haag": {
    pageBackground: "#f8fbef",
    accent: "#70a800",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#ffd84d",
    heading: "#1f2937",
    text: "#4b5563",
  },

  deventer: {
    pageBackground: "#fff7f2",
    accent: "#c96b2c",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#f6dccd",
    heading: "#111827",
    text: "#4b5563",
  },

  dordrecht: {
    pageBackground: "#f7fafc",
    accent: "#0f766e",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d9f2ee",
    heading: "#0f172a",
    text: "#334155",
  },

  eindhoven: {
    pageBackground: "#fff5f5",
    accent: "#e3342f",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#ffd9d8",
    heading: "#111827",
    text: "#374151",
  },

  enschede: {
    pageBackground: "#f7fbf8",
    accent: "#2f855a",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d9f0e2",
    heading: "#111827",
    text: "#374151",
  },

  groningen: {
    pageBackground: "#fff5f5",
    accent: "#d72638",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#fce3e7",
    heading: "#111827",
    text: "#374151",
  },

  haarlem: {
    pageBackground: "#f8fbfd",
    accent: "#2f6f9f",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dcecf7",
    heading: "#0f172a",
    text: "#334155",
  },

  harderwijk: {
    pageBackground: "#f3f8fb",
    accent: "#0f766e",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dff6f2",
    heading: "#0f172a",
    text: "#334155",
  },

  lelystad: {
    pageBackground: "#f3f8fb",
    accent: "#0f766e",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dff6f2",
    heading: "#0f172a",
    text: "#334155",
  },

  hilversum: {
    pageBackground: "#f5f7fa",
    accent: "#6b7280",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#e5e7eb",
    heading: "#111827",
    text: "#374151",
  },

  leeuwarden: {
    pageBackground: "#f4f8ff",
    accent: "#1d4ed8",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dbeafe",
    heading: "#0f172a",
    text: "#334155",
  },

  leiden: {
    pageBackground: "#fff7f0",
    accent: "#b45309",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#fde7d2",
    heading: "#111827",
    text: "#4b5563",
  },

  maastricht: {
    pageBackground: "#fff5f7",
    accent: "#a61e4d",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#f8d9e4",
    heading: "#111827",
    text: "#374151",
  },

  nijmegen: {
    pageBackground: "#fff5f5",
    accent: "#9e1b32",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#f4d8df",
    heading: "#111827",
    text: "#374151",
  },

  rotterdam: {
    pageBackground: "#f3fbf7",
    accent: "#00811f",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d9f2df",
    heading: "#111827",
    text: "#374151",
  },

  tilburg: {
    pageBackground: "#f5f8ff",
    accent: "#003da5",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#ffd84d",
    heading: "#111827",
    text: "#374151",
  },

  utrecht: {
    pageBackground: "#fff5f5",
    accent: "#cc0000",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#ffcc00",
    heading: "#111111",
    text: "#374151",
  },

  venlo: {
    pageBackground: "#fff8f1",
    accent: "#f59e0b",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#fde7bf",
    heading: "#111827",
    text: "#4b5563",
  },

  zaandam: {
    pageBackground: "#eefaf4",
    accent: "#009b77",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d8f2e8",
    heading: "#111827",
    text: "#374151",
  },

  zoetermeer: {
    pageBackground: "#f4f9ff",
    accent: "#0072ce",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#d9ecff",
    heading: "#111827",
    text: "#374151",
  },

  zwolle: {
    pageBackground: "#f4f8ff",
    accent: "#1d4ed8",
    accentText: "#ffffff",
    mutedSurface: "#ffffff",
    softSurface: "#dbeafe",
    heading: "#0f172a",
    text: "#334155",
  },
};

const CITY_LIQUID_PALETTES = {
  amsterdam: {
    deep: "#140507",
    mid: "#7f1419",
    highlight: "#ffd9d6",
  },
  deventer: {
    deep: "#2d0709",
    mid: "#92282d",
    highlight: "#e9a18b",
  },
  rotterdam: {
    deep: "#05200d",
    mid: "#0f6d2a",
    highlight: "#86efac",
  },
  utrecht: {
    deep: "#2d0707",
    mid: "#a21e1e",
    highlight: "#ffd45f",
  },
};

function buildCityConfig({
  slug,
  label,
  description,
  heroImage,
  cardImage,
  cardImageAlt,
  fallbackImage,
  layout = "default",
  contentStyle = "default",
  theme = "playful",
  colors,
  liquid,
  discovery,
}) {
  const resolvedColors = {
    ...DEFAULT_COLORS,
    ...(COLOR_THEMES[theme] || {}),
    ...(colors || {}),
  };

  return {
    slug,
    label,
    description,
    cardImage: cardImage || null,
    cardImageAlt: cardImageAlt || "",
    fallbackImage: fallbackImage || heroImage,
    heroImage: heroImage || fallbackImage,
    layout,
    contentStyle,
    colors: resolvedColors,
    liquid: {
      ...buildDefaultLiquidPalette(resolvedColors),
      ...(CITY_LIQUID_PALETTES[slug] || {}),
      ...(liquid || {}),
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
    cardImage: "/cities/apeldoorn.webp",
    cardImageAlt: "Het Oranjepark in Apeldoorn",
    contentStyle: "playful",
    theme: "playful",
    colors: CITY_BRAND_COLORS.apeldoorn,
  }),

  amersfoort: buildCityConfig({
    slug: "amersfoort",
    label: "Amersfoort",
    description:
      "Van de Koppelpoort tot creatieve adressen en fijne terrassen: ontdek Amersfoort.",
    heroImage: `${WIKIMEDIA}/e/e3/Amersfoort_Zuidsingel.JPG`,
    contentStyle: "warm",
    theme: "warm",
    colors: CITY_BRAND_COLORS.amersfoort,
  }),

  amsterdam: buildCityConfig({
    slug: "amsterdam",
    label: "Amsterdam",
    description:
      "Ontdek grachten, musea, buurtrestaurants, nachtleven en events in Amsterdam.",
    heroImage: `${WIKIMEDIA}/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png`,
    contentStyle: "canal",
    theme: "canal",
    colors: CITY_BRAND_COLORS.amsterdam,
  }),

  almere: buildCityConfig({
    slug: "almere",
    label: "Almere",
    description:
      "Verken moderne architectuur, waterfront hotspots en family-proof uitjes in Almere.",
    heroImage: `${WIKIMEDIA}/b/bc/Skyline_Almere.jpg`,
    contentStyle: "modern",
    theme: "modern",
    colors: CITY_BRAND_COLORS.almere,
  }),

  arnhem: buildCityConfig({
    slug: "arnhem",
    label: "Arnhem",
    description:
      "Ontdek mode, stadsparken, cultuur en verrassende plekken in Arnhem.",
    heroImage: `${WIKIMEDIA}/c/c2/The_Musis_Sacrum%2C_late_afternoon_-_panoramio.jpg`,
    contentStyle: "night",
    theme: "night",
    colors: CITY_BRAND_COLORS.arnhem,
  }),

  breda: buildCityConfig({
    slug: "breda",
    label: "Breda",
    description:
      "Ontdek bourgondische pleinen, historische straten en gezellige avonden in Breda.",
    heroImage: `${WIKIMEDIA}/2/2d/2010-05-21-breda-by-RalfR-06.jpg`,
    contentStyle: "warm",
    theme: "warm",
    colors: CITY_BRAND_COLORS.breda,
  }),

  delft: buildCityConfig({
    slug: "delft",
    label: "Delft",
    description:
      "Verken historische pleinen, Delftse grachten, cultuur en gezellige cafes in Delft.",
    heroImage: `${WIKIMEDIA}/c/c2/Delft_Blick_von_der_Nieuwe_Kerk_auf_die_Oude_Kerk_1.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
    colors: CITY_BRAND_COLORS.delft,
  }),

  "den-bosch": buildCityConfig({
    slug: "den-bosch",
    label: "Den Bosch",
    description:
      "Ontdek de Binnendieze, bourgondische horeca en historische charme in Den Bosch.",
    heroImage: `${WIKIMEDIA}/f/f1/St._Jans_cathedral_%27s-Hertogenbosch.jpg`,
    contentStyle: "warm",
    theme: "warm",
    colors: CITY_BRAND_COLORS["den-bosch"],
  }),

  "den-haag": buildCityConfig({
    slug: "den-haag",
    label: "Den Haag",
    description:
      "Ontdek musea, politiek Den Haag, stijlvolle hotspots en stranddagen aan zee.",
    heroImage: `${WIKIMEDIA}/c/ce/Den_Haag_Skyline_1.jpg`,
    cardImage: "/cities/den-haag.webp",
    cardImageAlt: "Skyline van Den Haag",
    contentStyle: "editorial",
    theme: "editorial",
    colors: CITY_BRAND_COLORS["den-haag"],
  }),

  deventer: buildCityConfig({
    slug: "deventer",
    label: "Deventer",
    description:
      "Ontdek de leukste evenementen, hotspots en uitjes in het historische Deventer.",
    heroImage: `${WIKIMEDIA}/7/7d/Deventer%2C_straatzicht_de_Brink_positie1_foto7_2012-02-05_11.49.JPG`,
    contentStyle: "warm",
    theme: "warm",
    colors: CITY_BRAND_COLORS.deventer,
    liquid: CITY_LIQUID_PALETTES.deventer,
  }),

  dordrecht: buildCityConfig({
    slug: "dordrecht",
    label: "Dordrecht",
    description:
      "Ontdek havens, monumentale binnenstad en culturele uitjes in Dordrecht.",
    heroImage: `${WIKIMEDIA}/f/fa/Augustijnenkamp%2C_3311_Dordrecht%2C_Netherlands_-_panoramio_%282%29.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
    colors: CITY_BRAND_COLORS.dordrecht,
  }),

  eindhoven: buildCityConfig({
    slug: "eindhoven",
    label: "Eindhoven",
    description:
      "Ontdek design, lichtkunst, tech-hotspots en creatieve events in Eindhoven.",
    heroImage: `${WIKIMEDIA}/0/07/Lichttoren_Eindhoven_1_-_Cropped.jpg`,
    contentStyle: "modern",
    theme: "modern",
    colors: CITY_BRAND_COLORS.eindhoven,
  }),

  enschede: buildCityConfig({
    slug: "enschede",
    label: "Enschede",
    description:
      "Ontdek Twentse gastvrijheid, cultuur, horeca en events in Enschede.",
    heroImage: `${WIKIMEDIA}/6/63/Enschede_Rijksmuseum_Twenthe.jpg`,
    contentStyle: "playful",
    theme: "playful",
    colors: CITY_BRAND_COLORS.enschede,
  }),

  groningen: buildCityConfig({
    slug: "groningen",
    label: "Groningen",
    description:
      "Van studentenleven en live muziek tot verborgen hofjes en terrassen: ontdek Groningen.",
    heroImage: `${WIKIMEDIA}/3/35/Grote_markt_zuidzijde.jpg`,
    cardImage: "/cities/groningen.webp",
    cardImageAlt: "Historische gevels aan de Grote Markt in Groningen",
    contentStyle: "night",
    theme: "night",
    colors: CITY_BRAND_COLORS.groningen,
  }),

  haarlem: buildCityConfig({
    slug: "haarlem",
    label: "Haarlem",
    description:
      "Verken boetieks, musea, mooie hofjes en fijne restaurants in Haarlem.",
    heroImage: `${WIKIMEDIA}/1/19/HaarlemGroteMarkt1.JPG`,
    contentStyle: "editorial",
    theme: "editorial",
    colors: CITY_BRAND_COLORS.haarlem,
  }),

  harderwijk: buildCityConfig({
    slug: "harderwijk",
    label: "Harderwijk",
    description:
      "Ontdek historische straatjes, Veluwemeer, horeca en activiteiten in Harderwijk.",
    heroImage: "/images/apeldoorn_img.jpg",
    contentStyle: "canal",
    theme: "canal",
    colors: CITY_BRAND_COLORS.harderwijk,
  }),

  lelystad: buildCityConfig({
    slug: "lelystad",
    label: "Lelystad",
    description:
      "Ontdek Bataviahaven, natuur, horeca en activiteiten in Lelystad.",
    heroImage: "/images/apeldoorn_img.jpg",
    contentStyle: "canal",
    theme: "canal",
    colors: CITY_BRAND_COLORS.lelystad,
  }),

  hilversum: buildCityConfig({
    slug: "hilversum",
    label: "Hilversum",
    description:
      "Ontdek mediacultuur, architectuur, heide in de buurt en fijne hotspots in Hilversum.",
    heroImage: `${WIKIMEDIA}/f/fa/Gemeentehuishilversum.jpg`,
    contentStyle: "modern",
    theme: "modern",
    colors: CITY_BRAND_COLORS.hilversum,
  }),

  leeuwarden: buildCityConfig({
    slug: "leeuwarden",
    label: "Leeuwarden",
    description:
      "Ontdek Friese cultuur, grachten, goede koffie en bijzondere events in Leeuwarden.",
    heroImage: `${WIKIMEDIA}/8/88/Nieuwestad-_Leeuwarden.jpg`,
    contentStyle: "editorial",
    theme: "editorial",
    colors: CITY_BRAND_COLORS.leeuwarden,
  }),

  leiden: buildCityConfig({
    slug: "leiden",
    label: "Leiden",
    description:
      "Verken grachten, musea, universiteitssfeer en historische hotspots in Leiden.",
    heroImage: `${WIKIMEDIA}/b/b8/Rapenburg_Leiden_Centrum.jpg`,
    contentStyle: "canal",
    theme: "canal",
    colors: CITY_BRAND_COLORS.leiden,
  }),

  maastricht: buildCityConfig({
    slug: "maastricht",
    label: "Maastricht",
    description:
      "Ontdek bourgondische pleinen, kunst, cafes en weekendtips in Maastricht.",
    heroImage: `${WIKIMEDIA}/e/e1/Maastricht_sunset.jpg`,
    contentStyle: "burgundy",
    theme: "burgundy",
    colors: CITY_BRAND_COLORS.maastricht,
  }),

  nijmegen: buildCityConfig({
    slug: "nijmegen",
    label: "Nijmegen",
    description:
      "Van Waaluitzicht en geschiedenis tot terrassen en festivals: ontdek Nijmegen.",
    heroImage: `${WIKIMEDIA}/e/e5/Skyline_Nijmegen._Gelderland._Netherlands.jpg`,
    cardImage: "/cities/nijmegen.webp",
    cardImageAlt: "Skyline van Nijmegen aan de Waal",
    contentStyle: "night",
    theme: "night",
    colors: CITY_BRAND_COLORS.nijmegen,
  }),

  rotterdam: buildCityConfig({
    slug: "rotterdam",
    label: "Rotterdam",
    description:
      "Van architectuur en foodhallen tot nightlife en festivals: ontdek Rotterdam.",
    heroImage: `${WIKIMEDIA}/e/e3/A_view_of_Rotterdam%2C_taken_from_the_roof_of_the_Maassilo%2C_Rotterdam%2C_The_Netherlands.jpg`,
    contentStyle: "modern",
    theme: "modern",
    colors: CITY_BRAND_COLORS.rotterdam,
    liquid: CITY_LIQUID_PALETTES.rotterdam,
  }),

  tilburg: buildCityConfig({
    slug: "tilburg",
    label: "Tilburg",
    description:
      "Ontdek rauwe cultuur, poppodia, festivals en verrassende foodspots in Tilburg.",
    heroImage: `${WIKIMEDIA}/3/3f/De_heuvel_in_Tilburg.jpg`,
    contentStyle: "playful",
    theme: "playful",
    colors: CITY_BRAND_COLORS.tilburg,
  }),

  utrecht: buildCityConfig({
    slug: "utrecht",
    label: "Utrecht",
    description:
      "Verken werfkelders, live muziek, goede restaurants en culturele tips in Utrecht.",
    heroImage: `${WIKIMEDIA}/1/14/Sol_Lumen.jpg`,
    cardImage: "/cities/utrecht.webp",
    cardImageAlt: "Verlichte Domtoren in Utrecht",
    contentStyle: "canal",
    theme: "canal",
    colors: CITY_BRAND_COLORS.utrecht,
    liquid: CITY_LIQUID_PALETTES.utrecht,
  }),

  venlo: buildCityConfig({
    slug: "venlo",
    label: "Venlo",
    description:
      "Verken sfeervolle pleinen, Limburgse horeca en grensstad-uitjes in Venlo.",
    heroImage: `${WIKIMEDIA}/7/75/Venlo_%E2%80%93_Parade_-_panoramio.jpg`,
    contentStyle: "warm",
    theme: "warm",
    colors: CITY_BRAND_COLORS.venlo,
  }),

  zaandam: buildCityConfig({
    slug: "zaandam",
    label: "Zaandam",
    description:
      "Van industrieel erfgoed tot vernieuwde kades en familie-uitjes: ontdek Zaandam.",
    heroImage: `${WIKIMEDIA}/7/7d/Zaanse_Schans_-_Windmills_3.jpg`,
    contentStyle: "playful",
    theme: "playful",
    colors: CITY_BRAND_COLORS.zaandam,
  }),

  zoetermeer: buildCityConfig({
    slug: "zoetermeer",
    label: "Zoetermeer",
    description:
      "Ontdek actieve uitjes, horeca en verrassende hotspots in Zoetermeer.",
    heroImage: `${WIKIMEDIA}/5/55/Zoetermeer_Dobbe.jpg`,
    contentStyle: "modern",
    theme: "modern",
    colors: CITY_BRAND_COLORS.zoetermeer,
  }),

  zwolle: buildCityConfig({
    slug: "zwolle",
    label: "Zwolle",
    description:
      "Curated culturele tips, hotspots en bijzondere momenten in het hart van Zwolle.",
    heroImage: `${WIKIMEDIA}/1/12/Sassenstraat_1-15%2C_Zwolle.jpg`,
    cardImage: "/cities/zwolle.webp",
    cardImageAlt: "De Peperbus in Zwolle",
    layout: "discoveryEditorial",
    contentStyle: "editorial",
    theme: "editorial",
    colors: CITY_BRAND_COLORS.zwolle,
    discovery: {
      eyebrow: "Zwolle Discovery",
      intro:
        "Curated culturele momenten in het hart van Overijssel. Van historische straatjes tot moderne hotspots en verrassende events.",
      tabs: [
        "Evenementen",
        "Attracties",
        "Restaurants",
        "Bars",
        "Dingen om te doen",
      ],
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
      liquid: DEFAULT_LIQUID,
    }
  );
}
