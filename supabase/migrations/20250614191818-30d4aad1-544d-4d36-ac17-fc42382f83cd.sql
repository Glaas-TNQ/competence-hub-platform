
-- Rimuovi tutte le policy di insert/update/delete (di qualunque tipo) sulle competence areas
DROP POLICY IF EXISTS "CompetenceAreas - Insert for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Insert for Admin by email" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Update for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Update for Admin by email" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Delete for Admin" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - Delete for Admin by email" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - anyone authenticated can insert" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - anyone authenticated can update" ON public.competence_areas;
DROP POLICY IF EXISTS "CompetenceAreas - anyone authenticated can delete" ON public.competence_areas;

-- Ripristina le policy completamente aperte per tutti gli autenticati:
CREATE POLICY "CompetenceAreas - anyone authenticated can insert" ON public.competence_areas
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "CompetenceAreas - anyone authenticated can update" ON public.competence_areas
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "CompetenceAreas - anyone authenticated can delete" ON public.competence_areas
  FOR DELETE TO authenticated USING (true);

-- La SELECT rimane come già è, aperta a tutti gli autenticati.
