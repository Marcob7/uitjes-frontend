export const runtime = "edge";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">404</p>
      <h1 className="mt-3 text-4xl font-bold text-neutral-900">Pagina niet gevonden</h1>
      <p className="mt-4 text-neutral-600">Deze pagina bestaat niet of is verplaatst.</p>
    </main>
  );
}
