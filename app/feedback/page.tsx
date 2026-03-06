// frontend/app/feedback/page.tsx
"use client";

import { useState } from "react";
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
  // Form state
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // Honeypot: echte gebruikers vullen dit niet in
  const [website, setWebsite] = useState("");

  // Tijd waarop formulier geladen is
  const [formStartedAt] = useState(() => Date.now());

  // UI state
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  // Kleine client-side check: voorkomt onnodige request
  const messageTooShort =
    message.trim().length > 0 && message.trim().length < 10;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Reset statusmeldingen
    setErrorText("");
    setSuccessId(null);

    // Simpele UX-validatie
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

          // Anti-spam
          website, // moet leeg blijven
          form_started_at: formStartedAt,
        }),
      });

      if (!r.ok) {
        setErrorText(formatApiError(r.data as ApiError));
        setLoading(false);
        return;
      }

      // Succes
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
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Feedback</h1>

      <p style={{ marginTop: 8, marginBottom: 16 }}>
        Heb je een suggestie of mis je iets? Laat het weten. Dit komt direct bij
        ons binnen.
      </p>

      {successId !== null ? (
        <div
          style={{
            border: "1px solid #b7eb8f",
            background: "#f6ffed",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <b>Bedankt!</b> Je feedback is verstuurd. (id: {successId})
        </div>
      ) : null}

      {errorText ? (
        <div
          style={{
            border: "1px solid #ffa39e",
            background: "#fff1f0",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          <b>Er ging iets mis</b>
          <div style={{ marginTop: 6 }}>{errorText}</div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Jouw suggestie (verplicht)
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Bijv. ‘Ik wil kunnen filteren op binnen/buiten’ of ‘Toon ook prikkelarme opties’..."
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
            Minimaal 10 tekens.
            {messageTooShort ? " Je zit er nog onder." : ""}
          </div>
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Email (optioneel)
          </div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jij@voorbeeld.nl"
            type="email"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </label>

        {/* Honeypot veld: bots vullen dit vaak in, echte gebruikers niet */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            display: "none",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Versturen..." : "Verstuur feedback"}
        </button>

        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Na versturen kun je het terugzien in Django Admin → Feedbacks.
        </div>
      </form>
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