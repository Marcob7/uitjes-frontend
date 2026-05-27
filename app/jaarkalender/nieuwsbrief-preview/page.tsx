import Link from "next/link";
import type { ReactNode } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import { buildEventsNewsletterPreview } from "@/lib/eventsNewsletterPreview";
import {
  getJaarkalenderEventEntriesForDay,
  getJaarkalenderEventHref,
  getJaarkalenderDayByNumber,
} from "../data";

const previewDay = getJaarkalenderDayByNumber(10);
const selectedEvents = previewDay
  ? getJaarkalenderEventEntriesForDay(previewDay).slice(0, 5).map((entry) => ({
      title: entry.card.title,
      dateLabel: `${entry.day.weekdayDisplay} ${entry.day.dayNumber} ${entry.day.monthDisplay} ${entry.day.year}`,
      time: entry.slot.time,
      location: entry.card.location,
      venue: entry.card.venue,
      category: entry.card.category,
      description: entry.card.description,
      href: getJaarkalenderEventHref(entry.day.slug, entry.eventSlug),
    }))
  : [];

const preview = buildEventsNewsletterPreview(selectedEvents);
const emptyPreview = buildEventsNewsletterPreview([]);

function PreviewBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-[#e4dccf] bg-white/76 p-5 shadow-[0_18px_36px_rgba(45,37,28,0.06)]">
      <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#171511]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function EventsNewsletterPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1040px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Jaarkalender", href: "/jaarkalender" },
            { label: "Nieuwsbrief preview" },
          ]}
          className="mb-6"
        />

        <div className="max-w-[44rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#817466]">
            Dev preview
          </p>
          <h1 className="mt-3 text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
            Jaarkalender nieuwsbrief
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#665d54] sm:text-base">
            Deze pagina toont alleen samengestelde nieuwsbriefcontent uit de
            bestaande frontend jaarkalenderdata. Er wordt niets verzonden en er
            is geen mailprovider gekoppeld.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <PreviewBlock title="Samengestelde preview">
            <div className="rounded-2xl border border-[#e8e0d4] bg-[#fffaf3] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f725f]">
                Onderwerp
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {preview.subject}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e8e0d4] bg-white p-5">
              <p className="text-sm leading-7 text-[#4f463d]">{preview.intro}</p>

              <div className="mt-5 space-y-4">
                {preview.events.map((event) => (
                  <article
                    key={`${event.title}-${event.href}`}
                    className="border-t border-[#ebe3d8] pt-4 first:border-t-0 first:pt-0"
                  >
                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em]">
                      {event.title}
                    </h3>
                    {event.dateTimeLabel ||
                    event.locationLabel ||
                    event.categoryLabel ? (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7f725f]">
                        {[
                          event.dateTimeLabel,
                          event.locationLabel,
                          event.categoryLabel,
                        ]
                          .filter(Boolean)
                          .join(" - ")}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-7 text-[#5d5145]">
                      {event.description}
                    </p>
                    <Link
                      href={event.href}
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-[#171511] px-4 text-sm font-semibold text-white transition hover:bg-[#2d281f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
                    >
                      {event.ctaLabel}
                    </Link>
                  </article>
                ))}
              </div>

              <p className="mt-6 border-t border-[#ebe3d8] pt-5 text-sm leading-7 text-[#4f463d]">
                {preview.closing}
              </p>
            </div>
          </PreviewBlock>

          <div className="space-y-5">
            <PreviewBlock title="Plain text">
              <pre className="max-h-[38rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-[#171511] p-4 text-xs leading-6 text-[#fff7eb]">
                {preview.plainText}
              </pre>
            </PreviewBlock>

            <PreviewBlock title="Lege data fallback">
              <p className="text-sm leading-7 text-[#5d5145]">
                {emptyPreview.intro}
              </p>
              <p className="mt-3 text-sm font-semibold text-[#171511]">
                {emptyPreview.subject}
              </p>
            </PreviewBlock>
          </div>
        </div>
      </div>
    </main>
  );
}
