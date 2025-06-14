
-- Step 1: Remove ALL existing RLS policies on public.profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles - Select own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles - Select all for Admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles - Update own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles - Update all for Admin" ON public.profiles;

-- Step 2: Drop functions not needed anymore
DROP FUNCTION IF EXISTS public.get_user_role CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role CASCADE;

-- Step 3: Create minimal, safe policies for own data only
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
