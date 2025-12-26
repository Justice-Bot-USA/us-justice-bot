-- Grant admin role to jenny.lynn7885@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('0e91ef33-67af-4f84-b0f7-ec2d484ef31b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;