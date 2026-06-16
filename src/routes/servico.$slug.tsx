import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { getServiceBySlug, createOrder } from "@/lib/orders.functions";

const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/servico/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(serviceQuery(params.slug)),
  component: ServicePage,
  notFoundComponent: () => <div className="p-10">Serviço não encontrado.</div>,
});

type ServiceField =
  | { type: "text"; name: string; label: string; placeholder?: string; required?: boolean; pattern?: "numbers" }
  | { type: "password"; name: string; label: string; required?: boolean }
  | { type: "select"; name: string; label: string; required?: boolean; options: string[] }
  | { type: "checkbox-group"; name: string; label: string; options: string[]; help?: string }
  | { type: "number"; name: string; label: string; help?: string; min?: number; max?: number };

const SERVICE_FORMS: Record<string, { fields: ServiceField[]; quantityField?: string; quantityFromCount?: string }> = {
  goenglish: {
    fields: [
      { type: "text", name: "login", label: "LOGIN (E-mail @aluno.educa.go.gov.br)", placeholder: "seu.nome@aluno.educa.go.gov.br", required: true },
      { type: "password", name: "senha", label: "Senha", required: true },
      { type: "number", name: "quantidade", label: "Quantidade de níveis/certificados", help: "Quantos níveis/certificados deseja completar?", min: 1, max: 20 },
    ],
    quantityField: "quantidade",
  },
  netescola: {
    fields: [
      { type: "text", name: "login", label: "LOGIN (Matrícula)", placeholder: "Sua matrícula (somente números)", required: true, pattern: "numbers" },
      { type: "password", name: "senha", label: "Senha", required: true },
      { type: "select", name: "plataforma", label: "Selecione a plataforma", required: true, options: ["IFA (Preparatório para Enem)", "Só Vem Enem", "Desafio Crescer"] },
      { type: "number", name: "quantidade", label: "Quantidade", min: 1, max: 10 },
    ],
    quantityField: "quantidade",
  },
  revisa: {
    fields: [
      { type: "checkbox-group", name: "turmas", label: "Turma(s)", options: ["6º ano", "7º ano", "8º ano", "9º ano", "1ª série", "2ª série", "3ª série"], help: "Selecione as turmas desejadas. R$10 por turma." },
    ],
    quantityFromCount: "turmas",
  },
};

function fmt(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function ServicePage() {
  const { slug } = Route.useParams();
  const { data: svc } = useSuspenseQuery(serviceQuery(slug));
  const navigate = useNavigate();
  const router = useRouter();
  const createOrderFn = useServerFn(createOrder);

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!svc) {
    return (
      <>
        <Background /><Header />
        <div className="mx-auto max-w-3xl px-6 py-24">Serviço não encontrado.</div>
      </>
    );
  }

  const cfg = SERVICE_FORMS[slug] ?? { fields: [] };

  const quantity = (() => {
    if (cfg.quantityFromCount) return Math.max(1, (form[cfg.quantityFromCount] as string[] | undefined)?.length ?? 0);
    if (cfg.quantityField) return Math.max(1, Number(form[cfg.quantityField] ?? 1));
    return 1;
  })();
  const total = svc.price_cents * quantity;

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Informe seu nome";
    if (contact.trim().length < 5) errs.contact = "Informe WhatsApp ou e-mail para contato";
    for (const f of cfg.fields) {
      const v = form[f.name];
      if (f.type === "checkbox-group") {
        if (!v || (v as string[]).length === 0) errs[f.name] = "Selecione ao menos uma opção";
      } else if (f.type === "number") {
        if (!v || Number(v) < (f.min ?? 1)) errs[f.name] = "Informe a quantidade";
      } else if (("required" in f) && f.required) {
        if (!v || String(v).trim().length === 0) errs[f.name] = "Campo obrigatório";
        if ("pattern" in f && f.pattern === "numbers" && v && !/^\d+$/.test(String(v))) errs[f.name] = "Use apenas números";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await createOrderFn({
        data: {
          service_slug: slug,
          customer_name: name.trim(),
          customer_contact: contact.trim(),
          quantity,
          form_data: form,
          notes: notes.trim() || null,
        },
      });
      toast.success("Pedido criado!");
      router.invalidate();
      navigate({ to: "/pagamento/$code", params: { code: res.public_code } });
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao criar pedido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Background />
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Início</Link> / <span className="text-foreground">{svc.name}</span>
        </div>
        <p className="mt-2 text-muted-foreground">{svc.description}</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* FORM */}
        <div className="rounded-2xl bg-card shadow-card border border-border/60 p-8 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Etapa {step} de 2</div>
          <h1 className="font-display text-3xl mb-1">{step === 1 ? svc.name : "Revise seu pedido"}</h1>
          <p className="text-sm text-muted-foreground mb-8">
            {step === 1 ? svc.description : "Confirme os dados antes de ir para o pagamento."}
          </p>

          {step === 1 ? (
            <div className="space-y-5">
              <Field label="Seu nome *" error={errors.name}>
                <input value={name} onChange={(e) => setName(e.target.value)} className="ui-input" placeholder="Como podemos te chamar?" maxLength={120} />
              </Field>
              <Field label="WhatsApp ou e-mail *" error={errors.contact}>
                <input value={contact} onChange={(e) => setContact(e.target.value)} className="ui-input" placeholder="(64) 99999-9999 ou seu@email.com" maxLength={160} />
              </Field>

              {cfg.fields.map((f) => (
                <Field key={f.name} label={f.label + ("required" in f && f.required ? " *" : "")} error={errors[f.name]} help={"help" in f ? f.help : undefined}>
                  {renderField(f, form, setForm)}
                </Field>
              ))}

              <Field label="Observações">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={500} className="ui-input resize-none" placeholder="Alguma instrução especial? (opcional)" />
              </Field>

              <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 flex items-start gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span>Login e senha são armazenados em ambiente protegido e apagados após a entrega do serviço.</span>
              </div>

              <div className="flex gap-3 pt-4">
                <Link to="/" className="ui-btn-secondary"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
                <button
                  onClick={() => { if (validateStep1()) setStep(2); }}
                  className="ui-btn-primary ml-auto"
                >
                  Revisar pedido <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <ReviewRow label="Nome" value={name} />
              <ReviewRow label="Contato" value={contact} />
              {cfg.fields.map((f) => {
                const v = form[f.name];
                const display = Array.isArray(v) ? v.join(", ") : f.type === "password" ? "•".repeat(Math.min(12, String(v ?? "").length)) : String(v ?? "");
                return <ReviewRow key={f.name} label={f.label} value={display || "—"} />;
              })}
              {notes && <ReviewRow label="Observações" value={notes} />}

              <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-gold mt-0.5" />
                <div>
                  <div className="font-medium">Credenciais protegidas</div>
                  <div className="text-sm text-muted-foreground">Suas informações ficam em ambiente isolado e são apagadas após a entrega.</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="ui-btn-secondary"><ArrowLeft className="h-4 w-4" /> Voltar</button>
                <button disabled={submitting} onClick={submit} className="ui-btn-primary ml-auto disabled:opacity-50">
                  {submitting ? "Criando..." : "Ir para pagamento"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <aside className="rounded-2xl bg-card shadow-card border border-border/60 p-6 lg:sticky lg:top-24 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Resumo</div>
          <h3 className="font-display text-xl mb-5">{svc.name}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Preço unitário</span><span>{fmt(svc.price_cents)} / {svc.unit}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Quantidade</span><span>{quantity} {svc.unit}{quantity > 1 ? "s" : ""}</span></div>
            <div className="h-px bg-border my-4" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase text-xs tracking-wider">Total</span>
              <span className="font-display text-3xl text-gold">{fmt(total)}</span>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span>Credenciais protegidas e apagadas após a entrega.</span>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Pagamento 100% via Pix · Entrega no prazo
          </div>
        </aside>
      </div>

      <style>{`
        .ui-input { width:100%; background: var(--input); border: 1px solid var(--border); border-radius: 0.625rem; padding: 0.75rem 0.875rem; color: inherit; outline: none; transition: border-color .15s, box-shadow .15s; }
        .ui-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px oklch(0.78 0.13 75 / 0.15); }
        .ui-btn-primary { display:inline-flex; align-items:center; gap:.5rem; background: var(--gold); color: var(--primary-foreground); font-weight: 600; padding: .75rem 1.25rem; border-radius: .75rem; transition: filter .15s, transform .15s; }
        .ui-btn-primary:hover { filter: brightness(1.05); }
        .ui-btn-secondary { display:inline-flex; align-items:center; gap:.5rem; background: transparent; border:1px solid var(--border); padding: .75rem 1.25rem; border-radius: .75rem; color: inherit; }
        .ui-btn-secondary:hover { background: var(--secondary); }
      `}</style>
    </>
  );
}

function Field({ label, error, help, children }: { label: string; error?: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      {children}
      {help && !error && <div className="text-xs text-muted-foreground mt-1.5">{help}</div>}
      {error && <div className="text-xs text-destructive mt-1.5 flex items-center gap-1">⊘ {error}</div>}
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function renderField(f: ServiceField, form: Record<string, any>, setForm: (v: any) => void) {
  const update = (val: any) => setForm({ ...form, [f.name]: val });
  if (f.type === "text") return <input className="ui-input" placeholder={f.placeholder} value={form[f.name] ?? ""} onChange={(e) => update(e.target.value)} maxLength={200} />;
  if (f.type === "password") return <input type="password" className="ui-input" value={form[f.name] ?? ""} onChange={(e) => update(e.target.value)} maxLength={200} />;
  if (f.type === "number") return <input type="number" min={f.min} max={f.max} className="ui-input" value={form[f.name] ?? 1} onChange={(e) => update(Number(e.target.value))} />;
  if (f.type === "select") return (
    <select className="ui-input" value={form[f.name] ?? ""} onChange={(e) => update(e.target.value)}>
      <option value="">Selecione...</option>
      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if (f.type === "checkbox-group") {
    const selected: string[] = form[f.name] ?? [];
    return (
      <div className="space-y-2">
        {f.options.map((o) => {
          const on = selected.includes(o);
          return (
            <label key={o} className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${on ? "border-gold bg-gold/5" : "border-border bg-input"}`}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => update(on ? selected.filter((x) => x !== o) : [...selected, o])}
                className="accent-[var(--gold)]"
              />
              <span>{o}</span>
            </label>
          );
        })}
      </div>
    );
  }
  return null;
}
