"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  faqCategories,
  faqItems,
  type FaqCategoryIcon,
  type FaqCategorySlug,
} from "@/lib/faq";

type ActiveCategory = "alle" | FaqCategorySlug;

const tabOptions: Array<{ slug: ActiveCategory; label: string }> = [
  { slug: "alle", label: "Alle vragen" },
  ...faqCategories.map(({ slug, label }) => ({ slug, label })),
];

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("nl-NL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ArrowUpRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="10.75" cy="10.75" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m16 16 4.25 4.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CategoryIcon({ icon }: { icon: FaqCategoryIcon }) {
  const iconProps = {
    "aria-hidden": true,
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;

  switch (icon) {
    case "compass":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="m14.8 9.2-1.5 3.9-3.9 1.7 1.5-4 3.9-1.6Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...iconProps}>
          <path
            d="m12 3 1.25 4.75L18 9l-4.75 1.25L12 15l-1.25-4.75L6 9l4.75-1.25L12 3ZM18.5 14l.65 2.35L21.5 17l-2.35.65L18.5 20l-.65-2.35L15.5 17l2.35-.65L18.5 14Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg {...iconProps}>
          <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 3.5v4M16 3.5v4M4 9.5h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <path d="M8 13h.01M12 13h.01M16 13h.01M8 16h.01M12 16h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.1" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...iconProps}>
          <path
            d="M6.5 4.5A1.5 1.5 0 0 1 8 3h8a1.5 1.5 0 0 1 1.5 1.5V21L12 17.5 6.5 21V4.5Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case "user":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M5.5 20c.5-3.25 2.55-5 6.5-5s6 1.75 6.5 5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case "info":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 10.5v5.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="12" cy="7.4" r=".8" fill="currentColor" />
        </svg>
      );
  }
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-200 ${
        open
          ? "rotate-45 border-[#1d5a46] bg-[#1d5a46] text-white"
          : "border-[#d9ddd5] bg-[#f7f8f2] text-[#1d5a46]"
      }`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

export default function FaqPageClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("alle");
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const faqSectionRef = useRef<HTMLElement>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());

    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "alle" || item.category === activeCategory;
      const searchableText = normalizeText(`${item.question} ${item.answer}`);
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  useEffect(() => {
    if (
      openQuestionId &&
      !filteredItems.some((item) => item.id === openQuestionId)
    ) {
      setOpenQuestionId(null);
    }
  }, [filteredItems, openQuestionId]);

  function scrollToFaq() {
    requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      faqSectionRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function selectCategory(category: ActiveCategory, shouldScroll = false) {
    setActiveCategory(category);
    setOpenQuestionId(null);

    if (shouldScroll) scrollToFaq();
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabOptions.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabOptions.length) % tabOptions.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabOptions.length - 1;

    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextTab = tabOptions[nextIndex];
    selectCategory(nextTab.slug);
    tabsRef.current[nextIndex]?.focus();
  }

  function clearSearch() {
    setQuery("");
    setOpenQuestionId(null);
  }

  const resultLabel = filteredItems.length === 1 ? "antwoord" : "antwoorden";

  return (
    <main className="overflow-hidden bg-[#f7f5ec] text-[#202d29]">
      <section
        data-navbar-contrast="on-light"
        className="relative isolate overflow-hidden border-b border-[#dfe6d8] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[29rem] bg-[radial-gradient(circle_at_50%_0%,#e3f0c8_0%,rgba(227,240,200,0.62)_22%,rgba(247,245,236,0)_68%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-20 -z-10 h-72 w-72 rounded-full border border-[#a6c77c]/30 bg-[#e8f2d0]/35 blur-[1px] sm:-right-12 sm:top-24"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="mb-5 inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#557d5d]">
            <span aria-hidden="true" className="h-px w-7 bg-current" />
            Hulp bij je volgende plan
            <span aria-hidden="true" className="h-px w-7 bg-current" />
          </p>
          <h1 className="mx-auto max-w-[12ch] text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[#202d29]">
            Waar kunnen we je mee <span className="text-[#1d5a46] italic">helpen?</span>
          </h1>
          <p className="mt-6 max-w-[39rem] text-sm leading-7 text-[#65736c] sm:text-base sm:leading-8">
            Vind snel het juiste antwoord over ontdekken, plannen en bewaren in
            UitjesNL.
          </p>

          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              scrollToFaq();
            }}
            className="mt-8 flex w-full max-w-[44rem] flex-col gap-2 rounded-[1.6rem] border border-[#d8e1d4] bg-white/95 p-2 text-left shadow-[0_20px_45px_rgba(45,70,43,0.1)] backdrop-blur sm:flex-row sm:items-center sm:rounded-full sm:p-2.5"
          >
            <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-full px-3 sm:px-4">
              <SearchIcon className="h-5 w-5 shrink-0 text-[#557d5d]" />
              <label htmlFor="faq-search" className="sr-only">
                Zoek in vragen en antwoorden
              </label>
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Zoek in vragen en antwoorden"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base text-[#202d29] outline-none placeholder:text-[#8b958e]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Zoekopdracht wissen"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-[#637169] transition hover:bg-[#f1f5ec] hover:text-[#202d29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc]"
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : null}
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d5a46] px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(29,90,70,0.2)] transition hover:bg-[#164c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2 sm:w-auto sm:px-8"
            >
              Zoek
              <ArrowUpRightIcon />
            </button>
          </form>
          <p className="mt-4 text-xs font-medium text-[#718078]">
            Zoek op onderwerp, vraag of woord uit een antwoord.
          </p>
        </div>
      </section>

      <section
        data-navbar-contrast="on-light"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#557d5d]">
                Vind je weg
              </p>
              <h2 className="max-w-[16ch] text-[clamp(2.25rem,4.6vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#202d29]">
                Waar gaat je vraag over?
              </h2>
            </div>
            <p className="max-w-[28rem] text-sm leading-7 text-[#65736c] sm:text-right">
              Kies een onderwerp om meteen de bijbehorende antwoorden te zien.
              Je kunt daarna altijd verder zoeken.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {faqCategories.map((category) => {
              const active = activeCategory === category.slug;

              return (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectCategory(category.slug, true)}
                  className={`group flex min-h-[10rem] flex-col items-start justify-between rounded-[1.6rem] border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2 sm:p-6 ${
                    active
                      ? "border-[#1d5a46] bg-[#e8f2d0] shadow-[0_14px_30px_rgba(71,112,54,0.12)]"
                      : "border-[#dfe3dc] bg-white/70 hover:-translate-y-0.5 hover:border-[#a6c77c] hover:bg-white hover:shadow-[0_14px_30px_rgba(52,74,47,0.08)]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                      active
                        ? "bg-[#1d5a46] text-white"
                        : "bg-[#f0f5e9] text-[#1d5a46] group-hover:bg-[#e8f2d0]"
                    }`}
                  >
                    <CategoryIcon icon={category.icon} />
                  </span>
                  <span className="mt-8 block">
                    <span className="flex items-center gap-2 text-lg font-bold tracking-[-0.025em] text-[#202d29]">
                      {category.label}
                      <ArrowUpRightIcon className="h-4 w-4 text-[#557d5d] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-2 block max-w-[30ch] text-sm leading-6 text-[#65736c]">
                      {category.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="faq-vragen"
        ref={faqSectionRef}
        data-navbar-contrast="on-light"
        className="scroll-mt-6 border-y border-[#e2e5de] bg-[#fffdf8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#557d5d]">
                Veelgestelde vragen
              </p>
              <h2 className="max-w-[16ch] text-[clamp(2.25rem,4.6vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#202d29]">
                Antwoorden zonder omwegen.
              </h2>
            </div>
            <p
              aria-live="polite"
              className="text-sm font-semibold text-[#65736c] sm:pb-1"
            >
              {filteredItems.length} {resultLabel}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter FAQ op categorie"
            className="mt-9 flex max-w-full gap-2 overflow-x-auto rounded-[1.35rem] bg-[#f1f4ec] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabOptions.map((tab, index) => {
              const active = activeCategory === tab.slug;

              return (
                <button
                  key={tab.slug}
                  ref={(element) => {
                    tabsRef.current[index] = element;
                  }}
                  id={`faq-tab-${tab.slug}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="faq-list"
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectCategory(tab.slug)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2 ${
                    active
                      ? "bg-[#18343a] text-white shadow-[0_7px_15px_rgba(24,52,58,0.16)]"
                      : "text-[#557066] hover:bg-white hover:text-[#18343a]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            id="faq-list"
            role="tabpanel"
            aria-labelledby={`faq-tab-${activeCategory}`}
            className="mt-5"
          >
            {filteredItems.length > 0 ? (
              <div className="overflow-hidden rounded-[1.7rem] border border-[#dfe5db] bg-white shadow-[0_18px_42px_rgba(38,58,42,0.06)]">
                {filteredItems.map((item, index) => {
                  const open = openQuestionId === item.id;
                  const triggerId = `faq-question-${item.id}`;
                  const answerId = `faq-answer-${item.id}`;

                  return (
                    <article
                      key={item.id}
                      className={index > 0 ? "border-t border-[#e6e9e3]" : undefined}
                    >
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={open}
                        aria-controls={answerId}
                        onClick={() => setOpenQuestionId(open ? null : item.id)}
                        className="flex min-h-[4.75rem] w-full items-center justify-between gap-5 px-5 py-4 text-left text-[1rem] font-bold leading-6 tracking-[-0.018em] text-[#202d29] outline-none transition hover:bg-[#fbfcf8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005fcc] sm:px-7 sm:py-5 sm:text-[1.08rem]"
                      >
                        <span>{item.question}</span>
                        <PlusIcon open={open} />
                      </button>
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={triggerId}
                        className={open ? "block px-5 pb-6 sm:px-7" : "hidden"}
                      >
                        <p className="max-w-3xl border-l-2 border-[#c5df91] pl-4 text-sm leading-7 text-[#65736c] sm:pl-5 sm:text-base sm:leading-8">
                          {item.answer}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div
                role="status"
                className="rounded-[1.7rem] border border-[#dfe5db] bg-[#f8faf4] px-6 py-12 text-center shadow-[0_14px_34px_rgba(38,58,42,0.04)] sm:px-10"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f2d0] text-[#1d5a46]">
                  <SearchIcon className="h-5 w-5" />
                </span>
                <h3 className="mx-auto mt-5 max-w-[18ch] text-2xl font-semibold tracking-[-0.04em] text-[#202d29]">
                  Geen antwoord gevonden
                </h3>
                <p className="mx-auto mt-3 max-w-[32rem] text-sm leading-7 text-[#65736c] sm:text-base">
                  Probeer een andere zoekterm of neem contact met ons op.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#cbd9c0] bg-white px-5 text-sm font-bold text-[#1d5a46] transition hover:bg-[#f1f7e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2"
                  >
                    Wis zoekopdracht
                  </button>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1d5a46] px-5 text-sm font-bold text-white transition hover:bg-[#164c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2"
                  >
                    Neem contact op
                    <ArrowUpRightIcon />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5ec] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#557d5d]">
              Nog iets nodig?
            </p>
            <h2 className="max-w-[15ch] text-[clamp(2.25rem,4.6vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#202d29]">
              We denken graag met je mee.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            <CtaCard
              dark
              eyebrow="Vraag of probleem?"
              description="Kom je ergens niet uit of klopt er iets niet? Stuur ons een bericht, dan kijken we met je mee."
              href="/contact"
              label="Neem contact op"
            />
            <CtaCard
              eyebrow="Idee of feedback?"
              description="Heb je een suggestie voor UitjesNL? Deel je idee en help ons de app steeds beter te maken."
              href="/feedback"
              label="Geef feedback"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function CtaCard({
  dark = false,
  eyebrow,
  description,
  href,
  label,
}: {
  dark?: boolean;
  eyebrow: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <article
      className={`flex min-h-[20rem] flex-col justify-between rounded-[1.8rem] border p-6 sm:min-h-[22rem] sm:p-8 ${
        dark
          ? "border-[#18343a] bg-[#18343a] text-white shadow-[0_20px_42px_rgba(24,52,58,0.14)]"
          : "border-[#dfe3dc] bg-[#eef2e7] text-[#202d29]"
      }`}
    >
      <div>
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            dark ? "bg-[#e8f2d0] text-[#18343a]" : "bg-[#18343a] text-white"
          }`}
        >
          <ArrowUpRightIcon className="h-5 w-5" />
        </span>
        <h3
          className={`mt-10 max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.55rem)] font-semibold leading-[1] tracking-[-0.05em] ${
            dark ? "text-white" : "text-[#202d29]"
          }`}
        >
          {eyebrow}
        </h3>
        <p
          className={`mt-4 max-w-[34rem] text-sm leading-7 sm:text-base ${
            dark ? "text-white/70" : "text-[#65736c]"
          }`}
        >
          {description}
        </p>
      </div>
      <Link
        href={href}
        className={`mt-8 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2 sm:w-fit sm:min-w-[12rem] ${
          dark
            ? "bg-[#e8f2d0] text-[#18343a] hover:bg-[#f1f7df]"
            : "bg-[#18343a] text-white hover:bg-[#254d53]"
        }`}
      >
        {label}
        <ArrowUpRightIcon />
      </Link>
    </article>
  );
}
