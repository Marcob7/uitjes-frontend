import Link from "next/link";

const quickLinks = [
  {
    label: "Buiten genieten",
    href: "/inspiratie/buiten-genieten",
    featured: true,
  },
  {
    label: "Regenproof",
    href: "/inspiratie/regenproof",
  },
  {
    label: "Voor vanavond",
    href: "/inspiratie/voor-vanavond",
  },
  {
    label: "Snel ontdekken",
    href: "/inspiratie/snel-ontdekken",
  },
];

export default function NewMomentSection() {
  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#fbfaf7] px-4 py-20 text-[#080a0d] sm:min-h-[820px] sm:px-6 sm:py-24 lg:min-h-[994px] lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_7%,rgba(218,250,232,0.72)_0%,rgba(218,250,232,0)_34%),radial-gradient(circle_at_87%_4%,rgba(238,240,251,0.88)_0%,rgba(238,240,251,0)_42%),radial-gradient(circle_at_4%_92%,rgba(226,240,253,0.82)_0%,rgba(226,240,253,0)_36%),radial-gradient(circle_at_81%_94%,rgba(255,251,232,0.95)_0%,rgba(255,251,232,0)_38%),linear-gradient(135deg,#f2fbf5_0%,#f6f8ff_47%,#fffdf6_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-52 bg-[linear-gradient(180deg,rgba(245,250,252,0.9),rgba(255,255,255,0))]"
      />

      <div className="mx-auto flex min-h-[calc(760px-10rem)] w-full max-w-5xl flex-col items-center sm:min-h-[calc(820px-12rem)] lg:min-h-[calc(994px-12rem)]">
        <div className="flex w-full flex-col items-center pt-6 text-center sm:pt-10 lg:pt-8">
          <h2 className="max-w-[54rem] text-center !font-black ![font-size:clamp(3.6rem,6.25vw,5rem)] ![line-height:0.94] ![max-inline-size:54rem] tracking-[0] text-[#080a0d]">
            <span className="block sm:whitespace-nowrap">
              Zijn je plannen in duigen
            </span>
            <span className="block">gevallen?</span>
          </h2>

          <p className="mt-8 max-w-[42rem] text-center text-[clamp(1rem,1.55vw,1.25rem)] font-normal leading-[1.4] tracking-[0] text-[#667085]">
            Geen paniek, we helpen je direct aan een nieuw plan.
          </p>

          <Link
            href="/inspiratie"
            className="group mt-12 inline-flex min-h-[52px] w-full max-w-[15.875rem] items-center justify-center gap-4 rounded-full bg-[#071020] px-8 text-[0.86rem] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_12px_24px_rgba(7,16,32,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#111b2d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071020] sm:w-auto sm:min-w-[15.875rem]"
          >
            <span>Red mijn moment</span>
            <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px] transition duration-300 group-hover:rotate-[-36deg]"
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
          </Link>
        </div>

        <div className="mt-20 w-full text-center sm:mt-20">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.48em] text-[#b9bec8]">
            Snel ontdekken
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[43rem] flex-wrap justify-center gap-3 sm:gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`inline-flex min-h-[50px] min-w-[9.25rem] items-center justify-center rounded-full px-6 text-sm font-semibold tracking-[0] shadow-[0_12px_26px_rgba(57,65,82,0.035)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 ${
                  item.featured
                    ? "bg-[#c9f8dd] text-[#2f6d55] hover:bg-[#bbf2d3] focus-visible:outline-[#8ae5b7]"
                    : "bg-white/72 text-[#566071] ring-1 ring-white/72 backdrop-blur-md hover:bg-white hover:text-[#071020] focus-visible:outline-[#c6ccd6]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
