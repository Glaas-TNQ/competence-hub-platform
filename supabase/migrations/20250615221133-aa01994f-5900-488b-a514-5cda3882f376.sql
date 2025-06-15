
-- Rimuovi tutte le politiche RLS esistenti che causano recursione infinita
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Disabilita temporaneamente RLS per permettere l'accesso agli admin
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
