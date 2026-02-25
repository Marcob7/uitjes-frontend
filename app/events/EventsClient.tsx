"use client";

import { useSearchParams } from "next/navigation";

export default function EventsClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <main>
      <h1>Events</h1>
      <p>Zoekterm: {q}</p>
      {/* jouw lijst/filters hier */}
    </main>
  );
}