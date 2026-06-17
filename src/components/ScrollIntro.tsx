import { useEffect, useRef, useState } from "react";

/**
 * Cinematic scroll intro inspired by oryzo.ai:
 * - Fixed overlay covers the viewport on first load
 * - As the user scrolls, the brand name zooms IN slightly,
 *   brightens, sharpens, then the whole overlay fades + scales out
 *   revealing the page underneath.
 * - Uses a tall spacer to drive scroll progress, then unmounts.
 */
export function ScrollIntro({ name = "FACILIT" }: { name?: string }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDone(true);
      return;
    }
    // lock scroll restoration to top on mount
    window.scrollTo(0, 0);

    let raf = 0;
    const update = () => {
      const el = spacerRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY, 0), total);
      const p = total > 0 ? scrolled / total : 1;
      setProgress(p);
      if (p >= 1) setDone(true);
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

  if (done) return null;

  // Easing
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const p = ease(progress);

  // Text starts large-but-dim/blurred, ends huge/sharp/bright before the
  // overlay itself fades + zooms out.
  const scale = 1 + p * 1.4;
  const blur = (1 - p) * 14;
  const tracking = -0.04 + (1 - p) * 0.18; // em
  const textOpacity = 0.35 + p * 0.65;

  // Last 25% of the timeline: the entire overlay fades + scales out
  const exitT = Math.max(0, (progress - 0.75) / 0.25);
  const overlayOpacity = 1 - exitT;
  const overlayScale = 1 + exitT * 0.15;

  return (
    <>
      {/* Spacer drives scroll progress without affecting layout */}
      <div ref={spacerRef} aria-hidden style={{ height: "260vh" }} />

      {/* Fixed cinematic overlay */}
      <div
        aria-hidden
        className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
        style={{
          opacity: overlayOpacity,
          transform: `scale(${overlayScale})`,
          pointerEvents: "none",
          background: "var(--background)",
          willChange: "opacity, transform",
        }}
      >
        {/* warm corner glow (oryzo-style) */}
        <div
          className="absolute -left-[20%] top-1/2 h-[120vmin] w-[120vmin] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.62 0.16 55 / 0.55), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* cool counter-glow */}
        <div
          className="absolute -right-[15%] top-1/2 h-[90vmin] w-[90vmin] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.38 0.10 162 / 0.45), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, oklch(0 0 0 / 0.7) 100%)",
          }}
        />

        <h1
          className="relative select-none font-display font-black uppercase will-change-transform"
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            letterSpacing: `${tracking}em`,
            opacity: textOpacity,
            color: "oklch(0.55 0.04 70)",
            fontSize: "clamp(4rem, 16vw, 14rem)",
            lineHeight: 1,
            textShadow:
              "0 0 80px oklch(0.74 0.14 80 / 0.35), 0 0 160px oklch(0.62 0.16 55 / 0.25)",
          }}
        >
          {name}
        </h1>

        {/* scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          style={{ opacity: (1 - p) * 0.8 }}
        >
          Role para entrar ↓
        </div>
      </div>
    </>
  );
}
