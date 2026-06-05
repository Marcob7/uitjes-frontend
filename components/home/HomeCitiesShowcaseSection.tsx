import Link from "next/link";

type ShowcaseCity = {
  name: string;
  slug: string;
  accent: string;
  mark: string;
};

const showcaseCities: ShowcaseCity[] = [
  { name: "Apeldoorn", slug: "apeldoorn", accent: "#e67e22", mark: "AP" },
  { name: "Den Haag", slug: "den-haag", accent: "#70a800", mark: "DH" },
  { name: "Zwolle", slug: "zwolle", accent: "#1d4ed8", mark: "ZW" },
  { name: "Groningen", slug: "groningen", accent: "#d72638", mark: "GR" },
  { name: "Utrecht", slug: "utrecht", accent: "#cc0000", mark: "UT" },
  { name: "Nijmegen", slug: "nijmegen", accent: "#9e1b32", mark: "NM" },
];

export default function HomeCitiesShowcaseSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 md:px-6 md:pb-20 md:pt-12 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-[360px] max-w-6xl rounded-full bg-[radial-gradient(circle_at_72%_38%,rgba(211,241,150,0.24),transparent_34%),radial-gradient(circle_at_42%_52%,rgba(255,255,255,0.72),transparent_42%),linear-gradient(90deg,rgba(238,243,240,0),rgba(238,243,240,0.62),rgba(238,243,240,0))] blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 py-6 md:py-10 lg:grid-cols-[minmax(280px,0.78fr)_minmax(520px,1.22fr)] lg:items-center lg:gap-16 xl:gap-20">
        <div className="max-w-md lg:pl-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#637042]">
            Steden ontdekken
          </p>

          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-[1.04] tracking-normal text-[#17231d] sm:text-4xl lg:text-[2.65rem]">
            Ontdek steden door heel Nederland
          </h2>

          <p className="mt-5 text-sm leading-6 text-[#4e5d55] sm:text-base">
            Van lokale evenementen tot verborgen parels: UitjesNL groeit stap
            voor stap mee met steden en gemeenten in Nederland.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[660px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:max-w-none">
          {showcaseCities.map((city) => (
            <Link
              key={city.slug}
              href={`/ontdek?city=${city.slug}`}
              className="group flex aspect-[1.74/1] min-h-[90px] items-center justify-center rounded-[18px] border border-white/70 bg-white/58 px-4 text-center shadow-[0_12px_32px_rgba(50,65,58,0.055)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white/78 hover:shadow-[0_16px_36px_rgba(50,65,58,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fc54a] sm:min-h-[104px] lg:min-h-[112px]"
              aria-label={`Ontdek uitjes in ${city.name}`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold tracking-normal text-white shadow-[0_8px_16px_rgba(23,35,29,0.1)] transition duration-200 group-hover:scale-105"
                  style={{ backgroundColor: city.accent }}
                  aria-hidden="true"
                >
                  {city.mark}
                </span>
                <span className="text-base font-semibold tracking-normal text-[#17231d] sm:text-lg">
                  {city.name}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
