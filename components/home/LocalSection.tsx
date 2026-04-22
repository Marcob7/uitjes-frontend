import Link from "next/link";
import { optimizeCssBackground } from "@/lib/remoteImage";

const benefits = [
  "Gecureerde routes door verborgen straatjes",
  "Exclusieve kortingen bij lokale ondernemers",
  "Real-time drukte indicatoren voor musea",
];

export default function LocalSection() {
  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="grid gap-8 rounded-[32px] bg-lime-100/80 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div
          className="min-h-[300px] overflow-hidden rounded-[28px]"
          style={{
            backgroundImage: optimizeCssBackground(
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80",
              {
                width: 960,
                quality: 56,
              }
            ),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Ontdek de stad als een
            <br />
            <span className="italic text-slate-800">local.</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-700 md:text-base">
            Vergeet de toeristische hotspots. Wij nemen je mee naar de plekken
            waar inwoners van Utrecht, Amsterdam en Rotterdam zelf hun koffie
            drinken en hun weekenden vieren.
          </p>

          <ul className="mt-6 space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-sm text-slate-800"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/nieuwsbrief"
              className="inline-flex min-h-[48px] items-center rounded-2xl bg-lime-700 px-6 text-sm font-semibold text-white transition hover:bg-lime-800 sm:rounded-full"
            >
              Meld je aan voor de nieuwsbrief
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
