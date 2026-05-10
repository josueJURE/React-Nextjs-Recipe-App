import { borderRadius } from "@/utils/const";

const skeletonLabelWidths = ["w-40", "w-36", "w-28"];

export function MenuPreviewButtonsSkeleton() {
  return (
    <div className="pt-4" role="status" aria-live="polite">
      <div className="grid gap-3 animate-pulse sm:grid-cols-3">
        {skeletonLabelWidths.map((width) => (
          <div
            key={width}
            className="flex min-h-12 w-full items-center rounded-md border border-[#d8e2d6] bg-white/80 px-4 py-3 shadow-[0_12px_30px_-26px_rgba(36,56,45,0.45)] backdrop-blur-sm"
            style={{ borderRadius }}
          >
            <div className={`h-4 rounded-full bg-[#d79674] ${width}`} />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading menu actions</span>
    </div>
  );
}
