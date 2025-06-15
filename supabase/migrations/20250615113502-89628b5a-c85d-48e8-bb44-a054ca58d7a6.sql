
-- Tabella per i template dei certificati
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  requirements JSONB NOT NULL, -- criteria per ottenere il certificato
  certificate_type TEXT NOT NULL DEFAULT 'course_completion', -- course_completion, competence_mastery, excellence, special_event
  is_active BOOLEAN DEFAULT true,
  points_required INTEGER DEFAULT 0,
  courses_required UUID[] DEFAULT '{}',
  competence_area_id UUID REFERENCES public.competence_areas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per i certificati assegnati agli utenti
CREATE TABLE public.user_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  certificate_id UUID REFERENCES public.certificates(id) NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verification_code TEXT UNIQUE NOT NULL,
  certificate_data JSONB NOT NULL, -- dati del certificato generato
  is_revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per le preferenze utente
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  dashboard_layout JSONB DEFAULT '{}',
  learning_preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  theme_settings JSONB DEFAULT '{}',
  personal_goals JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per note e annotazioni degli utenti
CREATE TABLE public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id),
  chapter_index INTEGER,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'personal', -- personal, shared, bookmark, highlight
  position_data JSONB, -- per salvare posizione nel contenuto
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per obiettivi personalizzati
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL, -- weekly_chapters, monthly_courses, streak_target, points_target
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Abilita RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Policies per certificates (pubbliche ma solo admin può modificare)
CREATE POLICY "Anyone can view active certificates" ON public.certificates
  FOR SELECT USING (is_active = true);

-- Policies per user_certificates (solo propri certificati)
CREATE POLICY "Users can view their own certificates" ON public.user_certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Policies per user_preferences (solo proprie preferenze)
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Policies per user_notes (solo proprie note + note condivise)
CREATE POLICY "Users can manage their own notes" ON public.user_notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared notes" ON public.user_notes
  FOR SELECT USING (is_shared = true);

-- Policies per user_goals (solo propri obiettivi)
CREATE POLICY "Users can manage their own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Trigger per updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_notes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Funzione per generare codice di verifica certificato
CREATE OR REPLACE FUNCTION generate_certificate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'CERT-' || UPPER(encode(gen_random_bytes(8), 'hex'));
END;
$$;

-- Funzione per controllare se un utente merita un certificato
CREATE OR REPLACE FUNCTION check_and_award_certificates(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  cert_record RECORD;
  user_progress_data RECORD;
BEGIN
  -- Per ogni certificato attivo
  FOR cert_record IN 
    SELECT * FROM public.certificates 
    WHERE is_active = true 
    AND id NOT IN (
      SELECT certificate_id FROM public.user_certificates 
      WHERE user_id = p_user_id AND is_revoked = false
    )
  LOOP
    -- Controlla i requisiti in base al tipo
    CASE cert_record.certificate_type
      WHEN 'course_completion' THEN
        -- Controlla se ha completato i corsi richiesti
        IF (
          SELECT COUNT(*) FROM public.user_progress 
          WHERE user_id = p_user_id 
          AND course_id = ANY(cert_record.courses_required)
          AND progress_percentage = 100
        ) >= array_length(cert_record.courses_required, 1) THEN
          
          INSERT INTO public.user_certificates (
            user_id, certificate_id, verification_code, certificate_data
          ) VALUES (
            p_user_id, 
            cert_record.id,
            generate_certificate_verification_code(),
            jsonb_build_object(
              'issued_date', now(),
              'certificate_name', cert_record.name,
              'user_id', p_user_id
            )
          );
        END IF;
        
      WHEN 'competence_mastery' THEN
        -- Controlla se ha completato tutti i corsi di una competenza
        IF cert_record.competence_area_id IS NOT NULL THEN
          IF (
            SELECT COUNT(*) FROM public.user_progress up
            JOIN public.courses c ON up.course_id = c.id
            WHERE up.user_id = p_user_id 
            AND c.competence_area_id = cert_record.competence_area_id
            AND up.progress_percentage = 100
          ) >= (
            SELECT COUNT(*) FROM public.courses 
            WHERE competence_area_id = cert_record.competence_area_id
            AND is_published = true
          ) AND (
            SELECT COUNT(*) FROM public.courses 
            WHERE competence_area_id = cert_record.competence_area_id
            AND is_published = true
          ) > 0 THEN
            
            INSERT INTO public.user_certificates (
              user_id, certificate_id, verification_code, certificate_data
            ) VALUES (
              p_user_id, 
              cert_record.id,
              generate_certificate_verification_code(),
              jsonb_build_object(
                'issued_date', now(),
                'certificate_name', cert_record.name,
                'user_id', p_user_id,
                'competence_area', cert_record.competence_area_id
              )
            );
          END IF;
        END IF;
        
      WHEN 'excellence' THEN
        -- Controlla se ha punti sufficienti
        SELECT total_points INTO user_progress_data
        FROM public.user_total_points 
        WHERE user_id = p_user_id;
        
        IF COALESCE(user_progress_data.total_points, 0) >= cert_record.points_required THEN
          INSERT INTO public.user_certificates (
            user_id, certificate_id, verification_code, certificate_data
          ) VALUES (
            p_user_id, 
            cert_record.id,
            generate_certificate_verification_code(),
            jsonb_build_object(
              'issued_date', now(),
              'certificate_name', cert_record.name,
              'user_id', p_user_id,
              'points_earned', user_progress_data.total_points
            )
          );
        END IF;
    END CASE;
  END LOOP;
END;
$$;

-- Inserisci alcuni certificati di base
INSERT INTO public.certificates (name, description, template_data, requirements, certificate_type, points_required) VALUES
(
  'Primo Completamento',
  'Certificato per aver completato il primo corso',
  '{"template": "basic", "color": "#3b82f6"}',
  '{"courses_count": 1}',
  'course_completion',
  0
),
(
  'Studente Dedicato',
  'Certificato per aver raggiunto 500 punti',
  '{"template": "achievement", "color": "#10b981"}',
  '{"points_minimum": 500}',
  'excellence',
  500
),
(
  'Maestro delle Competenze',
  'Certificato per aver completato tutti i corsi di una competenza',
  '{"template": "mastery", "color": "#f59e0b"}',
  '{"competence_complete": true}',
  'competence_mastery',
  0
);
