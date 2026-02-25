// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventList from "@/components/EventList";
import AuthBlock from "@/components/AuthBlock";
import { apiGet } from "@/lib/api";

function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function OntdekPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const LIMIT = 20;

  // URL -> state defaults
  const city = searchParams.get("city") || "apeldoorn";
  const free = searchParams.get("free") || "0";
  const when = searchParams.get("when") || "";
  const qFromUrl = searchParams.get("q") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const ongoing = searchParams.get("ongoing") || ""; // "1" | "0" | ""

  // Controlled input (q) met debounce
  const [q, setQ] = useState(qFromUrl);
  const debouncedQ = useDebouncedValue(q, 350);

  useEffect(() => {
    setQ(qFromUrl);
  }, [qFromUrl]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams.toString());

    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, String(value));

    const qs = next.toString();
    router.replace(qs ? `/ontdek?${qs}` : "/ontdek");
  }

  function resetFilters() {
    router.push("/ontdek?city=apeldoorn");
  }

  // Debounced q -> URL
  useEffect(() => {
    if ((debouncedQ || "") === (qFromUrl || "")) return;
    updateParam("q", debouncedQ.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // Bouw base query (zonder offset)
  const baseApiPath = useMemo(() => {
    const qs = new URLSearchParams();

    if (city) qs.set("city", city);
    if (free === "1") qs.set("free", "1");
    if (when) qs.set("when", when);

    const qTrim = (qFromUrl || "").trim();
    if (qTrim) qs.set("q", qTrim);

    if (from) qs.set("from", from);
    if (to) qs.set("to", to);

    if (ongoing) qs.set("ongoing", ongoing);

    qs.set("limit", String(LIMIT));

    return `/api/events/?${qs.toString()}`;
  }, [city, free, when, qFromUrl, from, to, ongoing]);

  async function loadPage(nextOffset = 0, append = false) {
    const url = `${baseApiPath}&offset=${nextOffset}`;

    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      setErrorMsg("");

      const data = await apiGet(url);
      const list = Array.isArray(data) ? data : data.results || [];

      if (append) {
        setEvents((prev) => [...prev, ...(Array.isArray(list) ? list : [])]);
      } else {
        setEvents(Array.isArray(list) ? list : []);
      }

      // pagination info uit backend
      if (data && typeof data === "object" && !Array.isArray(data)) {
        setHasMore(!!data.has_more);
        setOffset(nextOffset);
      } else {
        // fallback (als backend ooit weer array-only zou geven)
        setHasMore(false);
        setOffset(nextOffset);
      }
    } catch (e) {
      if (!append) setEvents([]);
      setHasMore(false);
      setErrorMsg("Kon events niet laden.");
      console.error(e);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }

  // Als filters veranderen: reset naar pagina 1
  useEffect(() => {
    loadPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseApiPath]);

  return (
    <main style={{ padding: 24 }}>
      <AuthBlock />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Ontdek</h1>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded border px-3 py-2 text-sm"
        >
          Reset filters
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
          marginBottom: 16,
          maxWidth: 640,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Zoeken</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Zoek op titel, omschrijving of locatie…"
            className="rounded border px-3 py-2"
          />
          <span className="text-xs opacity-70">
            Tip: typ rustig, zoeken gaat automatisch na een korte pauze.
          </span>
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Stad</span>
            <select
              value={city}
              onChange={(e) => updateParam("city", e.target.value)}
              className="rounded border px-3 py-2"
            >
              <option value="apeldoorn">Apeldoorn</option>
              <option value="deventer">Deventer</option>
              <option value="arnhem">Arnhem</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Wanneer</span>
            <select
              value={when}
              onChange={(e) => updateParam("when", e.target.value)}
              className="rounded border px-3 py-2"
            >
              <option value="">Alles</option>
              <option value="tonight">Vanavond</option>
              <option value="weekend">Weekend</option>
            </select>
          </label>
        </div>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={free === "1"}
            onChange={(e) => updateParam("free", e.target.checked ? "1" : "")}
          />
          Alleen gratis
        </label>

        {/* Ongoing toggles (als je die al hebt) */}
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={ongoing === "1"}
              onChange={(e) => updateParam("ongoing", e.target.checked ? "1" : "")}
              disabled={when === "tonight" || when === "weekend" || !!from || !!to}
            />
            Alleen doorlopend
          </label>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={ongoing === "0"}
              onChange={(e) => updateParam("ongoing", e.target.checked ? "0" : "")}
              disabled={when === "tonight" || when === "weekend" || !!from || !!to}
            />
            Verberg doorlopend
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Van (datum)</span>
            <input
              type="date"
              value={from}
              onChange={(e) => updateParam("from", e.target.value)}
              className="rounded border px-3 py-2"
              disabled={when === "tonight" || when === "weekend"}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Tot (datum)</span>
            <input
              type="date"
              value={to}
              onChange={(e) => updateParam("to", e.target.value)}
              className="rounded border px-3 py-2"
              disabled={when === "tonight" || when === "weekend"}
            />
          </label>
        </div>

        {(when === "tonight" || when === "weekend") && (
          <p className="text-xs opacity-70">
            Datumfilters staan uit als je “Vanavond” of “Weekend” kiest.
          </p>
        )}
      </div>

      {loading ? (
        <p>Laden…</p>
      ) : errorMsg ? (
        <p>{errorMsg}</p>
      ) : events.length === 0 ? (
        <p>Geen events gevonden voor deze filters.</p>
      ) : (
        <>
          <EventList events={events} />

          {hasMore && (
            <button
              type="button"
              onClick={() => loadPage(offset + LIMIT, true)}
              disabled={loadingMore}
              className="mt-4 rounded border px-3 py-2 text-sm"
            >
              {loadingMore ? "Laden…" : "Laad meer"}
            </button>
          )}
        </>
      )}
    </main>
  );
}