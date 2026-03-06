import Link from "next/link";

export default function FeatureCardsSection() {
  const benefits = [
    "Duidelijke informatie",
    "Snel inspiratie opdoen",
    "Veilig en overzichtelijk",
    "Lokale uitjes op één plek",
  ];

  return (
    <section className="bg-[#f5f3ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Card 1 */}
          <article className="rounded-[2.5rem] bg-[#dbead7] px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#5a6a52] text-sm text-[#5a6a52]">
                  &gt;_
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#39523b]">
                  Voor ontdekkers
                </span>
              </div>

              <h2 className="font-heading mt-8 text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl">
                Vind leuke uitjes en ideeën in jouw buurt
              </h2>

              <p className="mt-6 text-lg leading-9 text-neutral-800">
                Bekijk snel wat er te doen is. Van evenementen en dagjes weg tot
                spontane activiteiten dichtbij huis.
              </p>

              <div className="mt-8">
                <Link
                  href="/ontdek"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-6 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
                >
                  Ontdek uitjes
                  <span aria-hidden="true">›</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="relative overflow-hidden rounded-[2.5rem] bg-[#efe2bc] px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="pointer-events-none absolute right-8 top-6 text-[180px] leading-none text-neutral-900/20">
              ～
            </div>

            <div className="relative max-w-md">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#6b5320] text-sm text-[#6b5320]">
                  ✉
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b5320]">
                  Voor planners
                </span>
              </div>

              <h2 className="font-heading mt-8 text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl">
                Plan makkelijker je volgende dagje uit
              </h2>

              <p className="mt-6 text-lg leading-9 text-neutral-800">
                Verzamel ideeën, vergelijk opties en bewaar favoriete uitjes
                zodat je later snel verder kunt kijken.
              </p>

              <div className="mt-8">
                <Link
                  href="/saved"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-6 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
                >
                  Bekijk bewaard
                  <span aria-hidden="true">›</span>
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Grote onderste kaart */}
        <article className="mt-6 rounded-[2.5rem] bg-[#dfdef0] px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#4a4f7b] text-sm text-[#4a4f7b]">
                  □
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4a4f7b]">
                  Voor iedereen
                </span>
              </div>

              <h2 className="font-heading mt-8 text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Ontdek activiteiten, evenementen en inspiratie op één plek
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-9 text-neutral-800">
                OpPad helpt je sneller iets leuks te vinden, zonder eindeloos te
                zoeken. Alles overzichtelijk verzameld voor een spontaan of
                gepland uitje.
              </p>

              <div className="mt-8">
                <Link
                  href="/ontdek"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-6 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
                >
                  Bekijk alles
                  <span aria-hidden="true">›</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-4 rounded-2xl bg-white/35 px-5 py-5 backdrop-blur-sm"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-700 text-sm text-neutral-700">
                    ✓
                  </span>
                  <span className="text-lg text-neutral-900">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}