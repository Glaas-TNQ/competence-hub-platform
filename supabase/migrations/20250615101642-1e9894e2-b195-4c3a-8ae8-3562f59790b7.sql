
-- Create user_points table to track points for different activities
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  activity_type TEXT NOT NULL, -- 'chapter_completion', 'course_completion', 'quiz_completed', 'daily_login', etc.
  activity_id TEXT, -- reference to specific activity (course_id, chapter_id, etc.)
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_total_points table for aggregated points
CREATE TABLE public.user_total_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  points_to_next_level INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- lucide icon name
  category TEXT NOT NULL, -- 'completion', 'competency', 'social', 'temporal', 'special'
  criteria JSONB NOT NULL, -- conditions to earn the badge
  points_reward INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table for earned badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Add RLS policies for user_points
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points" 
  ON public.user_points 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert points" 
  ON public.user_points 
  FOR INSERT 
  WITH CHECK (true); -- Allow system to insert points

-- Add RLS policies for user_total_points
ALTER TABLE public.user_total_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own total points" 
  ON public.user_total_points 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own total points" 
  ON public.user_total_points 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert total points" 
  ON public.user_total_points 
  FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for badges (public read)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" 
  ON public.badges 
  FOR SELECT 
  USING (true);

-- Add RLS policies for user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" 
  ON public.user_badges 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user badges" 
  ON public.user_badges 
  FOR INSERT 
  WITH CHECK (true);

-- Function to calculate level from points
CREATE OR REPLACE FUNCTION calculate_level_from_points(points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: level = floor(points / 100) + 1, max level 50
  RETURN LEAST(FLOOR(points / 100.0) + 1, 50);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate points needed for next level
CREATE OR REPLACE FUNCTION points_to_next_level(current_points INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER;
  next_level_threshold INTEGER;
BEGIN
  current_level := calculate_level_from_points(current_points);
  
  -- If already at max level, return 0
  IF current_level >= 50 THEN
    RETURN 0;
  END IF;
  
  next_level_threshold := current_level * 100;
  RETURN next_level_threshold - current_points;
END;
$$ LANGUAGE plpgsql;

-- Function to update user total points
CREATE OR REPLACE FUNCTION update_user_total_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
DECLARE
  new_total INTEGER;
  new_level INTEGER;
  points_needed INTEGER;
BEGIN
  -- Insert or update total points
  INSERT INTO public.user_total_points (user_id, total_points, level, points_to_next_level)
  VALUES (
    p_user_id, 
    p_points, 
    calculate_level_from_points(p_points),
    points_to_next_level(p_points)
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_points = user_total_points.total_points + p_points,
    level = calculate_level_from_points(user_total_points.total_points + p_points),
    points_to_next_level = points_to_next_level(user_total_points.total_points + p_points),
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Insert initial badges
INSERT INTO public.badges (name, description, icon, category, criteria, points_reward, rarity) VALUES
('Primo Passo', 'Completa il tuo primo capitolo', 'play', 'completion', '{"type": "chapter_completion", "count": 1}', 10, 'common'),
('Studente Dedicato', 'Completa il tuo primo corso', 'book-open', 'completion', '{"type": "course_completion", "count": 1}', 50, 'common'),
('Maratoneta', 'Completa 5 corsi', 'trophy', 'completion', '{"type": "course_completion", "count": 5}', 200, 'rare'),
('Esperto', 'Completa 10 corsi', 'award', 'completion', '{"type": "course_completion", "count": 10}', 500, 'epic'),
('Maestro', 'Completa 25 corsi', 'star', 'completion', '{"type": "course_completion", "count": 25}', 1000, 'legendary'),
('Velocista', 'Completa un corso in meno di 2 ore', 'clock', 'temporal', '{"type": "course_fast_completion", "max_hours": 2}', 75, 'rare'),
('Collezionista', 'Ottieni 5 badge', 'badge', 'special', '{"type": "badge_collection", "count": 5}', 100, 'rare'),
('Punto di Riferimento', 'Raggiungi 1000 punti', 'target', 'special', '{"type": "points_milestone", "points": 1000}', 150, 'epic');
