import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Copy, Check, MessageCircle, ShieldCheck, Clock, Loader2, CheckCircle2, Sparkles } from "lucide-react";
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
    refetchInterval: 8000,
    refetchIntervalInBackground: true,
  });

const STATUS_META: Record<string, { label: string; tone: string; icon: typeof Clock; message: string }> = {
  pending_payment: { label: "Aguardando pagamento", tone: "text-gold border-gold/40 bg-gold/5", icon: Clock, message: "Pague via Pix para iniciarmos seu pedido." },
  payment_received: { label: "Pagamento recebido", tone: "text-emerald-400 border-emerald-400/40 bg-emerald-400/5", icon: CheckCircle2, message: "Recebemos seu Pix! Em breve começamos." },
  paid: { label: "Pagamento confirmado", tone: "text-emerald-400 border-emerald-400/40 bg-emerald-400/5", icon: CheckCircle2, message: "Pagamento confirmado. Vamos começar!" },
  in_progress: { label: "Em andamento", tone: "text-sky-400 border-sky-400/40 bg-sky-400/5", icon: Loader2, message: "Nossa equipe já está fazendo sua atividade." },
  delivered: { label: "Entregue", tone: "text-emerald-400 border-emerald-400/40 bg-emerald-400/5", icon: Sparkles, message: "Tudo pronto! Sua atividade foi entregue." },
  cancelled: { label: "Cancelado", tone: "text-red-400 border-red-400/40 bg-red-400/5", icon: Clock, message: "Este pedido foi cancelado." },
};

function getStatusMeta(status: string) {
  return STATUS_META[status] ?? { label: status, tone: "text-muted-foreground border-border bg-card", icon: Clock, message: "Status atualizado." };
}

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

  const prevStatusRef = useRef<string | null>(order?.status ?? null);
  useEffect(() => {
    if (!order?.status) return;
    const prev = prevStatusRef.current;
    if (prev && prev !== order.status) {
      const meta = getStatusMeta(order.status);
      toast.success(meta.label, { description: meta.message, duration: 7000 });
      if ("Notification" in window && Notification.permission === "granted") {
        try { new Notification(`Pedido ${order.public_code}`, { body: `${meta.label} — ${meta.message}` }); } catch {}
      }
    }
    prevStatusRef.current = order.status;
  }, [order?.status, order?.public_code]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }
  }, []);

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
        {/* STATUS BANNER — atualiza sozinho a cada poucos segundos */}
        {(() => {
          const meta = getStatusMeta(order.status);
          const Icon = meta.icon;
          const animate = order.status === "in_progress";
          return (
            <div className={`rounded-2xl border p-4 sm:p-5 flex items-center gap-4 animate-fade-up ${meta.tone}`}>
              <div className="h-11 w-11 rounded-full bg-card border border-current/30 flex items-center justify-center shrink-0">
                <Icon className={`h-5 w-5 ${animate ? "animate-spin" : ""}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.25em] opacity-80 font-semibold">Status do pedido</div>
                <div className="font-display text-lg sm:text-xl text-foreground">{meta.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{meta.message}</div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" /> Ao vivo
              </span>
            </div>
          );
        })()}

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

          {/* AVISO DE RESPONSABILIDADE */}
          <div className="rounded-xl border border-red-400/40 bg-red-400/5 p-4 mb-6 text-sm">
            <div className="font-semibold text-red-300 mb-2">⚠️ Importante — leia com atenção</div>
            <ul className="space-y-1.5 list-disc pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Guarde o código <span className="font-mono text-gold">{order.public_code}</span></strong>. Ele é a única forma de localizar seu pedido. <strong className="text-foreground">Se você perder o código, não me responsabilizo</strong> por falhas em encontrar ou acompanhar o atendimento.
              </li>
              <li>
                Se você notar que colocou alguma <strong className="text-foreground">informação errada</strong> (login, senha, dados do pedido), me chame <strong className="text-foreground">agora mesmo no WhatsApp informando o código acima</strong>.
              </li>
              <li>
                O contato (WhatsApp ou e-mail) que você informou precisa estar <strong className="text-foreground">correto</strong> — é por ele que avisamos qualquer problema. <strong className="text-foreground">Contato errado = sem aviso, e não me responsabilizo</strong> pelo atraso ou pela não entrega.
              </li>
            </ul>
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
