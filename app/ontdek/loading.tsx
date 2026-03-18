export default function Loading() {
  return (
    <section className="bg-[#f7f8fa] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="h-12 w-2/3 rounded-xl bg-slate-200" />
          <div className="mt-4 h-6 w-1/2 rounded-xl bg-slate-100" />

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="h-12 w-36 rounded-full bg-slate-200" />
            <div className="h-12 w-32 rounded-full bg-slate-200" />
            <div className="h-12 w-28 rounded-full bg-slate-200" />
            <div className="h-12 w-36 rounded-full bg-slate-200" />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-32 rounded-2xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-4 w-24 rounded bg-slate-200" />
                      <div className="mt-3 h-8 w-2/3 rounded bg-slate-200" />
                      <div className="mt-3 h-5 w-full rounded bg-slate-100" />
                      <div className="mt-2 h-5 w-4/5 rounded bg-slate-100" />
                      <div className="mt-4 h-4 w-40 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="min-h-[720px] rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}