export const runtime = 'edge';
"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <section className="bg-[#f7f8fa] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Er ging iets mis
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Deze pagina kon niet goed worden geladen. Probeer het opnieuw.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Opnieuw proberen
        </button>
      </div>
    </section>
  );
}