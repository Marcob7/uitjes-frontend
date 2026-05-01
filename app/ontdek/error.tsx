"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <section role="alert" className="uitjes-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/16 bg-white/10 backdrop-blur-xl p-8 shadow-[0_18px_44px_rgba(0,0,0,0.16)] sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Er ging iets mis
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">
          Deze pagina kon niet goed worden geladen. Probeer het opnieuw.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#23170f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3b291d]"
        >
          Opnieuw proberen
        </button>
      </div>
    </section>
  );
}
