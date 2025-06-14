
-- Aggiorno il profilo per impostare luca.tomasinoj@gmail.com come admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'luca.tomasinoj@gmail.com';

-- Se il profilo non esiste ancora, lo creo
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  'admin'
FROM auth.users au
WHERE au.email = 'luca.tomasinoj@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);
