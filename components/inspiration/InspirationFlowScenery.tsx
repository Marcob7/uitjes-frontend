import { SquirrelScreenWalker } from "./SquirrelScreenWalker";
import { InspirationValleyScenery } from "./InspirationValleyScenery";

type InspirationFlowSceneryProps = {
  /** Result previews need a quieter canvas than the choice steps. */
  variant?: "default" | "subtle";
};

/**
 * Decorative-only scenery for the fullscreen inspiration flow.
 * It intentionally reuses the original valley illustration and the existing
 * Safari-safe squirrel runner instead of introducing a second animation.
 */
export function InspirationFlowScenery({
  variant = "default",
}: InspirationFlowSceneryProps) {
  const isSubtle = variant === "subtle";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
          isSubtle
            ? "opacity-40 max-sm:[&_.inspiration-valley__landscape]:top-[36rem]"
            : "max-sm:[&_.inspiration-valley__landscape]:top-[36rem]"
        }`}
      >
        <InspirationValleyScenery />
      </div>

      <div
        className={`inspiration-flow-scenery__squirrel absolute inset-x-0 bottom-1 ${
          isSubtle
            ? "hidden opacity-35 md:block"
            : ""
        }`}
      >
        <SquirrelScreenWalker />
      </div>
    </div>
  );
}
