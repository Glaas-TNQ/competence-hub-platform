
-- Add payment-related fields to courses table
ALTER TABLE public.courses 
ADD COLUMN requires_payment boolean DEFAULT false,
ADD COLUMN price decimal(10,2) DEFAULT 0.00;

-- Add a field to track which courses a user has access to
ALTER TABLE public.profiles 
ADD COLUMN purchased_courses uuid[] DEFAULT '{}';

-- Update existing courses to be free by default
UPDATE public.courses SET requires_payment = false WHERE requires_payment IS NULL;
