import Link from "next/link";

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.55"
      className="h-[17px] w-[17px] transition-transform duration-[460ms] ease-in-out motion-reduce:transition-none group-focus-visible:rotate-45 group-hover:rotate-45"
    >
      <path d="M4 16 16 4" />
      <path d="M7 4h9v9" />
    </svg>
  );
}

export default function CtaBannerSection() {
  return (
    <section
      aria-labelledby="activity-help-heading"
      className="relative isolate flex min-h-[30rem] items-center justify-center overflow-hidden bg-[#F8F7F3] px-5 py-20 text-[#080d0e] sm:px-8 md:min-h-[26.625rem] md:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-13.5rem] left-1/2 -z-10 h-[20rem] w-[min(54rem,96vw)] -translate-x-1/2 rounded-[50%] blur-[82px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(151, 194, 122, 0.44) 0%, rgba(183, 216, 159, 0.35) 38%, rgba(223, 237, 211, 0.18) 59%, rgba(255, 255, 255, 0) 76%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[72rem] flex-col items-center text-center">
        <h2
          id="activity-help-heading"
          className="m-0 max-w-[19ch] text-[clamp(2.7rem,4.25vw,3.75rem)] font-medium leading-[0.99] tracking-[-0.058em] text-[#080d0e] sm:max-w-none md:whitespace-nowrap"
        >
          Op zoek naar een leuke activiteit?
        </h2>

        <p className="mt-5 max-w-[43rem] text-[0.9375rem] leading-[1.5] tracking-[-0.016em] text-[#52656a] sm:mt-[1.35rem]">
          Vertel ons wat je leuk vindt, dan vinden we samen iets dat bij je past.
        </p>

        <Link
          href="/inspiratie"
          className="group relative mt-[1.85rem] inline-flex h-[2.875rem] w-[12.1875rem] items-center overflow-hidden rounded-full bg-[#010610] pl-7 text-left text-[0.8125rem] font-semibold tracking-[-0.012em] text-white transition-[background-color,transform] duration-[460ms] ease-in-out hover:bg-[#2f373e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010610] focus-visible:ring-offset-4 focus-visible:ring-offset-white active:scale-[0.98] motion-reduce:transition-none"
        >
          <span className="relative z-10 inline-block transition-transform duration-[460ms] ease-in-out motion-reduce:transition-none group-focus-visible:translate-x-[1.9375rem] group-hover:translate-x-[1.9375rem]">
            Vind een activiteit
          </span>

          <span className="absolute left-[0.15625rem] top-1/2 flex h-[2.75rem] w-[2.75rem] -translate-y-1/2 translate-x-[9.125rem] items-center justify-center rounded-full border border-[#0c1518] bg-white text-[#081014] transition-transform duration-[460ms] ease-in-out motion-reduce:transition-none group-focus-visible:translate-x-0 group-hover:translate-x-0">
            <ArrowUpRightIcon />
          </span>
        </Link>
      </div>
    </section>
  );
}
