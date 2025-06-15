
-- Create daily_streaks table to track user study streaks
CREATE TABLE public.daily_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_date DATE NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'study', -- 'study', 'login', 'chapter_completion'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_date, activity_type)
);

-- Create user_activities table for detailed activity tracking
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'chapter_start', 'chapter_complete', 'course_start', 'course_complete', 'login'
  activity_data JSONB, -- store additional data like completion_time, performance_score, etc.
  competence_area_id UUID REFERENCES public.competence_areas(id),
  course_id UUID REFERENCES public.courses(id),
  chapter_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for daily_streaks
ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks" 
  ON public.daily_streaks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert streaks" 
  ON public.daily_streaks 
  FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for user_activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activities" 
  ON public.user_activities 
  FOR INSERT 
  WITH CHECK (true);

-- Function to get current user streak
CREATE OR REPLACE FUNCTION get_user_current_streak(p_user_id UUID, p_activity_type TEXT DEFAULT 'study')
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  -- Count consecutive days backwards from today
  LOOP
    -- Check if user has activity on this date
    IF EXISTS (
      SELECT 1 FROM public.daily_streaks 
      WHERE user_id = p_user_id 
      AND streak_date = check_date 
      AND activity_type = p_activity_type
    ) THEN
      current_streak := current_streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      -- Break the loop if no activity found
      EXIT;
    END IF;
  END LOOP;
  
  RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to record daily activity and maintain streak
CREATE OR REPLACE FUNCTION record_daily_activity(p_user_id UUID, p_activity_type TEXT DEFAULT 'study')
RETURNS VOID AS $$
BEGIN
  -- Insert today's activity (ignore if already exists)
  INSERT INTO public.daily_streaks (user_id, streak_date, activity_type)
  VALUES (p_user_id, CURRENT_DATE, p_activity_type)
  ON CONFLICT (user_id, streak_date, activity_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Insert new advanced badges for Phase 2
INSERT INTO public.badges (name, description, icon, category, criteria, points_reward, rarity) VALUES
-- Competency-based badges
('Esperto Marketing', 'Completa tutti i corsi di Marketing', 'award', 'competency', '{"type": "competence_area_mastery", "competence_area": "marketing"}', 300, 'epic'),
('Guru della Finanza', 'Completa tutti i corsi di Finanza', 'award', 'competency', '{"type": "competence_area_mastery", "competence_area": "finance"}', 300, 'epic'),
('Specialista Tech', 'Completa tutti i corsi di Tecnologia', 'award', 'competency', '{"type": "competence_area_mastery", "competence_area": "technology"}', 300, 'epic'),

-- Streak badges
('Studente Costante', 'Studia per 7 giorni consecutivi', 'clock', 'temporal', '{"type": "daily_streak", "days": 7}', 100, 'rare'),
('Maratoneta del Sapere', 'Studia per 30 giorni consecutivi', 'clock', 'temporal', '{"type": "daily_streak", "days": 30}', 500, 'epic'),
('Leggenda dello Studio', 'Studia per 100 giorni consecutivi', 'star', 'temporal', '{"type": "daily_streak", "days": 100}', 1500, 'legendary'),

-- Speed and performance badges
('Fulmine', 'Completa 3 capitoli in un giorno', 'badge', 'temporal', '{"type": "chapters_per_day", "count": 3}', 75, 'rare'),
('Velocità della Luce', 'Completa un corso in meno di 1 ora', 'clock', 'temporal', '{"type": "course_speed_completion", "max_hours": 1}', 150, 'epic'),

-- Early adopter and social badges
('Pioniere', 'Uno dei primi 100 utenti della piattaforma', 'badge', 'special', '{"type": "early_adopter", "position": 100}', 200, 'rare'),
('Mattiniero', 'Completa 10 capitoli prima delle 8:00', 'clock', 'temporal', '{"type": "early_bird_completions", "count": 10, "before_hour": 8}', 150, 'rare'),
('Nottambulo', 'Completa 10 capitoli dopo le 22:00', 'clock', 'temporal', '{"type": "night_owl_completions", "count": 10, "after_hour": 22}', 150, 'rare'),

-- Performance badges
('Perfezionista', 'Ottieni il 100% in 5 corsi consecutivi', 'star', 'competency', '{"type": "perfect_scores", "count": 5}', 400, 'epic'),
('Studente Modello', 'Completa tutti i capitoli senza saltarne nessuno in 3 corsi', 'award', 'competency', '{"type": "complete_all_chapters", "courses": 3}', 250, 'rare'),

-- Milestone badges
('Centaurista', 'Completa 100 capitoli in totale', 'target', 'completion', '{"type": "total_chapters", "count": 100}', 500, 'epic'),
('Accademico', 'Raggiungi il livello 25', 'star', 'special', '{"type": "level_milestone", "level": 25}', 750, 'epic'),
('Professore', 'Raggiungi il livello 50', 'award', 'special', '{"type": "level_milestone", "level": 50}', 2000, 'legendary');
