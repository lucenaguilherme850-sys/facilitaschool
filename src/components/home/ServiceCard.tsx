import { Link } from "@tanstack/react-router";
import { GraduationCap, BookOpen, FileText } from "lucide-react";
import { formatPriceUnit } from "@/lib/format";
import type { Service } from "./types";

const iconByIndex = [GraduationCap, BookOpen, FileText];

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const Icon = iconByIndex[index % iconByIndex.length];
  return (
    <Link
      to="/servico/$slug"
      params={{ slug: service.slug }}
      className="bento lift group p-8 md:p-10 block relative overflow-hidden"
    >
      <div className="mb-12 h-10 w-10 text-gold transition-transform duration-500 group-hover:scale-110">
        <Icon className="h-10 w-10" strokeWidth={1.25} />
      </div>
      <h3 className="font-display text-3xl italic mb-3 text-foreground">{service.name}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8">
        {service.description}
      </p>
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <span className="text-gold text-sm font-medium tracking-tight">
          {formatPriceUnit(service.price_cents, service.unit)}
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-gold transition-colors">
          Saber mais →
        </span>
      </div>
    </Link>
  );
}
