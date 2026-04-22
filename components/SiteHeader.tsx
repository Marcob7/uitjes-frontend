"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type RgbColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type HeaderTheme = {
  bg: string;
  text: string;
  border: string;
  panelBg: string;
  hoverBg: string;
  elevatedBg: string;
  elevatedBorder: string;
  ctaBg: string;
  ctaText: string;
  ctaHover: string;
};

const DEFAULT_HEADER_THEME: HeaderTheme = {
  bg: "#FDFBF7",
  text: "#171717",
  border: "rgba(58,78,35,0.10)",
  panelBg: "#FDFBF7",
  hoverBg: "rgba(255,255,255,0.78)",
  elevatedBg: "#ffffff",
  elevatedBorder: "rgba(58,78,35,0.14)",
  ctaBg: "#bef264",
  ctaText: "#171717",
  ctaHover: "#a3e635",
};

function clamp(value: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function parseColor(value: string | null | undefined): RgbColor | null {
  if (!value) {
    return null;
  }

  const input = value.trim();

  if (input.startsWith("#")) {
    const hex = input.slice(1);

    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }

    if (hex.length === 6) {
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
  }

  const rgbMatch = input.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i,
  );

  if (!rgbMatch) {
    return null;
  }

  return {
    r: clamp(Number(rgbMatch[1])),
    g: clamp(Number(rgbMatch[2])),
    b: clamp(Number(rgbMatch[3])),
    a: rgbMatch[4] ? Math.max(0, Math.min(1, Number(rgbMatch[4]))) : 1,
  };
}

function toRgbaString(color: RgbColor, alpha = color.a) {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${alpha})`;
}

function mixColors(base: RgbColor, overlay: RgbColor, amount: number): RgbColor {
  const ratio = Math.max(0, Math.min(1, amount));

  return {
    r: base.r + (overlay.r - base.r) * ratio,
    g: base.g + (overlay.g - base.g) * ratio,
    b: base.b + (overlay.b - base.b) * ratio,
    a: 1,
  };
}

function getLuminance(color: RgbColor) {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function getContrastRatio(first: RgbColor, second: RgbColor) {
  const lighter = Math.max(getLuminance(first), getLuminance(second));
  const darker = Math.min(getLuminance(first), getLuminance(second));

  return (lighter + 0.05) / (darker + 0.05);
}

function buildThemeFromColor(color: RgbColor): HeaderTheme {
  const darkText = parseColor("#171717")!;
  const lightText = parseColor("#FFFFFF")!;
  const textColor =
    getContrastRatio(color, darkText) >= getContrastRatio(color, lightText)
      ? darkText
      : lightText;

  const isDarkSurface = textColor === lightText;
  const elevatedBase = mixColors(color, textColor, isDarkSurface ? 0.1 : 0.04);
  const hoverBase = mixColors(color, textColor, isDarkSurface ? 0.16 : 0.06);

  return {
    bg: toRgbaString(color, 0.96),
    text: toRgbaString(textColor, 1),
    border: toRgbaString(textColor, isDarkSurface ? 0.18 : 0.1),
    panelBg: toRgbaString(color, 0.98),
    hoverBg: toRgbaString(hoverBase, isDarkSurface ? 0.9 : 1),
    elevatedBg: toRgbaString(elevatedBase, isDarkSurface ? 0.92 : 1),
    elevatedBorder: toRgbaString(textColor, isDarkSurface ? 0.2 : 0.12),
    ctaBg: isDarkSurface ? "#ffffff" : "#171717",
    ctaText: isDarkSurface ? "#171717" : "#ffffff",
    ctaHover: isDarkSurface ? "#f3f4f6" : "#0f0f0f",
  };
}

function applyAccessibleTextOverride(
  baseTheme: HeaderTheme,
  backgroundColor: RgbColor,
  preferredText: RgbColor | null,
) {
  if (!preferredText || getContrastRatio(backgroundColor, preferredText) < 4.5) {
    return baseTheme;
  }

  return {
    ...baseTheme,
    text: toRgbaString(preferredText, 1),
    border: toRgbaString(preferredText, 0.12),
    elevatedBorder: toRgbaString(preferredText, 0.16),
  };
}

function getThemeFromElement(element: HTMLElement | null): HeaderTheme | null {
  if (!element) {
    return null;
  }

  const style = window.getComputedStyle(element);
  const explicitBg =
    element.dataset.headerBg ?? style.getPropertyValue("--header-bg").trim();
  const explicitText =
    element.dataset.headerFg ?? style.getPropertyValue("--header-fg").trim();
  const backgroundColor = parseColor(explicitBg || style.backgroundColor);

  if (!backgroundColor || backgroundColor.a < 0.72) {
    return null;
  }

  const baseTheme = buildThemeFromColor(backgroundColor);

  if (!explicitText) {
    return baseTheme;
  }

  const textColor = parseColor(explicitText);
  return applyAccessibleTextOverride(baseTheme, backgroundColor, textColor);
}

function findThemeInAncestors(start: Element | null, boundary: HTMLElement | null) {
  let current = start instanceof HTMLElement ? start : null;

  while (current && current !== boundary) {
    const theme = getThemeFromElement(current);
    if (theme) {
      return theme;
    }
    current = current.parentElement;
  }

  return boundary ? getThemeFromElement(boundary) : null;
}

function findFallbackTheme(boundary: HTMLElement | null) {
  if (!boundary) {
    return DEFAULT_HEADER_THEME;
  }

  const pageRoot = boundary.firstElementChild as HTMLElement | null;
  if (!pageRoot) {
    return DEFAULT_HEADER_THEME;
  }

  const queue: HTMLElement[] = [pageRoot];
  let scanned = 0;

  while (queue.length > 0 && scanned < 40) {
    const current = queue.shift()!;
    scanned += 1;

    const rect = current.getBoundingClientRect();
    if (rect.height >= 24 && rect.bottom > 0) {
      const theme = getThemeFromElement(current);
      if (theme) {
        return theme;
      }
    }

    queue.push(...Array.from(current.children).slice(0, 6) as HTMLElement[]);
  }

  return DEFAULT_HEADER_THEME;
}

function isSameTheme(current: HeaderTheme, next: HeaderTheme) {
  return (
    current.bg === next.bg &&
    current.text === next.text &&
    current.border === next.border &&
    current.panelBg === next.panelBg &&
    current.elevatedBg === next.elevatedBg &&
    current.elevatedBorder === next.elevatedBorder &&
    current.ctaBg === next.ctaBg &&
    current.ctaText === next.ctaText
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const themeRef = useRef<HeaderTheme>(DEFAULT_HEADER_THEME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<HeaderTheme>(DEFAULT_HEADER_THEME);

  const closeMenu = () => setMobileMenuOpen(false);

  useLayoutEffect(() => {
    const contentRoot = document.getElementById("app-shell-content");
    let frame = 0;

    const updateTheme = () => {
      const header = headerRef.current;

      if (!header) {
        themeRef.current = DEFAULT_HEADER_THEME;
        setTheme(DEFAULT_HEADER_THEME);
        return;
      }

      const headerBounds = header.getBoundingClientRect();
      const sampleX = Math.max(24, Math.min(window.innerWidth / 2, window.innerWidth - 24));
      const sampleY = Math.min(window.innerHeight - 2, Math.max(headerBounds.bottom + 1, 2));
      const sampledElement = document.elementFromPoint(sampleX, sampleY);

      const nextTheme =
        findThemeInAncestors(sampledElement, contentRoot) ?? findFallbackTheme(contentRoot);

      if (!isSameTheme(themeRef.current, nextTheme)) {
        themeRef.current = nextTheme;
        setTheme(nextTheme);
      }
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateTheme);
    };

    scheduleUpdate();
    const delayedUpdate = window.setTimeout(scheduleUpdate, 120);
    window.addEventListener("load", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.clearTimeout(delayedUpdate);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  const headerStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
    borderColor: theme.border,
  } satisfies CSSProperties;

  const mutedTextStyle = { color: theme.text } satisfies CSSProperties;
  const elevatedStyle = {
    backgroundColor: theme.elevatedBg,
    color: theme.text,
    borderColor: theme.elevatedBorder,
  } satisfies CSSProperties;
  const panelStyle = {
    backgroundColor: theme.panelBg,
    borderColor: theme.border,
  } satisfies CSSProperties;
  const hoverableStyle = {
    color: theme.text,
  } satisfies CSSProperties;
  const ctaStyle = {
    backgroundColor: theme.ctaBg,
    color: theme.ctaText,
  } satisfies CSSProperties;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 backdrop-blur transition-[background-color,color] duration-200 ease-out"
      style={headerStyle}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo / merknaam */}
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight"
          aria-label="Ga naar home"
          onClick={closeMenu}
          style={hoverableStyle}
        >
          <span>Uitjes NL</span>
        </Link>

        {/* Desktop navigatie */}
        <nav aria-label="Hoofdnavigatie" className="hidden md:flex">
          <ul className="flex items-center gap-8 text-[15px] font-medium">
            <li>
              <Link href="/" className="transition-opacity hover:opacity-80" style={hoverableStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/jaarkalender"
                className="transition-opacity hover:opacity-80"
                style={hoverableStyle}
              >
                Jaarkalender
              </Link>
            </li>
            <li>
              <Link
                href="/inspiratie"
                className="transition-opacity hover:opacity-80"
                style={hoverableStyle}
              >
                Inspiratie
              </Link>
            </li>
            <li>
              <Link
                href="/inspiratie"
                className="transition-opacity hover:opacity-80"
                style={hoverableStyle}
              >
                Last minute
              </Link>
            </li>
            <li>
              <Link
                href="/event-details"
                className="transition-opacity hover:opacity-80"
                style={hoverableStyle}
              >
                Uitgelichte Events
              </Link>
            </li>
            <li>
              <Link
                href="/festivals"
                className="transition-opacity hover:opacity-80"
                style={hoverableStyle}
              >
                Festivals
              </Link>
            </li>
            <li>
              <Link
                href="/feedback"
                className="transition-opacity hover:opacity-80"
                style={hoverableStyle}
              >
                Feedback
              </Link>
            </li>
          </ul>
        </nav>

        {/* Rechter acties desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/saved"
            className="text-[15px] font-medium transition-opacity hover:opacity-80"
            style={mutedTextStyle}
          >
            Mijn lijst
          </Link>

          <Link
            href="/inspiratie"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-[15px] font-semibold transition duration-200 hover:brightness-[0.97]"
            style={ctaStyle}
          >
            Inspiratie
          </Link>
        </div>

        {/* Hamburger knop mobiel */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[0_8px_18px_rgba(48,64,28,0.08)] transition duration-200 hover:brightness-[0.98] md:hidden"
          style={elevatedStyle}
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
          className="border-t md:hidden"
          style={panelStyle}
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
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/jaarkalender"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Jaarkalender
                </Link>
              </li>
              <li>
                <Link
                  href="/inspiratie"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Inspiratie
                </Link>
              </li>
              <li>
                <Link
                  href="/inspiratie"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Last minute
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Bewaard
                </Link>
              </li>
              <li>
                <Link
                  href="/event-details"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Uitgelichte Events
                </Link>
              </li>
              <li>
                <Link
                  href="/festivals"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Festivals
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  onClick={closeMenu}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium transition-opacity hover:opacity-80"
                  style={hoverableStyle}
                >
                  Feedback
                </Link>
              </li>
            </ul>

            <div className="mt-4 flex flex-col gap-3 border-t pt-4" style={{ borderColor: theme.border }}>
              <Link
                href="/saved"
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border px-4 py-3 text-[15px] font-medium transition duration-200 hover:brightness-[0.98]"
                style={elevatedStyle}
              >
                Bewaard
              </Link>

              <Link
                href="/inspiratie"
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-[15px] font-semibold transition duration-200 hover:brightness-[0.97]"
                style={ctaStyle}
              >
                Inspiratie
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
