-- Grant admin role to kristinastruikmans@gmail.com for unlimited access
INSERT INTO public.user_roles (user_id, role)
VALUES ('a21dda3a-b2a8-4514-9fb9-692272e08060', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;