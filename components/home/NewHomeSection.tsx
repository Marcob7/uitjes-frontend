"use client";

type NewHomeSectionProps = {
  className?: string;
};

export default function NewHomeSection({
  className = "",
}: NewHomeSectionProps) {
  return (
    <section
      className={`clubbi-scene relative isolate min-h-screen min-h-[100dvh] w-full overflow-hidden ${className}`}
    >
      <div className="clubbi-background" aria-hidden="true">
        <div className="clubbi-blob clubbi-blob-1" />
        <div className="clubbi-blob clubbi-blob-2" />
        <div className="clubbi-blob clubbi-blob-3" />
        <div className="clubbi-blob clubbi-blob-4" />
        <div className="clubbi-blob clubbi-blob-5" />
        <div className="clubbi-blob clubbi-blob-6" />
        <div className="clubbi-blob clubbi-blob-7" />
      </div>

      <div className="clubbi-text-layer">
        <p className="clubbi-animated-subtitle">Vind je volgende geluksmoment</p>
      </div>
    </section>
  );
}
