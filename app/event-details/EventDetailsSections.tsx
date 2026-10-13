import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getRelativeEventLabel } from "@/lib/eventDateLabels";

import { ArrowIcon, CalendarIcon, PinIcon } from "./EventDetailsIcons";
import type { Category, TodayEvent, WeekendEvent } from "./eventDetailsData";

type Direction = "left" | "right";

function RailButton({ label, direction, onClick }: { label: string; direction: Direction; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#bdc6b9] bg-[#f7f5ee] text-[#263329] transition hover:border-[#263329] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-2 active:scale-95"><ArrowIcon direction={direction} /></button>;
}

function WeekendCard({ event, now }: { event: WeekendEvent; now?: Date }) {
  const { locale, t } = useLocale();
  const dateLabel = getRelativeEventLabel(event, now, locale);

  if (event.featured) {
    return <Link href="#events" className="group relative isolate col-span-12 flex min-h-[28rem] overflow-hidden rounded-[2rem] bg-[#c9d8c2] text-[#fdfcf7] shadow-[0_24px_60px_rgba(45,60,46,0.14)] md:col-span-7 md:row-span-2 md:min-h-[39rem]">
      <Image src={event.image} alt={t("events.featuredImageAlt")} fill unoptimized priority sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,17,0.05)_22%,rgba(15,24,17,0.86)_100%)]" />
      <div className="relative mt-auto flex w-full flex-col gap-5 p-6 sm:p-8 lg:p-10">
        <span className="text-sm font-medium leading-5 tracking-normal text-white/90">{event.label} · {t("events.featured")}</span>
        <div><h3 className="max-w-[9ch] text-[clamp(3.2rem,7vw,6.2rem)] font-medium leading-[0.84] tracking-[-0.065em] text-[#fdfcf7]">{event.title}</h3><div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80"><span className="inline-flex items-center gap-2"><PinIcon /> {event.location}</span><span className="inline-flex items-center gap-2"><CalendarIcon /> {dateLabel}</span></div></div>
        <div className="flex items-center justify-between border-t border-white/25 pt-4 text-sm font-semibold"><span>{event.price}</span><span className="inline-flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">{t("events.viewEvent")} <ArrowIcon /></span></div>
      </div>
    </Link>;
  }

  return <Link href="#events" className={`group relative isolate col-span-12 flex min-h-[17rem] overflow-hidden rounded-[1.7rem] ${event.tint} md:col-span-5 md:min-h-[18.5rem]`}>
    <Image src={event.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,12,0.02)_28%,rgba(10,16,12,0.76)_100%)]" />
    <div className="relative mt-auto w-full p-5 text-white sm:p-6"><p className="text-sm font-medium leading-5 tracking-normal text-white/85">{event.label}</p><h3 className="mt-2 max-w-[14ch] text-[clamp(1.6rem,3vw,2.3rem)] font-medium leading-[0.96] tracking-[-0.05em]">{event.title}</h3><div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/80"><span>{event.location}</span><span className="shrink-0">{dateLabel}</span></div></div>
  </Link>;
}

export function EventDetailsWeekendSection({ events, now, guideDateLabel, guideIsThisWeekend }: { events: WeekendEvent[]; now?: Date; guideDateLabel: string; guideIsThisWeekend: boolean }) {
  const { locale, t } = useLocale();
  return <section id="weekend" className="scroll-mt-24 border-b border-[#e0e1d8] bg-[#f6f3ec]" aria-labelledby="weekend-title"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><h2 id="weekend-title" className="mt-6 max-w-[12ch] text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.86] tracking-[-0.07em] text-[#223327]">{guideIsThisWeekend ? t("events.weekendTitle") : t("events.featuredTitle")}</h2></div><p className="max-w-[22rem] text-sm leading-6 text-[#697568] md:pb-1">{t("events.weekendIntro", { date: guideDateLabel.toLocaleLowerCase(locale) })}</p></div><div className="mt-12 grid grid-cols-12 gap-3 sm:mt-16 sm:gap-5">{events.map((event) => <WeekendCard event={event} key={event.id} now={now} />)}</div></div></section>;
}

export function EventDetailsTodaySection({ items, railRef, onScroll }: { items: TodayEvent[]; railRef: RefObject<HTMLDivElement | null>; onScroll: (direction: Direction) => void }) {
  const { t } = useLocale();
  return <section id="events" className="scroll-mt-24 border-b border-[#dfe2d8] bg-[#e8ebe2]" aria-labelledby="today-title"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><h2 id="today-title" className="mt-5 max-w-[11ch] text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[0.88] tracking-[-0.065em] text-[#223327]">{t("events.todayTitle")}</h2><p className="mt-4 max-w-[33rem] text-[15px] leading-7 text-[#687366]">{t("events.todayIntro")}</p></div><div className="flex gap-2 self-start sm:self-auto"><RailButton label={t("events.scrollEventsPrevious")} direction="left" onClick={() => onScroll("left")} /><RailButton label={t("events.scrollEventsNext")} direction="right" onClick={() => onScroll("right")} /></div></div><div className="mt-9 border-t border-[#cbd2c5] pt-4 sm:mt-12"><div ref={railRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={t("events.featuredEvents")}>{items.map((event) => <a href="#binnenkort" key={event.title} className="group flex min-w-[18.2rem] snap-start items-center gap-4 rounded-[1.4rem] border border-[#d2d6ca] bg-[#f9f8f3] p-3 transition hover:-translate-y-0.5 hover:border-[#a9b4a4] hover:shadow-[0_12px_28px_rgba(45,60,46,0.09)] sm:min-w-[22rem]"><div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[1rem] bg-[#d8dfd2]"><Image src={event.image} alt="" fill unoptimized sizes="88px" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="min-w-0 py-1"><p className="truncate text-sm font-medium leading-5 tracking-normal text-[#a05c3a]">{event.time} · {event.kind}</p><h3 className="mt-2 truncate text-base font-semibold tracking-[-0.03em] text-[#1f2a21]">{event.title}</h3><p className="mt-1 truncate text-xs text-[#6f796d]">{event.location}</p></div><ArrowIcon /></a>)}</div></div></div></section>;
}

function CategoryTile({ category }: { category: Category }) {
  return <Link href={category.href} className={`group relative isolate flex overflow-hidden rounded-[1.7rem] bg-[#dfe7d9] ${category.className}`}><Image src={category.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,19,0.02)_22%,rgba(18,24,19,0.74)_100%)]" /><div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 text-white sm:p-7"><div><p className="text-sm font-medium leading-5 tracking-normal text-white/85">{category.kicker}</p><h3 className="mt-2 text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.9] tracking-[-0.06em]">{category.title}</h3></div><span className="mb-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f3ec] text-[#203226] transition-transform duration-300 group-hover:translate-x-1"><ArrowIcon /></span></div></Link>;
}

export function EventDetailsCategoriesSection({ categories }: { categories: Category[] }) {
  const { t } = useLocale();
  return <section className="border-b border-[#dfe1d7] bg-[#f6f3ec]" aria-labelledby="category-title"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"><div className="max-w-[48rem]"><h2 id="category-title" className="mt-6 max-w-[10ch] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.84] tracking-[-0.073em] text-[#223327]">{t("events.categoryTitle")}</h2><p className="mt-5 max-w-[31rem] text-[15px] leading-7 text-[#697568]">{t("events.categoryIntro")}</p></div><div className="mt-12 grid gap-3 sm:mt-16 md:grid-cols-12 md:gap-5">{categories.map((category) => <CategoryTile category={category} key={category.title} />)}</div></div></section>;
}
