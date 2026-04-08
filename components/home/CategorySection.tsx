import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Vandaag iets doen",
    icon: "⚡",
    href: "/ontdek?vibe=vandaag",
    bg: "bg-lime-100",
  },
  {
    id: 2,
    title: "Festivals",
    icon: "🏛️",
    href: "/ontdek?category=festivals",
    bg: "bg-slate-100",
  },
  {
    id: 3,
    title: "Eten & Drinken",
    icon: "🍽️",
    href: "/ontdek?category=eten-drinken",
    bg: "bg-orange-50",
  },
  {
    id: 4,
    title: "Met kinderen",
    icon: "🧸",
    href: "/ontdek?category=kinderen",
    bg: "bg-yellow-50",
  },
];

export default function CategorySection() {
  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="rounded-[32px] bg-[#f5f3f1] px-5 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Populaire Categorieën
          </h2>

          <Link
            href="/ontdek"
            className="text-sm font-semibold text-lime-700 transition hover:text-lime-800"
          >
            Bekijk alles
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group rounded-[24px] p-6 transition hover:-translate-y-1 hover:shadow-md ${category.bg}`}
            >
              <div className="mb-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                {category.icon}
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                {category.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600 opacity-0 transition group-hover:opacity-100">
                Bekijk ideeën en tips
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}