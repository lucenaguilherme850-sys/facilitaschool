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
        className="absolute -top-40 -right-40 h-[820px] w-[820px] rounded-full blur-3xl opacity-80 will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.16 82 / 0.75), transparent 70%)",
          animation: reduced ? undefined : "orb-drift 22s ease-in-out infinite",
        }}
      />
      {/* Drifting soft gold glow bottom-left (counter-phase) */}
      <div
        className="absolute -bottom-40 -left-40 h-[680px] w-[680px] rounded-full blur-3xl opacity-70 will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.87 0.14 88 / 0.55), transparent 70%)",
          animation: reduced ? undefined : "orb-drift 28s ease-in-out infinite reverse",
          animationDelay: "-6s",
        }}
      />
      {/* Slow-pulsing accent orb center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full blur-3xl opacity-90"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.14 82 / 0.28), transparent 70%)",
          animation: reduced ? undefined : "pulse-soft 9s ease-in-out infinite",
        }}
      />

      {/* Cursor spotlight */}
      {!reduced && (
        <div
          ref={spotRef}
          className="absolute top-0 left-0 h-[760px] w-[760px] rounded-full blur-3xl will-change-transform"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.82 0.14 82 / 0.22), transparent 70%)",
          }}
        />
      )}

      {/* Diagonal light beam sweep */}
      {!reduced && (
        <>
          <div
            className="absolute -top-1/4 left-0 h-[160%] w-[22%] blur-2xl will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.90 0.12 88 / 0.42), transparent)",
              animation: "beam-sweep 14s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -top-1/4 left-0 h-[160%] w-[14%] blur-3xl will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.16 82 / 0.50), transparent)",
              animation: "beam-sweep 22s ease-in-out infinite",
              animationDelay: "-7s",
            }}
          />
        </>
      )}

      {/* Slow conic sweep behind everything */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120vmax] w-[120vmax] opacity-[0.14] will-change-transform"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.78 0.16 82 / 0.8) 60deg, transparent 120deg, transparent 240deg, oklch(0.87 0.14 88 / 0.7) 300deg, transparent 360deg)",
          animation: reduced ? undefined : "conic-spin 60s linear infinite",
        }}
      />

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
