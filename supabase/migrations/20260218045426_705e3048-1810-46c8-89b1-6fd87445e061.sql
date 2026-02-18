-- Make enrollment_id nullable in course_certificates
-- External certificate uploads don't always have a matching enrollment in our catalog
ALTER TABLE public.course_certificates
  ALTER COLUMN enrollment_id DROP NOT NULL;
