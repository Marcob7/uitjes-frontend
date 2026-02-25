// frontend/components/OntdekHeader.tsx
"use client";

import CitySelect, { type CityOption } from "@/components/CitySelect";

// OntdekHeader bundelt:
// - City selector
// - Filter chips (when + free)
// - Een statusregel ("Stad: ... Wanneer: ... Filter: ...")
//
// Dit is bewust een client component zodat we makkelijk UI/UX kunnen uitbreiden.
// Voor nu gebruiken we nog <a href="..."> links om URL-driven state te houden.

export default function OntdekHeader({
  city,
  free,
  when,
  cityOptions,
}: {
  city: string;
  free: string; // "0" of "1"
  when?: string; // "tonight" | "weekend" | undefined
  cityOptions: CityOption[];
}) {
  const whenLabel =
    when === "tonight" ? "Vanavond" : when === "weekend" ? "Dit weekend" : "Altijd";

  // Helper: maak een /ontdek URL met behoud van city + vrije combinatie van when/free
  function buildUrl(next: { city: string; free: string; when?: string }) {
    const params = new URLSearchParams();
    params.set("city", next.city);

    if (next.free === "1") params.set("free", "1");
    if (next.when) params.set("when", next.when);

    return `/ontdek?${params.toString()}`;
  }

  // Kleine helper voor chip-styling (active/inactive)
  function chipStyle(active: boolean) {
    return {
      padding: "8px 10px",
      border: "1px solid #ddd",
      borderRadius: 999,
      textDecoration: "none",
      fontWeight: active ? 700 : 400,
      display: "inline-block",
    } as const;
  }

  return (
    <section style={{ marginTop: 12, marginBottom: 16 }}>
      {/* 
        Layout:
        - op desktop: 2 kolommen (city links, chips rechts)
        - op mobiel: alles onder elkaar (wrap)
      */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {/* Links: city selector */}
        <CitySelect cities={cityOptions} defaultCity="apeldoorn" />

        {/* Rechts: chips */}
        <div style={{ display: "grid", gap: 10 }}>
          {/* When chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={buildUrl({ city, free, when: undefined })} style={chipStyle(!when)}>
              Altijd
            </a>
            <a
              href={buildUrl({ city, free, when: "tonight" })}
              style={chipStyle(when === "tonight")}
            >
              Vanavond
            </a>
            <a
              href={buildUrl({ city, free, when: "weekend" })}
              style={chipStyle(when === "weekend")}
            >
              Dit weekend
            </a>
          </div>

          {/* Free chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={buildUrl({ city, free: "0", when })} style={chipStyle(free !== "1")}>
              Alles
            </a>
            <a href={buildUrl({ city, free: "1", when })} style={chipStyle(free === "1")}>
              Gratis
            </a>
          </div>
        </div>
      </div>

      {/* Statusregel */}
      <p style={{ marginTop: 12 }}>
        Stad: <b>{city}</b> • Wanneer: <b>{whenLabel}</b> • Filter:{" "}
        <b>{free === "1" ? "Gratis" : "Alles"}</b>
      </p>
    </section>
  );
}
