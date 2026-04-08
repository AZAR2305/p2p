-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'both')),
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills/categories table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile_skills junction table
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

-- Create sessions table for booking and tracking
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_link TEXT,
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews/ratings table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, reviewer_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Skills policies (everyone can read)
CREATE POLICY "skills_select_all" ON public.skills FOR SELECT USING (true);

-- Profile skills policies
CREATE POLICY "profile_skills_select_all" ON public.profile_skills FOR SELECT USING (true);
CREATE POLICY "profile_skills_insert_own" ON public.profile_skills FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "profile_skills_delete_own" ON public.profile_skills FOR DELETE USING (auth.uid() = profile_id);

-- Sessions policies
CREATE POLICY "sessions_select_own" ON public.sessions FOR SELECT USING (auth.uid() = tutor_id OR auth.uid() = student_id);
CREATE POLICY "sessions_insert_student" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "sessions_update_own" ON public.sessions FOR UPDATE USING (auth.uid() = tutor_id OR auth.uid() = student_id);

-- Reviews policies
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default skills/categories
INSERT INTO public.skills (name, description, category, icon) VALUES
  ('Mathematics', 'Algebra, Calculus, Statistics, and more', 'Academic', 'calculator'),
  ('Physics', 'Mechanics, Thermodynamics, Quantum Physics', 'Academic', 'atom'),
  ('Chemistry', 'Organic, Inorganic, Biochemistry', 'Academic', 'flask'),
  ('Biology', 'Anatomy, Genetics, Ecology', 'Academic', 'leaf'),
  ('Computer Science', 'Programming, Algorithms, Data Structures', 'Technology', 'code'),
  ('Web Development', 'HTML, CSS, JavaScript, React, Node.js', 'Technology', 'globe'),
  ('Data Science', 'Python, Machine Learning, Statistics', 'Technology', 'bar-chart'),
  ('English', 'Grammar, Writing, Literature', 'Languages', 'book-open'),
  ('Spanish', 'Conversational, Grammar, Writing', 'Languages', 'message-circle'),
  ('French', 'Conversational, Grammar, Writing', 'Languages', 'message-circle'),
  ('Music Theory', 'Reading, Composition, Harmony', 'Arts', 'music'),
  ('Piano', 'Beginner to Advanced Piano Lessons', 'Arts', 'music'),
  ('Guitar', 'Acoustic, Electric, Classical', 'Arts', 'music'),
  ('Drawing', 'Sketching, Illustration, Digital Art', 'Arts', 'pencil'),
  ('Photography', 'Composition, Editing, Lighting', 'Arts', 'camera'),
  ('Business', 'Strategy, Marketing, Finance', 'Professional', 'briefcase'),
  ('Accounting', 'Bookkeeping, Tax, Financial Reporting', 'Professional', 'dollar-sign'),
  ('Public Speaking', 'Presentations, Confidence, Delivery', 'Professional', 'mic')
ON CONFLICT (name) DO NOTHING;
