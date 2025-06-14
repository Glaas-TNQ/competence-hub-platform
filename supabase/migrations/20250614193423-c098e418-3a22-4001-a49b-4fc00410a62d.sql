
-- Disable RLS and remove ALL policies from ALL tables
-- This will make all data accessible to authenticated users without any restrictions

-- Remove all policies from profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Remove all policies from competence_areas  
ALTER TABLE public.competence_areas DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "CompetenceAreas - Select for authenticated" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - anyone authenticated can insert" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - anyone authenticated can update" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - anyone authenticated can delete" ON public.competence_areas;

-- Remove all policies from courses
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;

-- Remove all policies from user_progress
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- Remove all policies from other tables if they exist
ALTER TABLE public.alimenti DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorie DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.html_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pasti_consumati DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ricette_salvate DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;

-- Drop any remaining functions that might cause issues
DROP FUNCTION IF EXISTS public.get_user_role CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role CASCADE;
DROP FUNCTION IF EXISTS public.has_role CASCADE;
