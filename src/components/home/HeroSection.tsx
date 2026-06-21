import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useRef, type MouseEvent } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const TRUST_ITEMS = ["Entrega no prazo", "Pagamento via Pix", "100% Sigilo", "Sem cadastro", "Suporte humano", "Resposta em minutos"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease } },
};

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--mouse-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Main hero cell */}
        <motion.div
          ref={heroRef}
          onMouseMove={handleMouseMove}
          variants={cardIn}
          className="lg:col-span-8 bento p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] group/hero"
          style={{ ["--mouse-x" as string]: "50%", ["--mouse-y" as string]: "50%" }}
        >
          {/* Cursor spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), oklch(0.78 0.14 82 / 0.18), transparent 60%)",
            }}
          />
          <motion.div
            className="orb h-[260px] w-[260px] sm:h-[420px] sm:w-[420px] -top-24 -right-24 sm:-top-32 sm:-right-32 opacity-100"
            animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />


          <div className="relative z-10">
            <motion.div variants={fadeIn} className="flex items-center gap-3 mb-8">
              <motion.span
                className="h-px bg-gold block"
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.9, ease, delay: 0.2 }}
              />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold">
                Soluções Acadêmicas
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="fluid-display mb-8 text-balance">
              Chega de professor<br />
              <em className="italic text-gold-soft not-italic" style={{ fontStyle: "italic" }}>
                no seu pé.
              </em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="fluid-lead text-muted-foreground max-w-md mb-10 leading-relaxed"
            >
              A Facilit faz suas atividades de GoEnglish, Netescola e Revisa Goiás{" "}
              <strong className="text-foreground font-medium">no prazo</strong>, com sigilo total.
              Você paga via Pix e a gente entrega.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="w-full sm:w-auto">
                <Link
                  to="/"
                  hash="servicos"
                  className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 rounded-full bg-gold text-primary-foreground font-semibold tracking-tight px-7 py-3.5 shadow-gold hover:bg-gold-soft transition-colors duration-300"
                >
                  Ver serviços
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="w-full sm:w-auto">
                <Link
                  to="/"
                  hash="como-funciona"
                  className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center rounded-full border border-border text-foreground font-medium px-7 py-3.5 hover:bg-secondary transition-colors duration-300"
                >
                  Como funciona →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right bento stack */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
          <motion.div
            variants={cardIn}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bento flex-1 p-6 md:p-8 flex flex-col justify-between min-h-[200px]"
          >
            <div className="flex -space-x-3 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-card ${
                    i === 0 ? "bg-neutral-700" : i === 1 ? "bg-neutral-600" : "bg-neutral-500"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease }}
                />
              ))}
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-card bg-gold flex items-center justify-center text-[11px] text-primary-foreground font-bold"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.78, type: "spring", stiffness: 320, damping: 18 }}
              >
                +47
              </motion.div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-2 font-semibold">
                Confiança
              </p>
              <p className="text-lg font-display leading-tight text-foreground">
                Alunos atendidos esta semana
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={cardIn}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bento flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[200px]"
            style={{
              background: "linear-gradient(135deg, var(--card) 0%, var(--background) 100%)",
              borderColor: "oklch(0.78 0.12 82 / 0.22)",
            }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-6 h-6 text-gold" />
            </motion.div>
            <p className="text-xl font-display italic text-gold-soft">Sigilo Absoluto</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] mt-2 font-semibold">
              Identidade Protegida
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Trust marquee — scrolling, edge-fade */}
      <motion.div
        className="relative mt-8 md:mt-10 py-6 border-y border-border overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease }}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex gap-12 whitespace-nowrap will-change-transform animate-[marquee_28s_linear_infinite]">
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((label, i) => (
            <div key={`${label}-${i}`} className="flex items-center gap-3 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
