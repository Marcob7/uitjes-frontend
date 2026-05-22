"use client";

import Link from "next/link";

import { useAuth } from "@/components/AuthProvider";
import JwtLoginForm from "@/components/JwtLoginForm";
import LoginWithGoogle from "@/components/LoginWithGoogle";

export default function LoginPage() {
  const { isAuthenticated, logout, status, user } = useAuth();

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <section className="pt-4 lg:pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
            Account
          </p>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] tracking-[-0.055em]">
            Inloggen
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-neutral-700">
            Gebruik je e-mail of gebruikersnaam voor JWT-login, of ga door met de
            bestaande Google login.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-emerald-900/10 bg-white/62 px-4 py-2 text-sm font-semibold text-neutral-700">
            {status === "checking"
              ? "Accountstatus controleren"
              : isAuthenticated && user
                ? `Ingelogd als ${user.username || user.email}`
                : "Nog niet ingelogd"}
          </p>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/76 p-5 shadow-[0_24px_70px_rgba(57,43,27,0.11)] ring-1 ring-black/[0.03] backdrop-blur-xl sm:p-7">
          {status === "checking" ? (
            <p className="text-sm font-medium text-neutral-700" role="status">
              Account controleren...
            </p>
          ) : isAuthenticated && user ? (
            <div className="grid gap-5">
              <div>
                <p className="text-sm font-semibold text-emerald-800">Ingelogd</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                  {user.first_name || user.username}
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  {user.email || user.username}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/saved"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(23,23,23,0.18)] transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                >
                  Naar mijn lijst
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                >
                  Uitloggen
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-7">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                  Inloggen met e-mail/gebruikersnaam
                </h2>
                <div className="mt-5">
                  <JwtLoginForm />
                </div>
              </div>

              <div className="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.025em] text-neutral-950">
                    Inloggen met Google
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    De bestaande Google login blijft beschikbaar.
                  </p>
                </div>
                <LoginWithGoogle />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
