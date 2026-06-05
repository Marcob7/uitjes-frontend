"use client";

import Link from "next/link";

import { useAuth } from "@/components/AuthProvider";

function getDisplayName(user: ReturnType<typeof useAuth>["user"]) {
  return user?.first_name || user?.username || user?.email || "Je account";
}

export default function AccountPageClient() {
  const { isAuthenticated, logout, status, user } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="pt-4 lg:pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
            Account
          </p>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.055em]">
            Jouw profiel
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-neutral-700">
            Bekijk je loginstatus en ga snel door naar de plekken die je voor later hebt bewaard.
          </p>
          <p
            className="mt-4 inline-flex rounded-full border border-emerald-900/10 bg-white/62 px-4 py-2 text-sm font-semibold text-neutral-700"
            role={status === "checking" ? "status" : undefined}
          >
            {status === "checking"
              ? "Accountstatus controleren"
              : isAuthenticated
                ? "Ingelogd"
                : "Niet ingelogd"}
          </p>
        </section>

        <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/76 p-5 shadow-[0_24px_70px_rgba(57,43,27,0.11)] ring-1 ring-black/[0.03] backdrop-blur-xl sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(198,223,154,0.20),transparent_32%),radial-gradient(circle_at_92%_10%,rgba(122,213,217,0.12),transparent_30%)]" />
          <div className="relative">
            {status === "checking" ? (
              <p className="text-sm font-medium text-neutral-700" role="status">
                Account laden...
              </p>
            ) : isAuthenticated && user ? (
              <div className="grid gap-7">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Accountstatus
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                    Ingelogd als {displayName}
                  </h2>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div className="flex flex-col gap-1 border-t border-neutral-900/10 pt-3 sm:flex-row sm:items-baseline sm:justify-between">
                      <dt className="font-semibold text-neutral-700">Naam</dt>
                      <dd className="break-words text-neutral-950">
                        {user.first_name || user.username || "Niet ingevuld"}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-neutral-900/10 pt-3 sm:flex-row sm:items-baseline sm:justify-between">
                      <dt className="font-semibold text-neutral-700">E-mail</dt>
                      <dd className="break-words text-neutral-950">
                        {user.email || "Niet beschikbaar"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/bewaard"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(23,23,23,0.18)] transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                  >
                    Bekijk bewaard
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white/72 px-5 text-sm font-semibold text-neutral-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                  >
                    Naar FAQ
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white/72 px-5 text-sm font-semibold text-neutral-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 sm:w-auto"
                >
                  Uitloggen
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Niet ingelogd
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                    Log in om je account te bekijken
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
                    Daarna zie je hier je accountstatus en kun je direct naar je bewaarde uitjes.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(23,23,23,0.18)] transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 sm:w-auto"
                >
                  Inloggen
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
