import Link from "next/link";
import { notFound } from "next/navigation";
import { optimizeCssBackground } from "@/lib/remoteImage";

type PageProps = {
  params: {
    category: string;
    slug: string;
  };
};

export const dynamicParams = false;

type SupportedCategory =
  | "vandaag"
  | "weekend"
  | "eten-drinken"
  | "met-kinderen"
  | "gratis"
  | "binnen"
  | "buiten"
  | "romantisch";

type DetailPageData = {
  title: string;
  heroImage: string;
  heroAlt: string;
  badges: string[];
  meta: string;
  chips: string[];
  reasons: string[];
  description: string[];
  practical: {
    address: string;
    openingHours: string;
    type: string;
    price: string;
  };
  gallery: string[];
  similar: Array<{
    title: string;
    href: string;
    image: string;
    meta: string;
    tag: string;
  }>;
};

const categoryLabels: Record<SupportedCategory, string> = {
  vandaag: "Vandaag iets doen",
  weekend: "Dit weekend",
  "eten-drinken": "Eten & Drinken",
  "met-kinderen": "Met kinderen",
  gratis: "Gratis",
  binnen: "Binnen",
  buiten: "Buiten",
  romantisch: "Romantisch",
};

const categoryMeta: Record<
  SupportedCategory,
  {
    badge: string;
    chips: string[];
    reasons: string[];
    type: string;
    price: string;
  }
> = {
  vandaag: {
    badge: "VANDAAG OPEN",
    chips: ["Populair", "Vandaag", "Curator tip"],
    reasons: [
      "Goede keuze voor vandaag",
      "Past goed binnen deze categorie",
      "Makkelijk te bezoeken",
      "Sterke sfeer en duidelijke propositie",
    ],
    type: "Aanrader van vandaag",
    price: "Wisselend",
  },
  weekend: {
    badge: "WEEKEND",
    chips: ["Weekend", "Populair", "Leuke sfeer"],
    reasons: [
      "Sterk weekendidee",
      "Goed voor langer bezoek",
      "Leuke setting voor samen of met vrienden",
      "Past goed bij een vrije dag",
    ],
    type: "Weekendactiviteit",
    price: "Wisselend",
  },
  "eten-drinken": {
    badge: "FOOD",
    chips: ["Eten", "Drinken", "Aanrader"],
    reasons: [
      "Sterk concept binnen eten & drinken",
      "Goede sfeer",
      "Makkelijk te combineren met een dagje stad",
      "Past bij lunch, borrel of diner",
    ],
    type: "Horeca",
    price: "€€ - €€€",
  },
  "met-kinderen": {
    badge: "GEZIN",
    chips: ["Gezin", "Toegankelijk", "Leuk voor kinderen"],
    reasons: [
      "Geschikt voor gezinnen",
      "Laagdrempelig",
      "Fijn voor een kort of middellang uitje",
      "Past goed bij deze doelgroep",
    ],
    type: "Gezinsuitje",
    price: "Betaalbaar",
  },
  gratis: {
    badge: "GRATIS",
    chips: ["Gratis", "Toegankelijk", "Lokaal"],
    reasons: [
      "Kost weinig of niets",
      "Makkelijk mee te pakken",
      "Laagdrempelig idee",
      "Goed als spontaan uitje",
    ],
    type: "Gratis activiteit",
    price: "Gratis",
  },
  binnen: {
    badge: "BINNEN",
    chips: ["Binnen", "Rustig", "Comfortabel"],
    reasons: [
      "Fijne binnenlocatie",
      "Goed bij minder goed weer",
      "Comfortabele setting",
      "Geschikt voor rustig bezoek",
    ],
    type: "Binnenlocatie",
    price: "Wisselend",
  },
  buiten: {
    badge: "BUITEN",
    chips: ["Buiten", "Frisse lucht", "Ontspannen"],
    reasons: [
      "Prettig buitenidee",
      "Goed voor beweging of ontspanning",
      "Fijne sfeer in de open lucht",
      "Makkelijk in te plannen",
    ],
    type: "Buitenactiviteit",
    price: "Wisselend",
  },
  romantisch: {
    badge: "DATE NIGHT",
    chips: ["Romantisch", "Sfeervol", "Bijzonder"],
    reasons: [
      "Goede keuze voor samen",
      "Sterke sfeer",
      "Fijn voor een rustige avond",
      "Past goed bij date night",
    ],
    type: "Romantische plek",
    price: "€€€",
  },
};

const imagePool = [
  "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80')",
  "url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1600&q=80')",
];

const supportedRoutes: Record<SupportedCategory, string[]> = {
  vandaag: [
    "maison-du-soir",
    "stadswandeling",
    "live-muziek-vanavond",
    "gratis-markt",
    "expositie-modern-light",
    "terras-aan-het-water",
    "foodhall-in-centrum",
  ],
  weekend: [
    "zondagsmarkt",
    "cocktailbar-met-skyline",
    "kunsthal-weekendexpo",
    "boottocht-door-de-grachten",
    "openluchtfilm",
    "speurtocht-voor-families",
  ],
  "eten-drinken": [
    "brunch-house",
    "koffiebar-aan-de-gracht",
    "streekkeuken",
    "bar-botanique",
    "aan-het-water",
    "pizza-en-natuurwijn",
  ],
  "met-kinderen": [
    "interactief-kindermuseum",
    "natuurspeeltuin",
    "kinderboerderij",
    "pannenkoekenhuis",
    "voorleesmiddag",
    "mini-speurroute",
  ],
  gratis: [
    "kunstroute-door-de-stad",
    "parkpicknick",
    "gratis-galerieavond",
    "lokale-markt",
    "bibliotheektips",
    "zonsondergangpunt",
  ],
  binnen: [
    "stadsmuseum-collectie",
    "stille-leeszaal",
    "kunstkamer",
    "koffie-en-werken",
    "filmavond-in-het-filmhuis",
    "wellnessmoment",
  ],
  buiten: [
    "stadspark-wandeling",
    "terras-aan-de-kade",
    "picknickplek-in-het-park",
    "boottocht-langs-de-oude-stad",
    "avondroute-met-uitzicht",
    "lokale-bloemenmarkt",
  ],
  romantisch: [
    "diner-bij-kaarslicht",
    "wijnbar-met-kleine-bites",
    "avondwandeling-langs-het-water",
    "sunset-viewpoint",
    "intiem-jazzconcert",
    "boutique-stay",
  ],
};

const customOverrides: Record<string, Partial<DetailPageData>> = {
  "vandaag/maison-du-soir": {
    title: "Maison du Soir",
    meta: "Modern Europees • Buitenrand Zwolle • €€€€ • 4.9",
    chips: ["Romantisch", "Gastronomie", "Toplocatie"],
    practical: {
      address: "Luttenbergstraat 12, Zwolle",
      openingHours: "Di - Zo: 18:00 - 23:00",
      type: "Restaurant",
      price: "€€€€",
    },
  },
  "vandaag/foodhall-in-centrum": {
    title: "Foodhall in centrum",
    meta: "Centrum • Food & Drinks • €€ • 4.8",
    practical: {
      address: "Grote Markt 8, Zwolle",
      openingHours: "Dagelijks: 11:00 - 23:00",
      type: "Foodhall",
      price: "€€",
    },
  },
  "romantisch/diner-bij-kaarslicht": {
    title: "Diner bij kaarslicht",
    meta: "Fine dining • Centrum • €€€€ • 4.8",
    chips: ["Date night", "Intiem", "Bijzonder"],
    practical: {
      address: "Melkmarkt 22, Zwolle",
      openingHours: "Wo - Zo: 19:00 - 23:30",
      type: "Fine dining",
      price: "€€€€",
    },
  },
};

function isSupportedCategory(value: string): value is SupportedCategory {
  return value in supportedRoutes;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getImageBySeed(seed: string): string {
  let total = 0;
  for (let i = 0; i < seed.length; i++) total += seed.charCodeAt(i);
  return imagePool[total % imagePool.length];
}

function buildSimilarItems(category: SupportedCategory, currentSlug: string) {
  return supportedRoutes[category]
    .filter((slug) => slug !== currentSlug)
    .slice(0, 3)
    .map((slug) => ({
      title: slugToTitle(slug),
      href: `/inspiratie/${category}/${slug}`,
      image: getImageBySeed(`${category}-${slug}-similar`),
      meta: categoryLabels[category],
      tag: category.toUpperCase(),
    }));
}

function getPageData(category: SupportedCategory, slug: string): DetailPageData {
  const categoryConfig = categoryMeta[category];
  const key = `${category}/${slug}`;
  const override = customOverrides[key];

  const baseTitle = slugToTitle(slug);
  const title = override?.title ?? baseTitle;
  const heroImage = override?.heroImage ?? getImageBySeed(`${category}-${slug}-hero`);
  const meta = override?.meta ?? `${categoryLabels[category]} • Curator tip • 4.7`;
  const chips = override?.chips ?? categoryConfig.chips;

  return {
    title,
    heroImage,
    heroAlt: title,
    badges: [categoryConfig.badge, "CURATOR TIP"],
    meta,
    chips,
    reasons: override?.reasons ?? categoryConfig.reasons,
    description:
      override?.description ?? [
        `${title} is een sterke keuze binnen de categorie ${categoryLabels[
          category
        ].toLowerCase()}. Deze detailpagina is nu nog gevuld met compacte dummy data, zodat je de volledige flow en opbouw alvast goed kunt testen.`,
        `Later kun je hier echte data vanuit je backend of CMS tonen, zoals openingstijden, locatie, prijs, sfeer, foto's en vergelijkbare plekken.`,
      ],
    practical:
      override?.practical ?? {
        address: "Voorbeeldstraat 12, Zwolle",
        openingHours: "Dagelijks: 10:00 - 22:00",
        type: categoryConfig.type,
        price: categoryConfig.price,
      },
    gallery: [
      getImageBySeed(`${category}-${slug}-gallery-1`),
      getImageBySeed(`${category}-${slug}-gallery-2`),
      getImageBySeed(`${category}-${slug}-gallery-3`),
      getImageBySeed(`${category}-${slug}-gallery-4`),
    ],
    similar: buildSimilarItems(category, slug),
  };
}

export function generateStaticParams() {
  return Object.entries(supportedRoutes).flatMap(([category, slugs]) =>
    slugs.map((slug) => ({
      category,
      slug,
    }))
  );
}

export default function InspirationDetailPage({ params }: PageProps) {
  const { category, slug } = params;

  if (!isSupportedCategory(category)) {
    notFound();
  }

  if (!supportedRoutes[category].includes(slug)) {
    notFound();
  }

  const page = getPageData(category, slug);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#111111]">
      <header className="border-b border-black/5 bg-[#f6f4ef]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 md:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.03em] text-black"
          >
            Radiant Curator
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/inspiratie"
              className="text-xs text-black/55 transition hover:text-black"
            >
              Ontdekken
            </Link>
            <Link
              href="/agenda"
              className="text-xs text-black/55 transition hover:text-black"
            >
              Agenda
            </Link>
            <Link
              href={`/inspiratie/${category}`}
              className="border-b border-black pb-1 text-xs font-medium text-black"
            >
              Populair
            </Link>
            <Link
              href="/favorieten"
              className="text-xs text-black/55 transition hover:text-black"
            >
              Favorieten
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Zoeken"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-black/5"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              aria-label="Profiel"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-black/5"
            >
              <UserIcon />
            </button>
          </div>
        </div>
      </header>

      <section className="px-4 pb-10 pt-6 md:px-8 md:pb-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="relative overflow-hidden rounded-[34px]">
            <div
              className="min-h-[360px] w-full bg-cover bg-center md:min-h-[520px]"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.12)), ${optimizeCssBackground(
                  page.heroImage,
                  {
                    width: 1280,
                    quality: 58,
                  }
                )}`,
              }}
              aria-label={page.heroAlt}
            />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {page.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex rounded-full bg-[#d5efaf] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <h1 className="max-w-[720px] text-4xl font-black leading-[0.94] tracking-[-0.05em] text-white md:text-6xl">
                {page.title}
              </h1>

              <p className="mt-3 text-sm font-medium text-white/90 md:text-base">
                {page.meta}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 md:px-8 md:pb-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex flex-wrap gap-3">
            {page.chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex rounded-full bg-[#ece6df] px-4 py-2 text-xs font-medium text-black/80"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.85fr]">
            <div>
              <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-black">
                Waarom dit een goede keuze is
              </h2>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {page.reasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#476a2e]">
                      <LeafIcon />
                    </div>
                    <p className="text-sm text-black/75">{reason}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[34px] bg-[#efe5dc] px-6 py-7 md:px-8 md:py-9">
                <h3 className="text-[2rem] font-bold tracking-[-0.04em] text-black">
                  Over deze plek
                </h3>

                <div className="mt-6 space-y-5 text-sm leading-7 text-black/70 md:text-[15px]">
                  {page.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[28px] bg-[#f3efe9] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-[#bde28d] px-6 text-sm font-semibold text-black transition hover:bg-[#add77a]"
                  >
                    Reserveer nu
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-black/80 transition hover:bg-black/5"
                    >
                      <MapIcon />
                      Bekijk route
                    </button>

                    <button
                      type="button"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#eeece9] text-sm font-medium text-black/80 transition hover:bg-black/5"
                    >
                      <SaveIcon />
                      Sla op
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-[#dcefd1] p-6">
                <h3 className="text-xl font-bold tracking-[-0.03em] text-black">
                  Praktisch
                </h3>

                <div className="mt-6 space-y-5">
                  <InfoRow
                    icon={<PinIcon />}
                    label="Adres"
                    value={page.practical.address}
                  />
                  <InfoRow
                    icon={<ClockIcon />}
                    label="Openingstijden"
                    value={page.practical.openingHours}
                  />
                  <InfoRow
                    icon={<TagIcon />}
                    label="Type"
                    value={page.practical.type}
                  />
                  <InfoRow
                    icon={<MoneyIcon />}
                    label="Prijs"
                    value={page.practical.price}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8 md:pb-16">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-black">
            In beeld
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {page.gallery.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-[22px]">
                <div
                  className="aspect-[0.88/1] w-full bg-cover bg-center"
                  style={{
                    backgroundImage: optimizeCssBackground(image, {
                      width: 640,
                      quality: 56,
                    }),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-black">
            Vergelijkbare plekken
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {page.similar.map((item) => (
              <Link key={item.href} href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-[26px]">
                  <div
                    className="aspect-[0.95/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                    style={{
                      backgroundImage: optimizeCssBackground(item.image, {
                        width: 760,
                        quality: 56,
                      }),
                    }}
                  />

                  <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                    {item.tag}
                  </span>
                </div>

                <div className="pt-4">
                  <h3 className="text-[1.7rem] font-semibold leading-[1.05] tracking-[-0.04em] text-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-black/55">{item.meta}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#111111] px-4 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.03em] text-white"
          >
            Radiant Curator
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <Link href="/over-ons" className="transition hover:text-white">
              Over ons
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/cookies" className="transition hover:text-white">
              Cookies
            </Link>
          </div>

          <p className="text-sm text-white/50">
            © 2024 Radiant Curator. City Guide Editorial.
          </p>
        </div>
      </footer>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#355226]">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-black">{label}</p>
        <p className="mt-1 text-sm leading-6 text-black/70">{value}</p>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M19 3c-7.5.3-12 4.7-12 10.5 0 3.7 2.5 6.5 6.2 6.5 5.5 0 7.8-4.8 7.8-10.8V3Z" />
      <path d="M7 21c.8-3.8 3.5-7 8-9.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10 10 20l-7-7L13 3h7v7Z" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}
