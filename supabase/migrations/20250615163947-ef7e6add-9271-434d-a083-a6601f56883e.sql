
-- Create learning paths table
CREATE TABLE public.learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_ids UUID[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

-- Policies for learning paths
CREATE POLICY "Anyone can view published learning paths"
  ON public.learning_paths
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage learning paths"
  ON public.learning_paths
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create user progress for learning paths
CREATE TABLE public.learning_path_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE NOT NULL,
  completed_course_ids UUID[] NOT NULL DEFAULT '{}',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, learning_path_id)
);

-- Enable RLS for learning path progress
ALTER TABLE public.learning_path_progress ENABLE ROW LEVEL SECURITY;

-- Policy for learning path progress
CREATE POLICY "Users can view own learning path progress"
  ON public.learning_path_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning path progress"
  ON public.learning_path_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning path progress"
  ON public.learning_path_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add updated_at trigger for learning path progress
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.learning_path_progress
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
