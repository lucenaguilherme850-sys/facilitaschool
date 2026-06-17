import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatPriceUnit } from "@/lib/format";
import type { Service } from "./types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/servico/$slug"
      params={{ slug: service.slug }}
      className="group relative block rounded-2xl bg-card shadow-card border border-border/60 p-6 hover:border-gold/60 transition-all duration-500 lift hover:shadow-gold"
    >
      <div className="aspect-[16/9] rounded-xl bg-secondary/60 border border-border/40 mb-5 grid place-items-center overflow-hidden">
        <div className="h-14 w-14 rounded-xl bg-gold-gradient grid place-items-center shadow-gold animate-float group-hover:scale-110 transition-transform duration-500">
          <span className="font-display text-2xl text-primary-foreground">{service.name.charAt(0)}</span>
        </div>
      </div>
      <h3 className="font-display text-2xl mb-2">{service.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{service.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <span className="text-gold text-sm font-medium">{formatPriceUnit(service.price_cents, service.unit)}</span>
        <span className="h-9 w-9 rounded-full border border-border/60 grid place-items-center group-hover:bg-gold group-hover:border-gold group-hover:text-primary-foreground transition-all duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
