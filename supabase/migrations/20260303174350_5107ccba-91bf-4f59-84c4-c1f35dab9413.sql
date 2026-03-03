
-- Update form_packages with official URLs
UPDATE public.form_packages SET
  official_pdf_url = url,
  official_form_page_url = CASE form_number
    WHEN 'FL-300' THEN 'https://selfhelp.courts.ca.gov/fl-300-request-order'
    WHEN 'FL-305' THEN 'https://selfhelp.courts.ca.gov/temporary-emergency-orders'
    WHEN 'FL-311' THEN 'https://selfhelp.courts.ca.gov/fl-311-custody-visitation'
    WHEN 'FL-320' THEN 'https://selfhelp.courts.ca.gov/fl-320-responsive-declaration'
    WHEN 'FL-341(A)' THEN 'https://selfhelp.courts.ca.gov/supervised-visitation'
    ELSE NULL
  END,
  official_directory_url = 'https://www.courts.ca.gov/rules-forms/court-forms'
WHERE hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Insert tracks
INSERT INTO public.tracks (hub_id, track_key, title, description, when_to_use, timeline_md, sort_order) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'rfo', 'Ask for Custody/Visitation Orders', 'File a Request for Order (RFO) to ask the court for custody or visitation orders.', 'Use this track when you need the court to make new custody or visitation orders, whether or not you have an existing family law case.', E'1. Complete FL-300 + FL-311\n2. File with the court clerk\n3. Get a hearing date\n4. Serve the other parent (at least 16 court days before hearing)\n5. Attend mediation/counseling (if required by your county)\n6. Attend hearing\n7. Receive court order', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'respond', 'Respond to Custody/Visitation Papers', 'You received papers from the other parent asking the court for custody or visitation orders. Here is how to respond.', 'Use this track if you were served with an FL-300 or similar request and need to file your response before the hearing date.', E'1. Read the papers carefully — note the hearing date\n2. Complete FL-320 (Responsive Declaration)\n3. Attach FL-311 if you want different custody/visitation\n4. File with the court clerk\n5. Serve the other parent (at least 9 court days before hearing)\n6. Attend mediation/counseling if required\n7. Attend hearing', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'emergency', 'Emergency / Safety Orders', 'If there is an immediate risk of harm to you or your children, you can ask for emergency (ex parte) orders without waiting for a regular hearing.', 'Use this track if there is an immediate danger — abuse, threats, child abduction risk, or other urgent safety concerns.', E'1. Complete FL-300 + FL-305\n2. File with the court — request ex parte hearing\n3. Court may grant temporary orders the same day\n4. Serve the other parent\n5. Full hearing scheduled (usually within 20–25 days)\n6. Court makes final decision at hearing', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'modify', 'Change an Existing Order', 'You already have a custody or visitation order but your circumstances have changed and you need to modify it.', 'Use this track when you already have a court order for custody/visitation but need it changed due to new circumstances (relocation, safety, schedule changes, etc.).', E'1. Complete FL-300 + FL-311 (same as RFO track)\n2. Explain the change in circumstances\n3. File with the court clerk\n4. Get a hearing date\n5. Serve the other parent\n6. Attend mediation/counseling if required\n7. Attend hearing\n8. Receive modified order', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'enforce', 'Enforce a Custody Order', 'The other parent is not following the existing custody or visitation order. Learn how to enforce it through the court.', 'Use this track when the other parent is violating a court order — not returning the children, denying visitation, etc.', E'1. Document each violation (dates, details, witnesses)\n2. Consider filing an RFO (FL-300) asking the court to enforce\n3. You may also contact local law enforcement for immediate violations\n4. File with the court clerk\n5. Serve the other parent\n6. Attend hearing — bring documentation\n7. Court may impose sanctions or modify the order', 5);

-- Wire track_forms (we'll do this after we know track IDs)
-- RFO track: FL-300 (required), FL-311 (required), FL-300-INFO
INSERT INTO public.track_forms (track_id, form_id, is_required, order_index)
SELECT t.id, fp.id, 
  CASE WHEN fp.form_number IN ('FL-300', 'FL-311') THEN true ELSE false END,
  CASE fp.form_number 
    WHEN 'FL-300' THEN 1
    WHEN 'FL-311' THEN 2
    WHEN 'FL-300-INFO' THEN 3
    WHEN 'FL-341' THEN 4
    WHEN 'FL-341(C)' THEN 5
    WHEN 'FL-341(D)' THEN 6
    WHEN 'FL-341(E)' THEN 7
  END
FROM public.tracks t, public.form_packages fp
WHERE t.track_key = 'rfo' AND t.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.form_number IN ('FL-300', 'FL-311', 'FL-300-INFO', 'FL-341', 'FL-341(C)', 'FL-341(D)', 'FL-341(E)');

-- Respond track: FL-320 (required), FL-311
INSERT INTO public.track_forms (track_id, form_id, is_required, order_index)
SELECT t.id, fp.id,
  CASE WHEN fp.form_number = 'FL-320' THEN true ELSE false END,
  CASE fp.form_number WHEN 'FL-320' THEN 1 WHEN 'FL-311' THEN 2 END
FROM public.tracks t, public.form_packages fp
WHERE t.track_key = 'respond' AND t.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.form_number IN ('FL-320', 'FL-311');

-- Emergency track: FL-300 (required), FL-305 (required)
INSERT INTO public.track_forms (track_id, form_id, is_required, order_index)
SELECT t.id, fp.id, true,
  CASE fp.form_number WHEN 'FL-300' THEN 1 WHEN 'FL-305' THEN 2 END
FROM public.tracks t, public.form_packages fp
WHERE t.track_key = 'emergency' AND t.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.form_number IN ('FL-300', 'FL-305');

-- Modify track: FL-300 (required), FL-311 (required)
INSERT INTO public.track_forms (track_id, form_id, is_required, order_index)
SELECT t.id, fp.id, true,
  CASE fp.form_number WHEN 'FL-300' THEN 1 WHEN 'FL-311' THEN 2 END
FROM public.tracks t, public.form_packages fp
WHERE t.track_key = 'modify' AND t.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.form_number IN ('FL-300', 'FL-311');

-- Enforce track: FL-300 (required)
INSERT INTO public.track_forms (track_id, form_id, is_required, order_index)
SELECT t.id, fp.id, true, 1
FROM public.tracks t, public.form_packages fp
WHERE t.track_key = 'enforce' AND t.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.hub_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND fp.form_number = 'FL-300';
