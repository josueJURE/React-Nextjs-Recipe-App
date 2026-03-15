export function AudioSkeleton() {
  return (
    <div
      className="mb-4 rounded-lg border-2 border-black bg-white/80 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-28 rounded-full bg-neutral-300" />
        <div className="h-20 w-full rounded-md bg-neutral-200" />
        <div className="flex items-center justify-center gap-4">
          <div className="h-10 w-10 rounded-full bg-neutral-200" />
          <div className="h-12 w-12 rounded-full bg-neutral-300" />
          <div className="h-10 w-10 rounded-full bg-neutral-200" />
        </div>
      </div>
      <span className="sr-only">Generating audio</span>
    </div>
  );
}
