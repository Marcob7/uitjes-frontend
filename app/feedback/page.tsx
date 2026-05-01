// frontend/app/feedback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetchAuth } from "@/lib/api";

type ApiError =
  | {
      message?: string[];
      email?: string[];
      page_url?: string[];
      detail?: string;
    }
  | string;

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  const messageTooShort =
    message.trim().length > 0 && message.trim().length < 10;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetMessage = params.get("message");
    const presetEmail = params.get("email");

    if (presetMessage) {
      setMessage((current) => current || presetMessage);
    }

    if (presetEmail) {
      setEmail((current) => current || presetEmail);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    setSuccessId(null);

    if (message.trim().length < 10) {
      setErrorText("Je bericht moet minimaal 10 tekens zijn.");
      return;
    }

    setLoading(true);

    try {
      const r = await apiFetchAuth("/api/feedback/", {
        method: "POST",
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() ? email.trim() : "",
          page_url: window.location.href,
          website,
          form_started_at: formStartedAt,
        }),
      });

      if (!r.ok) {
        setErrorText(formatApiError(r.data as ApiError));
        setLoading(false);
        return;
      }

      setSuccessId(r.data?.id ?? null);
      setMessage("");
      setEmail("");
      setWebsite("");
    } catch (err: any) {
      setErrorText(`Netwerkfout: ${err?.message ?? "Onbekende fout"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)] sm:px-8 sm:py-8">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-2xl bg-[#eef5df] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#50672f] sm:rounded-full">
              Feedback
            </div>
            <h1 className="mt-5 text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95] tracking-[-0.06em] text-[#171717]">
              Wat kunnen we op mobiel beter maken?
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#61584d] sm:text-base">
              Heb je een suggestie of mis je iets? Laat het weten. Dit komt direct bij
              ons binnen.
            </p>
          </div>

          {successId !== null ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 rounded-[1.4rem] border border-[#b7eb8f] bg-[#f6ffed] px-4 py-4 text-sm text-[#335317]"
            >
              <b>Bedankt!</b> Je feedback is verstuurd. (id: {successId})
            </div>
          ) : null}

          {errorText ? (
            <div
              id="feedback-error"
              role="alert"
              className="mt-6 whitespace-pre-wrap rounded-[1.4rem] border border-[#ffa39e] bg-[#fff1f0] px-4 py-4 text-sm text-[#7e2f2b]"
            >
              <b>Er ging iets mis</b>
              <div className="mt-2">{errorText}</div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <div className="text-sm font-semibold text-[#171717]">
                Jouw suggestie (verplicht)
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
                aria-invalid={messageTooShort || Boolean(errorText)}
                aria-describedby={errorText ? "feedback-error feedback-message-help" : "feedback-message-help"}
                placeholder="Bijvoorbeeld: ik wil kunnen filteren op binnen of buiten."
                className="min-h-[160px] w-full rounded-[1.5rem] border border-[#ddd6cb] bg-[#fcfaf7] px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#bfb3a4]"
              />

              <div id="feedback-message-help" className="text-xs text-[#6e6458]">
                Minimaal 10 tekens.
                {messageTooShort ? " Je zit er nog onder." : ""}
              </div>
            </label>

            <label className="grid gap-2">
              <div className="text-sm font-semibold text-[#171717]">
                Email (optioneel)
              </div>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
                type="email"
                autoComplete="email"
                className="min-h-12 w-full rounded-2xl border border-[#ddd6cb] bg-[#fcfaf7] px-4 text-base text-[#171717] outline-none transition focus:border-[#bfb3a4] sm:rounded-full"
              />
            </label>

            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#171717] bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#2b261f] disabled:opacity-60 sm:w-auto sm:rounded-full"
            >
              {loading ? "Versturen..." : "Verstuur feedback"}
            </button>

            <div className="text-xs text-[#6e6458]">
              Na versturen kun je het terugzien in Django Admin, onder Feedbacks.
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function formatApiError(data: ApiError): string {
  if (!data) return "Er ging iets mis.";
  if (typeof data === "string") return data;

  const parts: string[] = [];

  if (data.detail) parts.push(data.detail);
  if (data.message?.length) parts.push(`Bericht: ${data.message.join(", ")}`);
  if (data.email?.length) parts.push(`Email: ${data.email.join(", ")}`);
  if (data.page_url?.length) parts.push(`Pagina: ${data.page_url.join(", ")}`);

  if (parts.length === 0) return JSON.stringify(data);

  return parts.join("\n");
}
