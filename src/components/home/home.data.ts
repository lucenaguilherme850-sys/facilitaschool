import { Zap, Lock, ShieldCheck, type LucideIcon } from "lucide-react";

export const TRUST_ITEMS = [
  "Entrega no prazo",
  "Pagamento via Pix",
  "100% Sigilo",
] as const;

export type HowStep = { icon: LucideIcon; title: string; description: string };

export const HOW_STEPS: HowStep[] = [
  { icon: Zap, title: "Escolha e preencha", description: "Selecione o serviço e preencha os dados em menos de 1 minuto." },
  { icon: Lock, title: "Pague via Pix", description: "Você recebe um código único, faz o Pix e envia o comprovante." },
  { icon: ShieldCheck, title: "Receba no prazo", description: "Executamos o serviço com cuidado e te avisamos quando estiver pronto." },
];
