import Link from "next/link";

export default function SiteFooter() {
  return (
 <footer className="bg-[#111111] text-white">
  <div className="mx-auto max-w-7xl px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <div className="flex flex-col gap-12">
          {/* Bovenste rij */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            {/* Links boven */}
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="text-3xl font-medium text-[#d8f58d]">
                  Vragen?
                </span>

                <span
                  aria-hidden="true"
                  className="text-xl tracking-[0.18em] text-[#d8f58d]"
                >
                  〰〰〰
                </span>

                <a
                  href="mailto:outsidehousesolutions.org"
                  className="text-3xl font-medium text-[#d8f58d] transition hover:opacity-80"
                >
                 hello@outsidehousesolutions.org
                </a>
              </div>
            </div>

            {/* Rechts boven */}
            <div className="flex flex-col items-start gap-8 lg:items-end">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/saved"
                  className="text-xl text-white transition hover:opacity-80"
                >
                  Log in
                </Link>

                <Link
                  href="/ontdek"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#d8f58d] px-6 py-3 text-xl text-[#d8f58d] transition hover:bg-[#d8f58d] hover:text-neutral-950"
                >
                  Ontdek uitjes
                </Link>
              </div>

              <nav aria-label="Footer navigatie">
                <ul className="flex flex-wrap gap-x-8 gap-y-4 text-xl text-white">
                  <li>
                    <Link href="/ontdek" className="transition hover:opacity-80">
                      Ontdek
                    </Link>
                  </li>
                  <li>
                    <Link href="/saved" className="transition hover:opacity-80">
                      Bewaard
                    </Link>
                  </li>
                  <li>
                    <Link href="/feedback" className="transition hover:opacity-80">
                      FAQ&apos;s
                    </Link>
                  </li>
                  <li>
                    <Link href="/feedback" className="transition hover:opacity-80">
                      Toegankelijkheid
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Middelste / onderste rij */}
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            {/* Linksonder links */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-xl text-white">
                <Link href="/privacy" className="transition hover:opacity-80">
                  Privacy policy
                </Link>
                <Link href="/terms" className="transition hover:opacity-80">
                  Terms of service
                </Link>
                <Link href="/status" className="transition hover:opacity-80">
                  Status
                </Link>
              </div>

              <p className="max-w-2xl text-xl text-white">
                Ontdek eenvoudig wat er te doen is in jouw stad.
              </p>
            </div>

            {/* Rechtsonder */}
            <div className="flex flex-col items-start gap-5 lg:items-end">
              <Link
                href="/"
                className="flex items-center gap-3 text-4xl font-semibold tracking-tight text-[#d8f58d]"
                aria-label="Ga naar home"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8f58d] text-lg">
                  O
                </span>
                <span>OpPad</span>
              </Link>

              <p className="text-lg text-white">Made in Apeldoorn</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}