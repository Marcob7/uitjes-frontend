import Link from "next/link";
import { optimizeCssBackground } from "@/lib/remoteImage";

type FeaturedItem = {
  id: number;
  title: string;
  description: string;
  label: string;
  city: string;
  href: string;
  image: string;
  large: boolean;
};

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    title: "De geheimen van de Rijksmuseum kelders",
    description:
      "Ontdek de verborgen collectie die zelden aan het publiek wordt getoond. Een exclusieve blik achter de schermen van Nederlands meest iconische museum.",
    label: "Museum",
    city: "Amsterdam",
    href: "/artikel/rijksmuseum-kelders",
    image:
      'url("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80")',
    large: true,
  },
  {
    id: 2,
    title: "Top 5: Dineren aan de Vecht",
    description:
      "De mooiste terrassen en fine-dining locaties direct aan het water voor een magische avond.",
    label: "Gastronomie",
    city: "Utrecht",
    href: "/artikel/dineren-aan-de-vecht",
    image:
      'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80")',
    large: false,
  },
  {
    id: 3,
    title: "Zomer in het Park: Agenda 2024",
    description:
      "De leukste kleinschalige festivals door heel Nederland die je deze zomer wilt bezoeken.",
    label: "Festivals",
    city: "Nederland",
    href: "/artikel/zomer-in-het-park",
    image:
      'url("https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80")',
    large: false,
  },
];

type FeaturedCardProps = {
  item: FeaturedItem;
};

function FeaturedCard({ item }: FeaturedCardProps) {
  return (
    <article>
      <Link href={item.href} className="group block">
        <div
          className={`relative overflow-hidden rounded-[28px] ${
            item.large ? "min-h-[420px]" : "min-h-[220px]"
          }`}
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.22), rgba(0,0,0,0.02)), ${optimizeCssBackground(
              item.image,
              {
                width: item.large ? 1120 : 820,
                quality: 58,
              }
            )}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-slate-900">
              {item.label}
            </span>

            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
              {item.city}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <h3
            className={`font-semibold tracking-tight text-slate-900 transition group-hover:text-lime-700 ${
              item.large ? "text-3xl" : "text-xl"
            }`}
          >
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {item.description}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime-700">
            Lees de gids <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function FeaturedSection() {
  const mainCard = featuredItems.find((item) => item.large);
  const sideCards = featuredItems.filter((item) => !item.large);

  if (!mainCard) return null;

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Uitgelicht in <span className="italic text-lime-700">Nederland</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
            Onze redactie selecteert wekelijks de meest bijzondere evenementen en
            verborgen parels die je echt niet mag missen.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <FeaturedCard item={mainCard} />

          <div className="grid gap-6">
            {sideCards.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
