import type { CategoryKey } from "./types";

type CategoryTabsProps = {
  activeCategory: CategoryKey;
  counts: Record<CategoryKey, number>;
  onChange: (category: CategoryKey) => void;
};

const CATEGORY_OPTIONS: Array<{
  key: CategoryKey;
  label: string;
  activeClassName: string;
}> = [
  {
    key: "events",
    label: "Events",
    activeClassName: "bg-[#D6E7D8] text-[#1F2A1F]",
  },
  {
    key: "attractions",
    label: "Highlights",
    activeClassName: "bg-[#BFE293] text-[#2E4A1F]",
  },
  {
    key: "restaurants",
    label: "Restaurants",
    activeClassName: "bg-[#EEDFC7] text-[#3A2E1F]",
  },
  {
    key: "bars",
    label: "Bars",
    activeClassName: "bg-[#DFDFEA] text-[#2B2B39]",
  },
  {
    key: "thingsToDo",
    label: "Te doen",
    activeClassName: "bg-[#F3E6D6] text-[#43301F]",
  },
];

export default function CategoryTabs({
  activeCategory,
  counts,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = activeCategory === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-base font-semibold transition sm:px-6 sm:py-4 sm:text-lg ${
              isActive
                ? option.activeClassName + " shadow-sm"
                : "bg-white text-[#1b1b1b] ring-1 ring-black/10 hover:bg-[#f8f6f3]"
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-black/10 text-current"
                  : "bg-[#f4ede7] text-slate-600"
              }`}
            >
              {counts[option.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
