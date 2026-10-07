"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ShareActionProps = {
  /** The name that is shown by the device share sheet and in accessible labels. */
  title: string;
  /** A short, human-readable invitation. Defaults to a concise Dutch message. */
  text?: string;
  /** The canonical detail path or public URL to share. Query and hash state are discarded. */
  url: string;
  className?: string;
  label?: string;
};

type PopoverPosition = { top: number; left: number; width: number };

function ShareIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="5" cy="10" r="2" stroke="currentColor" strokeWidth="1.45" />
      <circle cx="14.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.45" />
      <circle cx="14.5" cy="15" r="2" stroke="currentColor" strokeWidth="1.45" />
      <path d="m6.8 9 5.05-2.75M6.8 11l5.05 2.75" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2e9d61] text-[11px] font-bold text-white">W</span>;
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.25" y="5.25" width="7.25" height="7.25" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.75 5.1V4.2c0-.75-.61-1.35-1.35-1.35H4.2c-.75 0-1.35.61-1.35 1.35V9.4c0 .75.61 1.35 1.35 1.35h.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function publicBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const parsed = new URL(configured);
      if (!/^(localhost|127(?:\.\d{1,3}){3})$/i.test(parsed.hostname)) return parsed.origin;
    } catch {
      // A malformed optional environment value should never break sharing.
    }
  }

  return window.location.origin;
}

function canonicalShareUrl(url: string) {
  const resolved = new URL(url, publicBaseUrl());
  resolved.search = "";
  resolved.hash = "";
  return resolved.toString();
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

/**
 * A reusable, canonical sharing control for concrete events and outings.
 * Devices with Web Share use their native app picker; desktop gets a compact
 * WhatsApp and copy-link menu instead of unreliable app-specific deep links.
 */
export default function ShareAction({
  title,
  text = `Dit lijkt me leuk: ${title}`,
  url,
  className,
  label = "Delen",
}: ShareActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => setIsMounted(true), []);

  const close = (returnFocus = true) => {
    setIsOpen(false);
    setPosition(null);
    setCopyStatus("idle");
    if (returnFocus) window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const openFallback = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = Math.min(304, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 12));
    const below = rect.bottom + 10;
    const top = below + 192 > window.innerHeight ? Math.max(12, rect.top - 202) : below;
    setPosition({ top, left, width: menuWidth });
    setCopyStatus("idle");
    setIsOpen(true);
  };

  const share = async () => {
    const shareUrl = canonicalShareUrl(url);
    if (typeof navigator.share !== "function") {
      openFallback();
      return;
    }

    try {
      await navigator.share({ title, text, url: shareUrl });
    } catch (error) {
      // Closing the native sheet is an expected user choice, not an error that
      // should unexpectedly open a second menu.
      if (error instanceof DOMException && error.name === "AbortError") return;
      openFallback();
    }
  };

  const copyLink = async () => {
    try {
      await copyText(canonicalShareUrl(url));
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popoverRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false);
    };
    const onViewportChange = () => close(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    window.setTimeout(() => popoverRef.current?.querySelector<HTMLElement>("a, button")?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [isOpen]);

  const shareUrl = isMounted ? canonicalShareUrl(url) : "";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`.trim())}`;
  const triggerClassName = className ?? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9d3c7] bg-white px-5 text-sm font-semibold text-[#294634] transition hover:bg-[#f2f6ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]";

  return <>
    <button
      ref={triggerRef}
      type="button"
      onClick={share}
      aria-label={`${label}: ${title}`}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className={triggerClassName}
    >
      <ShareIcon /> {label}
    </button>
    {isOpen && isMounted && position ? createPortal(
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={headingId}
        className="fixed z-[1250] rounded-[1.15rem] border border-[#d9ded5] bg-[#fffefa] p-2 shadow-[0_16px_46px_rgba(28,43,33,0.2)]"
        style={{ top: position.top, left: position.left, width: position.width }}
      >
        <p id={headingId} className="px-3 pb-2 pt-2 text-xs font-semibold text-[#536357]">Deel {title}</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => close(false)}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#253a2d] transition hover:bg-[#eef4eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#286e43]"
        >
          <WhatsAppIcon /> Deel via WhatsApp
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#253a2d] transition hover:bg-[#eef4eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#286e43]"
        >
          <CopyIcon /> {copyStatus === "success" ? "Link gekopieerd" : "Kopieer link"}
        </button>
        {copyStatus === "success" ? <p role="status" className="px-3 pb-2 pt-1 text-xs leading-5 text-[#346246]">De link naar {title} staat nu op je klembord.</p> : null}
        {copyStatus === "error" ? <p role="status" className="px-3 pb-2 pt-1 text-xs leading-5 text-[#994126]">Kopiëren lukt niet automatisch. Kopieer de link uit je adresbalk.</p> : null}
      </div>,
      document.body,
    ) : null}
  </>;
}
