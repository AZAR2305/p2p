-- Migration: align DB schema with current app implementation

-- 1) Ensure profile_skills exists (app uses this table)
CREATE TABLE IF NOT EXISTS public.profile_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_teaching BOOLEAN NOT NULL DEFAULT false,
  is_learning BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, skill_id)
);

ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;

-- Migrate data from tutor_skills if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'tutor_skills'
  ) THEN
    INSERT INTO public.profile_skills (profile_id, skill_id, proficiency_level, is_teaching, is_learning)
    SELECT ts.tutor_id, ts.skill_id, ts.proficiency_level, true, false
    FROM public.tutor_skills ts
    ON CONFLICT (profile_id, skill_id) DO NOTHING;
  END IF;
END $$;

DROP POLICY IF EXISTS "profile_skills_select_all" ON public.profile_skills;
DROP POLICY IF EXISTS "profile_skills_insert_own" ON public.profile_skills;
DROP POLICY IF EXISTS "profile_skills_delete_own" ON public.profile_skills;

CREATE POLICY "profile_skills_select_all" ON public.profile_skills FOR SELECT USING (true);
CREATE POLICY "profile_skills_insert_own" ON public.profile_skills FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "profile_skills_delete_own" ON public.profile_skills FOR DELETE USING (auth.uid() = profile_id);

-- 2) Align sessions table fields used by app
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS meeting_link TEXT,
  ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

ALTER TABLE public.sessions
  ALTER COLUMN title DROP NOT NULL;

-- Align sessions status check constraint to app states
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_status_check;
ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
