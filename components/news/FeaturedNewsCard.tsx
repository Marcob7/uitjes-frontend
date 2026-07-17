import Image from "next/image";
import Link from "next/link";

import { formatNewsDate, type NewsArticle } from "@/lib/newsArticles";

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return (
    <article>
      <Link
        href={`/nieuws/${article.slug}`}
        className="group relative isolate flex min-h-[26rem] overflow-hidden rounded-[1.9rem] bg-[#193C34] p-5 text-white shadow-[0_24px_58px_rgba(28,57,45,0.18)] transition hover:-translate-y-1 hover:shadow-[0_30px_68px_rgba(28,57,45,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC] sm:min-h-[29rem] sm:p-8 lg:min-h-[32rem] lg:p-10"
      >
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt || ""}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1220px"
            className="-z-20 object-cover transition duration-700 group-hover:scale-[1.025]"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,30,24,0.88)_0%,rgba(12,34,28,0.62)_43%,rgba(12,34,28,0.1)_84%),linear-gradient(0deg,rgba(8,23,18,0.76)_0%,transparent_55%)]" />
        <div className="mt-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-white/88">
            <span className="rounded-full bg-[#E8F2D0] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#28411D]">
              {article.category}
            </span>
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            {article.readingTime ? <span aria-hidden="true">·</span> : null}
            {article.readingTime ? <span>{article.readingTime} min. leestijd</span> : null}
          </div>
          <h2 className="mt-4 max-w-[19ch] text-[clamp(2rem,4.1vw,4rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
            {article.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/88 sm:text-base sm:leading-7">
            {article.excerpt}
          </p>
          <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1D5A46] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition group-hover:bg-[#E8F2D0]">
            Lees het verhaal <ArrowIcon />
          </span>
        </div>
      </Link>
    </article>
  );
}
