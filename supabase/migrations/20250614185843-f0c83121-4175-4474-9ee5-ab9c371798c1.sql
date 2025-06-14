
-- Drop all existing select and update policies on the profiles table to ensure a clean state.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update all profiles" ON public.profiles;


-- Create new, non-recursive policies for SELECT operations on the profiles table.
-- Users can view their own profile.
CREATE POLICY "Profiles - Select own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles by checking their email.
CREATE POLICY "Profiles - Select all for Admin" ON public.profiles
  FOR SELECT USING (auth.email() = 'admin@academy.com');


-- Create new, non-recursive policies for UPDATE operations on the profiles table.
-- Users can update their own profile.
CREATE POLICY "Profiles - Update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admins can update any profile.
CREATE POLICY "Profiles - Update all for Admin" ON public.profiles
  FOR UPDATE USING (auth.email() = 'admin@academy.com');
