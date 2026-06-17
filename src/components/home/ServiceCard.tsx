import { Link } from "@tanstack/react-router";
import { GraduationCap, BookOpen, FileText, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatPriceUnit } from "@/lib/format";
import type { Service } from "./types";

const iconByIndex = [GraduationCap, BookOpen, FileText];

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const Icon = iconByIndex[index % iconByIndex.length];
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <Link
        to="/servico/$slug"
        params={{ slug: service.slug }}
        className="bento lift group p-8 md:p-10 block relative overflow-hidden h-full"
      >
        {/* hover sheen */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx,50%) var(--my,0%), oklch(0.78 0.12 82 / 0.08), transparent 40%)",
          }}
        />
        <motion.div
          className="mb-12 h-10 w-10 text-gold"
          whileHover={{ rotate: -6, scale: 1.12 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
        >
          <Icon className="h-10 w-10" strokeWidth={1.25} />
        </motion.div>
        <h3 className="font-display text-3xl italic mb-3 text-foreground">{service.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8">
          {service.description}
        </p>
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <span className="text-gold text-sm font-medium tracking-tight">
            {formatPriceUnit(service.price_cents, service.unit)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-gold transition-colors">
            Saber mais
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
