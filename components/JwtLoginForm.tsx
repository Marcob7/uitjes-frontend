"use client";

import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/AuthProvider";

export default function JwtLoginForm() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inloggen is niet gelukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div>
        <label
          htmlFor="jwt-identifier"
          className="text-sm font-semibold text-neutral-900"
        >
          E-mail of gebruikersnaam
        </label>
        <input
          id="jwt-identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          disabled={loading}
          required
          className="mt-2 min-h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-base text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 disabled:bg-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor="jwt-password"
          className="text-sm font-semibold text-neutral-900"
        >
          Wachtwoord
        </label>
        <input
          id="jwt-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          required
          className="mt-2 min-h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-base text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 disabled:bg-neutral-100"
        />
      </div>

      {error ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !identifier.trim() || !password}
        className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(23,23,23,0.18)] transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 disabled:opacity-55"
      >
        {loading ? "Inloggen..." : "Inloggen"}
      </button>
    </form>
  );
}
