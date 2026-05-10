export function AudioSkeleton() {
  return (
    <div
      className="mb-4 rounded-lg border border-[#d8e2d6] bg-white/90 p-3 sm:p-4"
      role="status"
      aria-live="polite"
    >
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-28 rounded-full bg-[#bfd1c3]" />
        <div className="h-16 w-full rounded-md bg-[#edf3ee] sm:h-20" />
        <div className="flex items-center justify-center gap-4">
          <div className="size-11 rounded-full bg-[#edf3ee]" />
          <div className="size-12 rounded-full bg-[#bfd1c3]" />
          <div className="size-11 rounded-full bg-[#edf3ee]" />
        </div>
      </div>
      <span className="sr-only">Generating audio</span>
    </div>
  );
}
