-- Allow admin to delete orders
CREATE POLICY "Admin deletes orders" ON public.orders
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Enable extensions for scheduled cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to clean up old orders (older than 24h)
CREATE OR REPLACE FUNCTION public.cleanup_old_orders()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.orders WHERE created_at < now() - interval '24 hours';
$$;

-- Schedule cleanup every hour
SELECT cron.schedule(
  'cleanup-old-orders-hourly',
  '0 * * * *',
  $$ SELECT public.cleanup_old_orders(); $$
);