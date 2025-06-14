
-- Crea un nuovo utente admin nel database con password 000000
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@academy.com',
  crypt('000000', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Crea il profilo admin corrispondente
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  'Admin User',
  'admin'
FROM auth.users au
WHERE au.email = 'admin@academy.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.email = 'admin@academy.com'
);
