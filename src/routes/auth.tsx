import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso Admin — Faclit" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail se necessário.");
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (res.error) toast.error(String(res.error));
    if (!res.redirected && !res.error) navigate({ to: "/admin" });
  }

  return (
    <>
      <Background />
      <Header />
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl bg-card shadow-card border border-border/60 p-8 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Painel Admin</div>
          <h1 className="font-display text-3xl mb-2">{mode === "signin" ? "Entrar" : "Criar conta"}</h1>
          <p className="text-sm text-muted-foreground mb-6">Acesso restrito ao administrador.</p>

          <button onClick={google} className="w-full rounded-xl border border-border bg-input px-4 py-3 hover:border-gold transition-colors mb-4 flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M21.35 11.1H12v2.97h5.35c-.23 1.4-1.65 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.9 3.6 14.7 2.7 12 2.7 6.97 2.7 2.9 6.77 2.9 11.8s4.07 9.1 9.1 9.1c5.26 0 8.74-3.7 8.74-8.9 0-.6-.07-1.06-.17-1.5z"/></svg>
            Entrar com Google
          </button>
          <div className="text-center text-xs text-muted-foreground my-3">ou</div>

          <form onSubmit={submit} className="space-y-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="ui-input" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="ui-input" />
            <button disabled={loading} className="w-full rounded-xl bg-gold text-primary-foreground font-semibold py-3 disabled:opacity-50 hover:brightness-105 transition">
              {loading ? "..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-sm text-muted-foreground hover:text-foreground mt-5 block mx-auto">
            {mode === "signin" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
      <style>{`.ui-input { width:100%; background: var(--input); border: 1px solid var(--border); border-radius: 0.625rem; padding: 0.75rem 0.875rem; color: inherit; outline: none; } .ui-input:focus { border-color: var(--gold); }`}</style>
    </>
  );
}
