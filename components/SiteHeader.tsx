"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { href: "/", label: "Home" },  
  { href: "/inspiratie", label: "Inspiratie" },
  { href: "/jaarkalender", label: "Jaarkalender" },
  { href: "/event-details", label: "Uitgelichte Events" },
  { href: "/festivals/kalender", label: "Festivals" },
  { href: "/feedback", label: "Feedback" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout, status, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = user?.first_name || user?.username || user?.email || "Account";

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-5">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(255,255,255,0.43)_48%,rgba(226,244,237,0.52))] shadow-[0_22px_70px_rgba(24,37,30,0.14)] ring-1 ring-black/[0.03] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,255,255,0.88),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(190,242,100,0.26),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/80" />

          <div className="relative flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full pr-2 text-neutral-950 outline-none transition duration-200 hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-lime-500/70"
              aria-label="Ga naar home"
            >
              <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/65 bg-[radial-gradient(circle_at_30%_20%,#ffffff,rgba(232,242,208,0.86)_42%,rgba(163,230,53,0.34))] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_28px_rgba(68,92,38,0.18)]">
                <span className="h-3.5 w-3.5 rounded-full bg-neutral-950 shadow-[10px_4px_0_rgba(22,101,52,0.42),-7px_8px_0_rgba(15,118,110,0.34)]" />
              </span>
              <span className="text-lg font-semibold tracking-tight">Uitjes NL</span>
            </Link>

            <nav aria-label="Hoofdnavigatie" className="hidden min-w-0 flex-1 justify-center lg:flex">
              <ul className="flex min-w-0 items-center gap-1 rounded-full border border-white/45 bg-white/28 p-1 text-[14px] font-semibold text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <li key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`inline-flex min-h-10 items-center rounded-full px-3.5 transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 ${
                          active
                            ? "bg-neutral-950 text-white shadow-[0_10px_26px_rgba(23,23,23,0.18)]"
                            : "text-neutral-700 hover:bg-white/58 hover:text-neutral-950"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/saved"
                className="inline-flex min-h-11 items-center rounded-full border border-white/46 bg-white/34 px-4 text-[14px] font-semibold text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 hover:bg-white/58 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
              >
                Mijn lijst
              </Link>

              <Link
                href="/inspiratie"
                className="inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(23,23,23,0.2)] transition duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
              >
                Inspiratie
              </Link>

              {status === "checking" ? (
                <span className="inline-flex min-h-11 items-center rounded-full border border-white/46 bg-white/34 px-4 text-[13px] font-semibold text-neutral-600">
                  Account laden
                </span>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2 rounded-full border border-white/46 bg-white/34 p-1 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <span className="max-w-36 truncate text-[13px] font-semibold text-neutral-800">
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex min-h-9 items-center rounded-full bg-neutral-950 px-3 text-[13px] font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                  >
                    Uitloggen
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center rounded-full border border-white/46 bg-white/34 px-4 text-[14px] font-semibold text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 hover:bg-white/58 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                >
                  Inloggen
                </Link>
              )}
            </div>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/36 text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_26px_rgba(24,37,30,0.12)] backdrop-blur-xl transition duration-200 hover:bg-white/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 lg:hidden"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Sluit menu" : "Open menu"}
              </span>

              <span className="flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                    mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                    mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          {mobileMenuOpen && (
            <div id="mobile-menu" className="relative border-t border-white/45 lg:hidden">
              <nav
                aria-label="Mobiele hoofdnavigatie"
                className="px-3 pb-4 pt-3 sm:px-4"
              >
                <ul className="grid gap-1">
                  {navItems.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                      <li key={`mobile-${item.href}-${item.label}`}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-2xl px-4 py-3 text-[15px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 ${
                            active
                              ? "bg-neutral-950 text-white shadow-[0_12px_28px_rgba(23,23,23,0.16)]"
                              : "text-neutral-800 hover:bg-white/48 hover:text-neutral-950"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 grid gap-2 border-t border-white/45 pt-3">
                  <Link
                    href="/saved"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/52 bg-white/34 px-4 py-3 text-[15px] font-semibold text-neutral-800 transition duration-200 hover:bg-white/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                  >
                    Mijn lijst
                  </Link>

                  <Link
                    href="/inspiratie"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(23,23,23,0.2)] transition duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                  >
                    Inspiratie
                  </Link>

                  {status === "checking" ? (
                    <div className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/52 bg-white/34 px-4 py-3 text-[15px] font-semibold text-neutral-700">
                      Account laden
                    </div>
                  ) : isAuthenticated ? (
                    <div className="grid gap-2 rounded-2xl border border-white/52 bg-white/34 p-3">
                      <div className="min-w-0 text-center text-[14px] font-semibold text-neutral-800">
                        Ingelogd als <span className="break-words">{displayName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-950 px-4 text-[14px] font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                      >
                        Uitloggen
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/52 bg-white/34 px-4 py-3 text-[15px] font-semibold text-neutral-800 transition duration-200 hover:bg-white/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                    >
                      Inloggen
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
