import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Smooth fade + lift transition between routes.
 * - GPU-only properties (opacity, transform) → 60fps.
 * - Respects prefers-reduced-motion.
 * - Keyed by pathname so each route mounts/unmounts cleanly.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  const variants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(6px)" },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "opacity, transform, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
