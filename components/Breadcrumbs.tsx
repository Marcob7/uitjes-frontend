import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function ChevronIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-[#a39383]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m6 3.333 4.667 4.667L6 12.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12.667 8H3.333M7.333 12 3.333 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  const backTarget = [...items].slice(0, -1).reverse().find((item) => item.href)?.href;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {backTarget ? (
          <Link
            href={backTarget}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e7dfd4] bg-white/92 px-4 py-2 text-sm font-medium text-[#4d433a] shadow-[0_8px_18px_rgba(60,44,23,0.05)] transition hover:bg-white"
          >
            <ArrowLeftIcon />
            Terug
          </Link>
        ) : null}

        <ol className="flex min-w-0 flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1 || !item.href;

            return (
              <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
                {index > 0 ? <ChevronIcon /> : null}
                {isCurrent ? (
                  <span className="inline-flex min-h-10 max-w-full items-center rounded-full bg-[#f3ede5] px-4 py-2 text-sm font-semibold text-[#171511]">
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  <Link
                    href={item.href!}
                    className="inline-flex min-h-10 max-w-full items-center rounded-full border border-[#e7dfd4] bg-white/92 px-4 py-2 text-sm font-medium text-[#645548] shadow-[0_8px_18px_rgba(60,44,23,0.05)] transition hover:bg-white hover:text-[#171511]"
                  >
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
