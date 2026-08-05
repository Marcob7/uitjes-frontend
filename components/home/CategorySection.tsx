import Link from "next/link";

export default function CategorySection() {
  return (
    <section className="px-4 py-10 md:px-6 md:py-12 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[#f4f1ee]/78 px-5 py-7 shadow-[0_18px_55px_rgba(66,54,43,0.07)] backdrop-blur-xl md:px-8 md:py-10 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(211,241,150,0.32),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.18)_48%,rgba(232,242,208,0.34))]" />

        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-[#182026] md:text-3xl">
              Ontdek evenementen door het hele jaar
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#4d5961] md:max-w-xl md:text-base">
              Van festivals en markten tot seizoensevenementen: bekijk wat er
              de komende maanden te doen is en plan makkelijk vooruit.
            </p>
          </div>

          <Link
            href="/jaarkalender"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[#cfeaa2] bg-[#d3f196] px-6 text-sm font-semibold text-[#36570f] shadow-[0_14px_28px_rgba(169,208,78,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#caeb88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fc54a] sm:w-auto"
          >
            Bekijk de jaarkalender
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
