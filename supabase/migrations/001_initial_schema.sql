-- ============================================================
-- Amazon Samaúma Lodge — Schema inicial
-- Execute este SQL no Supabase SQL Editor:
-- Supabase Dashboard > SQL Editor > New query > Cole e execute
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ACCOMMODATIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.accommodations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  capacity     TEXT NOT NULL,
  price_info   TEXT,
  amenities    TEXT[]   NOT NULL DEFAULT '{}',
  images       TEXT[]   NOT NULL DEFAULT '{}',
  is_active    BOOLEAN  NOT NULL DEFAULT TRUE,
  sort_order   INT      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BANNERS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.banners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL DEFAULT '',
  subtitle   TEXT,
  image_url  TEXT NOT NULL,
  cta_text   TEXT,
  cta_url    TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  location    TEXT,
  text        TEXT NOT NULL,
  stars       INT  NOT NULL DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FAQS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faqs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SITE CONFIG ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default config values
INSERT INTO public.site_config (key, value) VALUES
  ('whatsapp_number',   '559293839110'),
  ('instagram_handle',  'amazon_samauma_lodge'),
  ('best_fishing_season', 'Setembro a Janeiro'),
  ('lodge_tagline', 'Pousada flutuante no coração da Amazônia')
ON CONFLICT (key) DO NOTHING;

-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── RLS POLICIES ────────────────────────────────────────────────────────────
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config     ENABLE ROW LEVEL SECURITY;

-- Leitura pública (site pode ler sem autenticação)
CREATE POLICY "Public read accommodations"  ON public.accommodations  FOR SELECT USING (TRUE);
CREATE POLICY "Public read banners"         ON public.banners          FOR SELECT USING (TRUE);
CREATE POLICY "Public read testimonials"    ON public.testimonials     FOR SELECT USING (TRUE);
CREATE POLICY "Public read faqs"            ON public.faqs             FOR SELECT USING (TRUE);
CREATE POLICY "Public read site_config"     ON public.site_config      FOR SELECT USING (TRUE);

-- Escrita somente para usuários autenticados (admin)
CREATE POLICY "Auth write accommodations"  ON public.accommodations  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write banners"         ON public.banners          FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write testimonials"    ON public.testimonials     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write faqs"            ON public.faqs             FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_config"     ON public.site_config      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Storage: leitura pública
CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

-- Storage: upload somente autenticados
CREATE POLICY "Auth upload site-images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update site-images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete site-images"
  ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_accommodations_updated_at BEFORE UPDATE ON public.accommodations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_banners_updated_at        BEFORE UPDATE ON public.banners         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_site_config_updated_at    BEFORE UPDATE ON public.site_config     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
