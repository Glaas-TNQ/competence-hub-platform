
-- Drop policies that use get_user_role to avoid recursion issues.
DROP POLICY IF EXISTS "CompetenceAreas - Insert for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Update for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Delete for Admin" ON public.competence_areas;

-- Recreate policies using a direct check on auth.email().
-- This is simpler and avoids querying the 'profiles' table, which was causing the infinite recursion error.

-- Policy: Admins (by email) can insert new competence areas.
CREATE POLICY "CompetenceAreas - Insert for Admin by email" ON public.competence_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'admin@academy.com');

-- Policy: Admins (by email) can update competence areas.
CREATE POLICY "CompetenceAreas - Update for Admin by email" ON public.competence_areas
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'admin@academy.com');

-- Policy: Admins (by email) can delete competence areas.
CREATE POLICY "CompetenceAreas - Delete for Admin by email" ON public.competence_areas
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'admin@academy.com');
