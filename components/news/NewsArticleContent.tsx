import Image from "next/image";

import type { ArticleSection } from "@/lib/newsArticles";

function QuoteMark() {
  return <span aria-hidden="true" className="text-3xl leading-none text-[#1D5A46]">“</span>;
}

export default function NewsArticleContent({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="space-y-7 text-[1.05rem] leading-8 text-[#47574E] sm:text-[1.08rem] sm:leading-8">
      {sections.map((section, index) => {
        const key = `${section.type}-${index}`;

        if (section.type === "paragraph") {
          return <p key={key}>{section.text}</p>;
        }

        if (section.type === "heading") {
          const Heading = section.level === 2 ? "h2" : "h3";
          const className =
            section.level === 2
              ? "pt-5 text-[clamp(1.7rem,3vw,2.35rem)] font-semibold leading-[0.98] tracking-[-0.048em] text-[#29342F]"
              : "pt-3 text-xl font-semibold leading-tight tracking-[-0.035em] text-[#29342F]";

          return (
            <Heading key={key} className={className}>
              {section.text}
            </Heading>
          );
        }

        if (section.type === "list") {
          return (
            <ul key={key} className="space-y-3 rounded-[1.4rem] bg-[#EAF1ED] px-5 py-5 text-[0.98rem] leading-7 text-[#3C5145] sm:px-6">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.62rem] h-2 w-2 shrink-0 rounded-full bg-[#1D5A46]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (section.type === "quote") {
          return (
            <figure key={key} className="border-y border-[#CFE0D6] py-7 text-center">
              <blockquote className="mx-auto max-w-[34rem] text-[clamp(1.3rem,2.7vw,1.8rem)] font-medium leading-[1.2] tracking-[-0.035em] text-[#1D5A46]">
                <QuoteMark />
                <span>{section.text}</span>
              </blockquote>
              {section.attribution ? (
                <figcaption className="mt-3 text-sm font-semibold text-[#65736C]">
                  {section.attribution}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (section.type === "image") {
          return (
            <figure key={key} className="overflow-hidden rounded-[1.5rem] bg-[#E8EFE9]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={section.src}
                  alt={section.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
              {section.caption ? (
                <figcaption className="px-5 py-3 text-sm leading-6 text-[#65736C]">
                  {section.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <aside key={key} className="rounded-[1.35rem] border border-[#B6D8C6] bg-[#E6F5EC] px-5 py-5 text-[#315640] sm:px-6">
            {section.title ? <h3 className="text-base font-bold text-[#1D5A46]">{section.title}</h3> : null}
            <p className={section.title ? "mt-2 text-[0.98rem] leading-7" : "text-[0.98rem] leading-7"}>{section.text}</p>
          </aside>
        );
      })}
    </div>
  );
}
