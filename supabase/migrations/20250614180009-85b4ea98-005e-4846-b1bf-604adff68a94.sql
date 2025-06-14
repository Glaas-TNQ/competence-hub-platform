
-- Rimuovo le vecchie politiche per competence_areas
DROP POLICY IF EXISTS "Anyone can view competence areas" ON public.competence_areas;
DROP POLICY IF EXISTS "Only admin can manage competence areas" ON public.competence_areas;

-- Creo nuove politiche più specifiche per competence_areas
CREATE POLICY "Anyone can view competence areas" ON public.competence_areas
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert competence areas" ON public.competence_areas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update competence areas" ON public.competence_areas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete competence areas" ON public.competence_areas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
