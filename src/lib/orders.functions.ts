import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

function genCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `EX-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: svc, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return svc;
  });

const createOrderSchema = z.object({
  service_slug: z.string().min(1).max(64),
  customer_name: z.string().trim().min(2).max(120),
  customer_contact: z.string().trim().min(5).max(160),
  quantity: z.number().int().min(1).max(16),
  form_data: z.record(z.string(), z.any()),
  notes: z.string().max(500).optional().nullable(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createOrderSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: svc, error: svcErr } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("slug", data.service_slug)
      .eq("active", true)
      .maybeSingle();
    if (svcErr || !svc) throw new Error("Serviço não encontrado");

    const amount_cents = svc.price_cents * data.quantity;
    const public_code = genCode();

    const { data: inserted, error } = await supabaseAdmin
      .from("orders")
      .insert({
        public_code,
        service_id: svc.id,
        service_slug: svc.slug,
        service_name: svc.name,
        customer_name: data.customer_name,
        customer_contact: data.customer_contact,
        quantity: data.quantity,
        form_data: data.form_data,
        notes: data.notes ?? null,
        amount_cents,
        status: "pending_payment",
      })
      .select("public_code, id, service_name, customer_name, customer_contact, amount_cents, quantity, created_at")
      .single();
    if (error) throw new Error(error.message);

    // Fire-and-forget Zapier notification
    await fireZap("order.created", {
      public_code: inserted.public_code,
      service_name: inserted.service_name,
      customer_name: inserted.customer_name,
      customer_contact: inserted.customer_contact,
      quantity: inserted.quantity,
      amount_cents: inserted.amount_cents,
      amount_brl: (inserted.amount_cents / 100).toFixed(2),
      created_at: inserted.created_at,
    });

    return { public_code: inserted.public_code };
  });

// ---------- Zapier integration ----------

async function fireZap(event: string, payload: Record<string, unknown>) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "zapier_webhook_url")
      .maybeSingle();
    const url = (data?.value as { url?: string } | null)?.url;
    if (!url || !/^https:\/\/hooks\.zapier\.com\//.test(url)) return;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        triggered_at: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (e) {
    console.error("[zapier] failed to send", event, e);
  }
}

export const getZapierWebhook = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data } = await context.supabase
      .from("app_settings")
      .select("value")
      .eq("key", "zapier_webhook_url")
      .maybeSingle();
    return { url: ((data?.value as { url?: string } | null)?.url ?? "") };
  });

export const setZapierWebhook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      url: z.string().trim().max(500).refine(
        (v) => v === "" || /^https:\/\/hooks\.zapier\.com\/hooks\/catch\//.test(v),
        { message: "URL precisa ser do tipo https://hooks.zapier.com/hooks/catch/..." },
      ),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("app_settings")
      .upsert({ key: "zapier_webhook_url", value: { url: data.url }, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });


export const getOrderByCode = createServerFn({ method: "GET" })
  .inputValidator((d: { code: string }) => z.object({ code: z.string().min(4).max(32) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase.rpc("get_order_by_code", { _code: data.code });
    if (error) throw new Error(error.message);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ?? null;
  });

// attachProof removido — comprovante é enviado via WhatsApp, não via endpoint público.
// Manter um endpoint anônimo que aceita URL arbitrária permitiria injeção de links
// maliciosos no painel admin (stored content injection). Se voltar a ser necessário,
// exigir upload direto ao bucket `proofs` com path validado contra o code do pedido.

// ---------- Admin ----------

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending_payment", "awaiting_review", "in_progress", "completed", "cancelled"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    // Concluído ou cancelado: remove do painel
    if (data.status === "completed" || data.status === "cancelled") {
      const { error } = await context.supabase.from("orders").delete().eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, deleted: true };
    }
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true, deleted: false };
  });

export const adminDeleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase.from("orders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetProofSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ path: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: signed, error } = await context.supabase.storage
      .from("proofs")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });
