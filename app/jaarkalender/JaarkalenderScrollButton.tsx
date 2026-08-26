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
  variant = "primary",
}: {
  targetId: string;
  label?: string;
  variant?: "primary" | "secondary";
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
      className={`inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#13251f] active:translate-y-0 ${
        variant === "primary"
          ? "bg-[#f4f5ef] text-[#17221d] shadow-[0_14px_34px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:bg-white"
          : "border border-white/30 bg-white/8 text-white hover:border-white/55 hover:bg-white/14"
      }`}
    >
      {label}
      <ArrowIcon />
    </button>
  );
}
