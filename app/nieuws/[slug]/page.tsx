import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import NewsArticleContent from "@/components/news/NewsArticleContent";
import NewsShareActions from "@/components/news/NewsShareActions";
import RelatedNews from "@/components/news/RelatedNews";
import { AppSection } from "@/components/ui/app";
import {
  formatNewsDate,
  getNewsArticleBySlug,
  getRelatedNewsArticles,
  newsArticles,
} from "@/lib/newsArticles";

type NewsDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: NewsDetailPageProps): Metadata {
  const article = getNewsArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Artikel niet gevonden | Uitjes",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `/nieuws/${article.slug}`;

  return {
    title: `${article.title} | Uitjes`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author] : undefined,
      images: article.image
        ? [
            {
              url: article.image,
              alt: article.imageAlt || article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: article.image ? "summary_large_image" : "summary",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = getNewsArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedNewsArticles(article);
  const metadata = [
    article.author ? { label: article.author, dateTime: null } : null,
    { label: formatNewsDate(article.publishedAt), dateTime: article.publishedAt },
    article.readingTime ? { label: `${article.readingTime} min. leestijd`, dateTime: null } : null,
    article.updatedAt
      ? { label: `Bijgewerkt ${formatNewsDate(article.updatedAt)}`, dateTime: article.updatedAt }
      : null,
  ].filter((item): item is { label: string; dateTime: string | null } => item !== null);

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_82%_3%,rgba(224,239,229,0.78),transparent_26%),linear-gradient(180deg,#F6F7F2_0%,#F4F6F3_60%,#EEF3F0_100%)] pt-24 text-[#29342F] sm:pt-28">
      <AppSection maxWidth="default" spacing="sm" innerClassName="pt-6 pb-14 sm:pt-8 sm:pb-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Nieuws & inspiratie", href: "/nieuws" },
            { label: article.title },
          ]}
          className="mb-9"
        />

        <article>
          <header className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full bg-[#E8F2D0] px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.17em] text-[#405526]">
              {article.category}
            </p>
            <h1 className="mx-auto mt-4 max-w-[21ch] text-[clamp(2.45rem,5.7vw,5.35rem)] font-semibold leading-[0.9] tracking-[-0.067em] text-[#29342F]">
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#65736C] sm:text-lg sm:leading-8">
              {article.excerpt}
            </p>
            {metadata.length > 0 ? (
              <p className="mt-5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-[#65736C]">
                {metadata.map((item, index) => (
                  <span key={`${item.label}-${index}`} className="inline-flex items-center gap-x-2">
                    {index > 0 ? <span aria-hidden="true">·</span> : null}
                    {item.dateTime ? <time dateTime={item.dateTime}>{item.label}</time> : <span>{item.label}</span>}
                  </span>
                ))}
              </p>
            ) : null}
          </header>

          {article.image ? (
            <figure className="relative mt-9 aspect-[16/8.7] overflow-hidden rounded-[1.8rem] bg-[#E8EFE9] shadow-[0_22px_56px_rgba(41,52,47,0.13)] sm:mt-11">
              <Image
                src={article.image}
                alt={article.imageAlt || ""}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1220px"
                className="object-cover"
              />
            </figure>
          ) : null}

          <div className="mx-auto mt-10 grid max-w-[52rem] gap-8 sm:mt-12 lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12">
            <NewsArticleContent sections={article.content} />
            <aside className="lg:order-first lg:pt-1">
              <NewsShareActions title={article.title} />
            </aside>
          </div>
        </article>

        <div className="mx-auto mt-14 max-w-[68rem] sm:mt-16">
          <RelatedNews articles={relatedArticles} />
          <div className="mt-8 text-center">
            <Link
              href="/nieuws"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B6CFC1] bg-white/70 px-5 py-2 text-sm font-semibold text-[#1D5A46] transition hover:border-[#1D5A46] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
            >
              Terug naar nieuws & inspiratie
            </Link>
          </div>
        </div>
      </AppSection>
    </main>
  );
}
