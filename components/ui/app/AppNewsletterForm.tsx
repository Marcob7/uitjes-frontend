"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";

export type AppNewsletterFormProps = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (email: string) => void | Promise<void>;
  className?: string;
};

export function AppNewsletterForm({
  title,
  description,
  placeholder = "Je e-mailadres",
  buttonLabel = "Aanmelden",
  onSubmit,
  className,
}: AppNewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");

    if (!email.trim()) {
      setStatus("error");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.(email.trim());
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("rounded-[1.8rem] bg-[#f7f3ef] p-5 sm:p-6", className)}>
      {title ? (
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#171511]">
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[#675e55]">{description}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <AppInput
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          required
          wrapperClassName="flex-1"
          className="bg-white"
          error={status === "error" ? "Vul een geldig e-mailadres in." : undefined}
        />
        <AppButton
          type="submit"
          variant="dark"
          size="md"
          disabled={isSubmitting}
          className="sm:self-start"
        >
          {isSubmitting ? "Bezig..." : buttonLabel}
        </AppButton>
      </form>

      {status === "success" ? (
        <p className="mt-3 text-sm font-medium text-[#4d6630]">
          Je aanmelding staat klaar. De backend koppelen we later.
        </p>
      ) : null}
    </div>
  );
}
