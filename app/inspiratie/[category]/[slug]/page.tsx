import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SavePlaceButton from "@/components/SavePlaceButton";
import { AppSection } from "@/components/ui/app";
import { buildActionSearchHref, buildMapsSearchHref } from "@/lib/actionLinks";
import { getInspirationDetailStaticParams, getInspirationResultBySlug, getSimilarInspirationResults, inspirationCategoryLabels, isInspirationCategorySlug, type InspirationResult } from "@/lib/dummy/inspirationResults";

type PageProps = { params: { category: string; slug: string }; searchParams?: { location?: string; nearbyCity?: string } };
export const dynamicParams = false;
export const runtime = "edge";
function buildContextQuery(searchParams?: PageProps["searchParams"]) { const params = new URLSearchParams(); if (searchParams?.location) params.set("location", searchParams.location); if (searchParams?.nearbyCity) params.set("nearbyCity", searchParams.nearbyCity); return params.toString(); }
function withContext(href: string, query: string) { return query ? `${href}?${query}` : href; }
export function generateStaticParams() { return getInspirationDetailStaticParams(); }
export function generateMetadata({ params }: PageProps) { const result = getInspirationResultBySlug(params.category, params.slug); return result ? { title: `${result.title} | Uitjes`, description: result.description, alternates: { canonical: `/inspiratie/${params.category}/${params.slug}` } } : { title: "Inspiratie | Uitjes" }; }

export default function InspirationDetailPage({ params, searchParams }: PageProps) {
  if (!isInspirationCategorySlug(params.category)) notFound();
  const activeCategory = params.category;
  const result = getInspirationResultBySlug(params.category, params.slug);
  if (!result) notFound();
  const query = buildContextQuery(searchParams);
  const categoryLabel = inspirationCategoryLabels[params.category];
  const detailHref = withContext(`/inspiratie/${params.category}/${params.slug}`, query);
  const savedPlace = { id: `inspiratie:${params.category}/${result.slug}`, title: result.title, href: detailHref, meta: `${result.city} - ${categoryLabel} - ${result.rating}`, image: result.image };
  const practical = [["Locatie", result.location], ["Openingstijden", result.openingHours], ["Prijs", result.price], ["Type", result.type]].filter((row): row is [string, string] => Boolean(row[1]));
  const similar = getSimilarInspirationResults(result);
  return <main className="min-h-screen overflow-hidden bg-[#F6F5F0] text-[#29342F]">
    <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-5 pb-14 sm:pt-8 sm:pb-20">
      <Breadcrumbs items={[{ label: "Inspiratie", href: "/inspiratie" }, { label: categoryLabel, href: withContext(`/inspiratie/${params.category}`, query) }, { label: result.title }]} className="mb-9" />
      <section className="relative overflow-hidden bg-[#E7EFEC] px-5 py-8 sm:px-9 sm:py-12 lg:grid lg:grid-cols-[minmax(0,1.25fr)_22rem] lg:gap-14 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute -right-24 -top-20 h-[130%] w-[36%] -skew-x-12 bg-[#D9E6E1]" />
        <div className="relative max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1D5A46]">{result.type || categoryLabel}</p><h1 className="mt-4 text-[clamp(2.7rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.065em]">{result.title}</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#65736C] sm:text-lg">{result.description}</p><div className="mt-7 flex flex-wrap gap-2">{result.tags.map((tag) => <span key={tag} className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#1D5A46]">{tag}</span>)}</div></div>
        <aside className="relative mt-9 rounded-2xl bg-white p-6 shadow-[0_18px_45px_rgba(41,52,47,0.12)] lg:mt-0"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1D5A46]">In één oogopslag</p><dl className="mt-5 space-y-3">{practical.map(([label, value]) => <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-[#DCE1DC] pb-3 text-sm last:border-0"><dt className="text-[#65736C]">{label}</dt><dd className="font-semibold text-[#29342F]">{value}</dd></div>)}</dl></aside>
      </section>
    </AppSection>
    <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-0 pb-14 sm:pb-20">
      <section className="grid gap-10 border-t border-[#DCE1DC] pt-10 lg:grid-cols-[10rem_minmax(0,1fr)_18rem] lg:gap-12 lg:pt-14" aria-labelledby="verwachten"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1D5A46]">Beleving</p><div><h2 id="verwachten" className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[0.96] tracking-[-0.05em]">Wat kun je verwachten?</h2><div className="mt-6 space-y-5 text-base leading-8 text-[#65736C]"><p>{result.description}</p><p>{result.practicalInfo}</p></div></div><aside className="border-l-2 border-[#1D5A46] pl-5"><p className="text-sm font-semibold text-[#1D5A46]">Waarom dit past</p><ul className="mt-4 space-y-3 text-sm leading-6 text-[#65736C]">{result.reasons.map((reason) => <li key={reason} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D5A46]" aria-hidden="true" />{reason}</li>)}</ul></aside></section>
      <section className="mt-14 grid gap-7 border-t border-[#DCE1DC] pt-10 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-label="Acties"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1D5A46]">Praktisch</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Plan je bezoek</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#65736C]">Bekijk de locatie, zoek actuele mogelijkheden of bewaar deze plek voor later.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><a href={buildMapsSearchHref(result.location)} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#355E7A] px-5 text-sm font-semibold text-[#355E7A] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">Bekijk route</a><SavePlaceButton item={savedPlace} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1D5A46] px-5 text-sm font-semibold text-white transition hover:bg-[#355E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]" savedClassName="inline-flex min-h-12 items-center justify-center rounded-full bg-[#DDEBE2] px-5 text-sm font-semibold text-[#1D5A46]" >Sla op</SavePlaceButton><a href={buildActionSearchHref({ title: result.title, location: result.location, actionLabel: "reserveer" })} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center text-sm font-semibold text-[#1D5A46] underline underline-offset-4">Zoek actuele informatie</a></div></section>
      {similar.length ? <section className="mt-16 border-t border-[#DCE1DC] pt-10" aria-labelledby="vergelijkbaar"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1D5A46]">Verder kijken</p><h2 id="vergelijkbaar" className="mt-2 text-[clamp(2rem,3vw,2.75rem)] font-semibold tracking-[-0.05em]">Vergelijkbare activiteiten</h2><div className="mt-7 grid divide-y divide-[#DCE1DC] border-y border-[#DCE1DC] md:grid-cols-3 md:divide-x md:divide-y-0">{similar.map((item) => <SimilarItem key={item.slug} item={item} href={withContext(`/inspiratie/${item.categories.includes(activeCategory) ? activeCategory : item.category}/${item.slug}`, query)} />)}</div></section> : null}
    </AppSection>
  </main>;
}
function SimilarItem({ item, href }: { item: InspirationResult; href: string }) { return <Link href={href} className="group block p-5 first:pl-0 last:pr-0 transition hover:bg-white/60 md:first:pl-0 md:last:pr-0"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1D5A46]">{item.categoryLabel}</p><h3 className="mt-3 text-xl font-semibold tracking-[-0.035em]">{item.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-[#65736C]">{item.description}</p><p className="mt-4 text-sm font-semibold text-[#1D5A46]">{item.price} <span aria-hidden="true">→</span></p></Link>; }
