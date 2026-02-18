-- Add official registry URL and recognition source to courses table
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS official_registry_url text,
  ADD COLUMN IF NOT EXISTS recognition_source text;

-- Update CA courses with official Judicial Council registry URL
UPDATE public.courses
SET 
  official_registry_url = 'https://www.courts.ca.gov/documents/ParentingClassProviders.pdf',
  recognition_source = 'CA Judicial Council – Approved Parenting Class Providers'
WHERE 'CA' = ANY(jurisdictions);

-- Update TX courses with OAG approved list URL
UPDATE public.courses
SET 
  official_registry_url = 'https://www.oag.texas.gov/child-support/services-parents/parent-education-family-stabilization-course',
  recognition_source = 'TX Office of Attorney General – Parent Education & Family Stabilization'
WHERE 'TX' = ANY(jurisdictions) AND ('CA' != ANY(jurisdictions));

-- Update FL courses with FL Supreme Court certified programs URL
UPDATE public.courses
SET 
  official_registry_url = 'https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Law/Parent-Education',
  recognition_source = 'FL Supreme Court – Certified Parent Education Programs'
WHERE 'FL' = ANY(jurisdictions) AND ('CA' != ANY(jurisdictions)) AND ('TX' != ANY(jurisdictions));