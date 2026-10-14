export type FestivalGenreFilter =
  | "all"
  | "techno"
  | "jazz"
  | "culinair"
  | "kunst";

export type FestivalGenreDefinition = {
  value: FestivalGenreFilter;
  labelKey:
    | "festival.allGenres"
    | "festival.genreTechno"
    | "festival.genreJazz"
    | "festival.genreCulinary"
    | "festival.genreArt";
  eventGenre: string | null;
};

export const FESTIVAL_GENRES = [
  { value: "all", labelKey: "festival.allGenres", eventGenre: null },
  { value: "techno", labelKey: "festival.genreTechno", eventGenre: "Techno" },
  { value: "jazz", labelKey: "festival.genreJazz", eventGenre: "Jazz" },
  { value: "culinair", labelKey: "festival.genreCulinary", eventGenre: "Culinair" },
  { value: "kunst", labelKey: "festival.genreArt", eventGenre: "Kunst" },
] as const satisfies ReadonlyArray<FestivalGenreDefinition>;

export const DEFAULT_FESTIVAL_GENRE: FestivalGenreFilter = "all";

export function parseFestivalGenre(value?: string | null): FestivalGenreFilter {
  const normalizedValue = value?.toLowerCase();

  return (
    FESTIVAL_GENRES.find((genre) => genre.value === normalizedValue)?.value ??
    DEFAULT_FESTIVAL_GENRE
  );
}

export function getFestivalGenreDefinition(genreValue: FestivalGenreFilter) {
  return FESTIVAL_GENRES.find((genre) => genre.value === genreValue)!;
}
