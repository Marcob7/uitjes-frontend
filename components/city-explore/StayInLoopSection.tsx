type StayInLoopSectionProps = {
  cityLabel: string;
};

export default function StayInLoopSection({
  cityLabel,
}: StayInLoopSectionProps) {
  return (
    <section className="mb-8 mt-12">
      <div className="rounded-[2.5rem] bg-[#efe2b8] px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-[#111111]">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            Subscribe to the {cityLabel} Digest and receive local highlights,
            events and city tips directly in your inbox.
          </p>

          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-black/5 bg-white px-5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-6 text-sm font-medium text-white transition hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}