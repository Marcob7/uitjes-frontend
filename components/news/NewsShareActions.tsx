import ShareAction from "@/components/ShareAction";

/** Keeps the article sidebar styling while delegating all share mechanics to ShareAction. */
export default function NewsShareActions({ title, url }: { title: string; url: string }) {
  return (
    <section className="border-t border-[#DCE1DC] pt-6" aria-label={`Deel ${title}`}>
      <p className="text-[0.68rem] font-bold tracking-[0.16em] text-[#65736C]">Deel dit verhaal</p>
      <ShareAction
        title={title}
        text={`Lees “${title}” op Uitjes.`}
        url={url}
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C9D8CF] bg-white px-4 text-sm font-semibold text-[#1D5A46] transition hover:border-[#1D5A46] hover:bg-[#F4F9F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
      />
    </section>
  );
}
