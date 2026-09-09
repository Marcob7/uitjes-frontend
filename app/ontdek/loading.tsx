import Image from "next/image";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Pagina laden"
      className="grid min-h-screen place-items-center bg-[#f2ece2] px-6"
    >
      <Image
        src="/images/uitjesplatform_logo_transparent.svg"
        alt=""
        width={64}
        height={50}
        priority
        className="h-auto w-16 animate-pulse opacity-70 grayscale brightness-0 motion-reduce:animate-none"
      />
      <span className="sr-only">Pagina wordt geladen</span>
    </main>
  );
}
