import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getRelativeEventLabel } from "@/lib/eventDateLabels";

import { EventDetailsActions } from "./EventDetailsActions";
import { ArrowIcon, PinIcon } from "./EventDetailsIcons";
import { EventDetailsRailButton, type EventDetailsRailDirection } from "./EventDetailsRailButton";
import { getUpcomingMomentCalendar, type UpcomingMoment } from "./eventDetailsData";

type EventDetailsTimelineProps = {
  moments: UpcomingMoment[];
  now?: Date;
  railRef: RefObject<HTMLDivElement | null>;
  onScroll: (direction: EventDetailsRailDirection) => void;
};

function TimelineCard({ moment, now }: { moment: UpcomingMoment; now?: Date }) {
  const { locale } = useLocale();
  const dateLabel = getRelativeEventLabel(moment, now, locale);
  const calendar = getUpcomingMomentCalendar(moment);

  return (
    <article className="relative min-w-[17.5rem] snap-start overflow-hidden rounded-[1.6rem] border border-[#d7d8cc] bg-[#fbfaf4]/95 shadow-[0_16px_38px_rgba(45,53,42,0.09)] backdrop-blur-sm sm:min-w-[20rem]">
      <div className="relative h-44 overflow-hidden">
        <Image src={moment.image} alt="" fill unoptimized sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,28,21,0.02),rgba(20,28,21,0.45))]" />
      </div>
      <div className="p-5">
        <p className="text-sm font-medium leading-5 tracking-normal text-[#a05c3a]">{dateLabel}</p>
        <h3 className="mt-3 text-[1.45rem] font-medium leading-[0.98] tracking-[-0.045em] text-[#1e2b21]">{moment.title}</h3>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#6d776b]"><PinIcon /> {moment.location}</p>
        {calendar ? <EventDetailsActions calendar={calendar} title={moment.title} /> : null}
      </div>
    </article>
  );
}

export function EventDetailsTimeline({
  moments,
  now,
  railRef,
  onScroll,
}: EventDetailsTimelineProps) {
  const { t } = useLocale();

  return (
    <section id="binnenkort" className="relative isolate overflow-hidden bg-[#dfe8d7]" aria-labelledby="upcoming-title">
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[#dce7d8]" />
      <video className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.3] mix-blend-multiply motion-reduce:hidden" autoPlay loop muted playsInline preload="metadata" poster="/videos/year-round-adventure-calendar-hero-poster.jpg" aria-hidden="true">
        <source src="/videos/year-round-adventure-calendar-hero.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(237,242,229,0.78)_0%,rgba(225,235,219,0.76)_55%,rgba(214,228,210,0.88)_100%)]" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><h2 id="upcoming-title" className="mt-6 max-w-[11ch] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.84] tracking-[-0.073em] text-[#203327]">{t("events.upcomingTitle")}</h2></div>
          <p className="max-w-[25rem] text-sm leading-6 text-[#5e6d5e] md:pb-1">{t("events.upcomingIntro")}</p>
        </div>
        <div className="relative mt-12 sm:mt-16">
          <div ref={railRef} className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-8"><div className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-[#aabca8] sm:block" /></div>
            {moments.map((moment, index) => (
              <div className="relative snap-start" key={`${moment.title}-${index}`}>
                <div className="relative h-8"><div className="absolute left-5 top-1/2 z-10 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#dfe8d7] bg-[#a05c3a] shadow-[0_0_0_4px_rgba(160,92,58,0.16)] sm:left-7" /></div>
                <TimelineCard moment={moment} now={now} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between gap-4 sm:mt-7"><div className="flex gap-2">
            <EventDetailsRailButton label={t("events.scrollCalendarPrevious")} direction="left" onClick={() => onScroll("left")} />
            <EventDetailsRailButton label={t("events.scrollCalendarNext")} direction="right" onClick={() => onScroll("right")} />
          </div></div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-[#b9c9b4] pt-6 sm:mt-20 sm:flex-row sm:items-center">
          <p className="max-w-[25rem] text-sm leading-6 text-[#5d6d5d]">{t("events.calendarOutro")}</p>
          <Link href="/jaarkalender" className="group inline-flex items-center gap-3 text-sm font-bold text-[#203327] underline decoration-[#a05c3a] decoration-2 underline-offset-8 transition hover:text-[#a05c3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#dfe8d7]">{t("events.viewYearCalendar")} <span className="transition-transform duration-300 group-hover:translate-x-1"><ArrowIcon /></span></Link>
        </div>
      </div>
    </section>
  );
}
