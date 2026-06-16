
-- Fix search_path on touch trigger fn
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Tighten anon update policy to only allow attaching proof on pending orders
DROP POLICY IF EXISTS "Anyone can attach proof while pending" ON public.orders;
CREATE POLICY "Attach proof while pending"
ON public.orders FOR UPDATE TO anon, authenticated
USING (status = 'pending_payment')
WITH CHECK (status IN ('pending_payment','awaiting_review'));

-- Storage policies for 'proofs' bucket: anyone can upload, only admins read
CREATE POLICY "Anyone uploads proof" ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'proofs');

CREATE POLICY "Admin reads proofs" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'proofs' AND public.has_role(auth.uid(), 'admin'));
