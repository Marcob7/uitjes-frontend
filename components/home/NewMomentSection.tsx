import Link from "next/link";

const quickLinks = [
  {
    label: "Buiten genieten",
    href: "/inspiratie/buiten-genieten",
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
            Snel ontdekken
          </p>

          <div className="mx-auto mt-8 grid w-full max-w-[42rem] grid-cols-2 gap-x-7 gap-y-5 text-center sm:grid-cols-4 sm:gap-x-10">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-h-8 items-center justify-center text-[0.78rem] font-medium tracking-[0] text-[#090f27] transition duration-200 hover:-translate-y-0.5 hover:text-[#767a96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9d5e7]"
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
