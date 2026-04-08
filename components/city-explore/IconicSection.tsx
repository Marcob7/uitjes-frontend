import Image from "next/image";
import type { IconicCard, SafeCityTheme } from "./types";
import { buildIconicCards } from "./utils";

function IconicCardItem({ card }: { card: IconicCard }) {
  return (
    <article className="group">
      <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] shadow-sm ring-1 ring-black/5">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-semibold tracking-tight text-[#111111]">
          {card.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {card.description}
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center text-sm font-medium text-[#111111] transition hover:opacity-70"
        >
          {card.cta}
        </button>
      </div>
    </article>
  );
}

type IconicSectionProps = {
  cityLabel: string;
  cityTheme: SafeCityTheme;
};

export default function IconicSection({
  cityLabel,
  cityTheme,
}: IconicSectionProps) {
  const iconicCards = buildIconicCards(
    cityLabel,
    cityTheme.heroImage,
    cityTheme.fallbackImage
  );

  return (
    <section
      className="mt-16 rounded-[2.5rem] px-6 py-10 sm:px-8 sm:py-12 lg:px-10"
      style={{
        backgroundColor: "#d9ead7",
      }}
    >
      <div className="max-w-3xl">
        <h2 className="text-4xl font-semibold tracking-tight text-[#111111]">
          Iconic {cityLabel}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Must-visit landmarks en plekken die de sfeer, geschiedenis en
          identiteit van {cityLabel} laten zien.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {iconicCards.map((card) => (
          <IconicCardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}