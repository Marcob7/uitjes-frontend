import Link from "next/link";

export default function NewMomentSection() {
  return (
    <section className="px-4 py-4 md:px-6 md:py-5 lg:px-8">
      <div className="rounded-[28px] border border-[#e8e0d9] bg-[#f4eeea] px-5 py-6 shadow-[0_10px_30px_rgba(90,76,65,0.06)] md:rounded-[32px] md:px-8 md:py-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <p className="text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold tracking-tight text-[#4c443e]">
              Zijn je plannen in duigen gevallen?
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#7b7068] md:text-[15px]">
              Geen paniek, we helpen je direct aan een nieuw plan.
            </p>
          </div>

          <Link
            href="/inspiratie"
            className="group inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#776d64] px-6 text-sm font-semibold text-[#fbf8f5] shadow-[0_14px_28px_rgba(76,68,62,0.18)] transition hover:-translate-y-0.5 hover:bg-[#675e56] md:min-h-[60px] md:w-auto md:min-w-[220px]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-base text-[#f6efe9]">
              &#10010;
            </span>
            <span>Red mijn moment</span>
            <span
              aria-hidden="true"
              className="text-base transition group-hover:translate-x-0.5"
            >
              &#10539;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
