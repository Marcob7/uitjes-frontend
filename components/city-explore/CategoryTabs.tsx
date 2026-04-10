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
    activeClassName: "bg-[#b8ea72] text-[#23321a]",
  },
  {
    key: "attractions",
    label: "Highlights",
    activeClassName: "bg-[#eee1cf] text-[#4c3a24]",
  },
  {
    key: "restaurants",
    label: "Restaurants",
    activeClassName: "bg-[#f2ddd2] text-[#56372d]",
  },
  {
    key: "bars",
    label: "Bars",
    activeClassName: "bg-[#dfe1ef] text-[#323548]",
  },
  {
    key: "thingsToDo",
    label: "Te doen",
    activeClassName: "bg-[#e9e4d3] text-[#49402d]",
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
            aria-label={`${option.label} (${counts[option.key]})`}
            className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition sm:px-6 ${
              isActive
                ? `${option.activeClassName} shadow-[0_10px_24px_rgba(69,76,34,0.10)]`
                : "bg-[#f4ece2] text-[#5e5548] hover:bg-[#ece2d6]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
