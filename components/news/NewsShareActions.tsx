"use client";

import { useState } from "react";

function CopyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.25" y="5.25" width="7.25" height="7.25" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.75 5.1V4.2c0-.75-.61-1.35-1.35-1.35H4.2c-.75 0-1.35.61-1.35 1.35V9.4c0 .75.61 1.35 1.35 1.35h.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function NewsShareActions({ title }: { title: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function copyLink() {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-t border-[#DCE1DC] pt-6" aria-label={`Deel ${title}`}>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#65736C]">Deel dit verhaal</p>
      <button
        type="button"
        onClick={copyLink}
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C9D8CF] bg-white px-4 text-sm font-semibold text-[#1D5A46] transition hover:border-[#1D5A46] hover:bg-[#F4F9F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
      >
        <CopyIcon />
        {status === "success" ? "Link gekopieerd" : "Kopieer link"}
      </button>
      {status === "error" ? (
        <p role="status" className="mt-2 text-sm leading-6 text-[#8A3B2A]">
          Kopiëren lukt niet automatisch. Kopieer de link uit je adresbalk.
        </p>
      ) : null}
    </section>
  );
}
