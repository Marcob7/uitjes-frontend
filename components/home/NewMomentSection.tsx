import Link from "next/link";

const quickLinks = [
  {
    label: "Buiten genieten",
    href: "/inspiratie/buiten-genieten",
    description: "Frisse lucht, groen en ruimte voor een plan dat meteen lichter voelt.",
  },
  {
    label: "Regenproof",
    href: "/inspiratie/regenproof",
    description: "Binnenideeen wanneer het weer niet meewerkt, maar jij wel weg wilt.",
  },
  {
    label: "Voor vanavond",
    href: "/inspiratie/voor-vanavond",
    description: "Avondplannen die weinig voorbereiding vragen en toch bijzonder voelen.",
  },
  {
    label: "Keuzehulp openen",
    href: "/inspiratie",
    description: "Laat je stap voor stap naar een passend uitje begeleiden.",
  },
];

export default function NewMomentSection() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-[#f8f6fd] px-5 pb-16 pt-24 text-[#12182d] sm:min-h-[720px] sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto flex min-h-[calc(720px-8rem)] w-full max-w-4xl flex-col items-center">
        <div className="flex w-full flex-col items-center pt-2 text-center sm:pt-3 lg:pt-2">
          <h2 className="max-w-[39rem] text-center !font-normal ![font-size:clamp(3.2rem,5.15vw,4.5rem)] ![line-height:0.98] ![max-inline-size:39rem] tracking-[0] text-[#12182d]">
            <span className="block">Zijn je plannen in</span>
            <span className="block font-normal italic">duigen gevallen?</span>
          </h2>

          <p className="mt-7 max-w-[24rem] text-center text-[clamp(1rem,1.35vw,1.125rem)] font-normal leading-[1.35] tracking-[0] text-[#7f839c]">
            Geen paniek, we helpen je direct aan een nieuw, betoverend plan.
          </p>

          <Link
            href="/inspiratie"
            className="group mt-16 inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#12182d] px-7 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_36px_rgba(18,24,45,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1f2845] hover:shadow-[0_22px_42px_rgba(18,24,45,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12182d] active:translate-y-0 sm:px-8"
          >
            <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-[14px] w-[14px] transition duration-300 group-hover:rotate-[-36deg]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
              >
                <path d="M4.75 12a7.25 7.25 0 0 1 12.18-5.32" />
                <path d="M17 3.75v3.5h-3.5" />
                <path d="M19.25 12a7.25 7.25 0 0 1-12.18 5.32" />
                <path d="M7 20.25v-3.5h3.5" />
              </svg>
            </span>
            <span>Red mijn moment</span>
          </Link>
        </div>

        <div className="mt-24 w-full text-center sm:mt-24">
          <p className="text-[0.67rem] font-medium uppercase tracking-[0.48em] text-[#b5b5c5]">
            Kies wat nu past
          </p>

          <div className="mx-auto mt-8 grid w-full max-w-[44rem] grid-cols-1 gap-3 text-left sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex min-h-[112px] w-full items-center justify-between gap-4 rounded-[1.35rem] border border-[#ded9eb] bg-white/72 px-5 py-4 text-left text-[#12182d] shadow-[0_14px_32px_rgba(67,58,96,0.07)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-[#c8c0dc] hover:bg-white/88 hover:shadow-[0_18px_38px_rgba(67,58,96,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12182d] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f6fd] active:translate-y-0 active:scale-[0.99]"
              >
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold tracking-[0] text-[#090f27]">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-sm leading-5 text-[#777b94]">
                    {item.description}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e1ef] bg-[#f7f4ff] text-[#505772] transition duration-200 group-hover:translate-x-0.5 group-hover:border-[#d3cce5] group-hover:bg-[#efebfb]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
