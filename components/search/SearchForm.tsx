"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppSearchInput } from "@/components/ui/app";
import { normalizeSearchQuery } from "@/lib/searchIntent";

type SearchFormProps = { initialQuery: string; showEmptyFeedback?: boolean };

export default function SearchForm({ initialQuery, showEmptyFeedback = false }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(showEmptyFeedback ? "Vul eerst een zoekterm in." : null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = normalizeSearchQuery(searchParams.get("query"));

  useEffect(() => {
    setQuery(urlQuery);
    setError(urlQuery ? null : showEmptyFeedback ? "Vul eerst een zoekterm in." : null);
  }, [showEmptyFeedback, urlQuery]);

  function submitSearch(value: string) {
    const normalizedQuery = normalizeSearchQuery(value);
    if (!normalizedQuery) {
      setError("Vul eerst een zoekterm in.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setQuery(normalizedQuery);
    startTransition(() => router.push(`/zoeken?query=${encodeURIComponent(normalizedQuery)}`));
  }

  return (
    <AppSearchInput
      inputId="site-search"
      inputRef={inputRef}
      value={query}
      onChange={(value) => { setQuery(value); setError(null); }}
      onSubmit={submitSearch}
      onClear={() => {
        setQuery("");
        setError(null);
        startTransition(() => router.push("/zoeken"));
      }}
      placeholder="Zoek op stad, activiteit of festival"
      submitLabel="Zoek"
      errorMessage={error}
      statusMessage={isPending ? "Zoeken…" : null}
      isSubmitting={isPending}
      inputClassName="min-h-12"
    />
  );
}
