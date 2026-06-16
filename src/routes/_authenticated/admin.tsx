import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, RefreshCcw, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Background } from "@/components/Background";
import { adminListOrders, adminUpdateOrderStatus, adminGetProofSignedUrl, checkIsAdmin } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — Executa" }] }),
  component: AdminPage,
});

const STATUSES = ["pending_payment", "awaiting_review", "in_progress", "completed", "cancelled"] as const;
const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Aguardando pagamento",
  awaiting_review: "Comprovante enviado",
  in_progress: "Em execução",
  completed: "Concluído",
  cancelled: "Cancelado",
};

function fmt(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(adminListOrders);
  const updateFn = useServerFn(adminUpdateOrderStatus);
  const signFn = useServerFn(adminGetProofSignedUrl);
  const checkFn = useServerFn(checkIsAdmin);

  const adminCheck = useQuery({ queryKey: ["isAdmin"], queryFn: () => checkFn() });
  const ordersQ = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listFn(),
    enabled: adminCheck.data?.isAdmin === true,
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function openProof(path: string) {
    try {
      const { url } = await signFn({ data: { path } });
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro");
    }
  }

  async function changeStatus(id: string, status: any) {
    try {
      await updateFn({ data: { id, status } });
      toast.success("Status atualizado");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Erro");
    }
  }

  if (adminCheck.isLoading) {
    return <><Background /><div className="p-10 text-center text-muted-foreground">Carregando...</div></>;
  }
  if (!adminCheck.data?.isAdmin) {
    return (
      <>
        <Background />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-3">Sem permissão de admin</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Sua conta foi criada, mas ainda não é admin. Peça acesso ou execute no banco:
          </p>
          <code className="block text-left text-xs bg-card border border-border rounded-lg p-4 font-mono overflow-x-auto">
            INSERT INTO public.user_roles (user_id, role)<br/>
            SELECT id, 'admin' FROM auth.users WHERE email = 'SEU_EMAIL';
          </code>
          <button onClick={logout} className="mt-6 text-sm text-gold underline">Sair</button>
        </div>
      </>
    );
  }

  const orders = ordersQ.data ?? [];

  return (
    <>
      <Background />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl">Executa<span className="text-gold">.</span><span className="text-muted-foreground text-sm ml-3">Admin</span></Link>
          <div className="flex items-center gap-2">
            <button onClick={() => qc.invalidateQueries({ queryKey: ["admin-orders"] })} className="ui-icon-btn"><RefreshCcw className="h-4 w-4" /></button>
            <button onClick={logout} className="ui-icon-btn"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="font-display text-4xl mb-2">Pedidos</h1>
        <p className="text-sm text-muted-foreground mb-8">{orders.length} pedido(s) no total.</p>

        <div className="grid gap-3">
          {orders.map((o: any) => {
            const open = expanded === o.id;
            return (
              <div key={o.id} className="rounded-xl bg-card border border-border/60 overflow-hidden">
                <div className="p-5 flex flex-wrap items-center gap-4">
                  <div className="font-mono text-gold tracking-wider">{o.public_code}</div>
                  <div className="font-medium">{o.service_name}</div>
                  <div className="text-sm text-muted-foreground">{o.customer_name} · {o.customer_contact}</div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-gold font-medium">{fmt(o.amount_cents)}</span>
                    <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)} className="bg-input border border-border rounded-lg px-3 py-1.5 text-sm">
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                    <button onClick={() => setExpanded(open ? null : o.id)} className="ui-icon-btn">
                      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {open && (
                  <div className="border-t border-border/60 p-5 bg-background/40 grid md:grid-cols-2 gap-6 animate-fade-in">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Dados do formulário</div>
                      <pre className="text-xs bg-input p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words">{JSON.stringify(o.form_data, null, 2)}</pre>
                      {o.notes && <div className="mt-3 text-sm"><span className="text-muted-foreground">Observações: </span>{o.notes}</div>}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Pagamento</div>
                      <div className="text-sm space-y-1">
                        <div><span className="text-muted-foreground">Qtd: </span>{o.quantity}</div>
                        <div><span className="text-muted-foreground">Criado: </span>{new Date(o.created_at).toLocaleString("pt-BR")}</div>
                        {o.proof_uploaded_at && <div><span className="text-muted-foreground">Comprovante: </span>{new Date(o.proof_uploaded_at).toLocaleString("pt-BR")}</div>}
                      </div>
                      {o.proof_url ? (
                        <button onClick={() => openProof(o.proof_url)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/10 px-4 py-2 text-sm hover:bg-gold/20">
                          <ExternalLink className="h-4 w-4" /> Ver comprovante
                        </button>
                      ) : (
                        <div className="mt-4 text-sm text-muted-foreground">Comprovante ainda não enviado.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="text-center text-muted-foreground py-16">Nenhum pedido ainda.</div>
          )}
        </div>
      </div>

      <style>{`.ui-icon-btn { height:2.25rem; width:2.25rem; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:.625rem; background:var(--card); } .ui-icon-btn:hover{ border-color: var(--gold); color: var(--gold); }`}</style>
    </>
  );
}
