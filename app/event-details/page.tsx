"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { ReactNode, RefObject } from "react";

type WeekendEvent = {
  id: string;
  label: string;
  title: string;
  location: string;
  date: string;
  price: string;
  image: string;
  featured?: boolean;
  tint: string;
};

type TodayEvent = {
  time: string;
  title: string;
  location: string;
  image: string;
  kind: string;
};

type Category = {
  title: string;
  kicker: string;
  href: string;
  image: string;
  className: string;
};

type UpcomingMoment = {
  month: string;
  date: string;
  title: string;
  location: string;
  image: string;
};

const weekendEvents: WeekendEvent[] = [
  {
    id: "strand",
    label: "Festival",
    title: "Festival STRAND",
    location: "Haarrijnse Plas · Utrecht",
    date: "28–29 aug. 2026",
    price: "Vanaf €29,50",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=88",
    featured: true,
    tint: "bg-[#d9e6d1]",
  },
  {
    id: "zeezout",
    label: "Dance",
    title: "ZeeZout Festival",
    location: "Tuinen van West · Amsterdam",
    date: "29 aug. 2026",
    price: "Vanaf €49,50",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#ede4d0]",
  },
  {
    id: "oude-muziek",
    label: "Muziek",
    title: "Festival Oude Muziek",
    location: "Binnenstad · Utrecht",
    date: "28 aug.–6 sep. 2026",
    price: "Vanaf €12,50",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#e3e2ef]",
  },
  {
    id: "ij-hallen",
    label: "Markt",
    title: "IJ-Hallen",
    location: "NDSM-werf · Amsterdam",
    date: "29–30 aug. 2026",
    price: "€6,50",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#eee1d4]",
  },
  {
    id: "south-east-jazz",
    label: "Jazz",
    title: "South East Jazz",
    location: "Zuidoost · Amsterdam",
    date: "29–30 aug. 2026",
    price: "Gratis",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#dfeadf]",
  },
];

const todayEvents: TodayEvent[] = [
  {
    time: "18:00",
    title: "Foodfestival aan de Kade",
    location: "Rotterdam · Leuvehoofd",
    kind: "Food",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=720&q=85",
  },
  {
    time: "19:30",
    title: "Openluchtconcert",
    location: "Utrecht · Ledig Erf",
    kind: "Live",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=720&q=85",
  },
  {
    time: "20:00",
    title: "Museumnacht Late",
    location: "Amsterdam · Museumplein",
    kind: "Kunst",
    image:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=720&q=85",
  },
  {
    time: "22:00",
    title: "Clubnacht aan het IJ",
    location: "Eindhoven · Effenaar",
    kind: "Nacht",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=720&q=85",
  },
];

const categories: Category[] = [
  {
    title: "Festivals",
    kicker: "Buitenlucht · live",
    href: "/festivals",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=88",
    className: "md:col-span-7 md:min-h-[25rem]",
  },
  {
    title: "Muziek & nightlife",
    kicker: "Tot laat · dichtbij",
    href: "/zoeken?q=muziek",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88",
    className: "md:col-span-5 md:min-h-[25rem]",
  },
  {
    title: "Kunst & cultuur",
    kicker: "Verhalen · ontdek",
    href: "/zoeken?q=kunst",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=88",
    className: "md:col-span-5 md:min-h-[25rem]",
  },
  {
    title: "Food & markets",
    kicker: "Proeven · rondstruinen",
    href: "/zoeken?q=food",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=88",
    className: "md:col-span-7 md:min-h-[25rem]",
  },
];

const upcomingMoments: UpcomingMoment[] = [
  {
    month: "September",
    date: "12–13 sep.",
    title: "Open Monumentendag",
    location: "Door heel Nederland",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=88",
  },
  {
    month: "September",
    date: "25 sep.–2 okt.",
    title: "Nederlands Film Festival",
    location: "Utrecht",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1100&q=88",
  },
  {
    month: "Oktober",
    date: "17–25 okt.",
    title: "Dutch Design Week",
    location: "Eindhoven",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=88",
  },
  {
    month: "Oktober",
    date: "21–25 okt.",
    title: "Amsterdam Dance Event",
    location: "Amsterdam",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1100&q=88",
  },
  {
    month: "November",
    date: "7 nov.",
    title: "Museumnacht Amsterdam",
    location: "Amsterdam · 19:00–02:00",
    image:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1100&q=88",
  },
  {
    month: "November",
    date: "26 nov.–17 jan.",
    title: "Amsterdam Light Festival",
    location: "Grachten · Amsterdam",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1100&q=88",
  },
];

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      {direction === "left" ? (
        <>
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h10" />
        </>
      ) : (
        <>
          <path d="M5 12h10" />
          <path d="m13 6 6 6-6 6" />
        </>
      )}
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M20 10.5c0 5.1-8 10.5-8 10.5S4 15.6 4 10.5a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
    </svg>
  );
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#6a7368]">
      <span className="text-[#a05c3a]">{number}</span>
      <span className="h-px w-8 bg-[#b8c1b4]" />
      {children}
    </p>
  );
}

function WeekendCard({ event }: { event: WeekendEvent }) {
  if (event.featured) {
    return (
      <Link
        href="#vandaag"
        className="group relative isolate col-span-12 flex min-h-[28rem] overflow-hidden rounded-[2rem] bg-[#c9d8c2] text-[#fdfcf7] shadow-[0_24px_60px_rgba(45,60,46,0.14)] md:col-span-7 md:row-span-2 md:min-h-[39rem]"
      >
        <Image
          src={event.image}
          alt="Festivalpubliek tijdens Festival STRAND"
          fill
          unoptimized
          priority
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,17,0.05)_22%,rgba(15,24,17,0.86)_100%)]" />
        <div className="relative mt-auto flex w-full flex-col gap-5 p-6 sm:p-8 lg:p-10">
          <span className="w-fit rounded-full border border-white/35 bg-white/12 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
            {event.label} · uitgelicht
          </span>
          <div>
            <h3 className="max-w-[9ch] text-[clamp(3.2rem,7vw,6.2rem)] font-medium leading-[0.84] tracking-[-0.065em] text-[#fdfcf7]">
              {event.title}
            </h3>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <PinIcon /> {event.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarIcon /> {event.date}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/25 pt-4 text-sm font-semibold">
            <span>{event.price}</span>
            <span className="inline-flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
              Bekijk event <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="#vandaag"
      className={`group relative isolate col-span-12 flex min-h-[17rem] overflow-hidden rounded-[1.7rem] ${event.tint} md:col-span-5 md:min-h-[18.5rem]`}
    >
      <Image
        src={event.image}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 40vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,12,0.02)_28%,rgba(10,16,12,0.76)_100%)]" />
      <div className="relative mt-auto w-full p-5 text-white sm:p-6">
        <p className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-white/75">
          {event.label}
        </p>
        <h3 className="mt-2 max-w-[14ch] text-[clamp(1.6rem,3vw,2.3rem)] font-medium leading-[0.96] tracking-[-0.05em]">
          {event.title}
        </h3>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/80">
          <span>{event.location}</span>
          <span className="shrink-0">{event.date}</span>
        </div>
      </div>
    </Link>
  );
}

function RailButton({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#bdc6b9] bg-[#f7f5ee] text-[#263329] transition hover:border-[#263329] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-2 active:scale-95"
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

function EventRail({ items, railRef }: { items: TodayEvent[]; railRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={railRef}
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Events van vandaag"
    >
      {items.map((event) => (
        <a
          href="#binnenkort"
          key={event.title}
          className="group flex min-w-[18.2rem] snap-start items-center gap-4 rounded-[1.4rem] border border-[#d2d6ca] bg-[#f9f8f3] p-3 transition hover:-translate-y-0.5 hover:border-[#a9b4a4] hover:shadow-[0_12px_28px_rgba(45,60,46,0.09)] sm:min-w-[22rem]"
        >
          <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[1rem] bg-[#d8dfd2]">
            <Image src={event.image} alt="" fill unoptimized sizes="88px" className="object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="min-w-0 py-1">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#a05c3a]">{event.time} · {event.kind}</p>
            <h3 className="mt-2 truncate text-base font-semibold tracking-[-0.03em] text-[#1f2a21]">{event.title}</h3>
            <p className="mt-1 truncate text-xs text-[#6f796d]">{event.location}</p>
          </div>
          <ArrowIcon />
        </a>
      ))}
    </div>
  );
}

function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className={`group relative isolate flex overflow-hidden rounded-[1.7rem] bg-[#dfe7d9] ${category.className}`}
    >
      <Image
        src={category.image}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 55vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,19,0.02)_22%,rgba(18,24,19,0.74)_100%)]" />
      <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 text-white sm:p-7">
        <div>
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-white/75">{category.kicker}</p>
          <h3 className="mt-2 text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.9] tracking-[-0.06em]">{category.title}</h3>
        </div>
        <span className="mb-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f3ec] text-[#203226] transition-transform duration-300 group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

function TimelineCard({ moment }: { moment: UpcomingMoment }) {
  return (
    <article className="relative min-w-[17.5rem] snap-start overflow-hidden rounded-[1.6rem] border border-[#d7d8cc] bg-[#fbfaf4]/95 shadow-[0_16px_38px_rgba(45,53,42,0.09)] backdrop-blur-sm sm:min-w-[20rem]">
      <div className="relative h-44 overflow-hidden">
        <Image src={moment.image} alt="" fill unoptimized sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,28,21,0.02),rgba(20,28,21,0.45))]" />
        <span className="absolute left-4 top-4 rounded-full bg-[#f6f3ec]/92 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#2f3c30]">{moment.month}</span>
      </div>
      <div className="p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#a05c3a]">{moment.date}</p>
        <h3 className="mt-3 text-[1.45rem] font-medium leading-[0.98] tracking-[-0.045em] text-[#1e2b21]">{moment.title}</h3>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#6d776b]"><PinIcon /> {moment.location}</p>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const todayRailRef = useRef<HTMLDivElement>(null);
  const timelineRailRef = useRef<HTMLDivElement>(null);

  function scrollRail(ref: RefObject<HTMLDivElement | null>, direction: "left" | "right") {
    const rail = ref.current;
    if (!rail) return;
    const amount = Math.min(440, Math.max(280, rail.clientWidth * 0.78));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction === "right" ? amount : -amount, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <main className="mt-24 min-h-screen overflow-x-clip bg-[#f6f3ec] text-[#1d2a20]">
      <section className="relative isolate overflow-hidden border-b border-[#d9ddd2] bg-[#dce8d7]" data-navbar-contrast="on-light" aria-labelledby="hero-title">
        <div aria-hidden="true" className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#f1c68f]/50 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-40 right-[-5rem] h-[28rem] w-[28rem] rounded-full bg-[#b7d2cc]/55 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-center lg:gap-16 lg:px-12 lg:pb-20 lg:pt-20">
          <div className="max-w-[38rem]">
            <div className="flex flex-wrap items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#536255]">
              <span className="rounded-full border border-[#91a78f] bg-[#edf4e9] px-3 py-1.5">Weekendguide</span>
              <span>28–30 augustus 2026</span>
            </div>
            <h1 id="hero-title" className="mt-7 max-w-[9ch] text-[clamp(4.1rem,9vw,8.6rem)] font-medium leading-[0.82] tracking-[-0.078em] text-[#203327]">
              Ga naar buiten.
            </h1>
            <p className="mt-7 max-w-[30rem] text-[clamp(1.08rem,1.7vw,1.35rem)] leading-[1.42] tracking-[-0.025em] text-[#4d5c4f]">
              De mooiste plannen van dit weekend, met zorg geselecteerd. Van live muziek aan het water tot nachten die je maandag nog voelt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#weekend" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#223629] px-5 py-3 text-sm font-semibold text-[#f8f7ef] shadow-[0_12px_28px_rgba(34,54,41,0.18)] transition hover:-translate-y-0.5 hover:bg-[#304938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#dce8d7]">
                Bekijk dit weekend <ArrowIcon />
              </a>
              <span className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[#5c6a5b]"><span className="h-2 w-2 rounded-full bg-[#b05f3a]" /> 5 redactionele tips</span>
            </div>
          </div>

          <div className="relative min-h-[29rem] overflow-hidden rounded-[2rem] bg-[#becdb9] shadow-[0_28px_65px_rgba(55,76,57,0.2)] sm:min-h-[36rem] lg:min-h-[42rem]">
            <Image
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=90"
              alt="Publiek bij een openluchtfestival in de avond"
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,25,17,0.04)_30%,rgba(13,25,17,0.75)_100%)]" />
            <div className="absolute left-5 top-5 rounded-full bg-[#f6f3ec]/90 px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.17em] text-[#2b3c2d] backdrop-blur sm:left-7 sm:top-7">Nu te zien · Utrecht</div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-[#fcfbf4] sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.19em] text-white/75">Hoofdhighlight</p>
                <p className="mt-2 max-w-[10ch] text-[clamp(2.25rem,4.8vw,4.7rem)] font-medium leading-[0.86] tracking-[-0.065em]">Festival STRAND</p>
              </div>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f6f3ec] text-[#24372a]"><ArrowIcon /></span>
            </div>
          </div>
        </div>
      </section>

      <section id="weekend" className="scroll-mt-24 border-b border-[#e0e1d8] bg-[#f6f3ec]" aria-labelledby="weekend-title">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <SectionLabel number="01">Dit weekend uitgelicht</SectionLabel>
              <h2 id="weekend-title" className="mt-6 max-w-[12ch] text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.86] tracking-[-0.07em] text-[#223327]">De events waar Nederland het over heeft.</h2>
            </div>
            <p className="max-w-[22rem] text-sm leading-6 text-[#697568] md:pb-1">Een redactionele selectie voor 28–30 augustus. Grote publiekstrekkers, kleine ontdekkingen en alles ertussenin.</p>
          </div>
          <div className="mt-12 grid grid-cols-12 gap-3 sm:mt-16 sm:gap-5">
            {weekendEvents.map((event) => <WeekendCard event={event} key={event.id} />)}
          </div>
        </div>
      </section>

      <section id="vandaag" className="scroll-mt-24 border-b border-[#dfe2d8] bg-[#e8ebe2]" aria-labelledby="today-title">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <SectionLabel number="02">Vandaag & vanavond</SectionLabel>
              <h2 id="today-title" className="mt-5 max-w-[11ch] text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[0.88] tracking-[-0.065em] text-[#223327]">Nog geen plannen?</h2>
              <p className="mt-4 max-w-[33rem] text-[15px] leading-7 text-[#687366]">Deze events zijn vandaag nog te bezoeken. Kies een tijd, pak je jas en ga.</p>
            </div>
            <div className="flex gap-2 self-start sm:self-auto">
              <RailButton label="Scroll vandaag terug" direction="left" onClick={() => scrollRail(todayRailRef, "left")} />
              <RailButton label="Scroll vandaag vooruit" direction="right" onClick={() => scrollRail(todayRailRef, "right")} />
            </div>
          </div>
          <div className="mt-9 border-t border-[#cbd2c5] pt-4 sm:mt-12">
            <EventRail items={todayEvents} railRef={todayRailRef} />
          </div>
        </div>
      </section>

      <section className="border-b border-[#dfe1d7] bg-[#f6f3ec]" aria-labelledby="category-title">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="max-w-[48rem]">
            <SectionLabel number="03">Kies je sfeer</SectionLabel>
            <h2 id="category-title" className="mt-6 max-w-[10ch] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.84] tracking-[-0.073em] text-[#223327]">Waar heb je zin in?</h2>
            <p className="mt-5 max-w-[31rem] text-[15px] leading-7 text-[#697568]">Vier manieren om je agenda te vullen. Van dansvloer tot museumzaal, altijd met iets om naar uit te kijken.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:mt-16 md:grid-cols-12 md:gap-5">
            {categories.map((category) => <CategoryTile category={category} key={category.title} />)}
          </div>
        </div>
      </section>

      <section id="binnenkort" className="relative isolate overflow-hidden bg-[#dfe8d7]" aria-labelledby="upcoming-title">
        <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[#dce7d8]" />
        <video className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.3] mix-blend-multiply motion-reduce:hidden" autoPlay loop muted playsInline preload="metadata" poster="/videos/year-round-adventure-calendar-hero-poster.jpg" aria-hidden="true">
          <source src="/videos/year-round-adventure-calendar-hero.mp4" type="video/mp4" />
        </video>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(237,242,229,0.78)_0%,rgba(225,235,219,0.76)_55%,rgba(214,228,210,0.88)_100%)]" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionLabel number="04">Binnenkort</SectionLabel>
              <h2 id="upcoming-title" className="mt-6 max-w-[11ch] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.84] tracking-[-0.073em] text-[#203327]">Zet deze alvast in je agenda.</h2>
            </div>
            <p className="max-w-[25rem] text-sm leading-6 text-[#5e6d5e] md:pb-1">Een horizontale reis door de komende maanden. Sla een datum op en laat de voorpret beginnen.</p>
          </div>
          <div className="relative mt-12 sm:mt-16">
            <div aria-hidden="true" className="absolute left-0 right-0 top-6 hidden h-px bg-[#aabca8] sm:block" />
            <div ref={timelineRailRef} className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {upcomingMoments.map((moment, index) => (
                <div className="relative snap-start" key={`${moment.title}-${index}`}>
                  <div className="relative z-10 mb-5 ml-5 h-3 w-3 rounded-full border-2 border-[#dfe8d7] bg-[#a05c3a] shadow-[0_0_0_4px_rgba(160,92,58,0.16)] sm:ml-7" />
                  <TimelineCard moment={moment} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between gap-4 sm:mt-7">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#637062]">Scroll om verder te reizen →</p>
              <div className="flex gap-2">
                <RailButton label="Scroll agenda terug" direction="left" onClick={() => scrollRail(timelineRailRef, "left")} />
                <RailButton label="Scroll agenda vooruit" direction="right" onClick={() => scrollRail(timelineRailRef, "right")} />
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-[#b9c9b4] pt-6 sm:mt-20 sm:flex-row sm:items-center">
            <p className="max-w-[25rem] text-sm leading-6 text-[#5d6d5d]">Alles bij elkaar in één overzicht, zodat je nooit meer hoeft te zoeken naar je volgende vrije dag.</p>
            <Link href="/jaarkalender" className="group inline-flex items-center gap-3 text-sm font-bold text-[#203327] underline decoration-[#a05c3a] decoration-2 underline-offset-8 transition hover:text-[#a05c3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#dfe8d7]">Bekijk de volledige jaarkalender <span className="transition-transform duration-300 group-hover:translate-x-1"><ArrowIcon /></span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
