import Image from "next/image";
import Link from "next/link";

import { formatNewsDate, type NewsArticle } from "@/lib/newsArticles";

type NewsCardProps = {
  article: NewsArticle;
  compact?: boolean;
};

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

function FallbackVisual({ category }: { category: string }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(232,242,208,0.9),transparent_27%),radial-gradient(circle_at_18%_85%,rgba(169,214,220,0.42),transparent_34%),linear-gradient(135deg,#e8efe9,#d9e8dd)]">
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1D5A46] text-lg text-white shadow-[0_10px_20px_rgba(29,90,70,0.2)]" aria-hidden="true">
          ↗
        </span>
        <span className="max-w-[12ch] text-right text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#1D5A46]/80">
          {category}
        </span>
      </div>
    </div>
  );
}

export default function NewsCard({ article, compact = false }: NewsCardProps) {
  const hasImage = Boolean(article.image);

  return (
    <article className="group h-full">
      <Link
        href={`/nieuws/${article.slug}`}
        className={`flex h-full overflow-hidden rounded-[1.55rem] border border-[#DCE1DC] bg-white/78 text-[#29342F] shadow-[0_12px_32px_rgba(41,52,47,0.055)] transition duration-200 hover:-translate-y-1 hover:border-[#B7CCBF] hover:bg-white hover:shadow-[0_20px_42px_rgba(41,52,47,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC] ${
          compact ? "gap-4 p-4" : "flex-col"
        }`}
      >
        {!compact ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-[#E8EFE9]">
            {hasImage ? (
              <Image
                src={article.image!}
                alt={article.imageAlt || ""}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.035]"
              />
            ) : (
              <FallbackVisual category={article.category} />
            )}
          </div>
        ) : null}

        <div className={`min-w-0 ${compact ? "flex-1 py-0.5" : "flex flex-1 flex-col p-5"}`}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#1D5A46]">
            {article.category}
          </p>
          <h3
            className={`mt-2 max-w-none font-semibold leading-[1.04] tracking-[-0.042em] text-[#29342F] ${
              compact ? "text-lg" : "text-[1.45rem]"
            }`}
          >
            {article.title}
          </h3>
          {!compact ? (
            <p className="mt-3 text-sm leading-6 text-[#65736C]">{article.excerpt}</p>
          ) : null}
          <div className={`mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#65736C] ${compact ? "pt-3" : "pt-5"}`}>
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            {article.readingTime ? <span aria-hidden="true">·</span> : null}
            {article.readingTime ? <span>{article.readingTime} min.</span> : null}
            {compact ? (
              <span className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F2D0] text-[#1D5A46] transition group-hover:bg-[#1D5A46] group-hover:text-white" aria-hidden="true">
                <ArrowIcon />
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
