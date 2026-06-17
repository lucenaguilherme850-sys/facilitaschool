import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@tanstack/react-router";

export function Background() {
  const hydrated = useHydrated();
  const [reduced, setReduced] = useState(false);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${cx - 350}px, ${cy - 350}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (!hydrated) {
    return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-background" />;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      {/* Drifting gold glow top-right */}
      <div
        className="absolute -top-40 -right-40 h-[720px] w-[720px] rounded-full blur-3xl opacity-40 will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.12 82 / 0.45), transparent 70%)",
          animation: reduced ? undefined : "orb-drift 22s ease-in-out infinite",
        }}
      />
      {/* Drifting soft gold glow bottom-left (counter-phase) */}
      <div
        className="absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-30 will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.87 0.10 88 / 0.30), transparent 70%)",
          animation: reduced ? undefined : "orb-drift 28s ease-in-out infinite reverse",
          animationDelay: "-6s",
        }}
      />
      {/* Slow-pulsing accent orb center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.12 82 / 0.10), transparent 70%)",
          animation: reduced ? undefined : "pulse-soft 9s ease-in-out infinite",
        }}
      />

      {/* Cursor spotlight */}
      {!reduced && (
        <div
          ref={spotRef}
          className="absolute top-0 left-0 h-[700px] w-[700px] rounded-full blur-3xl will-change-transform"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.78 0.12 82 / 0.12), transparent 70%)",
          }}
        />
      )}

      {/* Subtle panning grid */}
      <div
        className="absolute inset-0 bg-grid opacity-30"
        style={{ animation: reduced ? undefined : "grid-pan 30s linear infinite" }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
    </div>
  );
}
