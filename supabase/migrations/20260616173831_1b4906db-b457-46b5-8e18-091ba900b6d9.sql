DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders
  FOR INSERT TO public WITH CHECK (true);
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon, authenticated, service_role;
GRANT SELECT ON public.services TO anon, authenticated, service_role;