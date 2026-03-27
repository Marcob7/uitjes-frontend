"use client";

import { useMemo, useState } from "react";

type FestivalCategory =
  | "Jazz"
  | "Elektronisch"
  | "Pop"
  | "Klassiek"
  | "Cultureel"
  | "Food"
  | "Film"
  | "Theater";

type FestivalItem = {
  id: number;
  slug: string;
  name: string;
  city: string;
  province: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
  category: FestivalCategory;
  image: string;
  shortDescription: string;
  longDescription: string;
  location: string;
  priceLabel: string;
  featured?: boolean;
};

const FESTIVALS: FestivalItem[] = [
  {
    id: 1,
    slug: "north-sea-jazz",
    name: "North Sea Jazz",
    city: "Rotterdam",
    province: "Zuid-Holland",
    dateLabel: "10 t/m 12 juli 2026",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    category: "Jazz",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Internationale jazz, soul en funk op topniveau.",
    longDescription:
      "Een iconisch Nederlands festival met grote internationale namen, verrassende samenwerkingen en een sfeervolle mix van jazz, soul, funk en meer.",
    location: "Ahoy Rotterdam",
    priceLabel: "Vanaf €89",
    featured: true,
  },
  {
    id: 2,
    slug: "lowlands",
    name: "Lowlands",
    city: "Biddinghuizen",
    province: "Flevoland",
    dateLabel: "21 t/m 23 augustus 2026",
    startDate: "2026-08-21",
    endDate: "2026-08-23",
    category: "Pop",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Muziek, kunst, cultuur en een weekend vol beleving.",
    longDescription:
      "Lowlands is een van de bekendste festivals van Nederland, met grote artiesten, creatieve installaties en een compleet weekendprogramma.",
    location: "Evenemententerrein Walibi",
    priceLabel: "Weekend vanaf €299",
    featured: true,
  },
  {
    id: 3,
    slug: "mysteryland",
    name: "Mysteryland",
    city: "Haarlemmermeer",
    province: "Noord-Holland",
    dateLabel: "28 t/m 30 augustus 2026",
    startDate: "2026-08-28",
    endDate: "2026-08-30",
    category: "Elektronisch",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Groot dancefestival met stages, lichtshows en camping.",
    longDescription:
      "Mysteryland brengt elektronische muziek, indrukwekkende stage designs en een internationale festivalsfeer samen op één terrein.",
    location: "Haarlemmermeer",
    priceLabel: "Vanaf €119",
  },
  {
    id: 4,
    slug: "pinkpop",
    name: "Pinkpop",
    city: "Landgraaf",
    province: "Limburg",
    dateLabel: "19 t/m 21 juni 2026",
    startDate: "2026-06-19",
    endDate: "2026-06-21",
    category: "Pop",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Een klassieker met grote bands en een rijke historie.",
    longDescription:
      "Pinkpop is een van de oudste en bekendste popfestivals van Europa, met een mix van gevestigde namen en nieuwe acts.",
    location: "Megaland Landgraaf",
    priceLabel: "Vanaf €129",
  },
  {
    id: 5,
    slug: "grachtenfestival",
    name: "Grachtenfestival",
    city: "Amsterdam",
    province: "Noord-Holland",
    dateLabel: "14 t/m 23 augustus 2026",
    startDate: "2026-08-14",
    endDate: "2026-08-23",
    category: "Klassiek",
    image:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Klassieke muziek op unieke plekken in de stad.",
    longDescription:
      "Tijdens het Grachtenfestival beleef je klassieke muziek, jonge talenten en bijzondere optredens aan en op het water in Amsterdam.",
    location: "Binnenstad Amsterdam",
    priceLabel: "Veel gratis en betaalde onderdelen",
  },
  {
    id: 6,
    slug: "oerol",
    name: "Oerol",
    city: "Terschelling",
    province: "Friesland",
    dateLabel: "12 t/m 21 juni 2026",
    startDate: "2026-06-12",
    endDate: "2026-06-21",
    category: "Theater",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Theater, kunst en natuur op Terschelling.",
    longDescription:
      "Oerol combineert locatietheater, muziek, beeldende kunst en het eilandgevoel tot een unieke festivalervaring.",
    location: "Terschelling",
    priceLabel: "Programma vanaf €15",
  },
  {
    id: 7,
    slug: "nn-north-sea-round-town",
    name: "North Sea Round Town",
    city: "Rotterdam",
    province: "Zuid-Holland",
    dateLabel: "25 juni t/m 12 juli 2026",
    startDate: "2026-06-25",
    endDate: "2026-07-12",
    category: "Jazz",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Jazz door heel Rotterdam in clubs en op straat.",
    longDescription:
      "Een stadsbreed festival met intieme optredens, nieuwe makers en jazz op onverwachte plekken in Rotterdam.",
    location: "Rotterdam centrum",
    priceLabel: "Veel gratis events",
  },
  {
    id: 8,
    slug: "rolling-kitchens",
    name: "Rollende Keukens",
    city: "Amsterdam",
    province: "Noord-Holland",
    dateLabel: "13 t/m 17 mei 2026",
    startDate: "2026-05-13",
    endDate: "2026-05-17",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Foodtrucks, muziek en ontspannen festivalsfeer.",
    longDescription:
      "Een geliefd foodfestival waar eten, drinken, creativiteit en livemuziek samenkomen in een toegankelijke setting.",
    location: "Westerpark",
    priceLabel: "Toegang vaak gratis",
  },
  {
    id: 9,
    slug: "iffig",
    name: "IFFR Festival Week",
    city: "Rotterdam",
    province: "Zuid-Holland",
    dateLabel: "28 januari t/m 8 februari 2026",
    startDate: "2026-01-28",
    endDate: "2026-02-08",
    category: "Film",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Filmfestival met premières, talks en internationaal publiek.",
    longDescription:
      "Voor liefhebbers van cinema, premières, talent en vernieuwende filmcultuur is dit een van de belangrijkste festivals van Nederland.",
    location: "Diverse bioscopen Rotterdam",
    priceLabel: "Tickets per voorstelling",
  },
  {
    id: 10,
    slug: "liberation-festival-gelderland",
    name: "Bevrijdingsfestival Gelderland",
    city: "Wageningen",
    province: "Gelderland",
    dateLabel: "5 mei 2026",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    category: "Cultureel",
    image:
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Vrijheidsfestival met muziek en maatschappelijke thema’s.",
    longDescription:
      "Een dag vol optredens, ontmoeting en verdieping rond het thema vrijheid, met een toegankelijke festivalsfeer.",
    location: "Centrum Wageningen",
    priceLabel: "Gratis",
  },
  {
    id: 11,
    slug: "solar-weekend",
    name: "Solar Weekend",
    city: "Roermond",
    province: "Limburg",
    dateLabel: "30 juli t/m 2 augustus 2026",
    startDate: "2026-07-30",
    endDate: "2026-08-02",
    category: "Elektronisch",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Muziek, creativiteit en kunst op een speels terrein.",
    longDescription:
      "Solar staat bekend om zijn vrije sfeer, creatieve podia en mix van muziek, kunst en zomerse energie.",
    location: "De Maasplassen",
    priceLabel: "Weekend vanaf €179",
  },
  {
    id: 12,
    slug: "parade",
    name: "De Parade",
    city: "Den Haag",
    province: "Zuid-Holland",
    dateLabel: "Juli 2026",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    category: "Theater",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80",
    shortDescription: "Reizend theaterfestival met tenten, eten en shows.",
    longDescription:
      "De Parade brengt theater, dans, muziek en lekker eten samen in een sfeervol rondreizend festivalconcept.",
    location: "Westbroekpark",
    priceLabel: "Verschilt per voorstelling",
  },
];

const categories: Array<FestivalCategory | "Alles"> = [
  "Alles",
  "Jazz",
  "Elektronisch",
  "Pop",
  "Klassiek",
  "Cultureel",
  "Food",
  "Film",
  "Theater",
];

export default function FestivalsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<FestivalCategory | "Alles">("Alles");
  const [selectedProvince, setSelectedProvince] = useState("Alle provincies");

  const provinces = useMemo(() => {
    const unique = Array.from(new Set(FESTIVALS.map((item) => item.province)));
    return ["Alle provincies", ...unique];
  }, []);

  const featuredFestival = useMemo(() => {
    return FESTIVALS.find((festival) => festival.featured) ?? FESTIVALS[0];
  }, []);

  const filteredFestivals = useMemo(() => {
    return FESTIVALS.filter((festival) => {
      const matchesSearch =
        festival.name.toLowerCase().includes(search.toLowerCase()) ||
        festival.city.toLowerCase().includes(search.toLowerCase()) ||
        festival.shortDescription.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "Alles" || festival.category === activeCategory;

      const matchesProvince =
        selectedProvince === "Alle provincies" ||
        festival.province === selectedProvince;

      return matchesSearch && matchesCategory && matchesProvince;
    });
  }, [search, activeCategory, selectedProvince]);

  return (
    <main className="min-h-screen bg-[#f5f2ee] text-[#111111]">
      <section className="border-b border-black/5 bg-[#f5f2ee]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 pb-12 pt-6 md:px-10 lg:px-16 lg:pb-16 lg:pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                Nederland · Festivals
              </p>
              <h1 className="mt-3 max-w-[820px] text-[42px] font-semibold leading-[0.95] tracking-[-0.04em] md:text-[64px] lg:text-[84px]">
                Ontdek festivals door heel Nederland
              </h1>
              <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-black/65 md:text-[16px]">
                Een overzichtspagina voor festivals, culturele momenten en
                weekendtips. Voor nu met statische data en een rustige,
                premium layout die past bij je uitjesplatform.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="overflow-hidden rounded-[32px] bg-[#111111] text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="grid min-h-[520px] lg:grid-cols-[0.95fr_1.05fr]">
                <div className="flex flex-col justify-between p-8 md:p-10">
                  <div>
                    <span className="inline-flex rounded-full bg-[#dff4b8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1f2a12]">
                      Uitgelicht festival
                    </span>

                    <h2 className="mt-6 text-[36px] font-semibold leading-[0.95] tracking-[-0.04em] md:text-[54px]">
                      {featuredFestival.name}
                    </h2>

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-white/75">
                      <span>{featuredFestival.dateLabel}</span>
                      <span className="h-1 w-1 rounded-full bg-white/35" />
                      <span>
                        {featuredFestival.location}, {featuredFestival.city}
                      </span>
                    </div>

                    <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/72">
                      {featuredFestival.longDescription}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-white px-6 py-3 text-[14px] font-medium text-black transition hover:scale-[1.02]"
                    >
                      Bekijk festival
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-6 py-3 text-[14px] font-medium text-white transition hover:bg-white/8"
                    >
                      Bekijk alle festivals
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[320px]">
                  <img
                    src={featuredFestival.image}
                    alt={featuredFestival.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20" />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                  Filters
                </p>

                <div className="mt-4">
                  <label className="mb-2 block text-[13px] font-medium text-black/70">
                    Zoek op festival of stad
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Bijv. Rotterdam, jazz, food..."
                    className="h-12 w-full rounded-full border border-black/10 bg-[#faf8f5] px-4 text-[14px] outline-none transition placeholder:text-black/35 focus:border-black/30"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-[13px] font-medium text-black/70">
                    Provincie
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="h-12 w-full rounded-full border border-black/10 bg-[#faf8f5] px-4 text-[14px] outline-none transition focus:border-black/30"
                  >
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-[28px] bg-[#ebe4da] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                  Resultaten
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[34px] font-semibold leading-none tracking-[-0.04em]">
                      {filteredFestivals.length}
                    </p>
                    <p className="mt-1 text-[14px] text-black/60">
                      festivals gevonden
                    </p>
                  </div>
                  <div className="rounded-full bg-[#dff4b8] px-4 py-2 text-[12px] font-medium text-[#2d3b18]">
                    Nederland overzicht
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category as FestivalCategory | "Alles")
                  }
                  className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition ${
                    isActive
                      ? "bg-[#cfee8c] text-[#1b2412]"
                      : "bg-white text-black/70 hover:bg-black hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">
              Festivaloverzicht
            </p>
            <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] md:text-[42px]">
              Alle festivals
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFestivals.map((festival) => (
            <article
              key={festival.id}
              className="overflow-hidden rounded-[30px] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
            >
              <div className="relative h-[260px] overflow-hidden">
                <img
                  src={festival.image}
                  alt={festival.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-5 top-5 flex gap-2">
                  <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium text-black">
                    {festival.category}
                  </span>
                  <span className="rounded-full bg-black/80 px-3 py-1 text-[11px] font-medium text-white">
                    {festival.city}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[28px] font-semibold leading-[1] tracking-[-0.04em]">
                      {festival.name}
                    </h3>
                    <p className="mt-2 text-[13px] text-black/55">
                      {festival.dateLabel}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#f5f2ee] px-3 py-1.5 text-[12px] font-medium text-black/70">
                    {festival.priceLabel}
                  </span>
                </div>

                <p className="mt-4 text-[14px] leading-7 text-black/66">
                  {festival.shortDescription}
                </p>

                <div className="mt-5 space-y-2 text-[13px] text-black/58">
                  <p>
                    <span className="font-medium text-black/82">Locatie:</span>{" "}
                    {festival.location}
                  </p>
                  <p>
                    <span className="font-medium text-black/82">Provincie:</span>{" "}
                    {festival.province}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-black px-5 py-3 text-[14px] font-medium text-white transition hover:opacity-90"
                  >
                    Bekijk details
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-5 py-3 text-[14px] font-medium text-black/70 transition hover:bg-[#f7f4ef]"
                  >
                    Bewaar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredFestivals.length === 0 && (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
            <h3 className="text-[24px] font-semibold tracking-[-0.03em]">
              Geen festivals gevonden
            </h3>
            <p className="mt-3 text-[15px] text-black/60">
              Probeer een andere zoekterm, categorie of provincie.
            </p>
          </div>
        )}
      </section>

      <section className="border-t border-black/5 bg-[#e9e4dc]">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-6 py-12 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-16 lg:py-16">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-black/38">
              Op de hoogte blijven
            </p>
            <h3 className="mt-3 text-[30px] font-semibold leading-[1.02] tracking-[-0.04em]">
              Ontvang nieuwe festivals per mail
            </h3>
            <p className="mt-4 text-[14px] leading-7 text-black/62">
              Laat gebruikers later updates ontvangen op basis van stad,
              categorie of periode.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Vul je e-mailadres in"
                className="h-12 flex-1 rounded-full border border-black/10 bg-[#faf8f5] px-4 text-[14px] outline-none placeholder:text-black/35"
              />
              <button
                type="button"
                className="h-12 rounded-full bg-black px-6 text-[14px] font-medium text-white transition hover:opacity-90"
              >
                Aanmelden
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] bg-[#efe5c8] p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                01
              </p>
              <h4 className="mt-4 text-[22px] font-semibold tracking-[-0.03em]">
                Per stad
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-black/62">
                Toon straks festivals per stad, regio of provincie in dezelfde
                overzichtelijke stijl.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#dff0d2] p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                02
              </p>
              <h4 className="mt-4 text-[22px] font-semibold tracking-[-0.03em]">
                Per datum
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-black/62">
                Later kun je hier makkelijk maandfilters, weekendfilters en een
                kalender aan koppelen.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#e5e4ef] p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                03
              </p>
              <h4 className="mt-4 text-[22px] font-semibold tracking-[-0.03em]">
                Per thema
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-black/62">
                Jazz, food, pop, elektronisch, theater en meer kunnen direct
                gebruikt worden als filter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}