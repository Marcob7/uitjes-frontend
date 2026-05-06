"use client";

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JaarkalenderScrollButton({ targetId }: { targetId: string }) {
  const scrollToCalendar = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      aria-controls={targetId}
      onClick={scrollToCalendar}
      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#e8f2d0] px-7 text-sm font-semibold text-[#1c1b15] shadow-[0_14px_36px_rgba(155,192,72,0.24)] transition hover:-translate-y-0.5 hover:bg-[#bde86d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9efad]"
    >
      Bekijk kalender
      <ArrowIcon />
    </button>
  );
}
