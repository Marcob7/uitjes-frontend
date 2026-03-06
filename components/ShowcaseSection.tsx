import Image from "next/image";
import Link from "next/link";

export default function ShowcaseSection() {
  const images = new Array(8).fill("/images/julianatoren.jpg");

  return (
    <section className="bg-[#f5f3ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#efe4d9] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-2xl text-[#8a5a2b]">{`</>`}</span>

            <span className="font-heading text-sm font-semibold uppercase tracking-[0.35em] text-[#8a5a2b]">
              Voor uitjes
            </span>
          </div>

          <h2 className="font-heading mt-10 text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Ontdek leuke plekken, activiteiten en dagjes uit in jouw buurt
          </h2>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <p className="text-base text-neutral-800 sm:text-lg">
              Snel inspiratie opdoen
            </p>

            <Link
              href="/ontdek"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-6 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
            >
              Bekijk uitjes
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2.5rem]">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Uitje afbeelding ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}