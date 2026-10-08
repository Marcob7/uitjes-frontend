"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppSearchInput } from "@/components/ui/app";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { normalizeSearchQuery } from "@/lib/searchIntent";

type SearchFormProps = {
  initialQuery: string;
  className?: string;
};

export default function SearchForm({ initialQuery, className }: SearchFormProps) {
  const router = useRouter();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  // An empty URL is an initial state, not a failed search.  Only a submit of
  // an empty value should make the validation message visible.
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = normalizeSearchQuery(searchParams.get("query") ?? searchParams.get("q"));

  useEffect(() => {
    setQuery(urlQuery);
    setError(null);
  }, [urlQuery]);

  function submitSearch(value: string) {
    const normalizedQuery = normalizeSearchQuery(value);
    if (!normalizedQuery) {
      setError(t("search.emptyQuery"));
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
      placeholder={t("search.placeholder")}
      submitLabel={t("search.submit")}
      errorMessage={error}
      statusMessage={isPending ? t("search.pending") : null}
      isSubmitting={isPending}
      disableSubmitWhileSubmitting={false}
      className={className}
      contentClassName="flex-row items-center"
      inputClassName="min-h-12"
      submitButtonClassName="!border-[#1d5a46] !bg-[#1d5a46] !text-white hover:!bg-[#164a3a]"
    />
  );
}
