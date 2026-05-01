export default function Loading() {
  return (
    <section className="uitjes-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="rounded-3xl border border-white/16 bg-white/10 backdrop-blur-xl p-8 shadow-[0_18px_44px_rgba(0,0,0,0.16)] sm:p-10">
          <div className="h-12 w-2/3 rounded-xl bg-[#e5d9c8]" />
          <div className="mt-4 h-6 w-1/2 rounded-xl bg-[#faf4eb]" />

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="h-12 w-36 rounded-full bg-[#e5d9c8]" />
            <div className="h-12 w-32 rounded-full bg-[#e5d9c8]" />
            <div className="h-12 w-28 rounded-full bg-[#e5d9c8]" />
            <div className="h-12 w-36 rounded-full bg-[#e5d9c8]" />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/16 bg-white/10 backdrop-blur-xl p-4 shadow-[0_18px_44px_rgba(0,0,0,0.16)]"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-32 rounded-2xl bg-[#e5d9c8]" />
                    <div className="flex-1">
                      <div className="h-4 w-24 rounded bg-[#e5d9c8]" />
                      <div className="mt-3 h-8 w-2/3 rounded bg-[#e5d9c8]" />
                      <div className="mt-3 h-5 w-full rounded bg-[#faf4eb]" />
                      <div className="mt-2 h-5 w-4/5 rounded bg-[#faf4eb]" />
                      <div className="mt-4 h-4 w-40 rounded bg-[#e5d9c8]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/16 bg-white/10 backdrop-blur-xl p-3 shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
              <div className="min-h-[720px] rounded-2xl bg-[#faf4eb]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}