import type { ReactNode, RefObject } from "react";

import { DialogShell, IconButton } from "@/components/ui";

type JaarkalenderFilterDialogProps = {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  dialogRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/** Presentational shell only; parent owns filter values, focus handling and URL state. */
export function JaarkalenderFilterDialog({ open, title, closeLabel, onClose, dialogRef, children }: JaarkalenderFilterDialogProps) {
  if (!open) return null;

  return <div className="fixed inset-0 z-[1200] flex items-end justify-center overflow-y-auto bg-[rgba(34,26,20,0.28)] px-3 py-3 backdrop-blur-[6px] sm:items-center sm:px-4 sm:py-8" onClick={onClose}>
    <DialogShell ref={dialogRef} labelledBy="jaarkalender-filter-title" className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.4rem] border border-white/65 bg-[linear-gradient(180deg,#f9f5ee_0%,#f7f2ea_100%)] shadow-[0_28px_100px_rgba(52,38,25,0.22)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[2rem]" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4 border-b border-[#f0e2d6] px-5 py-5 sm:px-7 sm:py-6"><h3 id="jaarkalender-filter-title" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#171511] sm:text-4xl">{title}</h3><IconButton aria-label={closeLabel} onClick={onClose} className="rounded-full bg-white/80 text-[#4f4339] transition hover:bg-[#eddccd] focus-visible:outline-[#9cc84e]"><CloseIcon /></IconButton></div>
      {children}
    </DialogShell>
  </div>;
}

function CloseIcon() { return <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
