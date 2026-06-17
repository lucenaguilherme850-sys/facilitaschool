import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Zap, Save, ExternalLink } from "lucide-react";
import { getZapierWebhook, setZapierWebhook } from "@/lib/orders.functions";

export function ZapierSettings() {
  const getFn = useServerFn(getZapierWebhook);
  const setFn = useServerFn(setZapierWebhook);
  const q = useQuery({ queryKey: ["zapier-webhook"], queryFn: () => getFn() });

  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (q.data?.url !== undefined) setUrl(q.data.url);
  }, [q.data?.url]);

  async function save() {
    setSaving(true);
    try {
      await setFn({ data: { url: url.trim() } });
      toast.success(url.trim() ? "Webhook salvo" : "Webhook removido");
      q.refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
          <Zap className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl text-foreground">Automação Zapier</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cole a URL do "Catch Hook" do Zap. Dispara em <code className="text-gold">order.created</code> e{" "}
            <code className="text-gold">proof.uploaded</code>.
          </p>
        </div>
        <a
          href="https://zapier.com/apps/webhook/integrations"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold shrink-0"
        >
          Como criar <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://hooks.zapier.com/hooks/catch/..."
          className="flex-1 min-w-0 h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-gold"
        />
        <button
          onClick={save}
          disabled={saving || q.isLoading}
          className="h-11 px-4 rounded-lg bg-gold text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-gold-soft transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> Salvar
        </button>
      </div>
    </section>
  );
}
