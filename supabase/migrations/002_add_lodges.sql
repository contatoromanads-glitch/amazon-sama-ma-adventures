-- ============================================================
-- 002_add_lodges.sql
-- Tabela de pousadas (lodges) + relação com quartos
-- Execute no Supabase → SQL Editor
-- ============================================================

-- 1. Tabela lodges
CREATE TABLE IF NOT EXISTS lodges (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,   -- URL: /acomodacoes/segunda-pousada
  description  TEXT,
  location     TEXT,
  hero_image   TEXT,
  images       TEXT[]      DEFAULT '{}',
  amenities    TEXT[]      DEFAULT '{}',
  is_active    BOOLEAN     DEFAULT TRUE,
  sort_order   INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS
ALTER TABLE lodges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read lodges"
  ON lodges FOR SELECT USING (true);

CREATE POLICY "Auth insert lodges"
  ON lodges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update lodges"
  ON lodges FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete lodges"
  ON lodges FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Trigger updated_at (reutiliza função do migration 001)
CREATE TRIGGER set_lodges_updated_at
  BEFORE UPDATE ON lodges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Adiciona lodge_id na tabela accommodations
ALTER TABLE accommodations
  ADD COLUMN IF NOT EXISTS lodge_id UUID REFERENCES lodges(id) ON DELETE SET NULL;

-- 5. Índice para busca por lodge
CREATE INDEX IF NOT EXISTS idx_accommodations_lodge_id ON accommodations(lodge_id);
