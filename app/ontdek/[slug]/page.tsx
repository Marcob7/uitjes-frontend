import Image from "next/image";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import SavePlaceButton from "@/components/SavePlaceButton";
import { AppCard, AppSection } from "@/components/ui/app";
import {
  buildActionSearchHref,
  buildMapsSearchHref,
} from "@/lib/actionLinks";
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

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3.5 8.2 2.7 2.7 6.3-6.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#746355]">
        {label}
      </div>
      <div className="mt-1 text-sm leading-6 text-[#211a14]">{value}</div>
    </div>
  );
}

export default function ExploreDetailPage({ params }: PageProps) {
  const item = getExploreDetailBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const reserveHref = buildActionSearchHref({
    title: item.title,
    location: `${item.city} ${item.practical.address}`,
    actionLabel: item.actions.reserveLabel,
  });
  const routeHref = buildMapsSearchHref(item.practical.address);
  const savedPlace = {
    id: `explore:${item.slug}`,
    title: item.title,
    href: `/ontdek/${item.slug}`,
    meta: item.subtitle,
    image: item.heroImage,
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-6 pb-10 lg:pt-8 lg:pb-12">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Ontdek", href: "/ontdek" },
              { label: item.title },
            ]}
            className="mb-6"
          />

          <section className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/50 shadow-[0_28px_80px_rgba(66,49,31,0.16)]">
            <div className="relative h-[430px] w-full md:h-[580px]">
              <Image
                src={item.heroImage}
                alt={item.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,rgba(7,19,26,0.08),rgba(7,19,26,0.68))]" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#e8f2d0]/30 bg-[#152017]/72 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f7f4ed] backdrop-blur-xl">
                    {item.category}
                  </span>
                  <span className="rounded-full border border-[#e8f2d0]/50 bg-[#e8f2d0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#162016]">
                    {item.status}
                  </span>
                </div>

                <h1 className="max-w-[12ch] text-[clamp(3rem,8vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white">
                  {item.title}
                </h1>

                <p className="mt-4 max-w-[42rem] text-sm leading-6 text-white/88 md:text-base">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_360px]">
            <div>
              <AppCard
                variant="glass"
                padding="lg"
                className="grid gap-7 rounded-[2.1rem] border-[#d9cec1]/70 bg-white/78 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)] md:grid-cols-[0.9fr_1.1fr]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#746355]">
                    Redactie
                  </p>
                  <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                    Waarom dit een goede keuze is
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {item.reasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-start gap-3 rounded-[1.3rem] border border-[#d9cec1]/70 bg-[#fbf8f3]/82 p-4"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f2d0] text-[#162016]">
                        <CheckIcon />
                      </span>
                      <span className="text-sm leading-6 text-[#2d241c]">{reason}</span>
                    </div>
                  ))}
                </div>
              </AppCard>

              <AppCard
                variant="glass"
                padding="lg"
                className="mt-8 rounded-[2.1rem] border-[#d9cec1]/70 bg-white/78 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
              >
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  {item.aboutTitle}
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#3f3429] md:text-base">
                  {item.aboutText}
                </p>
              </AppCard>

              <div className="mt-8">
                <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  In beeld
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                  {item.gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-[0.88/1] overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/50 shadow-[0_14px_34px_rgba(66,49,31,0.1)]"
                    >
                      <Image
                        src={image}
                        alt={`${item.title} sfeerbeeld ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 300px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14">
                <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  Vergelijkbare plekken
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {item.similarPlaces.map((place) => (
                    <article key={place.title} className="group">
                      <div className="relative aspect-[0.88/1] overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/50 shadow-[0_18px_44px_rgba(66,49,31,0.1)]">
                        <Image
                          src={place.image}
                          alt={place.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />

                        <span className="absolute left-3 top-3 rounded-full border border-[#e8f2d0]/35 bg-[#152017]/78 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f7f4ed] backdrop-blur-xl">
                          {place.badge}
                        </span>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-2xl font-semibold leading-none tracking-[-0.04em] text-[#171511]">
                          {place.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#665d54]">
                          {place.subtitle}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28">
              <AppCard
                variant="elevated"
                padding="md"
                className="rounded-[1.8rem] border-[#d9cec1]/70 bg-white/82 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
              >
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noreferrer"
                  className="uitjes-cta mb-3 inline-flex min-h-14 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  {item.actions.reserveLabel}
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={routeHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b9aa98]/70 bg-[#f7f1e8] px-4 text-sm font-medium text-[#211a14] transition hover:bg-[#efe4d7]"
                  >
                    {item.actions.routeLabel}
                  </a>
                  <SavePlaceButton
                    item={savedPlace}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b9aa98]/70 bg-[#f7f1e8] px-4 text-sm font-medium text-[#211a14] transition hover:bg-[#efe4d7]"
                    savedClassName="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c8dc9a] bg-[#e8f2d0] px-4 text-sm font-medium text-[#162016] transition hover:bg-[#f1f7df]"
                    savedChildren="Opgeslagen"
                  >
                    {item.actions.saveLabel}
                  </SavePlaceButton>
                </div>
              </AppCard>

              <AppCard
                variant="glass"
                padding="lg"
                className="rounded-[1.8rem] border-[#d9cec1]/70 bg-white/82 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                  Praktisch
                </h3>

                <div className="mt-5 space-y-5">
                  <DetailRow label="Adres" value={item.practical.address} />
                  <DetailRow label="Openingstijden" value={item.practical.openingHours} />
                  <DetailRow label="Type" value={item.practical.cuisine} />
                  <DetailRow label="Prijs" value={item.practical.pricing} />
                </div>
              </AppCard>
            </aside>
          </section>
        </div>
      </AppSection>
    </main>
  );
}
