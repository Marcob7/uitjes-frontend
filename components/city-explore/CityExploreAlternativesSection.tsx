"use client";

import Image from "next/image";

import type { PlannerSelections } from "./types";

type AlternativeCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  score: string;
  image: string;
  tags: string[];
  cta: string;
};

type AlternativeListItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  match: string;
  image: string;
};

type CityExploreAlternativesSectionProps = {
  cityLabel: string;
  plannerSelections: PlannerSelections;
  scarcity: "none" | "few";
};

function getCompanionContext(companion: PlannerSelections["companion"]) {
  switch (companion) {
    case "solo":
      return "een solo moment met rust en eigen ritme";
    case "gezin":
      return "een plan dat werkt voor meerdere leeftijden";
    case "vrienden":
      return "een levendige setting voor samen op pad";
    default:
      return "een avond die goed voelt voor jullie samen";
  }
}

function getMomentContext(moment: PlannerSelections["moment"]) {
  switch (moment) {
    case "nu":
      return "dat direct haalbaar is";
    case "morgen":
      return "waar je morgen naartoe kunt uitkijken";
    case "weekend":
      return "dat goed past in een ontspannen weekend";
    default:
      return "voor later vanavond";
  }
}

function buildAlternativeContent(
  cityLabel: string,
  selections: PlannerSelections
): {
  title: string;
  subtitle: string;
  featured: AlternativeCard;
  alternatives: AlternativeListItem[];
} {
  const companionContext = getCompanionContext(selections.companion);
  const momentContext = getMomentContext(selections.moment);

  switch (selections.vibe) {
    case "cultureel":
      return {
        title: "Onze aanbevelingen voor jou",
        subtitle: `Er zijn nu weinig directe matches, dus we tonen een slimme culturele selectie in ${cityLabel} die past bij ${companionContext} ${momentContext}.`,
        featured: {
          id: "atelier-avond",
          eyebrow: "Beste alternatief",
          title: "Atelier aan de Singel",
          description:
            "Een rustige, gecureerde setting met kunst, design en genoeg ruimte om langer te blijven hangen zonder dat het te druk aanvoelt.",
          score: "9.6",
          image: "/images/apeldoorn_img.jpg",
          tags: ["Cultureel", "Intiem"],
          cta: "Bekijk alternatief",
        },
        alternatives: [
          {
            id: "museum-salon",
            eyebrow: "VERDIEPEND",
            title: "Museum Salon",
            description:
              "Perfect als je meer inhoud en een verfijnde sfeer zoekt.",
            match: "93% Match",
            image: "/images/locationv2.png",
          },
          {
            id: "stille-studio",
            eyebrow: "RUSTIGER",
            title: "Studio Noorderlicht",
            description:
              "Kleinschalig, licht en fijn als je liever buiten de drukte blijft.",
            match: "88% Match",
            image: "/images/location.png",
          },
          {
            id: "avondcollectie",
            eyebrow: "CURATOR PICK",
            title: "Avondcollectie 12",
            description:
              "Een esthetische plek voor een langere culturele stop.",
            match: "86% Match",
            image: "/images/cider.png",
          },
        ],
      };
    case "actief":
      return {
        title: "Onze aanbevelingen voor jou",
        subtitle: `De precieze combinatie is schaars, daarom hebben we alternatieven klaarstaan in ${cityLabel} voor ${companionContext} ${momentContext}.`,
        featured: {
          id: "groene-route",
          eyebrow: "Beste alternatief",
          title: "Groene Stadsroute",
          description:
            "Een actieve maar toegankelijke keuze die buitenlucht, afwisseling en een logische route door de stad combineert.",
          score: "9.4",
          image: "/images/julianatoren.jpg",
          tags: ["Actief", "Buiten"],
          cta: "Bekijk alternatief",
        },
        alternatives: [
          {
            id: "parkloop",
            eyebrow: "ENERGIEK",
            title: "Parklus Centrum",
            description:
              "Fijn als je iets wilt doen dat licht, spontaan en beweeglijk voelt.",
            match: "92% Match",
            image: "/images/location.png",
          },
          {
            id: "wandelatelier",
            eyebrow: "ONTSPANNEN",
            title: "Wandelatelier",
            description:
              "Iets rustiger tempo, maar nog steeds duidelijk actief van karakter.",
            match: "89% Match",
            image: "/images/locationv2.png",
          },
          {
            id: "stadsontdekking",
            eyebrow: "SMART PICK",
            title: "Stadsontdekking",
            description:
              "Meer vrijheid om te bewegen en onderweg keuzes bij te stellen.",
            match: "85% Match",
            image: "/images/frog.png",
          },
        ],
      };
    case "relaxed":
      return {
        title: "Onze aanbevelingen voor jou",
        subtitle: `We vonden weinig exacte matches, maar deze rustige alternatieven in ${cityLabel} sluiten nog steeds mooi aan op ${companionContext}.`,
        featured: {
          id: "curators-lounge",
          eyebrow: "Beste alternatief",
          title: "Curator's Lounge",
          description:
            "Een zachte, stijlvolle setting voor wie liever kiest voor comfort, sfeer en een avond zonder haast.",
          score: "9.5",
          image: "/images/apeldoorn_img.jpg",
          tags: ["Relaxed", "Sfeervol"],
          cta: "Bekijk alternatief",
        },
        alternatives: [
          {
            id: "the-alchemist",
            eyebrow: "INTIEMER",
            title: "The Alchemist",
            description:
              "Perfect voor een diepgaand gesprek in een rustige setting.",
            match: "94% Match",
            image: "/images/cider.png",
          },
          {
            id: "brass",
            eyebrow: "ZACHTER",
            title: "Brass",
            description:
              "Een ontspannen alternatief met verfijnde sfeer en weinig drukte.",
            match: "89% Match",
            image: "/images/location.png",
          },
          {
            id: "curators-table",
            eyebrow: "HIDDEN GEM",
            title: "The Curator's Table",
            description:
              "Exclusieve setting met een rustiger ritme en minder prikkels.",
            match: "86% Match",
            image: "/images/locationv2.png",
          },
        ],
      };
    default:
      return {
        title: "Onze aanbevelingen voor jou",
        subtitle: `Er zijn nu weinig directe matches, maar deze culinaire alternatieven in ${cityLabel} sluiten alsnog goed aan op ${companionContext}.`,
        featured: {
          id: "librijes-zusje",
          eyebrow: "Beste alternatief",
          title: "Librije's Zusje",
          description:
            "Op basis van jullie voorkeur voor een gastronomische ervaring met verfijnde sfeer is dit een sterke dummy-match om toch verder te kunnen ontdekken.",
          score: "9.8",
          image: "/images/apeldoorn_img.jpg",
          tags: ["EUR EUR EUR", "Sfeervol"],
          cta: "Bekijk alternatief",
        },
        alternatives: [
          {
            id: "the-alchemist-food",
            eyebrow: "INTIEMER",
            title: "The Alchemist",
            description:
              "Perfect voor een diepgaand gesprek in een rustige setting.",
            match: "94% Match",
            image: "/images/cider.png",
          },
          {
            id: "brass-food",
            eyebrow: "BETAALBAAR LUXE",
            title: "Brass",
            description:
              "Premium gastronomische ervaring tegen een vriendelijker tarief.",
            match: "89% Match",
            image: "/images/location.png",
          },
          {
            id: "curators-table-food",
            eyebrow: "HIDDEN GEM",
            title: "The Curator's Table",
            description:
              "Exclusieve setting met slechts een beperkt aantal plaatsen.",
            match: "86% Match",
            image: "/images/locationv2.png",
          },
        ],
      };
  }
}

export default function CityExploreAlternativesSection({
  cityLabel,
  plannerSelections,
  scarcity,
}: CityExploreAlternativesSectionProps) {
  const content = buildAlternativeContent(cityLabel, plannerSelections);

  return (
    <section className="mt-14 px-1 sm:px-0">
      <div className="max-w-[54rem]">
        <div className="text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[#6f8a2e]">
          {scarcity === "none" ? "Geen directe matches" : "Extra suggesties"}
        </div>
        <h3 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#151515]">
          {content.title}
        </h3>
        <p className="mt-4 max-w-[44rem] text-base leading-8 text-[#63584d]">
          {content.subtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.62fr)] xl:items-start">
        <article className="overflow-hidden rounded-[2.8rem] border border-[#d8cec2] bg-white">
          <div className="grid xl:grid-cols-[minmax(300px,0.95fr)_minmax(0,1fr)]">
            <div className="relative min-h-[340px]">
              <Image
                src={content.featured.image}
                alt={content.featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 520px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120b07]/12 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-[#4f7727] px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white">
                {content.featured.eyebrow}
              </div>
            </div>

            <div className="flex h-full flex-col px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex items-start justify-between gap-5">
                <div className="text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-[#456726]">
                  Exclusieve selectie
                </div>
                <div className="text-right">
                  <div className="text-[3rem] font-semibold leading-none tracking-[-0.07em] text-[#466d25]">
                    {content.featured.score}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#5e584f]">
                    Match score
                  </div>
                </div>
              </div>

              <h4 className="mt-6 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-[#171513]">
                {content.featured.title}
              </h4>

              <p className="mt-6 max-w-[28rem] text-[1.04rem] leading-9 text-[#40372f]">
                {content.featured.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {content.featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#efebe6] px-4 py-2 text-sm font-medium text-[#302821]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-[#4f7727] px-8 py-4 text-lg font-semibold text-white transition hover:-translate-y-0.5"
              >
                {content.featured.cta}
              </button>
            </div>
          </div>
        </article>

        <aside>
          <div className="text-[0.88rem] font-semibold uppercase tracking-[0.28em] text-[#171513]">
            Slimme alternatieven
          </div>

          <div className="mt-8 grid gap-4">
            {content.alternatives.map((item) => (
              <article
                key={item.id}
                className="flex items-center gap-5 rounded-[2rem] bg-[#f8f5f0] px-5 py-5"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[#ede4d8]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#567a2f]">
                    {item.eyebrow}
                  </div>
                  <div className="mt-2 text-[1.7rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#171513]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-[1rem] leading-7 text-[#665a4e]">
                    {item.description}
                  </p>
                  <div className="mt-2 text-base font-semibold text-[#232019]">
                    {item.match}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
