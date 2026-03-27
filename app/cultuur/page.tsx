"use client";

import { useMemo, useState } from "react";

type FilterTime = "vandaag" | "dit-weekend" | "volgende-week";

type ExperienceType = "Expositie" | "Festival" | "Workshop" | "Lezing";

type CityCount = {
  name: string;
  count: number;
};

type CultureCard = {
  id: number;
  city: string;
  featured?: boolean;
  title: string;
  description: string;
  dateLabel: string;
  priceLabel: string;
  image: string;
  type: ExperienceType;
  when: FilterTime;
};

const cityOptions: CityCount[] = [
  { name: "Amsterdam", count: 12 },
  { name: "Delft", count: 4 },
  { name: "Utrecht", count: 8 },
  { name: "Rotterdam", count: 6 },
  { name: "Eindhoven", count: 5 },
];

const cultureItems: CultureCard[] = [
  {
    id: 1,
    city: "Amsterdam",
    featured: true,
    title: "Vermeer's Licht",
    description:
      "Een unieke zintuiglijke ervaring waarbij de meesterwerken van Johannes Vermeer tot leven komen door middel van projectie en geluid.",
    dateLabel: "12 feb - 30 apr",
    priceLabel: "€ 18,50",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
    type: "Expositie",
    when: "dit-weekend",
  },
  {
    id: 2,
    city: "Utrecht",
    title: "Grachtenfestival",
    description:
      "Geniet van klassieke muziek op de meest bijzondere locaties langs de grachten. Van intieme hofjes tot drijvende podia.",
    dateLabel: "15 - 24 aug",
    priceLabel: "Gratis",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80",
    type: "Festival",
    when: "dit-weekend",
  },
  {
    id: 3,
    city: "Rotterdam",
    title: "Modern Dutch Design",
    description:
      "Een diepe duik in de wereld van hedendaagse Nederlandse ontwerpers die de grenzen van vorm en functie verleggen.",
    dateLabel: "Doorlopend",
    priceLabel: "€ 12,00",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
    type: "Expositie",
    when: "volgende-week",
  },
  {
    id: 4,
    city: "Eindhoven",
    title: "Licht in de Nacht",
    description:
      "Een magische wandeling door de stad, verlicht door innovatieve lichtinstallaties van internationale kunstenaars.",
    dateLabel: "10 - 17 nov",
    priceLabel: "€ 5,00",
    image:
      "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&w=1200&q=80",
    type: "Festival",
    when: "vandaag",
  },
  {
    id: 5,
    city: "Amsterdam",
    title: "Museum Atelier Live",
    description:
      "Een interactieve workshop waarin bezoekers zelf experimenteren met kleur, compositie en klassieke technieken.",
    dateLabel: "Elke zaterdag",
    priceLabel: "€ 22,00",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    type: "Workshop",
    when: "dit-weekend",
  },
  {
    id: 6,
    city: "Delft",
    title: "Verhalen van de Stad",
    description:
      "Een inspirerende lezing over verborgen geschiedenis, cultuur en architectuur in oude Nederlandse binnensteden.",
    dateLabel: "3 mei",
    priceLabel: "€ 9,50",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    type: "Lezing",
    when: "volgende-week",
  },
];

const sortOptions = ["Relevantie", "Prijs laag-hoog", "Prijs hoog-laag", "Nieuwste"];

function parsePrice(priceLabel: string) {
  if (priceLabel.toLowerCase() === "gratis") return 0;
  const number = priceLabel.replace("€", "").replace(",", ".").trim();
  return Number(number) || 0;
}

function FilterSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8A867F]">
      {children}
    </h3>
  );
}

function RadioRow({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-left"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
          checked
            ? "border-[#98C56B] bg-[#98C56B]"
            : "border-[#D8D2C8] bg-transparent"
        }`}
      >
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
      </span>
      <span className="text-[17px] text-[#242320]">{label}</span>
    </button>
  );
}

function TypeChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[14px] font-medium transition ${
        active
          ? "bg-[#B9DE84] text-[#233015]"
          : "bg-white text-[#4E4B46] hover:bg-[#F8F4EE]"
      }`}
    >
      {label}
    </button>
  );
}

function EventCard({ item }: { item: CultureCard }) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[36px] bg-[#E8E4DD]">
        <div
          className="aspect-[0.86/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
          style={{ backgroundImage: `url(${item.image})` }}
        />

        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2A2926] shadow-sm">
            {item.city}
          </span>

          {item.featured ? (
            <span className="rounded-full bg-[#B9DE84] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2A3A18] shadow-sm">
              Topkeuze
            </span>
          ) : null}
        </div>
      </div>

      <div className="pt-5">
        <h2 className="text-[23px] font-semibold tracking-[-0.03em] text-[#171717]">
          {item.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-[16px] leading-7 text-[#6A665F]">
          {item.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[15px] text-[#5E5A54]">
            <span className="text-[14px]">◷</span>
            <span>{item.dateLabel}</span>
          </div>

          <div className="text-[17px] font-semibold text-[#171717]">
            {item.priceLabel}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CultuurPage() {
  const [selectedWhen, setSelectedWhen] = useState<FilterTime>("dit-weekend");
  const [selectedTypes, setSelectedTypes] = useState<ExperienceType[]>([
    "Expositie",
  ]);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("Amsterdam");
  const [distanceKm, setDistanceKm] = useState(24);
  const [sortBy, setSortBy] = useState("Relevantie");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const filteredCities = useMemo(() => {
    return cityOptions.filter((city) =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [citySearch]);

  const filteredItems = useMemo(() => {
    let items = [...cultureItems];

    items = items.filter((item) => item.when === selectedWhen);

    if (selectedTypes.length > 0) {
      items = items.filter((item) => selectedTypes.includes(item.type));
    }

    if (selectedCity) {
      items = items.filter((item) => item.city === selectedCity);
    }

    if (sortBy === "Prijs laag-hoog") {
      items.sort((a, b) => parsePrice(a.priceLabel) - parsePrice(b.priceLabel));
    } else if (sortBy === "Prijs hoog-laag") {
      items.sort((a, b) => parsePrice(b.priceLabel) - parsePrice(a.priceLabel));
    } else if (sortBy === "Nieuwste") {
      items.reverse();
    }

    return items;
  }, [selectedWhen, selectedTypes, selectedCity, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  function toggleType(type: ExperienceType) {
    setCurrentPage(1);
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  }

  function handleSelectWhen(value: FilterTime) {
    setSelectedWhen(value);
    setCurrentPage(1);
  }

  function handleSelectCity(city: string) {
    setSelectedCity(city);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#171717] md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="xl:sticky xl:top-8 xl:h-fit">
          <div className="pt-8">
            <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717] xl:hidden">
              Ontdek Cultuur
            </h1>
          </div>

          <div className="mt-6 space-y-8">
            <section>
              <h2 className="mb-6 text-[30px] font-semibold tracking-[-0.04em] text-[#171717] xl:text-[32px]">
                Filters
              </h2>

              <FilterSectionTitle>Wanneer</FilterSectionTitle>

              <div className="space-y-4">
                <RadioRow
                  checked={selectedWhen === "vandaag"}
                  label="Vandaag"
                  onClick={() => handleSelectWhen("vandaag")}
                />
                <RadioRow
                  checked={selectedWhen === "dit-weekend"}
                  label="Dit Weekend"
                  onClick={() => handleSelectWhen("dit-weekend")}
                />
                <RadioRow
                  checked={selectedWhen === "volgende-week"}
                  label="Volgende Week"
                  onClick={() => handleSelectWhen("volgende-week")}
                />
              </div>
            </section>

            <section className="rounded-[34px] bg-[#F2E9E0] p-6">
              <FilterSectionTitle>Type ervaring</FilterSectionTitle>

              <div className="flex flex-wrap gap-3">
                {(["Expositie", "Festival", "Workshop", "Lezing"] as ExperienceType[]).map(
                  (type) => (
                    <TypeChip
                      key={type}
                      active={selectedTypes.includes(type)}
                      label={type}
                      onClick={() => toggleType(type)}
                    />
                  )
                )}
              </div>
            </section>

            <section>
              <FilterSectionTitle>Stad</FilterSectionTitle>

              <div className="relative">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Zoek stad..."
                  className="w-full border-b border-[#D8D2C8] bg-transparent pb-3 pr-8 text-[16px] text-[#171717] outline-none placeholder:text-[#9B958C]"
                />
                <span className="pointer-events-none absolute right-1 top-1 text-[#9B958C]">
                  ⌕
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {filteredCities.map((city) => {
                  const active = selectedCity === city.name;

                  return (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleSelectCity(city.name)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span
                        className={`text-[18px] ${
                          active ? "font-semibold text-[#171717]" : "text-[#4F4B45]"
                        }`}
                      >
                        {city.name}
                      </span>
                      <span className="text-[15px] text-[#9B958C]">
                        ({city.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[34px] bg-[#E9E7F3] p-6">
              <FilterSectionTitle>Afstand (km)</FilterSectionTitle>

              <div className="mt-6">
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[14px] text-[#7C7872]">
                <span>0 km</span>
                <span>{distanceKm} km</span>
                <span>50 km</span>
              </div>
            </section>
          </div>
        </aside>

        {/* Content */}
        <section className="pt-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="hidden text-[62px] font-semibold tracking-[-0.06em] text-[#171717] xl:block">
                Ontdek Cultuur
              </h1>
              <p className="mt-2 text-[18px] text-[#8A867F]">
                {filteredItems.length} resultaten gevonden in Nederland
              </p>
            </div>

            <div className="flex items-center gap-3 text-[16px] text-[#8A867F]">
              <span>Sorteer op:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-[#DDD7CE] bg-white px-4 py-2 font-medium text-[#171717] outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {paginatedItems.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>

          {paginatedItems.length === 0 ? (
            <div className="mt-16 rounded-[28px] border border-[#E1DBD1] bg-white px-6 py-8">
              <h2 className="text-[24px] font-semibold text-[#171717]">
                Geen resultaten gevonden
              </h2>
              <p className="mt-2 text-[16px] text-[#6A665F]">
                Probeer een andere stad, een ander type ervaring of een ander moment.
              </p>
            </div>
          ) : null}

          <div className="mt-16 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9D3C9] bg-white text-[18px] text-[#171717] transition hover:bg-[#F2EEE8]"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const active = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-[16px] font-medium transition ${
                    active
                      ? "border-[#B9DE84] bg-[#B9DE84] text-[#233015]"
                      : "border-[#D9D3C9] bg-white text-[#171717] hover:bg-[#F2EEE8]"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9D3C9] bg-white text-[18px] text-[#171717] transition hover:bg-[#F2EEE8]"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}