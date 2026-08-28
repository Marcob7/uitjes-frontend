import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AppSection } from "@/components/ui/app";
import {
  getInspirationCityLabel,
  getInspirationLocationMode,
  getInspirationResultsByCategory,
  getInspirationStaticParams,
  inspirationCategoryDescriptions,
  inspirationCategoryLabels,
  isInspirationCategorySlug,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";

type PageProps = { params: { category: string }; searchParams?: { location?: string; nearbyCity?: string } };

export const dynamicParams = false;
export const runtime = "edge";

const inspirationRouteConfig = {
  "snel-ontdekken": { category: "vandaag", label: "Snel ontdekken", description: "Laagdrempelige inspiratie voor als je snel een richting wilt kiezen, zonder eerst een volledig plan te maken." },
  "buiten-genieten": { category: "buiten", label: "Buiten genieten", description: "Ideeen met lucht, groen, water of ruimte om te dwalen. Fijn voor een wandeling, parkmoment of frisse pauze." },
  regenproof: { category: "binnen", label: "Regenproof", description: "Binneninspiratie voor wisselvallige dagen: cultuur, makersplekken en rustige plekken waar het weer geen spelbreker is." },
  "voor-vanavond": { category: "weekend", label: "Voor vanavond", description: "Ideeen met avondgevoel: iets eten, live muziek, samen op pad of een plan dat niet te veel voorbereiding vraagt." },
} as const;

function getRouteCategory(category: string) {
  if (category in inspirationRouteConfig) return inspirationRouteConfig[category as keyof typeof inspirationRouteConfig];
  if (isInspirationCategorySlug(category)) return { category, label: inspirationCategoryLabels[category], description: inspirationCategoryDescriptions[category] };
  return undefined;
}

function buildContextQuery(searchParams?: PageProps["searchParams"]) {
  const params = new URLSearchParams();
  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.nearbyCity) params.set("nearbyCity", searchParams.nearbyCity);
  return params.toString();
}
function withContext(href: string, query: string) { return query ? `${href}?${query}` : href; }

export function generateStaticParams() {
  return [...getInspirationStaticParams(), ...Object.keys(inspirationRouteConfig).map((category) => ({ category }))];
}
export function generateMetadata({ params }: PageProps) {
  const routeCategory = getRouteCategory(params.category);
  return routeCategory
    ? { title: `${routeCategory.label} | Uitjes`, description: routeCategory.description, alternates: { canonical: `/inspiratie/${encodeURIComponent(params.category)}` } }
    : { title: "Inspiratie | Uitjes", alternates: { canonical: `/inspiratie/${encodeURIComponent(params.category)}` } };
}

export default function InspirationCategoryPage({ params, searchParams }: PageProps) {
  const routeCategory = getRouteCategory(params.category);
  if (!routeCategory) notFound();
  const results = getInspirationResultsByCategory(routeCategory.category, searchParams?.location, searchParams?.nearbyCity);
  if (!results.length) notFound();
  const query = buildContextQuery(searchParams);
  const locationMode = getInspirationLocationMode(searchParams?.location);
  const cityLabel = getInspirationCityLabel(searchParams?.location, searchParams?.nearbyCity);
  const context = locationMode === "surprise" || !cityLabel ? routeCategory.label : `${routeCategory.label} ${cityLabel}`;

  return <main className="min-h-screen bg-[#F6F5F0] text-[#29342F] mt-18">
    <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-5 pb-16 sm:pt-8 sm:pb-24">
      <Breadcrumbs items={[{ label: "Inspiratie", href: "/inspiratie" }, { label: routeCategory.label }]} className="mb-9" />
      <header className="max-w-3xl border-b border-[#DCE1DC] pb-9 sm:pb-12">
        <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[0.94] tracking-[-0.06em]">{context}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#65736C] sm:text-lg">{routeCategory.description}</p>
        <p className="mt-5 text-sm font-medium text-[#1D5A46]">{results.length} {results.length === 1 ? "activiteit" : "activiteiten"}</p>
      </header>

      <section className="pt-8 sm:pt-10" aria-labelledby="resultaten-heading">
        <div className="mb-5 flex items-end justify-between gap-5"><div><h2 id="resultaten-heading" className="text-2xl font-semibold tracking-[-0.04em]">Kies een activiteit</h2></div><Link href={withContext("/inspiratie", query)} className="min-h-11 shrink-0 rounded-full border border-[#DCE1DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">Keuzehulp</Link></div>
        <div className="divide-y divide-[#DCE1DC] border-y border-[#DCE1DC]">{results.map((item) => <ResultRow key={item.slug} item={item} href={withContext(`/inspiratie/${item.category}/${item.slug}`, query)} />)}</div>
      </section>

    
    </AppSection>
  </main>;
}

function ResultRow({ item, href }: { item: InspirationResult; href: string }) {
  return <Link href={href} className="group grid min-h-28 grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 py-5 transition sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(7rem,auto)_2.75rem] sm:gap-x-5 sm:px-3 sm:hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005FCC]">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDEBE2] text-[#1D5A46]" aria-hidden="true"><ActivityIcon type={item.type} /></div>
    <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#1D5A46]">{item.type}</p><h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#29342F] sm:text-xl">{item.title}</h3><p className="mt-1 truncate text-sm text-[#65736C]">{[item.location, item.openingHours, `★ ${item.rating}`].filter(Boolean).join(" · ")}</p></div>
    <div className="col-start-2 text-sm font-semibold text-[#1D5A46] sm:col-start-auto sm:text-right"><span className="sm:hidden">{item.price}</span><span className="hidden sm:inline">{item.price}</span></div>
    <span className="col-start-3 row-span-2 row-start-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#1D5A46] text-white transition group-hover:bg-[#355E7A]" aria-hidden="true"><ArrowRightIcon /></span>
  </Link>;
}
function InfoBlock({ title, text }: { title: string; text: string }) { return <div><h2 className="text-sm font-semibold text-[#1D5A46]">{title}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-[#65736C]">{text}</p></div>; }
function ActivityIcon({ type }: { type: string }) { const isWalk = /wand|route|park/i.test(type); return isWalk ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5h16M6 19.5V8l6-4 6 4v11.5M9 19.5v-5h6v5M9 10h.01M15 10h.01"/></svg>; }
function ArrowRightIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>; }
