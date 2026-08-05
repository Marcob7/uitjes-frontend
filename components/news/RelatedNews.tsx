import type { NewsArticle } from "@/lib/newsArticles";

import NewsCard from "./NewsCard";

export default function RelatedNews({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-[#DCE1DC] pt-10 sm:pt-12" aria-labelledby="related-news-heading">
      <h2 id="related-news-heading" className="text-[clamp(1.8rem,3.5vw,2.7rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#29342F]">
        Misschien ook interessant
      </h2>
      <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} compact />
        ))}
      </div>
    </section>
  );
}
