
-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Drop the existing function that might be causing issues
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create a simple, non-recursive function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new, simpler policies that don't cause recursion
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- For admin access, we'll use a direct approach without self-referencing
CREATE POLICY "Service role can access all profiles" 
  ON public.profiles 
  FOR ALL 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Ensure admin user exists and has correct role
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  '5729a380-a70b-4e75-ad57-dadf388eccd5'::uuid,
  'admin@academy.com',
  'admin',
  'Administrator'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = 'admin@academy.com';
