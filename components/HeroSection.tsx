import Link from "next/link";

const featuredCities = [
  { label: "Apeldoorn", href: "/ontdek?city=apeldoorn" },
  { label: "Deventer", href: "/ontdek?city=deventer" },
  { label: "Arnhem", href: "/ontdek?city=arnhem" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#e9dfd2] bg-[#FDFBF7]">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5b33]">
            Reuring
          </p>
          <h1 className="font-heading mt-4 max-w-4xl text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.92] tracking-[-0.065em] text-[#23170f] [text-wrap:balance]">
            Zoek een stad en zie meteen wat daar te doen is.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#625141] sm:text-lg">
            Typ een plaatsnaam, open de ontdekpagina en filter verder op moment, prijs of type uitje.
          </p>
        </div>

        <div className="mt-10 max-w-5xl">
          <form
            action="/ontdek"
            method="get"
            role="search"
            aria-label="Zoek een stad"
            className="relative overflow-hidden rounded-[2rem] border border-[#e5d9c8] bg-white shadow-[0_28px_70px_rgba(92,63,36,0.10)]"
          >
            <div className="border-b border-[#ece1d2] px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d5b33]">
                  Begin hier
                </p>
                <span className="rounded-full border border-[#e4d5c1] bg-[#faf4eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8d5b33]">
                  Vandaag populair
                </span>
              </div>
              <p id="hero-search-help" className="mt-2 text-sm leading-6 text-[#6e5a49]">
                Bijvoorbeeld Apeldoorn, Deventer of Arnhem. Enter werkt ook.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4 rounded-[1.4rem] bg-[#f8f4ed] px-4 py-3 sm:px-5 sm:py-4">
                <svg
                  className="h-5 w-5 shrink-0 text-[#9b714d]"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14.1667 14.1667L17.5 17.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="8.75"
                    cy="8.75"
                    r="5.75"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <div className="min-w-0 flex-1">
                  <label htmlFor="city-search" className="sr-only">
                    Naar welke stad wil je zoeken?
                  </label>
                  <input
                    id="city-search"
                    name="city"
                    type="search"
                    placeholder="Naar welke stad wil je zoeken?"
                    autoComplete="address-level2"
                    enterKeyHint="search"
                    inputMode="search"
                    spellCheck={false}
                    maxLength={80}
                    required
                    aria-describedby="hero-search-help"
                    className="w-full min-w-0 bg-transparent text-lg text-[#23170f] outline-none placeholder:text-[#9b836d] sm:text-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-[1.35rem] bg-[#b7d36b] px-6 text-base font-semibold text-[#1f1b15] shadow-[0_14px_30px_rgba(127,158,53,0.18)] transition hover:-translate-y-0.5 hover:bg-[#a9c55f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f9e35] lg:min-w-[180px]"
              >
                Zoek evenementen
                <span aria-hidden="true">&#8594;</span>
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d5b33]">
                Snelle start
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {featuredCities.map((city) => (
                  <Link
                    key={city.label}
                    href={city.href}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ddd0bd] bg-white px-4 py-2 text-sm font-medium text-[#5f4d3e] transition hover:-translate-y-0.5 hover:border-[#bb8b58] hover:bg-[#fff7ec] hover:text-[#3b291d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb8b58]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b97a40]" aria-hidden="true" />
                    {city.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/ontdek"
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#6e5a49] transition hover:text-[#3b291d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb8b58]"
            >
              Liever eerst rustig bladeren?
              <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}