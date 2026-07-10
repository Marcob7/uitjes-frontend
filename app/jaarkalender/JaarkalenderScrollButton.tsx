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

export function JaarkalenderScrollButton({
  targetId,
  label = "Bekijk kalender",
}: {
  targetId: string;
  label?: string;
}) {
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
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#00733d] px-7 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,95,51,0.18)] transition hover:-translate-y-0.5 hover:bg-[#005f33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008247]"
    >
      {label}
      <ArrowIcon />
    </button>
  );
}
