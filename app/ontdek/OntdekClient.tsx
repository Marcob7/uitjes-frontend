"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthBlock from "@/components/AuthBlock";
import EventList from "@/components/EventList";
import OntdekHeader from "@/components/OntdekHeader";
import type { EventItem } from "@/components/EventCard";
import { apiGet } from "@/lib/api";

type EventsResponse =
  | EventItem[]
  | {
      results?: EventItem[];
      has_more?: boolean;
    };

const LIMIT = 20;
const CITY_OPTIONS = [
  { label: "Apeldoorn", value: "apeldoorn" },
  { label: "Deventer", value: "deventer" },
  { label: "Arnhem", value: "arnhem" },
];

function useDebouncedValue(value: string, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debounced;
}

export default function OntdekClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const city = searchParams.get("city") || "apeldoorn";
  const free = searchParams.get("free") || "0";
  const when = searchParams.get("when") || "";
  const qFromUrl = searchParams.get("q") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const ongoing = searchParams.get("ongoing") || "";

  const [q, setQ] = useState(qFromUrl);
  const debouncedQ = useDebouncedValue(q, 350);

  useEffect(() => {
    setQ(qFromUrl);
  }, [qFromUrl]);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const cityLabel = CITY_OPTIONS.find((option) => option.value === city)?.label ?? city;
  const whenLabel =
    when === "tonight" ? "Vanavond" : when === "weekend" ? "Dit weekend" : "Altijd";
  const ongoingDisabled = when === "tonight" || when === "weekend" || Boolean(from) || Boolean(to);
  const activeFilterCount = [free === "1", Boolean(when), Boolean(qFromUrl.trim()), Boolean(from), Boolean(to), Boolean(ongoing)].filter(Boolean).length;

  function updateParam(key: string, value: string | null | undefined) {
    const next = new URLSearchParams(searchParams.toString());

    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, String(value));

    const queryString = next.toString();
    router.replace(queryString ? `/ontdek?${queryString}` : "/ontdek");
  }

  function resetFilters() {
    router.push("/ontdek?city=apeldoorn");
  }

  useEffect(() => {
    if ((debouncedQ || "") === (qFromUrl || "")) return;
    updateParam("q", debouncedQ.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const baseApiPath = useMemo(() => {
    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (free === "1") params.set("free", "1");
    if (when) params.set("when", when);

    const qTrim = qFromUrl.trim();
    if (qTrim) params.set("q", qTrim);

    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (ongoing) params.set("ongoing", ongoing);

    params.set("limit", String(LIMIT));

    return `/api/events/?${params.toString()}`;
  }, [city, free, when, qFromUrl, from, to, ongoing]);

  async function loadPage(nextOffset = 0, append = false) {
    const url = `${baseApiPath}&offset=${nextOffset}`;

    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      setErrorMsg("");

      const data = (await apiGet(url)) as EventsResponse;
      const list = Array.isArray(data) ? data : data.results || [];

      if (append) {
        setEvents((prev) => [...prev, ...list]);
      } else {
        setEvents(list);
      }

      if (Array.isArray(data)) {
        setHasMore(false);
      } else {
        setHasMore(Boolean(data.has_more));
      }

      setOffset(nextOffset);
    } catch (error) {
      if (!append) setEvents([]);
      setHasMore(false);
      setErrorMsg("Kon events niet laden.");
      console.error(error);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseApiPath]);

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-4 xl:sticky xl:top-6">
            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-[0_18px_50px_rgba(70,52,24,0.06)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Account
                  </p>
                  <h2 className="font-heading mt-2 text-2xl text-stone-900">
                    Jouw ontdekruimte
                  </h2>
                </div>
                  <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
                  Live
                </span>
              </div>

              <div className="mt-4 rounded-[1.4rem] bg-[#fcfbf8] p-4">
                <AuthBlock />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(247,243,237,0.96)_100%)] p-5 shadow-[0_18px_50px_rgba(70,52,24,0.06)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Samenvatting
              </p>
              <h2 className="font-heading mt-2 text-2xl text-stone-900">
                {cityLabel} op {whenLabel.toLowerCase()}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {activeFilterCount === 0
                  ? "Je kijkt nu naar de brede standaardselectie zonder extra filters."
                  : `${activeFilterCount} actieve filters helpen je sneller de juiste events te vinden.`}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-stone-600">
                <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
                  Stad: {cityLabel}
                </span>
                <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
                  Prijs: {free === "1" ? "Gratis" : "Alles"}
                </span>
                <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
                  Resultaten per pagina: {LIMIT}
                </span>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/88 p-6 shadow-[0_28px_90px_rgba(60,43,24,0.08)] backdrop-blur sm:p-8 lg:p-10">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full border border-stone-300 bg-[#f8f3eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-stone-600">
                    Ontdek
                  </span>
                  <h1 className="font-heading mt-4 text-4xl leading-[0.98] tracking-[-0.05em] text-stone-900 sm:text-5xl">
                    Verken actuele events met rustiger filters en een duidelijkere flow.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                    Zoek, verfijn en blader door events zonder dat de pagina als een formulier aanvoelt.
                    Deze view combineert nu zoekfocus, filtercontext en resultaten in een meer redactionele layout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
                >
                  Reset filters
                </button>
              </div>

              <OntdekHeader city={city} free={free} when={when || undefined} cityOptions={CITY_OPTIONS} />

              <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-[1.75rem] border border-stone-200 bg-[#fcfbf8] p-5 sm:p-6">
                  <label className="grid gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                      Zoeken
                    </span>
                    <input
                      value={q}
                      onChange={(event) => setQ(event.target.value)}
                      placeholder="Zoek op titel, omschrijving of locatie..."
                      className="min-h-12 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
                    />
                    <span className="text-xs text-stone-500">
                      Typ rustig; zoeken wordt automatisch toegepast na een korte pauze.
                    </span>
                  </label>
                </div>

                <div className="rounded-[1.75rem] border border-stone-200 bg-[#fcfbf8] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Resultaatstatus
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-stone-600">
                    <span className="rounded-full bg-stone-900 px-3 py-1 font-medium text-white">
                      {loading ? "Laden..." : `${events.length} zichtbaar`}
                    </span>
                    {when ? (
                      <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
                        Moment: {whenLabel}
                      </span>
                    ) : null}
                    {qFromUrl.trim() ? (
                      <span className="rounded-full border border-stone-300 bg-white px-3 py-1">
                        Zoekterm actief
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-stone-200 bg-[#fcfbf8] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Datums
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-stone-700">
                      <span>Van</span>
                      <input
                        type="date"
                        value={from}
                        onChange={(event) => updateParam("from", event.target.value)}
                        className="min-h-11 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-stone-500 disabled:bg-stone-100"
                        disabled={when === "tonight" || when === "weekend"}
                      />
                    </label>

                    <label className="grid gap-2 text-sm text-stone-700">
                      <span>Tot</span>
                      <input
                        type="date"
                        value={to}
                        onChange={(event) => updateParam("to", event.target.value)}
                        className="min-h-11 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-stone-500 disabled:bg-stone-100"
                        disabled={when === "tonight" || when === "weekend"}
                      />
                    </label>
                  </div>

                  {(when === "tonight" || when === "weekend") && (
                    <p className="mt-3 text-xs text-stone-500">
                      Datumfilters zijn uitgeschakeld zolang je op "Vanavond" of "Dit weekend" filtert.
                    </p>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-stone-200 bg-[#fcfbf8] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Doorlopend
                  </p>
                  <div className="mt-3 grid gap-3">
                    <label className="flex items-center gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={free === "1"}
                        onChange={(event) => updateParam("free", event.target.checked ? "1" : "")}
                        className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
                      />
                      Alleen gratis
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={ongoing === "1"}
                        onChange={(event) => updateParam("ongoing", event.target.checked ? "1" : "")}
                        disabled={ongoingDisabled}
                        className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 disabled:opacity-50"
                      />
                      Alleen doorlopend
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={ongoing === "0"}
                        onChange={(event) => updateParam("ongoing", event.target.checked ? "0" : "")}
                        disabled={ongoingDisabled}
                        className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 disabled:opacity-50"
                      />
                      Verberg doorlopend
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(70,52,24,0.06)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Resultaten
                  </span>
                  <h2 className="font-heading mt-3 text-3xl text-stone-900 sm:text-4xl">
                    Events in {cityLabel}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
                    De lijst hieronder reageert op dezelfde URL-filters als hierboven. Daardoor blijven
                    delen, refreshen en verder zoeken consistent.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-stone-600">
                  <span className="rounded-full border border-stone-300 bg-[#f8f3eb] px-3 py-1">
                    Wanneer: {whenLabel}
                  </span>
                  <span className="rounded-full border border-stone-300 bg-[#f8f3eb] px-3 py-1">
                    Prijs: {free === "1" ? "Gratis" : "Alles"}
                  </span>
                </div>
              </div>

              <div
                className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-[#e7d3b5] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5"
                style={{
                  backgroundColor: "#fbf3e8",
                  backgroundImage:
                    "radial-gradient(circle at top left, rgba(210, 137, 72, 0.16), transparent 38%), linear-gradient(180deg, rgba(255, 249, 240, 0.98) 0%, rgba(247, 237, 224, 0.98) 100%)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_rgba(166,107,55,0),_rgba(166,107,55,0.55),_rgba(166,107,55,0))]" />

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a5a34]">
                      Live overzicht
                    </p>
                    <p className="mt-1 text-sm text-[#6f5a46]">
                      {loading
                        ? "We verversen de selectie op basis van je filters."
                        : `${events.length} events klaar om te bekijken.`}
                    </p>
                  </div>

                  <span className="rounded-full border border-[#d7b488] bg-[rgba(255,250,244,0.88)] px-3 py-1 text-xs font-semibold text-[#8a5a34]">
                    {loading ? "Bezig met laden" : hasMore ? "Meer beschikbaar" : "Complete selectie"}
                  </span>
                </div>

                {loading ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-4 text-sm text-[#6f5a46] shadow-[0_10px_30px_rgba(118,78,41,0.06)]"
                  >
                    Laden...
                  </p>
                ) : errorMsg ? (
                  <p
                    role="alert"
                    className="rounded-[1.35rem] border border-red-200 bg-red-50/90 px-4 py-4 text-sm text-red-800"
                  >
                    {errorMsg}
                  </p>
                ) : events.length === 0 ? (
                  <p
                    aria-live="polite"
                    className="rounded-[1.35rem] border border-[#eadcc8] bg-white/78 px-4 py-4 text-sm text-[#6f5a46]"
                  >
                    Geen events gevonden voor deze filters.
                  </p>
                ) : (
                  <>
                    <EventList events={events} />

                    {hasMore && (
                      <div className="mt-5 flex justify-center">
                        <button
                          type="button"
                          onClick={() => loadPage(offset + LIMIT, true)}
                          disabled={loadingMore}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#cfad84] bg-white/90 px-5 py-3 text-sm font-semibold text-[#6b4a2d] shadow-[0_10px_30px_rgba(118,78,41,0.08)] transition hover:border-[#b8844d] hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loadingMore ? "Laden..." : "Laad meer"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

