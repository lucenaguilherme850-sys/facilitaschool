import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "./types";

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="servicos" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">
              Catálogo
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Nossos <span className="italic text-gold-soft">Serviços</span>
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-right">
            Especialistas em cada plataforma. Entrega antes do prazo.
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
