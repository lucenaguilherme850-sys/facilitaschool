// Deterministic formatters — used in SSR-rendered text to avoid React #418
// (Intl on Cloudflare Workers vs browser ICU produce different whitespace for pt-BR).

export function formatBRL(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const reais = Math.floor(abs / 100).toString();
  const centavos = (abs % 100).toString().padStart(2, "0");
  // Thousand separators (.)
  const withThousands = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}R$ ${withThousands},${centavos}`;
}

export function formatPriceUnit(cents: number, unit: string): string {
  return `${formatBRL(cents)} / ${unit}`;
}
