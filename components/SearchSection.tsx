import Image from "next/image";
import Link from "next/link";

export default function SearchSection() {
  const popularCities = ["Apeldoorn", "Deventer"];

  return (
    <section className="relative overflow-hidden bg-[#0f1720]">
      {/* Achtergrondafbeelding */}
      <div className="absolute inset-0">
        <Image
          src="/images/apeldoorn_img.jpg"
          alt="Stadsbeeld als achtergrond"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#07111d]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111d]/40 via-[#07111d]/65 to-[#07111d]/85" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[580px] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-[#2b2b2b]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5a2a] backdrop-blur-sm sm:text-sm">
            Jouw lokale stadsgids
          </div>

          {/* Titel */}
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Ontdek wat er te
            <br />
            doen is <span className="text-[#ff5a2a]">in jouw stad</span>
          </h1>

          {/* Subtekst */}
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/85 sm:text-xl">
            Van restaurants en kroegen tot evenementen en uitjes — alles wat
            jouw stad te bieden heeft op één plek.
          </p>

          {/* Zoekbalk */}
          <form
            action="/ontdek"
            method="get"
            className="mx-auto mt-10 max-w-3xl"
            role="search"
            aria-label="Zoek een stad"
          >
            <div className="flex items-center rounded-[1.75rem] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                <svg
                  className="h-5 w-5 shrink-0 text-neutral-500"
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

                <label htmlFor="city-search" className="sr-only">
                  Zoek een stad
                </label>

                <input
                  id="city-search"
                  name="city"
                  type="text"
                  placeholder="Zoek een stad zoals Apeldoorn..."
                  className="w-full bg-transparent py-4 text-base text-neutral-900 outline-none placeholder:text-neutral-500 sm:text-xl"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff5a2a] text-white transition hover:bg-[#eb4d1e] sm:h-14 sm:w-14"
                aria-label="Zoeken"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4.1665 10H15.8332"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10.8335 5L15.8335 10L10.8335 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Populaire steden */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/75 sm:text-base">
            <span>Populair:</span>

            {popularCities.map((city) => (
              <Link
                key={city}
                href={`/ontdek?city=${encodeURIComponent(city.toLowerCase())}`}
                className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}