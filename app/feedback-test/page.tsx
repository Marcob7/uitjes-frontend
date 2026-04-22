// frontend/app/feedback-test/page.tsx
"use client";

import { useState } from "react";

export default function FeedbackTestPage() {
  const [message, setMessage] = useState("Dit is een test feedback bericht (min 10 tekens).");
  const [status, setStatus] = useState<string>("");

  async function sendFeedback() {
    setStatus("Versturen...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          email: "test@example.com",
          page_url: window.location.href,
        }),
      });

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
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)] sm:px-8 sm:py-8">
        <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[0.96] tracking-[-0.05em]">
          Feedback POST test
        </h1>

        <label className="mt-6 block">
          <span className="text-sm font-semibold">Bericht</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-2 min-h-[140px] w-full rounded-[1.5rem] border border-[#ddd6cb] bg-[#fcfaf7] px-4 py-3 text-base outline-none"
          />
        </label>

        <button
          onClick={sendFeedback}
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#171717] px-5 text-sm font-semibold text-white sm:rounded-full"
        >
          Verstuur test feedback
        </button>

        <p className="mt-4 text-sm text-[#5d5449]">{status}</p>

        <p className="mt-6 text-xs text-[#6e6458]">
          Na een succesvolle POST zie je het terug in Django Admin, onder Feedbacks.
        </p>
      </div>
    </main>
  );
}
