// frontend/app/feedback-test/page.tsx
"use client";

import { useState } from "react";

export default function FeedbackTestPage() {
  const [message, setMessage] = useState("Dit is een test feedback bericht (min 10 tekens).");
  const [status, setStatus] = useState<string>("");

  async function sendFeedback() {
    setStatus("Versturen...");

    try {
      // We sturen JSON naar Django. Dit is precies wat je echte feedback pagina straks ook doet.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Zonder deze header kan DRF je body niet als JSON lezen
        },
        body: JSON.stringify({
          message, // moet >= 10 tekens (jouw serializer)
          email: "test@example.com",
          page_url: window.location.href,
        }),
      });

      // Als Django 400 teruggeeft, willen we de fouttekst zien
      if (!res.ok) {
        const text = await res.text();
        setStatus(`Fout (${res.status}): ${text}`);
        return;
      }

      const data = await res.json();
      setStatus(`Gelukt! Feedback id: ${data.id}`);
    } catch (err: any) {
      setStatus(`Netwerkfout: ${err.message}`);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Feedback POST test</h1>

      <label style={{ display: "block", marginBottom: 8 }}>
        Bericht:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: 6 }}
        />
      </label>

      <button onClick={sendFeedback} style={{ padding: "8px 12px" }}>
        Verstuur test feedback
      </button>

      <p style={{ marginTop: 12 }}>{status}</p>

      <p style={{ marginTop: 24 }}>
        Na een succesvolle POST zie je het terug in Django Admin → Feedbacks.
      </p>
    </main>
  );
}
