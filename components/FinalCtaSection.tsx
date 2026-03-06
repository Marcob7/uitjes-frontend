import Link from "next/link";

export default function FinalCtaSection() {
  return (
    <section className="bg-[#f5f3ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] bg-[#d8ecc1] px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Klaar om iets leuks te gaan doen?
              </h2>
            </div>

            <div className="shrink-0">
              <Link
                href="/ontdek"
                className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-8 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
              >
                Ontdek uitjes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}