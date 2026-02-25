// frontend/app/feedback/page.tsx
"use client";

import { useState } from "react";

// Dit formulier post feedback naar Django/DRF.
// We houden het MVP-simpel: message verplicht, email optioneel.
// Django doet de echte validatie (bijv. min_length=10), maar we geven ook basic UX feedback.

type ApiError =
  | { message?: string[]; email?: string[]; page_url?: string[]; detail?: string }
  | string;

export default function FeedbackPage() {
  // Form state
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  // Kleine client-side check: voorkomt onnodige request (backend check blijft leidend)
  const messageTooShort = message.trim().length > 0 && message.trim().length < 10;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Reset statusmeldingen
    setErrorText("");
    setSuccessId(null);

    // Simpele UX-validatie (backend blijft de waarheid)
    if (message.trim().length < 10) {
      setErrorText("Je bericht moet minimaal 10 tekens zijn.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // DRF kan de body dan als JSON lezen
        },
        body: JSON.stringify({
          // message is verplicht (jouw serializer)
          message: message.trim(),

          // email is optioneel; stuur alleen als er iets ingevuld is
          email: email.trim() ? email.trim() : "",

          // page_url is optioneel; handig voor jou om te zien waar iemand feedback gaf
          page_url: window.location.href,
        }),
      });

      // Als het misgaat (400/500), willen we de response lezen en toonbaar maken
      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";

        // Vaak stuurt DRF JSON errors terug bij 400; bij 500 in dev krijg je soms HTML
        if (contentType.includes("application/json")) {
          const data = (await res.json()) as ApiError;
          setErrorText(formatApiError(data));
        } else {
          const text = await res.text();
          setErrorText(`Fout (${res.status}). Backend gaf geen JSON terug.\n${text.slice(0, 300)}…`);
        }

        setLoading(false);
        return;
      }

      // Succes: DRF stuurt meestal het object terug met id
      const data = await res.json();
      setSuccessId(data.id ?? null);

      // Form leegmaken na succes
      setMessage("");
      setEmail("");
    } catch (err: any) {
      // Netwerkfout: Django uit, verkeerde URL, CORS, etc.
      setErrorText(`Netwerkfout: ${err?.message ?? "Onbekende fout"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Feedback</h1>

      <p style={{ marginTop: 8, marginBottom: 16 }}>
        Heb je een suggestie of mis je iets? Laat het weten. Dit komt direct bij ons binnen.
      </p>

      {/* Succesmelding */}
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

      {/* Foutmelding */}
      {errorText ? (
        <div
          style={{
            border: "1px solid #ffa39e",
            background: "#fff1f0",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            whiteSpace: "pre-wrap", // zodat \n netjes getoond wordt
          }}
        >
          <b>Er ging iets mis</b>
          <div style={{ marginTop: 6 }}>{errorText}</div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Jouw suggestie (verplicht)</div>

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

          {/* Kleine hint onder het veld */}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
            Minimaal 10 tekens.
            {messageTooShort ? " Je zit er nog onder." : ""}
          </div>
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Email (optioneel)</div>

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

// Zet DRF errors om naar een leesbare tekst voor de gebruiker.
// Voorbeeld DRF error: { "message": ["Ensure this field has at least 10 characters."] }
function formatApiError(data: ApiError): string {
  if (typeof data === "string") return data;

  const parts: string[] = [];

  if (data.detail) parts.push(data.detail);
  if (data.message?.length) parts.push(`Bericht: ${data.message.join(", ")}`);
  if (data.email?.length) parts.push(`Email: ${data.email.join(", ")}`);
  if (data.page_url?.length) parts.push(`Pagina: ${data.page_url.join(", ")}`);

  // Fallback als het een onverwacht JSON object is
  if (parts.length === 0) return JSON.stringify(data);

  return parts.join("\n");
}
