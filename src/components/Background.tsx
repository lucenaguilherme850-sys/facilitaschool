export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 animate-grid-pan" />
      <div
        className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(closest-side, var(--gold), transparent)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
    </div>
  );
}
