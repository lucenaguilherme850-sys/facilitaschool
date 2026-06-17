import { TRUST_ITEMS } from "./home.data";

export function TrustStrip() {
  return (
    <div
      className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8 border-t border-border/40 w-full max-w-xl"
      style={{ animation: "var(--animate-fade-up)", animationDelay: "460ms" }}
    >
      {TRUST_ITEMS.map((label) => (
        <div key={label} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
