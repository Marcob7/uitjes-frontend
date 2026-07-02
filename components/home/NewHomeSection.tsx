"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getSearchRoute } from "@/lib/searchIntent";
import DateSearchInput from "./DateSearchInput";

type NewHomeSectionProps = {
  className?: string;
  words?: string[];
};

const DEFAULT_WORDS = [
  "HI AMSTERDAM",
  "HI APELDOORN",
  "HI HAARLEM",
  "HI DEN HAAG",
  "HI ZWOLLE",
];

export default function NewHomeSection({
  className = "",
  words = DEFAULT_WORDS,
}: NewHomeSectionProps) {
  const router = useRouter();

  const [wordIndex, setWordIndex] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const currentWord = words[wordIndex] ?? "";
  const shownText = currentWord.slice(0, visibleLetters);

  useEffect(() => {
    if (words.length === 0 || currentWord.length === 0) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (visibleLetters < currentWord.length) {
      timeout = setTimeout(() => {
        setVisibleLetters((prev) => prev + 1);
      }, 85);
    } else {
      timeout = setTimeout(() => {
        setVisibleLetters(1);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 950);
    }

    return () => clearTimeout(timeout);
  }, [currentWord, visibleLetters, words]);

  useEffect(() => {
    if (wordIndex >= words.length) {
      setWordIndex(0);
      setVisibleLetters(1);
    }
  }, [wordIndex, words.length]);

  function handleSearch(): void {
    router.push(getSearchRoute(searchQuery));
  }

  return (
    <section
      className={`clubbi-scene relative isolate min-h-[86svh] overflow-hidden sm:min-h-[90svh] lg:min-h-[94svh] ${className}`}
    >
      <div className="clubbi-background" aria-hidden="true">
        <div className="clubbi-blob clubbi-blob-1" />
        <div className="clubbi-blob clubbi-blob-2" />
        <div className="clubbi-blob clubbi-blob-3" />
        <div className="clubbi-blob clubbi-blob-4" />
        <div className="clubbi-blob clubbi-blob-5" />
        <div className="clubbi-blob clubbi-blob-6" />
        <div className="clubbi-blob clubbi-blob-7" />
      </div>

      <div className="clubbi-text-layer">
        <h1 className="clubbi-animated-word" aria-hidden="true">
          {shownText}
        </h1>
        <p className="clubbi-animated-subtitle">Vind je volgende geluksmoment</p>
      </div>

      <div className="clubbi-search-layer">
        <DateSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
        <Link
          href="/inspiratie"
          className="mx-auto mt-3 flex h-[52px] w-[min(400px,calc(100vw-2rem))] items-center justify-center rounded-full border-[4px] border-white bg-[#1464ff] px-6 text-center text-[17px] font-extrabold text-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-transform duration-150 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1464ff] active:scale-95"
        >
          Ik wil inspiratie
        </Link>
      </div>
    </section>
  );
}
