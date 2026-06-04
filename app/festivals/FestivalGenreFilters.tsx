"use client";

export const festivalGenreFilters = [
  "Alle genres",
  "Techno",
  "Jazz",
  "Culinair",
  "Kunst",
] as const;

export type FestivalGenreFilter = (typeof festivalGenreFilters)[number];

type FestivalGenreFiltersProps = {
  activeGenre: FestivalGenreFilter;
  onChange: (genre: FestivalGenreFilter) => void;
};

export function matchesFestivalGenre(
  genres: readonly string[],
  activeGenre: FestivalGenreFilter
) {
  return activeGenre === "Alle genres" || genres.includes(activeGenre);
}

export default function FestivalGenreFilters({
  activeGenre,
  onChange,
}: FestivalGenreFiltersProps) {
  return (
    <>
      {festivalGenreFilters.map((genre) => {
        const active = activeGenre === genre;

        return (
          <button
            key={genre}
            type="button"
            onClick={() => onChange(genre)}
            className={`min-h-11 rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:rounded-full ${
              active
                ? "bg-[#e8f2d0] text-[#3f5e1f]"
                : "bg-white/14 text-white/88 backdrop-blur-xl hover:bg-white/20"
            }`}
            aria-pressed={active}
          >
            {genre}
          </button>
        );
      })}
    </>
  );
}
