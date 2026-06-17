import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "FACILIT";
const DURATION_MS = 2800;
const STORAGE_KEY = "facilit:intro:v1";

/**
 * Opening intro — Curtain + Letter Mask Stagger + Counter + Iris reveal.
 * Auto-plays on first load only per session. Respects prefers-reduced-motion.
 */
export function OpeningIntro() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"letters" | "iris" | "done">("letters");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (reduced || seen) return;

    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(true);
    document.body.style.overflow = "hidden";

    // counter 0 → 100 over ~1.6s
    const start = performance.now();
    const counterDur = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / counterDur, 1);
      setCount(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const irisT = setTimeout(() => setPhase("iris"), 2000);
    const doneT = setTimeout(() => {
      setShow(false);
      setPhase("done");
      document.body.style.overflow = "";
    }, DURATION_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(irisT);
      clearTimeout(doneT);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          aria-hidden
        >
          {/* Ambient gold glow */}
          <div className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.14_82/0.35),transparent_70%)] blur-3xl" />

          {/* Letter mask stagger */}
          <h1
            className="relative z-10 flex select-none font-display font-black uppercase text-gold-soft"
            style={{
              fontSize: "clamp(3rem, 14vw, 12rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textShadow: "0 0 48px oklch(0.78 0.14 82 / 0.5)",
            }}
          >
            {NAME.split("").map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 1.1 }}>
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-110%" }}
                  transition={{
                    delay: 0.1 + i * 0.07,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Counter */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs font-bold uppercase tracking-[0.4em] text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {String(count).padStart(3, "0")}
          </motion.div>

          {/* Top + bottom curtain bars */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-background"
            initial={{ y: 0 }}
            animate={phase === "iris" ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            style={{ pointerEvents: "none" }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-background"
            initial={{ y: 0 }}
            animate={phase === "iris" ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            style={{ pointerEvents: "none" }}
          />

          {/* Iris ring shockwave */}
          {phase === "iris" && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-gold"
              initial={{ width: 0, height: 0, opacity: 0.9, x: "-50%", y: "-50%" }}
              animate={{ width: "260vmax", height: "260vmax", opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
