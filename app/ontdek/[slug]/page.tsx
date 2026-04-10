import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllExploreDetailSlugs,
  getExploreDetailBySlug,
} from "@/lib/exploreDetailData";

type PageProps = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllExploreDetailSlugs().map((slug) => ({
    slug,
  }));
}

export default function ExploreDetailPage({ params }: PageProps) {
  const item = getExploreDetailBySlug(params.slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#111111]">
      <section className="px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-[1280px]">
          <header className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-[-0.03em]">
              Radiant Curator
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <Link href="/ontdek" className="text-sm text-black/70 hover:text-black">
                Ontdekken
              </Link>
              <Link href="/agenda" className="text-sm text-black/70 hover:text-black">
                Agenda
              </Link>
              <Link href="/populair" className="border-b border-black pb-1 text-sm font-medium">
                Populair
              </Link>
              <Link href="/favorieten" className="text-sm text-black/70 hover:text-black">
                Favorieten
              </Link>
            </nav>
          </header>

          <section className="overflow-hidden rounded-[2rem]">
            <div className="relative h-[360px] w-full md:h-[520px]">
              <Image
                src={item.heroImage}
                alt={item.title}
                fill
                className="object-cover"
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-5 md:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#d8efb5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                    {item.status}
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white md:text-6xl">
                  {item.title}
                </h1>

                <p className="mt-3 text-sm text-white/90 md:text-base">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_360px]">
            <div>
              <div className="grid gap-6 rounded-[2rem] bg-white/60 p-6 md:grid-cols-2 md:p-8">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                    Waarom dit een goede keuze is
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {item.reasons.map((reason) => (
                    <div key={reason} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6d8f3d] text-xs text-white">
                        ✓
                      </span>
                      <span className="text-sm leading-6 text-black/70">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] bg-[#ede1d6] p-7 md:p-9">
                <h2 className="text-4xl font-semibold tracking-[-0.04em]">
                  {item.aboutTitle}
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-black/70 md:text-base">
                  {item.aboutText}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-4xl font-semibold tracking-[-0.04em]">
                  In beeld
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {item.gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-[0.88/1] overflow-hidden rounded-[1.25rem]"
                    >
                      <Image
                        src={image}
                        alt={`${item.title} sfeerbeeld ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14">
                <h2 className="text-4xl font-semibold tracking-[-0.04em]">
                  Vergelijkbare plekken
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {item.similarPlaces.map((place) => (
                    <article key={place.title} className="group">
                      <div className="relative aspect-[0.88/1] overflow-hidden rounded-[1.5rem]">
                        <Image
                          src={place.image}
                          alt={place.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                          {place.badge}
                        </span>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                          {place.title}
                        </h3>
                        <p className="mt-1 text-sm text-black/55">
                          {place.subtitle}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
                <button className="mb-3 inline-flex w-full items-center justify-center rounded-full bg-[#bde28d] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90">
                  {item.actions.reserveLabel}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="inline-flex items-center justify-center rounded-full bg-[#f1e7dd] px-4 py-3 text-sm font-medium text-black">
                    {item.actions.routeLabel}
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full bg-[#ececf2] px-4 py-3 text-sm font-medium text-black">
                    {item.actions.saveLabel}
                  </button>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-[#d8ead0] p-6">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  Praktisch
                </h3>

                <div className="mt-5 space-y-5">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                      Adres
                    </div>
                    <div className="mt-1 text-sm leading-6 text-black/75">
                      {item.practical.address}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                      Openingstijden
                    </div>
                    <div className="mt-1 text-sm leading-6 text-black/75">
                      {item.practical.openingHours}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                      Type
                    </div>
                    <div className="mt-1 text-sm leading-6 text-black/75">
                      {item.practical.cuisine}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                      Prijs
                    </div>
                    <div className="mt-1 text-sm leading-6 text-black/75">
                      {item.practical.pricing}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </section>

      <footer className="mt-20 bg-[#121212] px-4 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xl font-semibold tracking-[-0.03em]">
            Radiant Curator
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <Link href="/over-ons">Over ons</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
          </div>

          <div className="text-sm text-white/60">
            © 2024 Radiant Curator. City Guide Editorial.
          </div>
        </div>
      </footer>
    </main>
  );
}
