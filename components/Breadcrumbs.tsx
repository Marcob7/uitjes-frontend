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
   <div></div>
  );
}
