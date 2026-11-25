-- Schema for the Next Generation Team site (Postgres / Supabase).
-- Run once in the Supabase SQL editor.

CREATE TYPE public.app_role AS ENUM ('admin','editor');

CREATE TABLE public.user_roles(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_roles ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE FUNCTION public.is_team() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin','editor'))
$$;

CREATE TABLE public.lessons(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_slug text NOT NULL CHECK (group_slug IN ('cubby-house','fun-house','voltage','fuel')),
  lesson_date date NOT NULL,
  title_en text NOT NULL DEFAULT '', title_de text NOT NULL DEFAULT '',
  verses_en text NOT NULL DEFAULT '', verses_de text NOT NULL DEFAULT '',
  idea_en text NOT NULL DEFAULT '', idea_de text NOT NULL DEFAULT '',
  story_en text NOT NULL DEFAULT '', story_de text NOT NULL DEFAULT '',
  questions_en text[] NOT NULL DEFAULT '{}', questions_de text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  UNIQUE(group_slug, lesson_date)
);
GRANT SELECT ON public.lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY published_lessons ON public.lessons FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY team_lessons ON public.lessons FOR ALL TO authenticated USING (public.is_team()) WITH CHECK (public.is_team());

CREATE TABLE public.events(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date date NOT NULL,
  event_time text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '', title_de text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '', description_de text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  groups text[] NOT NULL DEFAULT '{}'
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_events ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY team_events ON public.events FOR ALL TO authenticated USING (public.is_team()) WITH CHECK (public.is_team());

-- Private bucket for lesson photos (signed URLs are issued server-side for published lessons only).
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-images', 'lesson-images', false) ON CONFLICT DO NOTHING;
CREATE POLICY team_image_read   ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'lesson-images' AND public.is_team());
CREATE POLICY team_image_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'lesson-images' AND public.is_team());
CREATE POLICY team_image_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'lesson-images' AND public.is_team()) WITH CHECK (bucket_id = 'lesson-images' AND public.is_team());
CREATE POLICY team_image_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'lesson-images' AND public.is_team());
