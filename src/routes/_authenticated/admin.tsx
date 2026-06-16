import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut, RefreshCcw, ExternalLink, ChevronDown, ChevronUp, Copy, Download, Search, Trash2 } from "lucide-react";
import { Background } from "@/components/Background";
import { adminListOrders, adminUpdateOrderStatus, adminGetProofSignedUrl, checkIsAdmin, adminDeleteOrder } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — Faclit" }] }),
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
const STATUS_COLOR: Record<string, string> = {
  pending_payment: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  awaiting_review: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  in_progress: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

function fmt(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function copy(text: string, label = "Copiado") {
  navigator.clipboard.writeText(String(text));
  toast.success(label);
}

function toCSV(orders: any[]) {
  const headers = ["codigo", "servico", "cliente", "contato", "qtd", "valor", "status", "criado_em", "comprovante_em", "dados"];
  const rows = orders.map(o => [
    o.public_code,
    o.service_name,
    o.customer_name,
    o.customer_contact,
    o.quantity,
    (o.amount_cents / 100).toFixed(2).replace(".", ","),
    STATUS_LABEL[o.status] ?? o.status,
    new Date(o.created_at).toLocaleString("pt-BR"),
    o.proof_uploaded_at ? new Date(o.proof_uploaded_at).toLocaleString("pt-BR") : "",
    JSON.stringify(o.form_data ?? {}),
  ]);
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...rows].map(r => r.map(esc).join(";")).join("\n");
}

function downloadCSV(orders: any[]) {
  const blob = new Blob(["\uFEFF" + toCSV(orders)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(adminListOrders);
  const updateFn = useServerFn(adminUpdateOrderStatus);
  const signFn = useServerFn(adminGetProofSignedUrl);
  const checkFn = useServerFn(checkIsAdmin);
  const deleteFn = useServerFn(adminDeleteOrder);

  const adminCheck = useQuery({ queryKey: ["isAdmin"], queryFn: () => checkFn() });
  const ordersQ = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listFn(),
    enabled: adminCheck.data?.isAdmin === true,
    refetchInterval: 30_000,
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const allOrders = ordersQ.data ?? [];

  const stats = useMemo(() => {
    const s: Record<string, number> = { total: allOrders.length, revenue: 0 };
    for (const st of STATUSES) s[st] = 0;
    for (const o of allOrders) {
      s[o.status] = (s[o.status] ?? 0) + 1;
      if (o.status === "completed") s.revenue += o.amount_cents;
    }
    return s;
  }, [allOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allOrders.filter((o: any) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return [o.public_code, o.service_name, o.customer_name, o.customer_contact]
        .some((v: any) => String(v ?? "").toLowerCase().includes(q));
    });
  }, [allOrders, search, statusFilter]);

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
      const res: any = await updateFn({ data: { id, status } });
      toast.success(res?.deleted ? "Pedido finalizado e removido" : "Status atualizado");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Erro");
    }
  }

  async function removeOrder(id: string, code: string) {
    if (!confirm(`Apagar pedido ${code}? Esta ação é permanente.`)) return;
    try {
      await deleteFn({ data: { id } });
      toast.success("Pedido apagado");
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
          <p className="text-muted-foreground mb-6 text-sm">Sua conta foi criada, mas ainda não é admin.</p>
          <button onClick={logout} className="mt-6 text-sm text-gold underline">Sair</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Background />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl">Executa<span className="text-gold">.</span><span className="text-muted-foreground text-sm ml-3">Admin</span></Link>
          <div className="flex items-center gap-2">
            <button onClick={() => downloadCSV(filtered)} className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-card hover:border-gold hover:text-gold text-sm">
              <Download className="h-4 w-4" /> Exportar CSV
            </button>
            <button onClick={() => qc.invalidateQueries({ queryKey: ["admin-orders"] })} className="ui-icon-btn"><RefreshCcw className="h-4 w-4" /></button>
            <button onClick={logout} className="ui-icon-btn"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="A pagar" value={stats.pending_payment} accent="yellow" />
          <StatCard label="Para revisar" value={stats.awaiting_review} accent="blue" />
          <StatCard label="Em execução" value={stats.in_progress} accent="purple" />
          <StatCard label="Concluídos" value={stats.completed} accent="emerald" />
          <StatCard label="Receita" value={fmt(stats.revenue)} accent="gold" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar código, cliente, contato, serviço..."
              className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:border-gold outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos os status</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>

        <p className="text-xs text-muted-foreground mb-4">Mostrando {filtered.length} de {allOrders.length} pedido(s).</p>

        <div className="grid gap-3">
          {filtered.map((o: any) => {
            const open = expanded === o.id;
            return (
              <div key={o.id} className="rounded-xl bg-card border border-border/60 overflow-hidden">
                <div className="p-4 flex flex-wrap items-center gap-3">
                  <button onClick={() => copy(o.public_code, "Código copiado")} className="font-mono text-gold tracking-wider hover:opacity-80 inline-flex items-center gap-1.5">
                    {o.public_code} <Copy className="h-3 w-3 opacity-60" />
                  </button>
                  <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${STATUS_COLOR[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  <div className="font-medium">{o.service_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {o.customer_name} ·{" "}
                    <button onClick={() => copy(o.customer_contact, "Contato copiado")} className="hover:text-gold inline-flex items-center gap-1">
                      {o.customer_contact} <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-gold font-medium">{fmt(o.amount_cents)}</span>
                    <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)} className="bg-input border border-border rounded-lg px-3 py-1.5 text-sm">
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                    <button onClick={() => removeOrder(o.id, o.public_code)} title="Apagar pedido" className="ui-icon-btn hover:!border-red-500/60 hover:!text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setExpanded(open ? null : o.id)} className="ui-icon-btn">
                      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {open && (
                  <div className="border-t border-border/60 p-5 bg-background/40 grid md:grid-cols-2 gap-6 animate-fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Dados do formulário</div>
                        <button onClick={() => copy(JSON.stringify(o.form_data, null, 2), "Dados copiados")} className="text-xs text-gold hover:underline inline-flex items-center gap-1"><Copy className="h-3 w-3" /> Copiar tudo</button>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(o.form_data ?? {}).map(([k, v]) => (
                          <div key={k} className="flex items-start justify-between gap-3 bg-input rounded-lg px-3 py-2">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground pt-0.5 min-w-[90px]">{k}</div>
                            <div className="text-sm flex-1 break-all font-mono">{String(v)}</div>
                            <button onClick={() => copy(String(v), `${k} copiado`)} className="text-muted-foreground hover:text-gold shrink-0"><Copy className="h-3.5 w-3.5" /></button>
                          </div>
                        ))}
                      </div>
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
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-16">Nenhum pedido encontrado.</div>
          )}
        </div>
      </div>

      <style>{`.ui-icon-btn { height:2.25rem; width:2.25rem; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:.625rem; background:var(--card); } .ui-icon-btn:hover{ border-color: var(--gold); color: var(--gold); }`}</style>
    </>
  );
}

function StatCard({ label, value, accent }: { label: string; value: any; accent?: string }) {
  const color =
    accent === "yellow" ? "text-yellow-400" :
    accent === "blue" ? "text-blue-400" :
    accent === "purple" ? "text-purple-400" :
    accent === "emerald" ? "text-emerald-400" :
    accent === "gold" ? "text-gold" : "text-foreground";
  return (
    <div className="rounded-xl bg-card border border-border/60 p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-display ${color}`}>{value}</div>
    </div>
  );
}
