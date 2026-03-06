import Image from "next/image";

export default function InspirationCardsSection() {
  const cards = [
    { id: 1, width: "w-[280px]", height: "h-[280px]" },
    { id: 2, width: "w-[240px]", height: "h-[280px]" },
    { id: 3, width: "w-[170px]", height: "h-[280px]" },
    { id: 4, width: "w-[120px]", height: "h-[280px]" },
    { id: 5, width: "w-[110px]", height: "h-[280px]" },
    { id: 6, width: "w-[38px]", height: "h-[280px]" },
  ];

  return (
    <section className="bg-[#f5f3ef] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Vorige kaarten"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ebe7df] text-neutral-900 transition hover:bg-[#e3ddd4]"
        >
          <span className="text-2xl leading-none">‹</span>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`${card.width} ${card.height} relative shrink-0 overflow-hidden rounded-[2rem]`}
            >
              <Image
                src="/images/apeldoorn_img.jpg"
                alt={`Inspiratiekaart ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={index < 2}
              />

              <div className="absolute inset-0 bg-black/5" />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Volgende kaarten"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ebe7df] text-neutral-900 transition hover:bg-[#e3ddd4]"
        >
          <span className="text-2xl leading-none">›</span>
        </button>
      </div>
    </section>
  );
}