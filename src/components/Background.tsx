export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base creme */}
      <div className="absolute inset-0 bg-background" />

      {/* AURORA — gradiente cônico esmeralda + dourado girando lentamente */}
      <div
        className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.55] blur-3xl"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, oklch(0.38 0.10 162 / 0.55), oklch(0.74 0.14 80 / 0.45), oklch(0.90 0.10 86 / 0.35), oklch(0.38 0.10 162 / 0.55))",
          animation: "aurora-spin 40s linear infinite",
        }}
      />

      {/* BLOBS impactantes */}
      <div
        className="absolute -top-40 -left-32 h-[720px] w-[720px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, oklch(0.38 0.10 162 / 0.8), transparent 70%)",
          animation: "orb-drift 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/4 -right-40 h-[640px] w-[640px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, oklch(0.74 0.14 80 / 0.7), transparent 70%)",
          animation: "orb-drift 22s ease-in-out infinite",
          animationDelay: "-7s",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, oklch(0.90 0.10 86 / 0.7), transparent 70%)",
          animation: "orb-drift 19s ease-in-out infinite",
          animationDelay: "-13s",
        }}
      />

      {/* GRID de caderno suavemente animado */}
      <div className="absolute inset-0 bg-grid opacity-50 animate-grid-pan" />

      {/* ONDAS FLUINDO — duas camadas em direções opostas */}
      <svg
        className="absolute inset-x-0 top-[20%] w-[220%] h-72 opacity-25"
        style={{ animation: "wave-flow 18s ease-in-out infinite", color: "var(--primary)" }}
        viewBox="0 0 1600 200"
        preserveAspectRatio="none"
      >
        <path d="M0,100 C200,20 400,180 600,100 C800,20 1000,180 1200,100 C1400,20 1600,180 1600,100 L1600,200 L0,200 Z" fill="currentColor" opacity="0.18" />
        <path d="M0,120 C200,40 400,200 600,120 C800,40 1000,200 1200,120 C1400,40 1600,200 1600,120" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg
        className="absolute inset-x-0 bottom-[15%] w-[220%] h-72 opacity-25"
        style={{ animation: "wave-flow 26s ease-in-out infinite reverse", color: "var(--gold)" }}
        viewBox="0 0 1600 200"
        preserveAspectRatio="none"
      >
        <path d="M0,80 C200,160 400,0 600,80 C800,160 1000,0 1200,80 C1400,160 1600,0 1600,80" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M0,110 C200,190 400,30 600,110 C800,190 1000,30 1200,110 C1400,190 1600,30 1600,110" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </svg>

      {/* PARTÍCULAS douradas piscando */}
      <div className="absolute inset-0">
        {[
          { l: "8%", t: "18%", d: "0s", s: 6 },
          { l: "22%", t: "72%", d: "-2s", s: 4 },
          { l: "38%", t: "30%", d: "-4s", s: 5 },
          { l: "55%", t: "60%", d: "-1s", s: 7 },
          { l: "70%", t: "22%", d: "-3s", s: 4 },
          { l: "82%", t: "78%", d: "-5s", s: 6 },
          { l: "92%", t: "40%", d: "-2.5s", s: 5 },
          { l: "15%", t: "50%", d: "-3.5s", s: 4 },
          { l: "48%", t: "85%", d: "-1.5s", s: 5 },
          { l: "65%", t: "12%", d: "-4.5s", s: 6 },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold"
            style={{
              left: p.l,
              top: p.t,
              width: p.s,
              height: p.s,
              boxShadow: "0 0 14px 2px oklch(0.74 0.14 80 / 0.75)",
              animation: "pulse-soft 4.5s ease-in-out infinite, float 8s ease-in-out infinite",
              animationDelay: p.d,
            }}
          />
        ))}
      </div>

      {/* fade superior e inferior para legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
    </div>
  );
}
