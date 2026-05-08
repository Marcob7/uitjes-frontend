import { AppButton, AppEmptyState, AppResultCard, AppSection } from "@/components/ui/app";
import {
  featuredInspirationCities,
  inspirationCategoryLabels,
  inspirationResults,
} from "@/lib/dummy/inspirationResults";

export const runtime = "edge";

type UitjesPageProps = {
  searchParams?: {
    query?: string;
  };
};

const searchableCategoryAliases: Record<string, string[]> = {
  "eten-drinken": ["restaurant", "restaurants", "eten", "drinken", "lunch", "diner", "koffie"],
  "met-kinderen": ["kind", "kinderen", "gezin", "familie"],
  romantisch: ["date", "romantisch", "samen"],
  buiten: ["wandelen", "wandeling", "park", "route", "buiten", "natuur"],
  binnen: ["museum", "binnen", "cultuur", "workshop"],
  gratis: ["gratis", "budget"],
};

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(result: (typeof inspirationResults)[number], query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  const haystack = normalize(
    [
      result.title,
      result.city,
      result.categoryLabel,
      result.description,
      result.practicalInfo,
      result.location,
      result.type,
      ...result.tags,
      ...result.categories,
    ].join(" ")
  );

  const categoryAliasMatch = result.categories.some((category) =>
    (searchableCategoryAliases[category] ?? []).some((alias) =>
      normalizedQuery.includes(normalize(alias))
    )
  );

  return haystack.includes(normalizedQuery) || categoryAliasMatch;
}

export default function UitjesPage({ searchParams }: UitjesPageProps) {
  const query = searchParams?.query?.trim() ?? "";
  const results = inspirationResults.filter((result) => matchesQuery(result, query));

  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-8 pb-10">
        <div className="rounded-[2.2rem] border border-[#e5dccf] bg-[#fffaf4] px-5 py-8 shadow-[0_20px_54px_rgba(69,50,27,0.08)] sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
            Uitjes zoeken
          </p>
          <h1 className="mt-3 max-w-[13ch] text-[clamp(2.4rem,6vw,4.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
            Resultaten voor {query ? `"${query}"` : "uitjes"}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#665d54] sm:text-base">
            Een kleine dummy selectie van activiteiten, routes, horeca en gezinsuitjes.
            Later kan deze pagina dezelfde query gebruiken met echte data.
          </p>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16">
        {results.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {results.map((result) => (
              <AppResultCard
                key={result.slug}
                title={result.title}
                description={result.description}
                image={result.image}
                href={`/inspiratie/${result.category}/${result.slug}`}
                badge={result.badge ?? result.categoryLabel}
                tags={[result.city, result.price, ...result.tags.slice(0, 2)]}
                meta={`${result.type} - ${result.location}`}
                ctaLabel="Bekijk uitje"
              />
            ))}
          </div>
        ) : (
          <AppEmptyState
            title="Geen uitjes gevonden"
            description="Probeer een andere zoekterm, kies een stad of bekijk een categorie zoals met kinderen, buiten of eten & drinken."
            className="mx-auto max-w-3xl"
          />
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <AppButton href="/ontdek" variant="dark">
            Kies een stad
          </AppButton>
          {Object.entries(inspirationCategoryLabels).slice(0, 4).map(([slug, label]) => (
            <AppButton key={slug} href={`/inspiratie/${slug}`} variant="dark">
              {label}
            </AppButton>
          ))}
          {featuredInspirationCities.map((city) => (
            <AppButton key={city.value} href={`/ontdek?city=${city.value}`} variant="dark">
              {city.label}
            </AppButton>
          ))}
        </div>
      </AppSection>
    </main>
  );
}
