"use client";

import { useEffect, useRef } from "react";

import type { ResultFilterKey } from "./types";
import { RESULT_FILTER_OPTIONS } from "./utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DialogShell, IconButton } from "@/components/ui";

type DiscoverResultsFilterDialogProps = {
  open: boolean;
  cityLabel: string;
  filters: ResultFilterKey[];
  dialogId: string;
  titleId: string;
  onChange: (filter: ResultFilterKey) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
};

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export default function DiscoverResultsFilterDialog({
  open,
  cityLabel,
  filters,
  dialogId,
  titleId,
  onChange,
  onApply,
  onReset,
  onClose,
}: DiscoverResultsFilterDialogProps) {
  const { t } = useLocale();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
    >
      <button
        type="button"
        aria-label={t("discover.closeFilters")}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <DialogShell
        id={dialogId}
        labelledBy={titleId}
        className="relative z-10 w-full max-w-md overflow-y-auto rounded-3xl border border-[#dfd4c6] bg-[#fffaf2] p-5 text-[#171511] shadow-xl sm:p-6"
        style={{ maxHeight: "calc(100dvh - 2rem)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id={titleId}
              className="text-2xl font-semibold leading-none tracking-[-0.03em] text-[#171511]"
            >
              {t("search.filters")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#665d54]">
              {t("discover.filterIntro", { city: cityLabel })}
            </p>
          </div>
          <IconButton
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t("discover.closeFilters")}
            className="rounded-full border border-[#dfd4c6] bg-white/72 text-[#4b3a28] shadow-[0_10px_22px_rgba(83,65,45,0.08)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-[#8aa449]"
          >
            <CloseIcon className="h-5 w-5" />
          </IconButton>
        </div>

        <fieldset className="mt-6 space-y-3">
          <legend className="text-sm font-semibold text-[#4b3a28]">
            {t("discover.filterOptions")}
          </legend>
          {RESULT_FILTER_OPTIONS.map((filter) => {
            const checked = filters.includes(filter.id);

            return (
              <label
                key={filter.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left shadow-[0_10px_22px_rgba(83,65,45,0.05)] transition ${
                  checked
                    ? "border-[#b8df71] bg-[#e8f6cf] text-[#344125]"
                    : "border-[#dfd4c6] bg-white/68 text-[#4b3a28] hover:bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(filter.id)}
                  className="mt-1 h-4 w-4 rounded border-[#b8aa98] accent-[#405028] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449]"
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <span>{filter.label}</span>
                    {checked ? (
                      <span className="rounded-full bg-[#405028] px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white">
                        {t("discover.active")}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#665d54]">
                    {filter.description}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#d6c9b8] bg-white/68 px-5 py-2.5 text-sm font-semibold text-[#4b3a28] shadow-[0_12px_28px_rgba(83,65,45,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
          >
            {t("common.clear")}
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#cfe2a6] bg-[#e8f2d0] px-5 py-2.5 text-sm font-semibold text-[#162016] shadow-[0_12px_28px_rgba(109,144,51,0.12)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
          >
            {t("discover.apply")}
          </button>
        </div>
      </DialogShell>
    </div>
  );
}
