import { useEffect, useRef, useState } from "react";

/**
 * Cinematic scroll intro inspired by oryzo.ai.
 * The overlay is fixed above the real page, so the first frame always shows
 * the brand name instead of an empty spacer/blank screen.
 */
export function ScrollIntro({ name = "FACILIT" }: { name?: string }) {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(p);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
  const smoothstep = (edge0: number, edge1: number, value: number) => {
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  const exit = smoothstep(0.08, 0.92, progress);
  const overlayExit = smoothstep(0.52, 1, progress);
  const scale = 1 + exit * 0.36;
  const blur = exit * 6;
  const tracking = 0.01 + exit * 0.08;
  const textOpacity = 1 - overlayExit;

  const overlayOpacity = 1 - overlayExit;
  const overlayScale = 1 + overlayExit * 0.05;

  return (
    <section ref={sectionRef} className="relative h-[185dvh]" aria-label="Abertura Facilit">
      <div
        className="sticky top-0 z-[70] flex h-dvh items-center justify-center overflow-hidden"
        style={{
          opacity: overlayOpacity,
          transform: `scale(${overlayScale})`,
          background: "var(--background)",
          willChange: "opacity, transform",
        }}
      >
        <div className="absolute -left-[18%] top-1/2 h-[110vmin] w-[110vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(244,213,111,0.42),transparent_70%)] blur-3xl" />
        <div className="absolute -right-[14%] top-1/2 h-[86vmin] w-[86vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(54,211,153,0.32),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.72)_100%)]" />

        <h1
          className="relative z-10 max-w-[94vw] select-none whitespace-nowrap text-center font-display font-black uppercase text-[#f4d56f]"
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            letterSpacing: `${tracking}em`,
            opacity: textOpacity,
            fontSize: "clamp(3rem, 13vw, 11rem)",
            lineHeight: 1,
            textShadow: "0 0 32px rgba(244, 213, 111, 0.58), 0 0 96px rgba(54, 211, 153, 0.35)",
            willChange: "opacity, transform, filter",
          }}
        >
          {name}
        </h1>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse text-center text-[10px] font-semibold uppercase text-muted-foreground"
          style={{ letterSpacing: "0.38em", opacity: (1 - exit) * 0.82 }}
        >
          Role para entrar ↓
        </div>
      </div>
    </section>
  );
}

