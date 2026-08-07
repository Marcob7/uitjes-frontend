import { AppSection } from "@/components/ui/app";

export default function SearchLoading() {
  return <main className="min-h-screen bg-[#f8f5f3] text-[#171511]"><AppSection maxWidth="wide" spacing="sm" innerClassName="pt-8 pb-8 sm:pt-12"><div className="max-w-4xl"><h1 className="text-[clamp(2.4rem,6vw,4.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">Zoeken</h1><div className="mt-7 h-16 max-w-3xl animate-pulse rounded-[24px] border border-[#ded5cb] bg-[#fffaf4]" /></div></AppSection><AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16"><div role="status" aria-live="polite" className="border-t border-[#ded5cb] pt-8 text-sm font-medium text-[#665d54]">Zoeken…</div></AppSection></main>;
}
