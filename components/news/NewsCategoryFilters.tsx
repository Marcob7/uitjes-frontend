import Link from "next/link";

import type { NewsCategory } from "@/lib/newsArticles";

type NewsCategoryFilter = {
  label: NewsCategory;
  queryValue: string;
};

type NewsCategoryFiltersProps = {
  categories: NewsCategoryFilter[];
  activeCategory: NewsCategory | null;
};

export default function NewsCategoryFilters({
  categories,
  activeCategory,
}: NewsCategoryFiltersProps) {
  return (
    <nav aria-label="Filter artikelen op categorie">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/nieuws"
            aria-current={activeCategory === null ? "page" : undefined}
            className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] ${
              activeCategory === null
                ? "border-[#1D5A46] bg-[#1D5A46] text-white shadow-[0_10px_22px_rgba(29,90,70,0.17)]"
                : "border-[#DCE1DC] bg-white/72 text-[#526159] hover:border-[#9EB9AC] hover:bg-white"
            }`}
          >
            Alles
          </Link>
        </li>
        {categories.map((category) => {
          const isActive = category.label === activeCategory;

          return (
            <li key={category.queryValue}>
              <Link
                href={`/nieuws?category=${encodeURIComponent(category.queryValue)}`}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] ${
                  isActive
                    ? "border-[#1D5A46] bg-[#1D5A46] text-white shadow-[0_10px_22px_rgba(29,90,70,0.17)]"
                    : "border-[#DCE1DC] bg-white/72 text-[#526159] hover:border-[#9EB9AC] hover:bg-white"
                }`}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
