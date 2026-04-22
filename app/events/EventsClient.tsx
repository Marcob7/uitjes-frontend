"use client";

import { useSearchParams } from "next/navigation";

export default function EventsClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)] sm:px-8 sm:py-8">
        <h1 className="text-[clamp(2rem,5vw,3.2rem)] leading-[0.96] tracking-[-0.05em]">
          Events
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#62594e] sm:text-base">
          Zoekterm: {q || "geen actieve zoekterm"}
        </p>
      </div>
    </main>
  );
}
