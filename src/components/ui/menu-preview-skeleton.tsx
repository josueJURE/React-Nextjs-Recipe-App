import { borderRadius } from "@/utils/const";

const skeletonLabelWidths = ["w-40", "w-36", "w-28"];

export function MenuPreviewButtonsSkeleton() {
  return (
    <div className="pt-4" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-[400px] flex-col gap-3 animate-pulse">
        {skeletonLabelWidths.map((width) => (
          <div
            key={width}
            className="flex h-15 w-full items-center rounded-[1.35rem] border border-[#e7d7ca] bg-white/80 px-6 shadow-[0_12px_30px_-24px_rgba(81,52,34,0.45)] backdrop-blur-sm sm:h-18"
            style={{ borderRadius }}
          >
            <div className={`h-4 rounded-full bg-[#d79674] ${width} sm:h-5`} />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading menu actions</span>
    </div>
  );
}
