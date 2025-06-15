
-- Create user_goals table if it doesn't exist (check if needed based on existing schema)
-- Add RLS policies for user goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for user goals
CREATE POLICY "Users can view their own goals" 
  ON public.user_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
  ON public.user_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
  ON public.user_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
  ON public.user_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically update goal progress
CREATE OR REPLACE FUNCTION public.update_goal_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Update goals based on activity type
  FOR goal_record IN 
    SELECT * FROM public.user_goals 
    WHERE user_id = NEW.user_id 
    AND is_completed = false
    AND period_start <= CURRENT_DATE 
    AND period_end >= CURRENT_DATE
  LOOP
    -- Update different goal types based on activity
    CASE goal_record.goal_type
      WHEN 'courses_completed' THEN
        IF NEW.activity_type = 'course_completion' THEN
          UPDATE public.user_goals 
          SET current_value = LEAST(current_value + 1, target_value),
              updated_at = now(),
              is_completed = (current_value + 1 >= target_value),
              completed_at = CASE WHEN (current_value + 1 >= target_value) THEN now() ELSE completed_at END
          WHERE id = goal_record.id;
        END IF;
      WHEN 'study_days' THEN
        IF NEW.activity_type = 'daily_study' THEN
          UPDATE public.user_goals 
          SET current_value = LEAST(current_value + 1, target_value),
              updated_at = now(),
              is_completed = (current_value + 1 >= target_value),
              completed_at = CASE WHEN (current_value + 1 >= target_value) THEN now() ELSE completed_at END
          WHERE id = goal_record.id;
        END IF;
      WHEN 'points_earned' THEN
        IF NEW.activity_type IN ('chapter_completion', 'course_completion', 'quiz_completion') THEN
          -- Get points from the activity data
          DECLARE
            points_gained INTEGER := 0;
          BEGIN
            IF NEW.activity_data ? 'points' THEN
              points_gained := (NEW.activity_data->>'points')::INTEGER;
              UPDATE public.user_goals 
              SET current_value = LEAST(current_value + points_gained, target_value),
                  updated_at = now(),
                  is_completed = (current_value + points_gained >= target_value),
                  completed_at = CASE WHEN (current_value + points_gained >= target_value) THEN now() ELSE completed_at END
              WHERE id = goal_record.id;
            END IF;
          END;
        END IF;
    END CASE;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update goal progress when user activities are recorded
CREATE OR REPLACE TRIGGER update_goal_progress_trigger
  AFTER INSERT ON public.user_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goal_progress();
