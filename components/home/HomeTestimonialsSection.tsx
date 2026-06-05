const testimonialExamples = [
  {
    initial: "A",
    tint: "bg-[#d4f58a]",
    quote: "Binnen een paar minuten hadden we een idee voor vanavond.",
    label: "Voorbeeld A",
    context: "Snel iets kiezen",
  },
  {
    initial: "B",
    tint: "bg-[#d9efde]",
    quote:
      "Het weekendplan lag er snel, zonder eindeloos heen en weer appen.",
    label: "Voorbeeld B",
    context: "Samen plannen",
  },
  {
    initial: "C",
    tint: "bg-[#f1dfcc]",
    quote: "Handig om per stad snel leuke uitjes te ontdekken.",
    label: "Voorbeeld C",
    context: "Stad ontdekken",
  },
  {
    initial: "D",
    tint: "bg-[#d4f58a]",
    quote: "Ideaal voor regenachtige dagen waarop je toch iets wilt doen.",
    label: "Voorbeeld D",
    context: "Regenproof inspiratie",
  },
  {
    initial: "E",
    tint: "bg-[#d9efde]",
    quote: "Fijn als startpunt wanneer je wel zin hebt, maar nog geen plan.",
    label: "Voorbeeld E",
    context: "Vrije middag",
  },
];

export default function HomeTestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f2eeeb] px-4 py-14 md:px-6 md:py-16 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-72 max-w-5xl rounded-full bg-[radial-gradient(circle_at_28%_36%,rgba(211,241,150,0.18),transparent_34%),radial-gradient(circle_at_74%_42%,rgba(255,255,255,0.72),transparent_44%)] blur-2xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mx-auto text-3xl font-bold tracking-tight text-[#05070a] md:text-4xl">
            Sneller iets leuks gevonden
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#3f4a45] md:text-base">
            Voorbeeldsituaties waarin UitjesNL kan helpen. Nog geen echte
            reviews; deze placeholders vervangen we later door echte ervaringen.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonialExamples.map((item) => (
            <article
              key={item.quote}
              className="relative min-h-[184px] overflow-hidden rounded-[28px] border border-white/72 bg-white/76 px-6 py-6 shadow-[0_16px_38px_rgba(53,45,38,0.045)] backdrop-blur-xl md:min-h-[198px] md:px-8 md:py-7"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,255,255,0.2)_58%,rgba(232,242,208,0.16))]" />
              <div className="relative flex h-full flex-col">
                <div
                  className="flex gap-1 text-[13px] font-semibold tracking-[0.08em] text-[#587a21]"
                  aria-hidden="true"
                >
                  <span>&#9733;</span>
                  <span>&#9733;</span>
                  <span>&#9733;</span>
                  <span>&#9733;</span>
                  <span>&#9733;</span>
                </div>
                <p className="mt-4 text-[15px] font-semibold italic leading-6 text-[#05070a]">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="mt-auto flex items-center gap-3 pt-7">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-[#3d4a2b] ${item.tint}`}
                    aria-hidden="true"
                  >
                    {item.initial}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold leading-4 text-[#151b18]">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-4 text-[#65736c]">
                      {item.context}
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
