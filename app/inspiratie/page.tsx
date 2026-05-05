import Link from "next/link";
import { Suspense } from "react";
import { InspirationContextLink } from "@/components/inspiration/InspirationContextLink";
import { InspirationLocationContext } from "@/components/inspiration/InspirationLocationContext";
import { AppCard, AppSection } from "@/components/ui/app";
import { optimizeCssBackground } from "@/lib/remoteImage";

type CategoryCard = {
  title: string;
  description: string;
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
    title: "Nu",
    description: "Ik wil snel iets vinden dat nu kan.",
    href: "/inspiratie/vandaag",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <ClockIcon />,
  },
  {
    title: "Dit weekend",
    description: "Ik wil ideeën voor het weekend.",
    href: "/inspiratie/weekend",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <CalendarIcon />,
  },
  {
    title: "Eten & drinken",
    description: "Ik wil iets met horeca, proeven, borrelen of uit eten.",
    href: "/inspiratie/eten-drinken",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <FoodIcon />,
  },
  {
    title: "Met gezin",
    description: "Ik zoek iets dat past bij kinderen en samen op pad gaan.",
    href: "/inspiratie/met-kinderen",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <SmileIcon />,
  },
  {
    title: "Relaxed",
    description: "Ik zoek iets rustigs, simpels of laagdrempeligs.",
    href: "/inspiratie/gratis",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <MoneyIcon />,
  },
  {
    title: "Cultureel",
    description: "Ik wil inspiratie voor musea, steden, voorstellingen of bijzondere plekken.",
    href: "/inspiratie/binnen",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <BuildingIcon />,
  },
  {
    title: "Actief",
    description: "Ik zoek iets buiten, sportiefs of avontuurlijks.",
    href: "/inspiratie/buiten",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
    icon: <TreeIcon />,
  },
  {
    title: "Date",
    description: "Ik zoek iets dat geschikt is om samen te doen.",
    href: "/inspiratie/romantisch",
    bgClass: "border border-white/14 bg-white/10 backdrop-blur-xl",
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
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-6 pb-10 lg:pt-8 lg:pb-14">
        <div className="uitjes-liquid-section rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-12">
          <div className="pointer-events-none absolute -right-16 top-6 h-56 w-56 rounded-full bg-[#c6df9a]/18 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-[42rem]">
              <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl">
                Inspiratiegids
              </div>
              <h1 className="mt-6 max-w-[10ch] text-[clamp(3.2rem,8vw,5.7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                Begeleide ontdekkingsreis
              </h1>
              <p className="mt-6 max-w-[34rem] text-base leading-8 text-white/76 sm:text-lg">
                Kies een stemming, moment of stad en vind sneller een uitje dat
                klopt met je dag.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Categorie", "Sfeer", "Moment"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-xl"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <AppCard
              variant="glass"
              padding="lg"
              className="relative min-h-[17rem] overflow-hidden rounded-[2.1rem] lg:min-h-[21rem]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(232,242,208,0.38),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
                    Start bij je moment
                  </p>
                  <p className="mt-4 max-w-[13ch] text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
                    Van idee naar plan in een paar keuzes.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Vandaag", "Weekend", "Cultureel"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-xl"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </AppCard>
          </div>

          <Suspense fallback={null}>
            <InspirationLocationContext compact className="mt-8" />
          </Suspense>

          <Suspense fallback={<CategoryGrid contextAware={false} />}>
            <CategoryGrid contextAware />
          </Suspense>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" className="bg-white/5">
        <div>
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Steden
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#171511]">
                Populaire steden
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#665d54] md:text-base">
                Ontdek de verborgen parels in de leukste steden van Nederland.
              </p>
            </div>

            <Link
              href="/steden"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#171511] transition hover:opacity-70"
            >
              Bekijk alle <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {popularCities.map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className="group relative overflow-hidden rounded-[1.8rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl"
              >
                <div
                  className="min-h-[290px] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03] md:min-h-[340px]"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.58), rgba(0,0,0,0.06)), ${optimizeCssBackground(
                      city.image,
                      {
                        width: 960,
                        quality: 58,
                      }
                    )}`,
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
      </AppSection>

      <AppSection maxWidth="wide" spacing="lg" innerClassName="pt-10">
        <div>
          <div className="grid gap-8 overflow-hidden rounded-[2.2rem] border border-white/14 bg-white/10 px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:grid-cols-[1.2fr_0.9fr] md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/76">
                UITJES COMMUNITY
              </p>

              <h2 className="mt-4 max-w-[520px] text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-5xl">
                Ontvang wekelijks de beste speciaal geselecteerd-tips.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/76 md:text-base">
                Geen spam, alleen de meest unieke plekjes en evenementen die je
                echt niet wilt missen.
              </p>

              <form className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Je e-mailadres"
                  className="h-14 flex-1 rounded-full border border-white/16 bg-white/10 backdrop-blur-xl px-5 text-sm text-white outline-none placeholder:text-white/48"
                />
                <button
                  type="submit"
                  className="uitjes-cta inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  Aanmelden
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4 md:items-center">
              <div
                className="aspect-[0.9/1] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage: optimizeCssBackground(
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
                    {
                      width: 720,
                      quality: 56,
                    }
                  ),
                }}
              />
              <div
                className="aspect-[0.9/1] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage: optimizeCssBackground(
                    "https://images.unsplash.com/photo-1612196808214-b7e239e5e7f1?auto=format&fit=crop&w=900&q=80",
                    {
                      width: 720,
                      quality: 56,
                    }
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </AppSection>

    </main>
  );
}

function CategoryGrid({ contextAware }: { contextAware: boolean }) {
  const LinkComponent = contextAware ? InspirationContextLink : Link;

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {categoryCards.map((card) => (
        <LinkComponent
          key={card.title}
          href={card.href}
          className={`group flex min-h-[142px] flex-col justify-between rounded-[1.5rem] px-4 py-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-white/14 md:min-h-[180px] md:rounded-[1.9rem] md:px-5 md:py-5 ${card.bgClass}`}
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f2d0] text-[#1c2a17]">
            {card.icon}
          </div>
          <div>
            <span className="block text-lg font-semibold leading-none tracking-[-0.04em] text-white md:text-xl">
              {card.title}
            </span>
            <span className="mt-2 block max-w-[13rem] text-xs leading-5 text-white/70">
              {card.description}
            </span>
          </div>
        </LinkComponent>
      ))}
    </div>
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
