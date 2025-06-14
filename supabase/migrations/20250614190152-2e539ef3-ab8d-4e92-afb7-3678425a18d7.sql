
-- Drop any existing policies on competence_areas to ensure a clean slate.
DROP POLICY IF EXISTS "CompetenceAreas - Select for authenticated" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Insert for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Update for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Delete for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "Enable all access for admins" ON public.competence_areas;

-- Enable RLS on the competence_areas table.
ALTER TABLE public.competence_areas ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view all competence areas.
CREATE POLICY "CompetenceAreas - Select for authenticated" ON public.competence_areas
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins can insert new competence areas.
CREATE POLICY "CompetenceAreas - Insert for Admin" ON public.competence_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Policy: Admins can update competence areas.
CREATE POLICY "CompetenceAreas - Update for Admin" ON public.competence_areas
  FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Policy: Admins can delete competence areas.
CREATE POLICY "CompetenceAreas - Delete for Admin" ON public.competence_areas
  FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');
