"use client";

import Image from "next/image";
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
  { href: "/faq", label: "FAQ" },
];

type SiteHeaderProps = {
  variant?: "default" | "homeGlass";
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated, logout, status, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const homeGlass = variant === "homeGlass";
  const displayName = user?.first_name || user?.username || user?.email || "Account";
  const savedActive = isActivePath(pathname, "/bewaard");
  const accountActive = isActivePath(pathname, "/account");

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`z-50 px-3 py-3 sm:px-5 ${
        homeGlass ? "fixed inset-x-0 top-0" : "sticky top-0"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`site-header-shell ${
            homeGlass
              ? "site-header-shell--home-glass"
              : "site-header-shell--default"
          }`}
        >
          <div className="relative flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full pr-2 text-neutral-950 outline-none transition duration-200 hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-lime-500/70"
              aria-label="Ga naar home"
            >
              <Image
                src="/images/uitjesplatform_logo_transparent.svg"
                alt=""
                aria-hidden="true"
                width={75}
                height={75}
                className="h-10 w-10 shrink-0 object-contain"
              />
              <span className="text-lg font-semibold tracking-tight">HI NEDERLAND</span>
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
                href="/bewaard"
                aria-current={savedActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[14px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 ${
                  savedActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-white/46 bg-white/34 text-neutral-800 hover:bg-white/58 hover:text-neutral-950"
                }`}
              >
                Bewaard
              </Link>

       
              {status === "checking" ? (
                <span className="inline-flex min-h-11 items-center rounded-full border border-white/46 bg-white/34 px-4 text-[13px] font-semibold text-neutral-600">
                  Account laden
                </span>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2 rounded-full border border-white/46 bg-white/34 p-1 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <Link
                    href="/account"
                    aria-current={accountActive ? "page" : undefined}
                    className={`max-w-36 truncate rounded-full px-1 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 ${
                      accountActive
                        ? "text-neutral-950 underline decoration-neutral-950/35 underline-offset-4"
                        : "text-neutral-800 hover:text-neutral-950"
                    }`}
                  >
                    {displayName}
                  </Link>
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
                    href="/bewaard"
                    aria-current={savedActive ? "page" : undefined}
                    className={`inline-flex min-h-12 items-center justify-center rounded-2xl border px-4 py-3 text-[15px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 ${
                      savedActive
                        ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_12px_28px_rgba(23,23,23,0.16)]"
                        : "border-white/52 bg-white/34 text-neutral-800 hover:bg-white/58"
                    }`}
                  >
                    Bewaard
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
                      <Link
                        href="/account"
                        aria-current={accountActive ? "page" : undefined}
                        className={`min-w-0 rounded-xl px-3 py-2 text-center text-[14px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 ${
                          accountActive
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-800 hover:bg-white/48"
                        }`}
                      >
                        Ingelogd als <span className="break-words">{displayName}</span>
                      </Link>
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
