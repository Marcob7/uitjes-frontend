import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import FestivalViewToggle from "@/components/FestivalViewToggle";
import { optimizeCssBackground } from "@/lib/remoteImage";
import { festivalDetails, getFestivalDetailHref } from "../data";

type MapFestivalCard = {
  slug: string;
  indexLabel: string;
  title: string;
  dateLabel: string;
  venueLabel: string;
  matchLabel: string;
  genres: string[];
  image: string;
  pointX: string;
  pointY: string;
  calloutLabel: string;
  accent: "lime" | "amber" | "lavender";
};

const mapFestivals: MapFestivalCard[] = [
  {
    slug: "dekmantel-festival",
    indexLabel: "01",
    title: "Dekmantel Festival",
    dateLabel: "02 Aug - 04 Aug",
    venueLabel: "Amsterdamse Bos",
    matchLabel: "98% Match",
    genres: ["Electronic", "Underground"],
    image: festivalDetails[0].heroImage,
    pointX: "58%",
    pointY: "36%",
    calloutLabel: "Dekmantel",
    accent: "lime",
  },
  {
    slug: "lowlands",
    indexLabel: "02",
    title: "Lowlands '24",
    dateLabel: "16 Aug - 18 Aug",
    venueLabel: "Biddinghuizen",
    matchLabel: "85% Match",
    genres: ["Multi-genre", "Art"],
    image: festivalDetails[1].heroImage,
    pointX: "66%",
    pointY: "49%",
    calloutLabel: "Lowlands",
    accent: "amber",
  },
  {
    slug: "north-sea-jazz",
    indexLabel: "03",
    title: "North Sea Jazz",
    dateLabel: "12 Jul - 14 Jul",
    venueLabel: "Rotterdam Ahoy",
    matchLabel: "92% Match",
    genres: ["Jazz", "Soul"],
    image: festivalDetails[2].heroImage,
    pointX: "50%",
    pointY: "64%",
    calloutLabel: "North Sea Jazz",
    accent: "lavender",
  },
];

function MapBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-11 items-center rounded-full border border-white/80 bg-white/86 px-6 text-sm font-semibold text-[#3f382f] shadow-[0_10px_18px_rgba(44,42,37,0.06)] backdrop-blur-md">
      {children}
    </span>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12.667 8H3.333M7.333 12 3.333 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 4 12.667 8l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3.333v9.334M3.333 8h9.334"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocateIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.667v2M8 12.333v2M1.667 8h2M12.333 8h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NetherlandsShape() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 700 980"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M468 90c35 10 71 30 100 57 23 21 41 51 43 84 3 32-7 59-22 85-17 31-21 67-14 101 8 37 29 68 49 100 17 27 27 57 25 89-2 36-20 66-37 96-22 38-32 79-30 123 1 31-3 60-19 87-14 23-38 37-64 44-26 7-50 15-74 29-36 20-73 43-115 48-28 4-57-4-83-15-32-13-61-31-95-39-30-7-62-7-87-27-21-17-29-46-34-72-7-37-11-76-31-109-17-29-43-49-64-75-24-30-44-64-48-103-6-57 20-108 39-159 13-33 22-69 19-105-3-35-17-67-25-100-8-34-11-71 3-103 14-31 43-54 72-71 30-18 63-30 88-55 28-29 48-66 84-86 34-19 76-15 113-14 36 1 73-4 108 5Z"
        fill="#f4ddd0"
        stroke="#9dc5ca"
        strokeWidth="6"
      />
      <path
        d="M420 210c18 14 30 33 46 48 18 18 43 29 57 51 13 21 8 47 15 70 8 24 28 43 33 68 5 24-5 48-13 71-10 28-16 57-25 85-9 27-23 55-47 72-27 18-61 18-92 15-33-4-68-9-99 2-29 11-52 34-81 46-29 12-64 11-89-9-21-17-27-47-40-70-14-25-39-42-51-67-12-27-9-58-2-86 9-33 31-62 37-96 5-30-4-62 5-91 10-30 37-51 65-65 34-17 71-16 107-12 30 4 60 12 89 18 30 6 61 9 86 25Z"
        stroke="#9dc5ca"
        strokeWidth="4"
        opacity="0.6"
      />
      <path
        d="M265 780c26 2 49 14 73 24 23 10 48 17 73 18 27 1 54-5 79-15 24-10 44-28 68-39 15-7 31-12 47-16-18 21-42 36-69 44-26 7-50 15-74 29-36 20-73 43-115 48-28 4-57-4-83-15-32-13-61-31-95-39-30-7-62-7-87-27-12-9-20-22-25-37 15 12 33 20 52 23 50 9 102-3 156 2Z"
        fill="#ebd1c2"
      />
      <path
        d="M155 865c20 7 40 18 52 36 11 16 12 37 5 55-7 19-22 34-39 45-16 11-35 17-53 25-18 7-34 18-44 35-10 16-15 37-5 54-18-7-31-24-40-41-18-36-23-81-10-120 11-31 34-57 62-73 23-12 49-18 72-16Z"
        fill="#f4ddd0"
        stroke="#9dc5ca"
        strokeWidth="5"
      />
    </svg>
  );
}

function Marker({
  item,
}: {
  item: MapFestivalCard;
}) {
  const badgeClass =
    item.accent === "lime"
      ? "bg-[#e8f2d0] text-[#3d5d1d]"
      : item.accent === "amber"
        ? "bg-[#ffe7b4] text-[#704800]"
        : "bg-[#e6e2ff] text-[#45318f]";

  const dotClass =
    item.accent === "lime"
      ? "bg-[#b2dd64]"
      : item.accent === "amber"
        ? "bg-[#f0b34d]"
        : "bg-[#a39cf6]";

  return (
    <div className="absolute" style={{ left: item.pointX, top: item.pointY }}>
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#171511] text-lg font-semibold text-white shadow-[0_16px_26px_rgba(26,22,17,0.16)]">
            {item.indexLabel}
          </span>
          <span className="rounded-full border border-white/70 bg-white/86 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3b332c] shadow-[0_8px_18px_rgba(26,22,17,0.08)] backdrop-blur-xl">
            {item.calloutLabel}
          </span>
          <span className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClass} opacity-70 blur-[1px]`} />
        </div>
        <div
          className="absolute left-[10rem] top-[-4rem] w-[28rem] rounded-[2rem] border border-white/80 bg-white/88 p-4 shadow-[0_22px_50px_rgba(27,21,15,0.14)] backdrop-blur-xl"
          style={{
            transform:
              item.slug === "dekmantel-festival"
                ? "translateY(-4%)"
                : item.slug === "lowlands"
                  ? "translateY(-2%)"
                  : "translateY(4%)",
          }}
        >
          <div className="flex gap-4">
            <div
              className="h-28 w-28 shrink-0 overflow-hidden rounded-[1.8rem] bg-[#171511]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.08), rgba(8,8,8,0.4)), ${optimizeCssBackground(
                  item.image,
                  {
                    width: 360,
                    quality: 56,
                  }
                )}`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b6f64]">
                <span>{item.dateLabel}</span>
                <span className={`rounded-full px-3 py-1 ${badgeClass}`}>
                  {item.matchLabel}
                </span>
              </div>

              <h2 className="mt-3 max-w-none text-[2rem] leading-[0.96] tracking-[-0.05em] text-[#171511]">
                {item.title}
              </h2>
              <p className="mt-2 text-[1.05rem] text-[#665c51]">{item.venueLabel}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span
                    key={`${item.slug}-${genre}`}
                    className="rounded-full border border-[#e5dbcf] bg-white/86 px-3 py-1 text-[11px] font-medium text-[#3f382f]"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <Link
                href={getFestivalDetailHref(item.slug)}
                className="mt-4 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-[#171511] transition hover:text-[#4f7628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7628]"
              >
                Bekijk festival
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FestivalsMapPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Kaart" },
          ]}
          className="mb-6"
        />

        <section className="uitjes-liquid-section mb-6 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-12">
          <div className="pointer-events-none absolute -right-12 top-8 h-48 w-48 rounded-full bg-[#ffb84d]/18 blur-3xl" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[42rem]">
              <div className="inline-flex rounded-full border border-white/24 bg-white/14 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl">
                Festivalkaart
              </div>
              <h1 className="mt-6 max-w-[11ch] text-[clamp(3.2rem,8vw,5.7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                Vind festivals op de kaart
              </h1>
              <p className="mt-6 max-w-[34rem] text-base leading-8 text-white/88 sm:text-lg">
                Scan Nederland op sfeer, locatie en match. De kaart blijft rustig,
                zodat de festivalpunten zelf het werk doen.
              </p>
            </div>

            <FestivalViewToggle currentView="map" />
          </div>
        </section>

        <section className="mb-6 md:hidden">

          <div className="mt-5 space-y-4">
            {mapFestivals.map((item) => (
              <Link
                key={item.slug}
                href={getFestivalDetailHref(item.slug)}
                className="block overflow-hidden rounded-[2rem] border border-white/80 bg-white/82 shadow-[0_18px_36px_rgba(45,37,28,0.08)] backdrop-blur-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9cc84e]"
              >
                <div
                  className="min-h-[12rem] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.12), rgba(8,8,8,0.5)), ${optimizeCssBackground(
                      item.image,
                      {
                        width: 960,
                        quality: 56,
                      }
                    )}`,
                  }}
                />
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b6f64]">
                        {item.dateLabel}
                      </p>
                      <h2 className="mt-2 text-[1.7rem] leading-[0.98] tracking-[-0.05em] text-[#171511]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm text-[#665c51]">{item.venueLabel}</p>
                    </div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#171511] text-sm font-semibold text-white">
                      {item.indexLabel}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-2xl border border-[#e5dbcf] bg-white/86 px-3 py-2 text-xs font-medium text-[#3f382f]">
                      {item.matchLabel}
                    </span>
                    {item.genres.map((genre) => (
                      <span
                        key={`${item.slug}-${genre}`}
                        className="rounded-2xl border border-[#e5dbcf] bg-white/80 px-3 py-2 text-xs font-medium text-[#3f382f]"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="hidden overflow-hidden rounded-[2.4rem] border border-white/70 bg-[#c2d7d9] shadow-[0_30px_70px_rgba(45,37,28,0.08)] md:block">
          <div className="relative min-h-[72rem] overflow-hidden lg:min-h-[76rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.38),_transparent_34%),radial-gradient(circle_at_85%_18%,_rgba(255,255,255,0.24),_transparent_28%)]" />

            <div className="absolute right-8 top-8 z-20 flex flex-wrap gap-3">
              <MapBadge>
                <span className="mr-3 inline-flex h-2.5 w-2.5 rounded-full bg-[#6c8c2d]" />
                Trending Now
              </MapBadge>
              <MapBadge>Summer '24</MapBadge>
              <MapBadge>Eco-friendly</MapBadge>
            </div>

            <div className="absolute inset-[4%_8%_8%_8%]">
              <NetherlandsShape />
            </div>

            {mapFestivals.map((item) => (
              <Marker key={item.slug} item={item} />
            ))}

            <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-3">
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/86 text-[#171511] shadow-[0_14px_24px_rgba(24,21,18,0.12)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7628]"
                aria-label="Zoom in"
              >
                <PlusIcon />
              </button>
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/86 text-[#171511] shadow-[0_14px_24px_rgba(24,21,18,0.12)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7628]"
                aria-label="Zoom out"
              >
                <MinusIcon />
              </button>
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#171511] text-white shadow-[0_14px_24px_rgba(24,21,18,0.16)] transition hover:bg-[#2a241d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7628]"
                aria-label="Center map"
              >
                <LocateIcon />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
