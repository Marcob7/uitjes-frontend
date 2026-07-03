const SQUIRREL_VIDEO_SRC = "/images/squirrel-screen-walker.mp4";

export function SquirrelScreenWalker() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden h-16 overflow-visible sm:block md:h-20"
    >
      <div className="absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 overflow-hidden">
        {/*
          Tuning notes:
          - width controls the squirrel size; keep object-contain so he stays fully visible.
          - bottom controls the walking lane position.
          - animation duration is defined in globals.css on .squirrel-screen-walker.
        */}
        <video
          className="squirrel-screen-walker absolute bottom-1 left-0 h-14 w-14 object-contain opacity-95 mix-blend-multiply md:h-16 md:w-16 lg:h-20 lg:w-20"
          src={SQUIRREL_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}
