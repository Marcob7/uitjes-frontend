import Link from "next/link";

type FestivalView = "list" | "calendar" | "map";

type FestivalViewToggleProps = {
  currentView: FestivalView;
  className?: string;
};

const toggleItems: Array<{
  key: FestivalView;
  label: string;
  href: string;
}> = [
  { key: "calendar", label: "Kalender", href: "/festivals/kalender" },
  { key: "list", label: "Lijst", href: "/festivals/lijst" },
  { key: "map", label: "Kaart", href: "/festivals/kaart" },
];

export default function FestivalViewToggle({
  currentView,
  className = "",
}: FestivalViewToggleProps) {
  return (
    <nav aria-label="Festivalweergave" className={className}>
      <div className="grid w-full grid-cols-3 rounded-[1.4rem] border border-[#e1d9ce] bg-[#f4efe7] p-1 shadow-[0_10px_22px_rgba(60,44,23,0.05)] sm:inline-flex sm:w-auto sm:rounded-full">
        {toggleItems.map((item) => {
          const active = item.key === currentView;

          return active ? (
            <span
              key={item.key}
              className="relative inline-flex min-h-11 items-center justify-center rounded-[1rem] bg-white px-3 text-sm font-semibold text-[#171511] shadow-[0_8px_18px_rgba(60,44,23,0.08)] sm:rounded-full sm:px-5"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              className="relative inline-flex min-h-11 items-center justify-center rounded-[1rem] px-3 text-sm font-medium text-[#62574d] transition hover:bg-white/70 hover:text-[#171511] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] sm:rounded-full sm:px-5"
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
