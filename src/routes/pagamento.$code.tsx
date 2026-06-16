import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Check, MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { getOrderByCode } from "@/lib/orders.functions";

const PIX_KEY = "64999611088";
const WHATSAPP = "5564999611088";
const WHATSAPP_DISPLAY = "+55 (64) 99961-1088";

const orderQuery = (code: string) =>
  queryOptions({
    queryKey: ["order", code],
    queryFn: () => getOrderByCode({ data: { code } }),
  });

export const Route = createFileRoute("/pagamento/$code")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(orderQuery(params.code)),
  component: PaymentPage,
});

function fmt(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function PaymentPage() {
  const { code } = Route.useParams();
  const { data: order } = useSuspenseQuery(orderQuery(code));
  const [copied, setCopied] = useState<string | null>(null);

  if (!order) {
    return (
      <>
        <Background /><Header />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl mb-3">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">Verifique o código e tente novamente.</p>
          <Link to="/" className="text-gold underline">Voltar ao início</Link>
        </div>
      </>
    );
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Arquivo muito grande (máx 8MB)"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${code}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("proofs").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      await attachFn({ data: { code, proof_url: path } });
      toast.success("Comprovante enviado! Em breve confirmaremos.");
      qc.invalidateQueries({ queryKey: ["order", code] });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao enviar comprovante");
    } finally {
      setUploading(false);
    }
  }

  const waMessage = encodeURIComponent(
    `Olá! Acabei de pagar o serviço *${order.service_name}*.\nCódigo do pedido: *${order.public_code}*\nValor: ${fmt(order.amount_cents)}\nSegue o comprovante 📎`,
  );
  const waText = decodeURIComponent(waMessage);
  const waAppLink = `whatsapp://send?phone=${WHATSAPP}&text=${waMessage}`;

  function openWhatsApp(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    navigator.clipboard.writeText(waText).catch(() => undefined);
    toast.success(`Mensagem copiada. Abrindo WhatsApp para ${WHATSAPP_DISPLAY}.`);
    window.location.href = waAppLink;
  }

  const sent = order.status !== "pending_payment";

  return (
    <>
      <Background />
      <Header />
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Início</Link>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        {/* CONFIRM */}
        <div className="rounded-2xl bg-card shadow-card border border-border/60 p-8 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Pedido criado</div>
          <h1 className="font-display text-4xl mb-2">Pague via Pix para começar</h1>
          <p className="text-muted-foreground mb-8">Use os dados abaixo. Depois, envie o comprovante.</p>

          {/* Code */}
          <div className="rounded-xl border border-gold/40 bg-gold/5 p-5 mb-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Código único do pedido</div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-2xl md:text-3xl text-gold tracking-wider">{order.public_code}</span>
              <button onClick={() => copy(order.public_code, "code")} className="ui-icon-btn">
                {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Guarde este código. Envie-o junto com o comprovante.</p>
          </div>

          {/* PIX */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-border bg-input p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Chave Pix (Celular)</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-lg">(64) 99961-1088</span>
                <button onClick={() => copy(PIX_KEY, "pix")} className="ui-icon-btn">
                  {copied === "pix" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-input p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Valor a pagar</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-2xl text-gold">{fmt(order.amount_cents)}</span>
                <button onClick={() => copy((order.amount_cents/100).toFixed(2), "val")} className="ui-icon-btn">
                  {copied === "val" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <ol className="space-y-2 text-sm text-muted-foreground mb-2">
            <li>1. Abra o app do seu banco e faça um Pix para a chave acima.</li>
            <li>2. Mande o comprovante no nosso WhatsApp junto com o código do pedido.</li>
            <li>3. Assim que confirmarmos, iniciamos seu serviço.</li>
          </ol>
        </div>

        {/* WHATSAPP */}
        <div className="rounded-2xl bg-card shadow-card border border-border/60 p-8 animate-fade-up">
          <h2 className="font-display text-2xl mb-1">Envie o comprovante pelo WhatsApp</h2>
          <p className="text-sm text-muted-foreground mb-6">Toque no botão abaixo — abrimos o WhatsApp com a mensagem já preenchida. Basta anexar a foto/PDF do comprovante e enviar.</p>

          <a href={waAppLink} onClick={openWhatsApp} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white font-semibold px-5 py-3.5 hover:brightness-110 transition">
            <MessageCircle className="h-5 w-5" /> Abrir WhatsApp: {WHATSAPP_DISPLAY}
          </a>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
            Assim que recebermos seu comprovante, confirmamos e iniciamos o serviço.
          </div>
        </div>

      </div>

      <style>{`
        .ui-icon-btn { height: 2.25rem; width: 2.25rem; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius: .625rem; background: var(--card); }
        .ui-icon-btn:hover { background: var(--secondary); border-color: var(--gold); color: var(--gold); }
      `}</style>
    </>
  );
}
