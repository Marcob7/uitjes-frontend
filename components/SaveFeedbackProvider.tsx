"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SaveFeedbackKind = "added" | "removed";

type SaveFeedbackContextValue = {
  showSaveFeedback: (kind: SaveFeedbackKind) => void;
};

const SaveFeedbackContext = createContext<SaveFeedbackContextValue | null>(null);

const messages: Record<SaveFeedbackKind, string> = {
  added: "Uitje toegevoegd aan Opgeslagen",
  removed: "Uitje verwijderd uit Opgeslagen",
};

export function SaveFeedbackProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<SaveFeedbackKind | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaveFeedback = useCallback((kind: SaveFeedbackKind) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotice(kind);
    timeoutRef.current = setTimeout(() => {
      setNotice(null);
      timeoutRef.current = null;
    }, 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <SaveFeedbackContext.Provider value={{ showSaveFeedback }}>
      {children}
      {notice ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none fixed inset-x-4 bottom-5 z-[1200] mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-[#d5e8ae] bg-[#f6fbe9] px-4 py-3 text-sm font-semibold text-[#253019] shadow-[0_14px_34px_rgba(45,57,27,0.18)] sm:bottom-7"
        >
          <span aria-hidden="true" className="text-base leading-none">✓</span>
          <span>{messages[notice]}</span>
        </div>
      ) : null}
    </SaveFeedbackContext.Provider>
  );
}

export function useSaveFeedback() {
  const context = useContext(SaveFeedbackContext);

  if (!context) {
    throw new Error("useSaveFeedback must be used inside <SaveFeedbackProvider>");
  }

  return context;
}
