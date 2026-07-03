import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { name: "Ontdek", href: "/ontdek" },
  { name: "Jaarkalender", href: "/jaarkalender" },
  { name: "Festivals", href: "/festivals/kalender" },
  { name: "Inspiratie", href: "/inspiratie" },
  { name: "FAQ", href: "/faq" },
  { name: "Bewaard", href: "/saved" },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-[#193528]/10 bg-[#fbfaf7] text-[#173024]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 text-sm font-semibold sm:flex-row sm:items-center sm:justify-center sm:gap-9">
          <span>Vragen? Tip voor een uitje?</span>
          <span className="hidden h-px w-32 bg-[#173024]/55 sm:block" />
          <a
            href="mailto:uitjesnl@events.nl"
            className="group inline-flex items-center gap-3 transition hover:text-[#2f9f6c]"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 3 9.75 14.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="m21 3-7 19-4.25-7.75L2 10l19-7Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>uitjesnl@events.nl</span>
          </a>
        </div>

        <div className="mt-16 border-t border-[#193528]/10 pt-16 md:mt-20 md:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight"
                aria-label="Uitjes home"
              >
                <Image
                  src="/images/uitjesplatform_logo_transparent.svg"
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 object-contain"
                />
                <span className="site-brand-wordmark text-2xl">
                  HI NEDERLAND
                </span>
              </Link>

              <p className="mt-20 max-w-sm text-sm leading-6 text-[#173024]/65 sm:mt-24">
                Gemaakt voor plannen die spontaan mogen voelen. Vind festivals,
                dagjes weg en kleine momenten in de buurt.
              </p>
            </div>

            <nav aria-label="Footer" className="lg:pt-2">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm font-semibold sm:flex sm:flex-wrap sm:items-center sm:gap-x-12 sm:gap-y-5">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition hover:text-[#2f9f6c]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-14 flex flex-col gap-5 text-xs leading-5 text-[#173024]/62 sm:flex-row sm:items-end sm:justify-between md:mt-20">
            <div>
              <p>&copy; 2026 Uitjes. Alle plannen op een fijne plek.</p>
              <a
                href="mailto:outsidehousesolutions@events.nl"
                className="mt-1 inline-flex underline decoration-[#173024]/25 underline-offset-4 transition hover:text-[#2f9f6c]"
              >
                Webapp door Outside House Solutions
              </a>
            </div>

            <div className="flex flex-wrap gap-x-9 gap-y-3">
              <Link href="/privacy" className="transition hover:text-[#2f9f6c]">
                Privacy
              </Link>
              <a
                href="mailto:uitjesnl@events.nl"
                className="transition hover:text-[#2f9f6c]"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
