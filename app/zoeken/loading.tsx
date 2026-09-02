export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero">
        <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8">
          <div className="max-w-4xl">
            <span className="search-section-label">DOEN zoeken</span>
            <div className="mt-4 h-16 w-56 animate-pulse rounded-xl bg-[#dce9dc] sm:h-24 sm:w-80" />
            <div className="mt-5 h-6 max-w-xl animate-pulse rounded-full bg-[#e0ebe0]" />
            <div className="mt-7 h-16 max-w-3xl animate-pulse rounded-[24px] border border-[#d8e2d9] bg-white/80" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div role="status" aria-live="polite" className="border-t border-[#dce1dc] pt-8 text-sm font-medium text-[#68746d]">
          Zoeken…
        </div>
      </section>
    </main>
  );
}
