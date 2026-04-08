import Link from "next/link";
import SearchBar from "@/components/home/SearchBar";

type CategoryCard = {
  title: string;
  href: string;
  bgClass: string;
  icon: React.ReactNode;
};

type CityCard = {
  name: string;
  subtitle: string;
  href: string;
  image: string;
};

const categoryCards: CategoryCard[] = [
  {
    title: "Vandaag iets doen",
    href: "/inspiratie/vandaag",
    bgClass: "bg-[#dcebd9]",
    icon: <ClockIcon />,
  },
  {
    title: "Dit weekend",
    href: "/inspiratie/weekend",
    bgClass: "bg-[#eee2d9]",
    icon: <CalendarIcon />,
  },
  {
    title: "Eten & Drinken",
    href: "/inspiratie/eten-drinken",
    bgClass: "bg-[#efe3bf]",
    icon: <FoodIcon />,
  },
  {
    title: "Met kinderen",
    href: "/inspiratie/met-kinderen",
    bgClass: "bg-[#e5e4f2]",
    icon: <SmileIcon />,
  },
  {
    title: "Gratis",
    href: "/inspiratie/gratis",
    bgClass: "bg-[#dff0c8]",
    icon: <MoneyIcon />,
  },
  {
    title: "Binnen",
    href: "/inspiratie/binnen",
    bgClass: "bg-[#e9e6e6]",
    icon: <BuildingIcon />,
  },
  {
    title: "Buiten",
    href: "/inspiratie/buiten",
    bgClass: "bg-[#dbead8]",
    icon: <TreeIcon />,
  },
  {
    title: "Romantisch",
    href: "/inspiratie/romantisch",
    bgClass: "bg-[#efe4dc]",
    icon: <HeartIcon />,
  },
];

const popularCities: CityCard[] = [
  {
    name: "Amsterdam",
    subtitle: "HOOFDSTAD VAN CULTUUR",
    href: "/ontdek?city=amsterdam",
    image:
      "url('https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80')",
  },
  {
    name: "Utrecht",
    subtitle: "HISTORISCH & KNUS",
    href: "/ontdek?city=utrecht",
    image:
      "url('https://images.unsplash.com/photo-1576924542622-772281a13f0c?auto=format&fit=crop&w=1200&q=80')",
  },
  {
    name: "Rotterdam",
    subtitle: "MODERN & GEDURFD",
    href: "/ontdek?city=rotterdam",
    image:
      "url('https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80')",
  },
];

export default function InspiratiePage() {
  return (
    <main className="min-h-screen bg-[#f7f5f1] text-[#111111]">
      <header className="border-b border-black/5 bg-[#f7f5f1]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 md:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.02em] text-black"
          >
            Uitjes
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/inspiratie"
              className="border-b border-black pb-1 text-sm font-medium text-black"
            >
              Discover
            </Link>
            <Link
              href="/gidsen"
              className="text-sm text-black/60 transition hover:text-black"
            >
              Guides
            </Link>
            <Link
              href="/nearby"
              className="text-sm text-black/60 transition hover:text-black"
            >
              Nearby
            </Link>
            <Link
              href="/saved"
              className="text-sm text-black/60 transition hover:text-black"
            >
              Saved
            </Link>
          </nav>

          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-black hover:text-white"
          >
            <UserIcon />
          </Link>
        </div>
      </header>

      <section className="px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-[2.6rem] font-black leading-[0.92] tracking-[-0.04em] text-black md:text-[4.5rem]">
              Begeleide Ontdekkingsreis
            </h1>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar
                placeholder="Waar heb je zin in vandaag?"
                buttonLabel="Zoeken"
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4">
            {categoryCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group flex min-h-[150px] flex-col items-center justify-center rounded-[28px] px-5 py-6 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:min-h-[190px] ${card.bgClass}`}
              >
                <div className="mb-5 text-black">{card.icon}</div>
                <span className="text-sm font-semibold tracking-[-0.02em] text-black md:text-base">
                  {card.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe5dc] px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-black md:text-4xl">
                Populaire steden
              </h2>
              <p className="mt-2 max-w-xl text-sm text-black/60 md:text-base">
                Ontdek de verborgen parels in de leukste steden van Nederland.
              </p>
            </div>

            <Link
              href="/steden"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:opacity-70"
            >
              Bekijk alle <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {popularCities.map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className="group relative overflow-hidden rounded-[28px] bg-neutral-200"
              >
                <div
                  className="min-h-[290px] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03] md:min-h-[340px]"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.58), rgba(0,0,0,0.06)), ${city.image}`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-white">
                    {city.name}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                    {city.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-8 rounded-[34px] bg-[#ddefc9] px-6 py-8 md:grid-cols-[1.2fr_0.9fr] md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/70">
                UITJES COMMUNITY
              </p>

              <h2 className="mt-4 max-w-[520px] text-4xl font-black leading-[0.95] tracking-[-0.04em] text-black md:text-5xl">
                Ontvang wekelijks de beste curator-tips.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-black/65 md:text-base">
                Geen spam, alleen de meest unieke plekjes en evenementen die je
                echt niet wilt missen.
              </p>

              <form className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Je e-mailadres"
                  className="h-14 flex-1 rounded-full border border-black/5 bg-white/70 px-5 text-sm text-black outline-none placeholder:text-black/35"
                />
                <button
                  type="submit"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition hover:bg-black/85"
                >
                  Aanmelden
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4 md:items-center">
              <div
                className="aspect-[0.9/1] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80')",
                }}
              />
              <div
                className="aspect-[0.9/1] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1612196808214-b7e239e5e7f1?auto=format&fit=crop&w=900&q=80')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#111111] px-5 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-[-0.02em]">
            Uitjes
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link
              href="/editorial-guidelines"
              className="transition hover:text-white"
            >
              Editorial Guidelines
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>

          <p className="text-sm text-white/50">
            © 2024 Uitjes Platform. A Radiant Curator Experience.
          </p>
        </div>
      </footer>
    </main>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
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

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function FoodIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3v8" />
      <path d="M10 3v8" />
      <path d="M6 7h4" />
      <path d="M16 3v18" />
      <path d="M16 3c2 2 2 5 0 7" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M9 10h.01M15 10h.01" />
      <path d="M9 14c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 10h.01M17 14h.01" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 20V8l6-3 6 3v12" />
      <path d="M9 20v-3h6v3" />
      <path d="M10 10h.01M14 10h.01M10 13h.01M14 13h.01" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21v-5" />
      <path d="M12 4l6 7h-3l3 4H6l3-4H6l6-7z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="currentColor"
    >
      <path d="M12 21s-6.7-4.35-9.2-8.18C.3 8.9 2.28 5 6.2 5c2.22 0 3.63 1.22 4.4 2.36C11.37 6.22 12.78 5 15 5c3.92 0 5.9 3.9 3.4 7.82C18.7 16.65 12 21 12 21z" />
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