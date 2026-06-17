import { useEffect, useState } from "react";

/**
 * Cinematic scroll intro inspired by oryzo.ai.
 * The overlay is fixed above the real page, so the first frame always shows
 * the brand name instead of an empty spacer/blank screen.
 */
export function ScrollIntro({ name = "FACILIT" }: { name?: string }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    const previousRestoration = window.history.scrollRestoration;
    let raf = 0;
    let armRaf = 0;
    let armed = false;

    html.style.scrollBehavior = "auto";
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setProgress(0);
    setHidden(false);

    const update = () => {
      if (!armed) return;
      const total = Math.max(window.innerHeight * 0.9, 1);
      const p = Math.min(Math.max(window.scrollY / total, 0), 1);
      setProgress(p);
      setHidden(p >= 0.995);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    armRaf = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      armRaf = requestAnimationFrame(() => {
        armed = true;
        update();
        html.style.scrollBehavior = previousScrollBehavior;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (armRaf) cancelAnimationFrame(armRaf);
      html.style.scrollBehavior = previousScrollBehavior;
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  if (hidden) return null;

  const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
  const smoothstep = (edge0: number, edge1: number, value: number) => {
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  const exit = smoothstep(0.08, 0.92, progress);
  const overlayExit = smoothstep(0.52, 1, progress);
  const scale = 1 + exit * 0.36;
  const blur = exit * 10;
  const tracking = 0.01 + exit * 0.08;
  const textOpacity = 1 - smoothstep(0.2, 0.82, progress);

  const overlayOpacity = 1 - overlayExit;
  const overlayScale = 1 + overlayExit * 0.05;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-hidden"
      style={{
        opacity: overlayOpacity,
        transform: `scale(${overlayScale})`,
        pointerEvents: overlayOpacity > 0.04 ? "auto" : "none",
        background: "var(--background)",
        willChange: "opacity, transform",
      }}
    >
      <div
        className="absolute -left-[18%] top-1/2 h-[110vmin] w-[110vmin] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--gold) 70%, transparent), transparent 70%)",
          filter: "blur(46px)",
          opacity: 0.72,
        }}
      />
      <div
        className="absolute -right-[14%] top-1/2 h-[86vmin] w-[86vmin] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 58%, transparent), transparent 70%)",
          filter: "blur(54px)",
          opacity: 0.62,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, oklch(0 0 0 / 0.72) 100%)",
        }}
      />

      <div
        className="relative z-10 max-w-[94vw] select-none whitespace-nowrap text-center font-display font-black uppercase will-change-transform"
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          letterSpacing: `${tracking}em`,
          opacity: textOpacity,
          fontSize: "clamp(3rem, 13vw, 11rem)",
          lineHeight: 1,
        }}
      >
        <span
          className="block"
          style={{
            color: "#f4d56f",
            textShadow: "0 0 32px rgba(244, 213, 111, 0.58), 0 0 96px rgba(54, 211, 153, 0.35)",
          }}
        >
          {name}
        </span>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse text-center text-[10px] font-semibold uppercase text-muted-foreground"
        style={{ letterSpacing: "0.38em", opacity: (1 - exit) * 0.82 }}
      >
        Role para entrar ↓
      </div>
    </div>
  );
}

