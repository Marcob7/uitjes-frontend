"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { href: "/", label: "Ontdek" },
  { href: "/inspiratie", label: "Inspiratie" },
  { href: "/jaarkalender", label: "Agenda" },
  { href: "/event-details", label: "Events" },
  { href: "/festivals/kalender", label: "Festivals" },
  { href: "/faq", label: "FAQ" },
];

type NavBarProps = {
  position?: "absolute" | "fixed";
};

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar({ position = "absolute" }: NavBarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header
      className={`${position} inset-x-0 top-0 z-[1100] px-4 pt-4 sm:px-6 md:pt-[18px]`}
    >
      <div className="mx-auto flex w-full max-w-[1150px] items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group inline-flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label="Ga naar de homepage van DOEN"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-[1.04]">
            <Image
              src="/images/uitjesplatform_logo_transparent.svg"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span
            className={`whitespace-nowrap text-[15px] font-bold tracking-[-0.035em] sm:text-[16px] ${
              isHome
                ? "text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.24)]"
                : "text-[#171b1c]"
            }`}
          >
            DOEN<span className={isHome ? "text-white/80" : "text-[#171b1c]/68"}>.</span>
          </span>
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden min-w-0 flex-1 lg:block">
          <ul className="flex items-center justify-center gap-[clamp(1rem,2.1vw,2rem)]">
            {navigationItems.map((item) => {
              const active = isCurrentPath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex py-2 text-[13px] font-medium leading-none tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${
                      active
                        ? isHome
                          ? "text-white focus-visible:ring-white/90"
                          : "text-[#171b1c] focus-visible:ring-[#171b1c]/70"
                        : isHome
                          ? "text-white/67 hover:text-white focus-visible:ring-white/90"
                          : "text-[#171b1c]/72 hover:text-[#171b1c] focus-visible:ring-[#171b1c]/70"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            href="/login"
            className="inline-flex h-[38px] items-center justify-center rounded-full bg-[#f1f2f2] px-4 text-[13px] font-semibold text-[#131719] shadow-[0_8px_22px_rgba(0,0,0,0.13)] outline-none transition duration-200 hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.19)] focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            Inloggen
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="home-navigation-menu"
            className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border outline-none backdrop-blur-sm transition focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent lg:hidden ${
              isHome
                ? "border-white/28 bg-white/10 text-white hover:bg-white/18 focus-visible:ring-white/90"
                : "border-[#171b1c]/14 bg-white/72 text-[#171b1c] hover:bg-white focus-visible:ring-[#171b1c]/70"
            }`}
          >
            <span className="sr-only">
              {mobileMenuOpen ? "Sluit menu" : "Open menu"}
            </span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span
                className={`block h-px w-4 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-opacity duration-200 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="home-navigation-menu"
          className="mx-auto mt-3 max-w-[1150px] rounded-[1.35rem] border border-white/15 bg-[#061218]/78 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobiele hoofdnavigatie">
            <ul className="grid gap-1">
              {navigationItems.map((item) => {
                const active = isCurrentPath(pathname, item.href);

                return (
                  <li key={`mobile-${item.href}`}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-11 items-center rounded-[0.95rem] px-4 text-[15px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/90 ${
                        active
                          ? "bg-white text-[#101617]"
                          : "text-white/82 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
