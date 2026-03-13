"use client";

import Link from "next/link";
import CitySelect, { type CityOption } from "@/components/CitySelect";

type OntdekHeaderProps = {
  city: string;
  free: string;
  when?: string;
  cityOptions: CityOption[];
};

export default function OntdekHeader({
  city,
  free,
  when,
  cityOptions,
}: OntdekHeaderProps) {
  const whenLabel =
    when === "tonight" ? "Vanavond" : when === "weekend" ? "Dit weekend" : "Altijd";

  const cityLabel = cityOptions.find((option) => option.value === city)?.label ?? city;

  function buildUrl(next: { city: string; free: string; when?: string }) {
    const params = new URLSearchParams();
    params.set("city", next.city);

    if (next.free === "1") params.set("free", "1");
    if (next.when) params.set("when", next.when);

    return `/ontdek?${params.toString()}`;
  }

  function chipClass(active: boolean) {
    return [
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition",
      active
        ? "border border-stone-900 bg-stone-900 font-semibold text-white shadow-sm"
        : "border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50",
    ].join(" ");
  }

  const whenOptions = [
    { label: "Altijd", href: buildUrl({ city, free, when: undefined }), active: !when },
    { label: "Vanavond", href: buildUrl({ city, free, when: "tonight" }), active: when === "tonight" },
    {
      label: "Dit weekend",
      href: buildUrl({ city, free, when: "weekend" }),
      active: when === "weekend",
    },
  ];

  const priceOptions = [
    { label: "Alles", href: buildUrl({ city, free: "0", when }), active: free !== "1" },
    { label: "Gratis", href: buildUrl({ city, free: "1", when }), active: free === "1" },
  ];

  return (
    <section className="mb-6 mt-4 rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(247,243,237,0.96)_100%)] p-5 shadow-[0_18px_50px_rgba(70,52,24,0.06)] sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] lg:items-end">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-stone-600">
            Ontdek filters
          </span>

          <h2 className="font-heading mt-4 text-3xl leading-tight text-stone-900 sm:text-4xl">
            Verfijn je ontdektocht in {cityLabel}
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
            Wissel snel tussen moment en prijs zonder je stad te verliezen. De filters blijven
            URL-gedreven zodat delen en verversen voorspelbaar blijft.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-stone-200 bg-white/90 p-4 shadow-sm sm:p-5">
          <CitySelect cities={cityOptions} defaultCity={city} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
            Wanneer
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {whenOptions.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                className={chipClass(option.active)}
                aria-current={option.active ? "page" : undefined}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
            Prijs
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {priceOptions.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                className={chipClass(option.active)}
                aria-current={option.active ? "page" : undefined}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-stone-600">
        <span className="rounded-full bg-stone-900 px-3 py-1 font-medium text-white">
          Stad: {cityLabel}
        </span>
        <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
          Wanneer: {whenLabel}
        </span>
        <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
          Filter: {free === "1" ? "Gratis" : "Alles"}
        </span>
      </div>
    </section>
  );
}