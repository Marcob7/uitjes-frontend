import Image from "next/image";

export default function InspirationCardsSection() {
  const cards = [
    {
      id: 1,
      width: "w-[260px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Paleis_Het_Loo_Apeldoorn.jpg",
      alt: "Paleis Het Loo in Apeldoorn",
      imagePosition: "50% 50%",
    },
    {
      id: 2,
      width: "w-[220px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tuin_van_Paleis_het_Loo_Apeldoorn.jpg",
      alt: "Baroktuinen van Paleis Het Loo in Apeldoorn",
      imagePosition: "48% 50%",
    },
    {
      id: 3,
      width: "w-[190px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/09/Radio_Kootwijk_Building_A_from_the_north.jpg",
      alt: "Gebouw A van Radio Kootwijk bij Apeldoorn",
      imagePosition: "52% 50%",
    },
    {
      id: 4,
      width: "w-[150px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/6/65/Apeldoorn%2C_de_Grote_Kerk_RM8162_IMG_4728_2020-04-16_16.46.jpg",
      alt: "De Grote Kerk in Apeldoorn",
      imagePosition: "50% 35%",
    },
    {
      id: 5,
      width: "w-[140px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/05/Park_Berg_en_Bos.jpg",
      alt: "Vijver in Park Berg en Bos in Apeldoorn",
      imagePosition: "50% 50%",
    },
    {
      id: 6,
      width: "w-[120px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/7/77/Hoofdstraat-143-Apeldoorn-2024.jpg",
      alt: "Monumentaal pand aan de Hoofdstraat in Apeldoorn",
      imagePosition: "50% 50%",
    },
    {
      id: 7,
      width: "w-[100px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Winkelcentrum_Oranjerie-Apeldoorn-01-2024.jpg",
      alt: "Interieur van Winkelcentrum Oranjerie in Apeldoorn",
      imagePosition: "50% 50%",
    },
    {
      id: 8,
      width: "w-[80px]",
      height: "h-[280px]",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Queen-Wilhelmina-Statue-Apeldoorn.jpg",
      alt: "Standbeeld van Koningin Wilhelmina in Apeldoorn",
      imagePosition: "48% 18%",
    },
  ];

  return (
    <section className="bg-[#f5f3ef] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Vorige kaarten"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ebe7df] text-neutral-900 transition hover:bg-[#e3ddd4]"
        >
          <span className="text-2xl leading-none">&#8249;</span>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`${card.width} ${card.height} relative shrink-0 overflow-hidden rounded-[2rem]`}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                unoptimized
                className="object-cover"
                style={{ objectPosition: card.imagePosition }}
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
          <span className="text-2xl leading-none">&#8250;</span>
        </button>
      </div>
    </section>
  );
}
