"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { signupForNewsletter } from "@/lib/newsletter";

export default function WeeklyPulseSignupSection({
  className = "",
}: {
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Vul een geldig e-mailadres in.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    const result = await signupForNewsletter({
      email: trimmedEmail,
      preferred_city: preferredCity.trim(),
      frequency: "monthly",
      interests: ["festivals", "events"],
      source: "festivals",
    });

    setStatus(result.ok ? "success" : "error");
    setMessage(result.message);

    if (result.ok) {
      setEmail("");
      setPreferredCity("");
    }

    setIsSubmitting(false);
  }

  return (
    <section className={`pb-8 ${className}`}>
      <div className="uitjes-liquid-section rounded-[2.4rem] px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(232,242,208,0.24),transparent_28%),radial-gradient(circle_at_20%_76%,rgba(255,255,255,0.1),transparent_34%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,1fr)] lg:items-end lg:gap-12">
          <div className="max-w-[38rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8f2d0]/86">
              Festival updates
            </p>
            <h2 className="mt-3 max-w-[13ch] text-[clamp(2.25rem,4.8vw,4rem)] leading-[0.94] tracking-[-0.06em] text-white">
              Mis geen nieuwe festivals
            </h2>
            <p className="mt-5 max-w-[35rem] text-sm leading-7 text-white/76 sm:text-base sm:leading-8">
              Ontvang updates wanneer er nieuwe festivals en evenementen worden
              toegevoegd. Handig als je niets wilt missen.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Nieuwe festivals", "Evenementen updates", "Regio optioneel"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur-md"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-3"
            aria-label="Aanmelden voor festival updates"
          >
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)]">
              <label className="grid gap-2 text-sm font-semibold text-white">
                E-mailadres
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jij@example.nl"
                  autoComplete="email"
                  required
                  aria-describedby={message ? "festival-newsletter-message" : undefined}
                  className="min-h-14 rounded-2xl border border-white/18 bg-white/14 px-4 text-base font-normal text-white outline-none shadow-[0_14px_32px_rgba(0,0,0,0.12)] transition placeholder:text-white/50 focus:border-[#e8f2d0]/70 focus:bg-white/18 focus:ring-4 focus:ring-[#e8f2d0]/18 sm:text-sm"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-white">
                Stad of regio
                <input
                  type="text"
                  value={preferredCity}
                  onChange={(event) => setPreferredCity(event.target.value)}
                  placeholder="Optioneel"
                  className="min-h-14 rounded-2xl border border-white/18 bg-white/14 px-4 text-base font-normal text-white outline-none shadow-[0_14px_32px_rgba(0,0,0,0.12)] transition placeholder:text-white/50 focus:border-[#e8f2d0]/70 focus:bg-white/18 focus:ring-4 focus:ring-[#e8f2d0]/18 sm:text-sm"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="uitjes-cta inline-flex min-h-14 w-full items-center justify-center rounded-2xl px-6 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7fbeb] sm:w-auto sm:rounded-full"
              >
                {isSubmitting ? "Bezig..." : "Ontvang updates"}
              </button>

              <p className="text-xs leading-5 text-white/58">
                Alleen inschrijven. Er wordt geen bulkmail verstuurd.
              </p>
            </div>

            {message ? (
              <p
                id="festival-newsletter-message"
                role="status"
                aria-live="polite"
                className={`text-sm font-medium ${
                  status === "success" ? "text-[#e8f2d0]" : "text-[#ffd4cc]"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
