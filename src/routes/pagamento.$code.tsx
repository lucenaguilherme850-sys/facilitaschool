import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Check, MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { getOrderByCode } from "@/lib/orders.functions";
import { formatBRL } from "@/lib/format";

const PIX_KEY = "64999611088";
const WHATSAPP = "5564999611088";
const WHATSAPP_DISPLAY = "+55 (64) 99961-1088";

const orderQuery = (code: string) =>
  queryOptions({
    queryKey: ["order", code],
    queryFn: () => getOrderByCode({ data: { code } }),
  });

function PaymentError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-2">Erro ao carregar o pedido</h1>
      <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
      <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary text-primary-foreground px-6 py-2.5">Tentar novamente</button>
    </div>
  );
}

export const Route = createFileRoute("/pagamento/$code")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(orderQuery(params.code)),
  component: PaymentPage,
  errorComponent: PaymentError,
  notFoundComponent: () => <div className="p-10 text-center">Pedido não encontrado.</div>,
});

const fmt = formatBRL;

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


  const waMessage = encodeURIComponent(
    `Olá! Acabei de pagar o serviço *${order.service_name}*.\nCódigo do pedido: *${order.public_code}*\nValor: ${fmt(order.amount_cents)}\nSegue o comprovante 📎`,
  );
  const waText = decodeURIComponent(waMessage);
  const waWebLink = `https://wa.me/${WHATSAPP}?text=${waMessage}`;

  function openWhatsApp(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const popup = window.open("about:blank", "_blank");
    navigator.clipboard.writeText(waText).catch(() => undefined);
    toast.success(`Mensagem copiada. Abrindo WhatsApp para ${WHATSAPP_DISPLAY}.`);
    if (popup) {
      popup.opener = null;
      popup.location.href = waWebLink;
      return;
    }
    window.open(waWebLink, "_blank", "noopener,noreferrer");
  }

  

  return (
    <>
      <Background />
      <Header />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 sm:pt-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Início</Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10 space-y-5 sm:space-y-6">
        {/* CONFIRM */}
        <div className="rounded-2xl bg-card shadow-card border border-border/60 p-5 sm:p-8 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Pedido criado</div>
          <h1 className="font-display text-3xl sm:text-4xl mb-2">Pague via Pix para começar</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">Use os dados abaixo. Depois, envie o comprovante.</p>

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
        <div className="rounded-2xl bg-card shadow-card border border-border/60 p-5 sm:p-8 animate-fade-up">
          <h2 className="font-display text-xl sm:text-2xl mb-1">Envie o comprovante pelo WhatsApp</h2>
          <p className="text-sm text-muted-foreground mb-6">Toque no botão abaixo — abrimos o WhatsApp com a mensagem já preenchida. Basta anexar a foto/PDF do comprovante e enviar.</p>

          <a href="#whatsapp-comprovante" onClick={openWhatsApp} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white font-semibold px-4 py-3.5 text-sm sm:text-base hover:brightness-110 transition text-center break-all">
            <MessageCircle className="h-5 w-5 shrink-0" /> <span>Abrir WhatsApp: {WHATSAPP_DISPLAY}</span>
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
