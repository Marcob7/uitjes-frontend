export default function TestimonialSection() {
  return (
    <section className="bg-[#f5f3ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
        {/* Linkerkant */}
        <div className="max-w-md">
          <div className="flex items-start gap-6">
            <span className="text-7xl leading-none text-neutral-900 sm:text-8xl">
              “
            </span>

            <div>
              <h2 className="text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Ervaringen van
                <br />
                onze bezoekers
              </h2>

              <div className="mt-10 flex items-center gap-6 text-neutral-700">
                <div
                  aria-hidden="true"
                  className="text-xl tracking-[0.25em] text-neutral-500"
                >
                  〰〰〰〰〰〰
                </div>

                <div className="flex items-center gap-4 text-2xl">
                  <button
                    type="button"
                    aria-label="Vorige review"
                    className="transition hover:opacity-70"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Volgende review"
                    className="transition hover:opacity-70"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rechter quote card */}
        <article className="rounded-[2.5rem] border-2 border-neutral-900 bg-[#f7f7f5] px-8 py-10 shadow-[0_4px_0_0_rgba(23,23,23,1)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <blockquote className="max-w-2xl">
            <p className="text-2xl leading-relaxed text-neutral-900 sm:text-3xl sm:leading-relaxed">
              “We zochten iets leuks om spontaan te doen en vonden via Reuring
              binnen een paar minuten een evenement in de buurt. De app is
              overzichtelijk, snel en geeft meteen inspiratie.”
            </p>

            <footer className="mt-10">
              <p className="text-xl font-semibold text-neutral-900">
                Sanne Jansen
              </p>
              <p className="mt-2 text-lg text-neutral-700">
                Bezoeker uit Apeldoorn
              </p>
            </footer>
          </blockquote>
        </article>
      </div>
    </section>
  );
}