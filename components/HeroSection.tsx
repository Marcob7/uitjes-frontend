import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="border-b border-neutral-200 bg-[#f5f3ef]">
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl text-center">
      <h1 className="font-heading mx-auto max-w-4xl text-5xl leading-tight tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
  Gemakkelijk vinden
  <br />
  wat je kunt doen
</h1>

       <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-neutral-800 sm:text-lg">
  Bekijk wat je allemaal kunt doen in iedere stad, het gehele jaar
  door. Alle evenementen en dingen die je kan doen zijn beschikbaar
  en te bekijken.
</p>

          <div className="mt-10">
            <Link
              href="/ontdek"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-6 py-4 text-base font-medium text-neutral-900 transition hover:bg-lime-400"
            >
              Bekijk evenementen
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}