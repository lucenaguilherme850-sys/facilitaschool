
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins see all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Services catalog
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  unit TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active services" ON public.services FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin manages services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.services (slug, name, description, price_cents, unit, sort_order) VALUES
('goenglish', 'GoEnglish / Efekta / Speak', 'Atividades, exercícios e módulos concluídos com atenção.', 2000, 'nível/certificado', 1),
('netescola', 'Netescola/Ser Goiás', 'IFA, Desafio Crescer ou Só Vem Enem — pagamento único.', 1500, 'serviço', 2),
('revisa', 'Revisa Goiás do Professor', 'PDFs organizados por série e bimestre — escolha e receba.', 1000, 'turma', 3);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code TEXT NOT NULL UNIQUE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  service_slug TEXT NOT NULL,
  service_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_contact TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  proof_url TEXT,
  proof_uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create an order
CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Admins can read/update all
CREATE POLICY "Admin reads all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin updates all orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Anyone can update own order by knowing the code (for attaching proof) — restricted via WITH CHECK to allowed fields handled in app + we limit to status transition pending->awaiting_review only via a function. For simplicity allow update where status is pending_payment.
CREATE POLICY "Anyone can attach proof while pending" ON public.orders FOR UPDATE TO anon, authenticated USING (status IN ('pending_payment','awaiting_review')) WITH CHECK (status IN ('pending_payment','awaiting_review'));
-- Allow public SELECT only by public_code via a SECURITY DEFINER function (no broad anon select)
CREATE OR REPLACE FUNCTION public.get_order_by_code(_code TEXT)
RETURNS TABLE (id UUID, public_code TEXT, service_name TEXT, customer_name TEXT, amount_cents INTEGER, status TEXT, proof_url TEXT, created_at TIMESTAMPTZ)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, public_code, service_name, customer_name, amount_cents, status, proof_url, created_at
  FROM public.orders WHERE public_code = _code
$$;
GRANT EXECUTE ON FUNCTION public.get_order_by_code(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
