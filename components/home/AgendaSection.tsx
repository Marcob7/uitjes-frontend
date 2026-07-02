import Link from "next/link";

export default function AgendaSection() {
  return (
    <section className="clubbi-scene relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="clubbi-background" aria-hidden="true">
        <div className="clubbi-blob clubbi-blob-1" />
        <div className="clubbi-blob clubbi-blob-2" />
        <div className="clubbi-blob clubbi-blob-3" />
        <div className="clubbi-blob clubbi-blob-4" />
        <div className="clubbi-blob clubbi-blob-5" />
        <div className="clubbi-blob clubbi-blob-6" />
        <div className="clubbi-blob clubbi-blob-7" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[61.5rem]">
        <div className="group relative min-h-[22rem] overflow-hidden rounded-[28px] shadow-[0_28px_80px_rgba(13,34,45,0.22)] sm:min-h-[28rem] sm:rounded-[34px] lg:min-h-[32rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(7, 7, 7, 0.06), rgba(7, 7, 7, 0.24)), url("https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&fm=webp&w=920&q=58")',
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="text-[clamp(2.25rem,5.2vw,3.25rem)] font-black uppercase leading-[0.9] tracking-[0] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.34)]">
              Events calendar
            </h2>
            <Link
              href="/jaarkalender"
              className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#1464ff] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(20,100,255,0.34)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0757ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
