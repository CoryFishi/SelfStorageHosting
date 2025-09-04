export default function Spinner() {
  return (
    <div className="grid place-items-center min-h-[60vh]">
      <div className="relative h-12 w-12" role="status" aria-label="Loading">
        {/* background ring */}
        <span className="absolute inset-0 rounded-full border-4 border-background-200" />
        {/* animated ring */}
        <span className="absolute inset-0 rounded-full border-4 border-[var(--color-accent-website)] border-t-transparent animate-spin" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
