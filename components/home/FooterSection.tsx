import Link from "next/link";

const cityLinks = [
  { name: "Amsterdam", href: "/ontdek?city=amsterdam" },
  { name: "Rotterdam", href: "/ontdek?city=rotterdam" },
  { name: "Utrecht", href: "/ontdek?city=utrecht" },
  { name: "Den Haag", href: "/ontdek?city=den-haag" },
];

export default function FooterSection() {
  return (
    <footer className="px-4 pb-8 pt-4 md:px-6 lg:px-8">
      <div className="rounded-[32px] bg-[#111111] px-6 py-10 text-white md:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Uitjes</div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
              De slimste gids voor je dagelijks avontuur in de mooiste steden van
              Nederland.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
              Steden
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {cityLinks.map((city) => (
                <li key={city.name}>
                  <Link href={city.href} className="transition hover:text-white">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
              Platform
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>
                <Link href="/redactie" className="transition hover:text-white">
                  Editorial Guidelines
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="transition hover:text-white">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
              Volg ons
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Deel"
              >
                ↗
              </a>

              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Mail"
              >
                ✉
              </a>
            </div>

            <p className="mt-6 text-xs text-white/40">
              © 2026 Uitjes. Je leukste manier om te ontdekken.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}