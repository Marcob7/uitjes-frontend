export default function TrustedSection() {
  const items = [
    "Apeldoorn",
    "Deventer",
    "Zwolle",
    "Arnhem",
    "Utrecht",
    "Nijmegen",
  ];

  return (
    <section className="bg-[#f5f3ef] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-14 lg:px-8">
        {/* Linkerkant */}
        <div className="max-w-md">
          <h2 className="text-3xl leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Ontdek populaire steden en uitjes op één plek
          </h2>

          <div className="mt-10 flex items-center gap-6 text-neutral-700">
            <div
              aria-hidden="true"
              className="text-xl tracking-[0.25em] text-neutral-500"
            >
              〰〰〰〰〰〰
            </div>

            <div className="flex items-center gap-4 text-2xl">
              <span aria-hidden="true">↑</span>
              <span aria-hidden="true">↓</span>
            </div>
          </div>
        </div>

        {/* Rechterkant */}
        <div className="rounded-[2.5rem] border-2 border-neutral-900 bg-[#f5f3ef] px-8 py-10 shadow-[0_4px_0_0_rgba(23,23,23,1)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3">
            {items.map((item) => (
              <div
                key={item}
                className="flex min-h-[48px] items-center justify-center text-center text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}