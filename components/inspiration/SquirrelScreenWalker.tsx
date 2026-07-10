const SQUIRREL_GIF_SRC = "/animations/squirrel-running.gif?v=20260708";

export function SquirrelScreenWalker() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative block h-12 overflow-visible sm:h-16 md:h-14"
    >
      <div className="absolute left-1/2 top-0 z-0 h-full w-screen -translate-x-1/2 overflow-hidden">
        {/*
          Tuning notes:
          - the outer runner controls screen movement; the image only plays the internal GIF loop.
          - fixed square sizing keeps Safari from recalculating dimensions during playback.
          - bottom controls the walking lane position.
          - animation duration is defined in globals.css on .squirrel-runner.
        */}
        <div className="squirrel-runner absolute bottom-1 left-0 h-9 w-9 opacity-95 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-14 lg:w-14">
          <img
            src={SQUIRREL_GIF_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="block h-auto w-full select-none"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
