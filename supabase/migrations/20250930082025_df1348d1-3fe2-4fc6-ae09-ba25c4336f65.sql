-- Clean up duplicate roles for terri.bertin57@gmail.com
-- Keep only the admin role, remove the user role
DELETE FROM user_roles 
WHERE user_id = 'bf8f802e-f53e-4472-908a-a25f1891a81d' 
AND role = 'user';