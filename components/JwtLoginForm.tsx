"use client";

import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AppInput } from "@/components/ui/app";
import LoginErrorAlert from "@/components/LoginErrorAlert";
import { getLoginErrorCode, type LoginErrorCode } from "@/lib/authErrors";

export default function JwtLoginForm({ onLoginAttempt }: { onLoginAttempt?: () => void }) {
  const { login } = useAuth();
  const { t } = useLocale();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<LoginErrorCode | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onLoginAttempt?.();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      setError(getLoginErrorCode(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <AppInput
          id="jwt-identifier"
          name="identifier"
          label={t("auth.identifier")}
          labelClassName="text-neutral-900"
          showRequiredIndicator={false}
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          disabled={loading}
          required
          className="min-h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-base text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 focus:bg-white disabled:bg-neutral-100 disabled:text-neutral-950 sm:text-base"
        />

      <AppInput
          id="jwt-password"
          name="password"
          label={t("auth.password")}
          labelClassName="text-neutral-900"
          showRequiredIndicator={false}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          required
          className="min-h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-base text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 focus:bg-white disabled:bg-neutral-100 disabled:text-neutral-950 sm:text-base"
        />

      {error ? <LoginErrorAlert code={error} /> : null}

      <button
        type="submit"
        disabled={loading || !identifier.trim() || !password}
        className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(23,23,23,0.18)] transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 disabled:opacity-55"
      >
        {loading ? t("common.loading") : t("auth.login")}
      </button>
    </form>
  );
}
