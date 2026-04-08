import type { CategoryKey } from "./types";

type CategoryTabsProps = {
  activeCategory: CategoryKey;
  onChange: (category: CategoryKey) => void;
};

const CATEGORY_OPTIONS: Array<{
  key: CategoryKey;
  label: string;
  count: number;
  icon: string;
  activeClassName: string;
}> = [
  {
    key: "attractions",
    label: "Kunst",
    count: 3,
    icon: "◔",
    activeClassName: "bg-[#BFE293] text-[#2E4A1F]",
  },
  {
    key: "events",
    label: "Muziek",
    count: 4,
    icon: "♪",
    activeClassName: "bg-[#D6E7D8] text-[#1F2A1F]",
  },
  {
    key: "thingsToDo",
    label: "Theater",
    count: 3,
    icon: "◕",
    activeClassName: "bg-[#DFDFEA] text-[#2B2B39]",
  },
  {
    key: "restaurants",
    label: "Food",
    count: 2,
    icon: "⌘",
    activeClassName: "bg-[#EEDFC7] text-[#3A2E1F]",
  },
];

export default function CategoryTabs({
  activeCategory,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = activeCategory === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`inline-flex items-center gap-3 rounded-full px-6 py-4 text-lg font-semibold transition ${
              isActive
                ? option.activeClassName + " shadow-sm"
                : "bg-white text-[#1b1b1b] ring-1 ring-black/10 hover:bg-[#f8f6f3]"
            }`}
          >
            <span className="text-lg leading-none">{option.icon}</span>
            <span>
              {option.label} ({option.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}