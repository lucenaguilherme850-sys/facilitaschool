-- #1 CRÍTICO: revoga execução pública da função de limpeza
REVOKE EXECUTE ON FUNCTION public.cleanup_old_orders() FROM PUBLIC, anon, authenticated;

-- #3 ALTO: revoga execução pública de funções internas SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.auto_promote_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role precisa ser chamável por usuários autenticados (usado em RLS/policies via server fn)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- get_order_by_code permanece chamável por anon (rastreamento público de pedido por código)
-- Já está com GRANT padrão; só confirma:
GRANT EXECUTE ON FUNCTION public.get_order_by_code(text) TO anon, authenticated;

-- #4 MÉDIO: hardening da policy de INSERT anônimo em orders — limita tamanho dos campos
-- e valida quantidade, prevenindo spam/flood com payloads grandes.
DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;

CREATE POLICY "Anyone can create order"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(customer_name)    BETWEEN 2 AND 120
  AND char_length(customer_contact) BETWEEN 5 AND 160
  AND char_length(service_slug)    BETWEEN 1 AND 64
  AND char_length(service_name)    BETWEEN 1 AND 200
  AND char_length(public_code)     BETWEEN 4 AND 32
  AND (notes IS NULL OR char_length(notes) <= 500)
  AND quantity BETWEEN 1 AND 16
  AND amount_cents BETWEEN 0 AND 10000000
  AND status = 'pending_payment'
  AND proof_url IS NULL
  AND octet_length(form_data::text) <= 8192
);