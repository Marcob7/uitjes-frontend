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
      <div className="grid w-full min-w-0 grid-cols-3 rounded-[1.35rem] border border-white/22 bg-white/12 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_18px_42px_rgba(6,10,12,0.18)] backdrop-blur-xl sm:inline-grid sm:w-auto sm:rounded-full">
        {toggleItems.map((item) => {
          const active = item.key === currentView;

          return active ? (
            <span
              key={item.key}
              className="relative inline-flex min-h-11 items-center justify-center rounded-[1rem] border border-white/55 bg-[#f4f7e7]/92 px-3 text-sm font-semibold text-[#182015] shadow-[0_10px_24px_rgba(7,13,11,0.18)] sm:rounded-full sm:px-5"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              className="relative inline-flex min-h-11 items-center justify-center rounded-[1rem] px-3 text-sm font-medium text-white/86 transition hover:bg-white/16 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:rounded-full sm:px-5"
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
