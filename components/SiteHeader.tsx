"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / merknaam */}
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight text-neutral-900"
          aria-label="Ga naar home"
          onClick={closeMenu}
        >
      <Image
  src="/images/cider.png"
  alt="Logo"
  width={75}
  height={75}
  className="object-contain"
/>  <span>Reuring</span>
        </Link>

        {/* Desktop navigatie */}
        <nav aria-label="Hoofdnavigatie" className="hidden md:flex">
          <ul className="flex items-center gap-8 text-[15px] font-medium text-neutral-700">
            <li>
              <Link href="/" className="transition-colors hover:text-neutral-950">
                Home
              </Link>
            </li>
            <li>
              <Link href="/ontdek" className="transition-colors hover:text-neutral-950">
                Ontdek
              </Link>
            </li>
            <li>
              <Link href="/saved" className="transition-colors hover:text-neutral-950">
                Bewaard
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="transition-colors hover:text-neutral-950">
                Feedback
              </Link>
            </li>
          </ul>
        </nav>

        {/* Rechter acties desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/saved"
            className="text-[15px] font-medium text-neutral-700 transition-colors hover:text-neutral-950"
          >
            Mijn lijst
          </Link>

          <Link
            href="/ontdek"
            className="inline-flex items-center justify-center rounded-2xl bg-lime-300 px-5 py-3 text-[15px] font-semibold text-neutral-950 transition hover:bg-lime-400"
          >
            Ontdek uitjes
          </Link>
        </div>

        {/* Hamburger knop mobiel */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 text-neutral-900 transition hover:bg-neutral-50 md:hidden"
        >
          <span className="sr-only">
            {mobileMenuOpen ? "Sluit menu" : "Open menu"}
          </span>

          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${
                mobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                mobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${
                mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobiel menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-neutral-200 bg-white md:hidden"
        >
          <nav
            aria-label="Mobiele hoofdnavigatie"
            className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6"
          >
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/ontdek"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  Ontdek
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  Bewaard
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  Feedback
                </Link>
              </li>
            </ul>

            <div className="mt-4 flex flex-col gap-3 border-t border-neutral-200 pt-4">
              <Link
                href="/saved"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-3 text-[15px] font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                Mijn lijst
              </Link>

              <Link
                href="/ontdek"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-2xl bg-lime-300 px-5 py-3 text-[15px] font-semibold text-neutral-950 transition hover:bg-lime-400"
              >
                Ontdek uitjes
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}