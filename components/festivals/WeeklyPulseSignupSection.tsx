"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { signupForNewsletter } from "@/lib/newsletter";

type AlertKey = "jazzAmsterdam" | "budgetFriendly";
type NewsletterFrequency = "weekly" | "weekend" | "monthly";
type NewsletterInterest =
  | "festivals"
  | "events"
  | "food_drink"
  | "family"
  | "surprise";

type AlertPreference = {
  key: AlertKey;
  label: string;
  icon: "music" | "ticket";
};

const alertPreferences: AlertPreference[] = [
  {
    key: "jazzAmsterdam",
    label: "Jazz events in Amsterdam",
    icon: "music",
  },
  {
    key: "budgetFriendly",
    label: "Tickets onder de EUR 50",
    icon: "ticket",
  },
];

const defaultAlerts: Record<AlertKey, boolean> = {
  jazzAmsterdam: true,
  budgetFriendly: false,
};

const newsletterFrequencyOptions: {
  value: NewsletterFrequency;
  label: string;
}[] = [
  { value: "weekly", label: "Wekelijks" },
  { value: "weekend", label: "Alleen weekendtips" },
  { value: "monthly", label: "Maandelijks" },
];

const newsletterInterestOptions: {
  value: NewsletterInterest;
  label: string;
}[] = [
  { value: "festivals", label: "Festivals" },
  { value: "events", label: "Evenementen" },
  { value: "food_drink", label: "Restaurants / eten & drinken" },
  { value: "family", label: "Gezinsuitjes" },
  { value: "surprise", label: "Verrassingen / inspiratie" },
];

function BellIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 10a8 8 0 0 1 8 8v5.143c0 2.21.79 4.347 2.228 6.023L37 32.5H11l2.772-3.334A9.42 9.42 0 0 0 16 23.143V18a8 8 0 0 1 8-8Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 36a3.5 3.5 0 0 0 7 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.333 2.667v7.2a2 2 0 1 1-1.333-1.887V4.267l5.333-1.6v5.866a2 2 0 1 1-1.333-1.886V2.667l-2.667.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.667 5.333a1.333 1.333 0 0 0 0 2.667V10a1.333 1.333 0 0 0 1.333 1.333h8A1.333 1.333 0 0 0 13.333 10V8a1.333 1.333 0 1 0 0-2.667V4A1.333 1.333 0 0 0 12 2.667H4A1.333 1.333 0 0 0 2.667 4v1.333Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 4.667v1.333M6.667 8v1.333"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlertRow({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: AlertPreference["icon"];
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="uitjes-liquid-button flex w-full items-center justify-between gap-4 rounded-[1.2rem] px-4 py-4 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
      aria-pressed={active}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eff5e6] text-[#4a6b27]">
          {icon === "music" ? <MusicIcon /> : <TicketIcon />}
        </span>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>

      <span
        className={`relative inline-flex h-7 w-12 rounded-full transition ${
          active ? "bg-[#e8f2d0]" : "bg-white/18"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full shadow-[0_6px_12px_rgba(0,0,0,0.12)] transition ${
            active ? "left-6" : "left-1"
          } ${active ? "bg-[#171511]" : "bg-white"}`}
        />
      </span>
    </button>
  );
}

function NewsletterPreferencesModal({
  email,
  preferredCity,
  frequency,
  interests,
  isSubmitting,
  onClose,
  onPreferredCityChange,
  onFrequencyChange,
  onInterestToggle,
  onSubmit,
}: {
  email: string;
  preferredCity: string;
  frequency: NewsletterFrequency;
  interests: NewsletterInterest[];
  isSubmitting: boolean;
  onClose: () => void;
  onPreferredCityChange: (value: string) => void;
  onFrequencyChange: (value: NewsletterFrequency) => void;
  onInterestToggle: (value: NewsletterInterest) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#171511]/58 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="presentation"
    >
      <form
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-preferences-title"
        className="max-h-[92vh] w-full max-w-[36rem] overflow-y-auto rounded-[1.6rem] border border-[#e2dccf] bg-[#fffaf3] p-5 text-left shadow-[0_24px_80px_rgba(24,20,16,0.28)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b7a69]">
              Nieuwsbrief
            </p>
            <h3
              id="newsletter-preferences-title"
              className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#171511]"
            >
              Kies je voorkeuren
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#665d54]">
              We bewaren je keuzes bij {email}. Je kunt dit later verfijnen zodra
              uitschrijven en voorkeurbeheer klaarstaan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d7cfbf] bg-white text-xl leading-none text-[#3f362f] transition hover:bg-[#f8f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
            aria-label="Sluit voorkeuren"
          >
            x
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#171511]">Frequentie</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {newsletterFrequencyOptions.map((option) => {
              const active = frequency === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFrequencyChange(option.value)}
                  className={`min-h-11 rounded-2xl border px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
                    active
                      ? "border-[#9cc84e] bg-[#e8f2d0] text-[#2e4b1f]"
                      : "border-[#ded8cc] bg-white text-[#4d463e] hover:bg-[#f8f5f3]"
                  }`}
                  aria-pressed={active}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#171511]">Interesse</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {newsletterInterestOptions.map((option) => {
              const active = interests.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onInterestToggle(option.value)}
                  className={`min-h-10 rounded-full border px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
                    active
                      ? "border-[#23351f] bg-[#23351f] text-white"
                      : "border-[#ded8cc] bg-white text-[#4d463e] hover:bg-[#f8f5f3]"
                  }`}
                  aria-pressed={active}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-6 block text-sm font-semibold text-[#171511]">
          Stad/regio
          <input
            type="text"
            value={preferredCity}
            onChange={(event) => onPreferredCityChange(event.target.value)}
            placeholder="Bijvoorbeeld Amersfoort"
            className="mt-3 min-h-12 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 text-sm font-normal text-[#171511] outline-none transition placeholder:text-[#75695f] focus:border-[#9cc84e] focus:ring-4 focus:ring-[#d9f1a6]/45"
          />
        </label>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-5 text-sm font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3]"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="uitjes-cta inline-flex min-h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
          >
            {isSubmitting ? "Opslaan..." : "Voorkeuren opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function WeeklyPulseSignupSection({
  className = "",
}: {
  className?: string;
}) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterPendingEmail, setNewsletterPendingEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterStatus, setNewsletterStatus] =
    useState<"idle" | "success" | "error">("idle");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [newsletterFrequency, setNewsletterFrequency] =
    useState<NewsletterFrequency>("weekly");
  const [newsletterInterests, setNewsletterInterests] = useState<
    NewsletterInterest[]
  >(["festivals", "events"]);
  const [newsletterPreferredCity, setNewsletterPreferredCity] = useState("");
  const [alerts, setAlerts] = useState(defaultAlerts);

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!email) {
      setNewsletterStatus("error");
      setNewsletterMessage("Vul een geldig e-mailadres in.");
      return;
    }

    setNewsletterPendingEmail(email);
    setNewsletterStatus("idle");
    setNewsletterMessage("");
    setNewsletterModalOpen(true);
  }

  function toggleNewsletterInterest(value: NewsletterInterest) {
    setNewsletterInterests((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }
      return [...current, value];
    });
  }

  async function saveNewsletterPreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterSubmitting(true);
    setNewsletterStatus("idle");
    setNewsletterMessage("");

    const result = await signupForNewsletter({
      email: newsletterPendingEmail,
      preferred_city: newsletterPreferredCity.trim(),
      frequency: newsletterFrequency,
      interests: newsletterInterests,
      source: "festival_weekly_pulse",
    });

    setNewsletterStatus(result.ok ? "success" : "error");
    setNewsletterMessage(result.message);

    if (result.ok) {
      setNewsletterEmail("");
      setNewsletterPendingEmail("");
      setNewsletterPreferredCity("");
      setNewsletterModalOpen(false);
    }

    setNewsletterSubmitting(false);
  }

  return (
    <>
      <section className={`uitjes-liquid-section rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10 ${className}`}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-[28rem]">
            <div className="inline-flex rounded-full bg-[#4f7628] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
              Smart alerts
            </div>
            <h2 className="mt-5 max-w-none text-[clamp(2.1rem,4vw,3.2rem)] leading-[0.96] tracking-[-0.055em] text-white">
              Persoonlijke Meldingen
            </h2>
            <p className="mt-4 max-w-[26rem] text-sm leading-7 text-white/76 sm:text-[15px]">
              Focus op wat ertoe doet. Krijg alleen bericht over evenementen
              die exact bij jouw profiel aansluiten.
            </p>

            <div className="mt-6 space-y-3">
              {alertPreferences.map((preference) => (
                <AlertRow
                  key={preference.key}
                  active={alerts[preference.key]}
                  icon={preference.icon}
                  label={preference.label}
                  onClick={() =>
                    setAlerts((current) => ({
                      ...current,
                      [preference.key]: !current[preference.key],
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute right-[10%] top-[8%] hidden rounded-full bg-[#4f7628] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(79,118,40,0.18)] sm:block">
              Live nu
            </div>
            <div className="grid h-[15rem] w-[15rem] place-items-center rounded-full border border-white/18 bg-white/10 text-[#e8f2d0] shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:h-[22rem] sm:w-[22rem]">
              <BellIcon />
            </div>
          </div>
        </div>
      </section>

      <section className="px-2 py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.96] tracking-[-0.055em] text-[#171511]">
          Your Weekly Pulse
        </h2>
        <p className="mx-auto mt-4 max-w-[32rem] text-sm leading-7 text-[#665d54] sm:text-[15px]">
          De curator selecteert. Jij beleeft. Geen ruis, alleen de essentie
          elke donderdag in je inbox.
        </p>

        <form
          onSubmit={submitNewsletter}
          className="mx-auto mt-8 flex max-w-[32rem] flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={newsletterEmail}
            onChange={(event) => setNewsletterEmail(event.target.value)}
            placeholder="E-mailadres"
            required
            aria-describedby={newsletterMessage ? "festival-newsletter-message" : undefined}
            className="min-h-14 flex-1 rounded-2xl border border-[#ded8cc] bg-white/82 px-5 text-base text-[#171511] outline-none transition placeholder:text-[#75695f] focus:border-[#9cc84e] focus:ring-4 focus:ring-[#d9f1a6]/45 sm:rounded-full sm:text-sm"
          />
          <button
            type="submit"
            disabled={newsletterSubmitting}
            className="uitjes-cta inline-flex min-h-14 items-center justify-center rounded-2xl px-8 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] sm:rounded-full"
          >
            {newsletterSubmitting ? "Bezig..." : "Inschrijven"}
          </button>
        </form>
        {newsletterMessage ? (
          <p
            id="festival-newsletter-message"
            role="status"
            aria-live="polite"
            className={`mx-auto mt-3 max-w-[32rem] text-sm font-medium ${
              newsletterStatus === "success" ? "text-[#4d6630]" : "text-[#9d342f]"
            }`}
          >
            {newsletterMessage}
          </p>
        ) : null}
      </section>

      {newsletterModalOpen ? (
        <NewsletterPreferencesModal
          email={newsletterPendingEmail}
          preferredCity={newsletterPreferredCity}
          frequency={newsletterFrequency}
          interests={newsletterInterests}
          isSubmitting={newsletterSubmitting}
          onClose={() => setNewsletterModalOpen(false)}
          onPreferredCityChange={setNewsletterPreferredCity}
          onFrequencyChange={setNewsletterFrequency}
          onInterestToggle={toggleNewsletterInterest}
          onSubmit={saveNewsletterPreferences}
        />
      ) : null}
    </>
  );
}
