import { useEffect, useState } from "react";

// Partículas fixas — menos elementos, sem dupla animação, sem box-shadow pesado
const PARTICLES = [
  { l: "12%", t: "22%", d: "0s", s: 5 },
  { l: "32%", t: "70%", d: "-2s", s: 4 },
  { l: "55%", t: "30%", d: "-1s", s: 6 },
  { l: "72%", t: "65%", d: "-3s", s: 4 },
  { l: "88%", t: "20%", d: "-2.5s", s: 5 },
  { l: "20%", t: "85%", d: "-1.5s", s: 4 },
];

export function Background() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base creme */}
      <div className="absolute inset-0 bg-background" />

      {/* AURORA — gradiente cônico esmeralda + dourado girando lentamente (GPU-only) */}
      <div
        className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.55] blur-3xl will-change-transform"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, oklch(0.38 0.10 162 / 0.55), oklch(0.74 0.14 80 / 0.45), oklch(0.90 0.10 86 / 0.35), oklch(0.38 0.10 162 / 0.55))",
          animation: reduced ? undefined : "aurora-spin 60s linear infinite",
        }}
      />

      {/* BLOBS — só 2, animação mais lenta */}
      <div
        className="absolute -top-40 -left-32 h-[640px] w-[640px] rounded-full blur-3xl will-change-transform"
        style={{
          background: "radial-gradient(closest-side, oklch(0.38 0.10 162 / 0.75), transparent 70%)",
          animation: reduced ? undefined : "orb-drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/4 -right-40 h-[560px] w-[560px] rounded-full blur-3xl will-change-transform"
        style={{
          background: "radial-gradient(closest-side, oklch(0.74 0.14 80 / 0.65), transparent 70%)",
          animation: reduced ? undefined : "orb-drift 28s ease-in-out infinite",
          animationDelay: "-9s",
        }}
      />

      {/* GRID estático — sem animação (economia enorme de paint) */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* PARTÍCULAS douradas — menos, mais leves */}
      {!reduced &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold will-change-transform"
            style={{
              left: p.l,
              top: p.t,
              width: p.s,
              height: p.s,
              opacity: 0.8,
              animation: "pulse-soft 5s ease-in-out infinite",
              animationDelay: p.d,
            }}
          />
        ))}

      {/* fade superior e inferior para legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
    </div>
  );
}
