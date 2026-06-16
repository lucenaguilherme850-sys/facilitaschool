export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* animated emerald + gold mesh blobs */}
      <div
        className="absolute -top-40 -left-32 h-[640px] w-[640px] rounded-full blur-3xl opacity-50 animate-orb"
        style={{ background: "radial-gradient(closest-side, var(--primary), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-40 animate-orb"
        style={{ background: "radial-gradient(closest-side, var(--gold), transparent 70%)", animationDelay: "-7s" }}
      />
      <div
        className="absolute bottom-[-180px] left-1/3 h-[520px] w-[520px] rounded-full blur-3xl opacity-30 animate-orb"
        style={{ background: "radial-gradient(closest-side, var(--gold-soft), transparent 70%)", animationDelay: "-14s" }}
      />

      {/* soft notebook/paper grid that pans — remete a caderno/estudo */}
      <div className="absolute inset-0 bg-grid opacity-30 animate-grid-pan" />

      {/* flowing knowledge lines (slow horizontal sweep) */}
      <svg className="absolute inset-x-0 top-1/4 w-[200%] h-64 opacity-[0.07] animate-marquee" viewBox="0 0 1600 200" preserveAspectRatio="none">
        <path d="M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100 C1400,40 1600,160 1600,100" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-primary" />
        <path d="M0,130 C200,70 400,190 600,130 C800,70 1000,190 1200,130 C1400,70 1600,190 1600,130" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
      </svg>

      {/* top + bottom fade to keep content legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
    </div>
  );
}
