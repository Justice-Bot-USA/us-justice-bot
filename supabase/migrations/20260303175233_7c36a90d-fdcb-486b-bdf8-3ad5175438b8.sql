
-- Add hub_key column (unique, used for jurisdiction-aware lookups)
ALTER TABLE public.issue_hubs ADD COLUMN hub_key text;

-- Create unique index on hub_key
CREATE UNIQUE INDEX idx_issue_hubs_hub_key ON public.issue_hubs (hub_key) WHERE hub_key IS NOT NULL;

-- Update existing CA custody hub
UPDATE public.issue_hubs
SET hub_key = 'ca/family-law/custody-visitation',
    category = 'family-law',
    title = 'Child Custody & Visitation (Parenting Time) – California',
    summary = 'Understand parenting plans, choose the right track, and use official California court forms to request or change custody and visitation orders.'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Update tracks with better descriptions
UPDATE public.tracks SET title = 'Ask for a custody/visitation order', description = 'Use this when you want the court to make or change custody/parenting time orders.' WHERE id = '39753aff-3a5f-4aa6-b3ca-2d678de5dab5';
UPDATE public.tracks SET title = 'Respond to papers you received', description = 'Use this when the other parent filed and you need to respond before the hearing.' WHERE id = '03ce7bb6-6435-495a-b9fa-139762c8fdd6';
UPDATE public.tracks SET title = 'Emergency / safety situation', description = 'Use this when you need urgent court orders related to safety or immediate risk.' WHERE id = 'c3a074fc-e715-4ba0-91b4-2dc6f9b21e11';
UPDATE public.tracks SET title = 'Change an existing order', description = 'Use this when you already have an order and need to update the schedule or custody terms.' WHERE id = '5389705d-5b95-4b8b-ba42-aced59ec70cb';
UPDATE public.tracks SET title = 'Enforce an order', description = 'Use this when an existing custody/visitation order is not being followed.' WHERE id = '7aa6cf91-4239-487d-9b29-29bc7d1721de';

-- Update FL-300 with correct official URLs
UPDATE public.form_packages SET
  official_form_page_url = 'https://selfhelp.courts.ca.gov/jcc-form/FL-300',
  official_pdf_url = 'https://courts.ca.gov/system/files?file=2025-07%2Ffl300.pdf',
  official_directory_url = 'https://courts.ca.gov/rules-forms/court-forms',
  description = 'Ask the court for orders in a family law case and get a hearing date.',
  category = 'start',
  is_required = true
WHERE id = '3695156b-9dc1-4a31-9da6-bc481eaa4ae9';

-- Update FL-311 with correct official URLs
UPDATE public.form_packages SET
  official_form_page_url = 'https://selfhelp.courts.ca.gov/jcc-form/FL-311',
  official_pdf_url = 'https://courts.ca.gov/sites/default/files/courts/default/2024-11/fl311.pdf',
  official_directory_url = 'https://courts.ca.gov/rules-forms/court-forms',
  description = 'Add detailed custody/parenting time orders you want the court to make.',
  category = 'start',
  is_required = true
WHERE id = 'b7f58900-d270-4591-acd2-c89d82ca110e';

-- Update resource links with correct URLs
UPDATE public.resource_links SET
  label = 'California Courts – Court Forms directory (official)',
  url = 'https://courts.ca.gov/rules-forms/court-forms',
  description = 'Search official Judicial Council forms by number, topic, or category.',
  category = 'official'
WHERE id = 'f54ffbdb-c279-4054-bd0d-f01d99bbf2a5';

UPDATE public.resource_links SET
  label = 'California Courts Self-Help – Child custody & visitation overview',
  url = 'https://selfhelp.courts.ca.gov/child-custody',
  description = 'Parenting plans, legal vs physical custody, and visitation basics.',
  category = 'official'
WHERE id = 'd50d79c6-4cc0-464f-ae67-21d38e7b45e4';

-- Insert new resource: CA Self-Help index
INSERT INTO public.resource_links (hub_id, jurisdiction_code, category, label, url, description, sort_order)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'CA',
  'official',
  'CA Self-Help – Child custody & parenting time index',
  'https://selfhelp.courts.ca.gov/child-custody-and-parenting-time-index',
  'Find step-by-step pages inside the custody/visitation section.',
  1
);
