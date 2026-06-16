import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  variant?: "default" | "soft";
  as?: "div" | "section" | "li" | "span";
  className?: string;
  style?: CSSProperties;
};

export function Reveal({ children, delay = 0, variant = "default", as = "div", className = "", style }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: garante que aparece mesmo se IO falhar
    const fallback = window.setTimeout(() => setVisible(true), 600);

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return () => window.clearTimeout(fallback);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            window.clearTimeout(fallback);
            break;
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    // Se já está visível na montagem, força imediatamente
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      io.disconnect();
      window.clearTimeout(fallback);
    }

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const Tag = as as "div";
  const base = variant === "soft" ? "reveal-soft" : "reveal";
  return (
    <Tag
      ref={ref as never}
      className={`${base} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
