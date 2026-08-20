"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import {
  signupForNewsletter,
  type NewsletterSignupInput,
} from "@/lib/newsletter";

type NewsLetterSectionProps = {
  className?: string;
  interests: NonNullable<NewsletterSignupInput["interests"]>;
  source: string;
};

export function NewsLetterSection({
  className,
  interests,
  source,
}: NewsLetterSectionProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageId = useId();
  const headingId = useId();

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
      frequency: "monthly",
      interests,
      source,
    });

    setStatus(result.ok ? "success" : "error");
    setMessage(result.message);

    if (result.ok) {
      setEmail("");
    }

    setIsSubmitting(false);
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden bg-white text-[#171717]",
        className
      )}
    >
      <div className="mx-auto flex min-h-[42rem] max-w-[48rem] flex-col items-center justify-center px-5 py-20 text-center sm:min-h-screen sm:-translate-y-[3.25rem] sm:px-6">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[13px] bg-[#171717]">
          <Image
            src="/images/uitjesplatform_logo_transparent.svg"
            alt=""
            aria-hidden="true"
            width={30}
            height={30}
            className="h-[30px] w-[30px] object-contain brightness-0 invert"
          />
        </div>

        <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-2 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-[-0.01em] text-[#242424]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#171717]" aria-hidden="true" />
          Nieuwe evenementen
        </p>

        <h2
          id={headingId}
          className="mt-7 max-w-[38rem] text-[clamp(2.25rem,3.1vw,2.5rem)] leading-[1.02] tracking-[-0.05em] [max-inline-size:none]"
        >
          Mis geen nieuwe evenementen
        </h2>

        <p className="mt-3 max-w-[38rem] text-[15px] leading-6 text-[#737373] sm:text-base">
          Ontvang updates wanneer er nieuwe evenementen aan de jaarkalender
          worden toegevoegd. Handig als je vooruit wilt plannen of niets leuks
          in jouw omgeving wilt missen.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex w-full max-w-[28rem] items-center gap-2"
          aria-label="Aanmelden voor nieuwsbriefupdates"
        >
          <label className="sr-only" htmlFor={`${messageId}-email`}>
            E-mailadres
          </label>
          <input
            id={`${messageId}-email`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="E-mailadres"
            autoComplete="email"
            required
            aria-invalid={status === "error" ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className="min-h-10 min-w-0 flex-1 rounded-md border border-[#e5e5e5] bg-white px-3.5 text-sm font-normal text-[#171717] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#8db5e7] focus:ring-2 focus:ring-[#cfe2fa]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-[#171717] px-3.5 text-sm font-semibold text-white transition hover:bg-[#303030] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? "Bezig..." : "Aanmelden"}
          </button>
        </form>

        {message ? (
          <p
            id={messageId}
            role="status"
            aria-live="polite"
            className={`mt-4 max-w-[28rem] text-sm font-medium leading-6 ${
              status === "success" ? "text-[#26724a]" : "text-[#b42318]"
            }`}
          >
            {message}
          </p>
        ) : (
          <p className="mt-5 text-sm leading-6 text-[#737373]">
            Alleen relevante updates. Afmelden kan altijd.
          </p>
        )}
      </div>
    </section>
  );
}
