import { useEffect, useRef, useState } from "react";

/**
 * Oryzo-style scroll intro:
 * - Full-screen sticky panel that pins for ~1.5 viewports of scroll
 * - The site name starts small, blurred and dim, then scales up, sharpens,
 *   and brightens as the user scrolls — finally fading out to reveal the page.
 */
export function ScrollIntro({ name = "FACILIT" }: { name?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Respect reduced motion: skip the intro entirely.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDone(true);
      return;
    }

    let raf = 0;
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
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

  // Easing curves
  const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
  const scale = 0.35 + eased * 7.5; // grows from small → huge
  const blur = (1 - eased) * 18; // px
  const letterSpacing = -0.02 + (1 - eased) * 0.25; // em, tightens
  const textOpacity = 0.25 + eased * 0.75;
  const fadeOut = progress > 0.82 ? Math.max(0, 1 - (progress - 0.82) / 0.18) : 1;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="relative w-full"
      style={{ height: done ? 0 : "220vh", pointerEvents: "none" }}
    >
      <div
        className="sticky top-0 left-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          opacity: fadeOut,
          visibility: done ? "hidden" : "visible",
          background:
            "radial-gradient(120% 80% at 10% 50%, oklch(0.32 0.10 65 / 0.55), transparent 60%), radial-gradient(120% 80% at 90% 50%, oklch(0.20 0.05 160 / 0.45), transparent 60%), var(--background)",
        }}
      >
        {/* subtle grain / vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, oklch(0 0 0 / 0.55) 100%)",
          }}
        />
        <h1
          className="relative select-none font-display font-black uppercase will-change-transform"
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            letterSpacing: `${letterSpacing}em`,
            color: "var(--gold)",
            opacity: textOpacity,
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            transition: "color 200ms linear",
            textShadow:
              "0 0 60px oklch(0.74 0.14 80 / 0.35), 0 0 120px oklch(0.74 0.14 80 / 0.2)",
          }}
        >
          {name}
        </h1>

        {/* scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-muted-foreground"
          style={{ opacity: (1 - eased) * 0.8 }}
        >
          Role para começar ↓
        </div>
      </div>
    </div>
  );
}
