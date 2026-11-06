-- ========================================================
-- MANDO G PRESS KIT — SCHEMA DE BASE DE DATOS Y STORAGE
-- Ejecutar este script en el editor SQL de tu proyecto Supabase
-- ========================================================

-- 1. Tabla de contenido (Borrador y Publicado)
CREATE TABLE IF NOT EXISTS public.presskit_content (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL, -- 'published' o 'draft'
  data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Historial de versiones publicadas
CREATE TABLE IF NOT EXISTS public.presskit_versions (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  note TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Usuarios administradores seguros
CREATE TABLE IF NOT EXISTS public.presskit_admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- 'superadmin', 'admin', 'editor'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 4. Códigos de invitación temporales
CREATE TABLE IF NOT EXISTS public.presskit_invites (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_by TEXT,
  revoked BOOLEAN DEFAULT FALSE
);

-- 5. Biblioteca multimedia
CREATE TABLE IF NOT EXISTS public.presskit_media (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL, -- 'fotos', 'portadas', 'videos', 'documentos', 'general'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Bucket de almacenamiento público para medios (fotos, videos, PDFs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('presskit-media', 'presskit-media', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de lectura pública para el bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'presskit-media');

-- Políticas de escritura para rol de servicio / autenticado
CREATE POLICY "Service Role Upload Access"
ON storage.objects FOR ALL
USING (bucket_id = 'presskit-media');

