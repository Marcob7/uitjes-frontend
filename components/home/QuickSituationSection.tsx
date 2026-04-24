import Link from "next/link";

const situationLinks = [
  {
    label: "Buiten genieten",
    href: "/inspiratie/buiten",
    featured: true,
  },
  {
    label: "Regenproof",
    href: "/inspiratie/binnen",
  },
  {
    label: "Voor vanavond",
    href: "/ontdek?when=tonight",
  },
  {
    label: "Dit weekend",
    href: "/inspiratie/weekend",
  },
];

export default function QuickSituationSection() {
  return (
    <section className="px-4 pb-3 pt-1 md:px-6 md:pb-4 lg:px-8">
      <div className="rounded-[28px] border border-[#efe6df] bg-[#f7f3ef] px-5 py-5 shadow-[0_8px_24px_rgba(95,80,67,0.04)] md:rounded-[32px] md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <p className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#3f4c55] md:text-[13px]">
            Snel ontdekken
          </p>

          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {situationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border px-5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                  item.featured
                    ? "border-[#cfeaa2] bg-[#d3f196] text-[#3f6112] shadow-[0_10px_18px_rgba(169,208,78,0.18)] hover:bg-[#caeb88]"
                    : "border-[#e8e1db] bg-white text-[#20262b] shadow-[0_8px_18px_rgba(56,45,36,0.06)] hover:border-[#ddd3ca] hover:bg-[#fcfbfa]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
