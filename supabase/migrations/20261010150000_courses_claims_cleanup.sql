-- Course Hub: remove court-approval and statute claims from the seeded course rows, and hide Texas
-- and Florida courses (Justice Bot USA is live only in California and New York). We don't know
-- whether any court accepts these outside providers, so the text tells people to check with their
-- court. UPDATE statements only; each one matches only rows that still need the change, so running
-- this file again changes nothing.
-- acceptance_label keeps its CHECK-constrained values; CourseHub.tsx shows neutral display text
-- for them.

-- 1. California parent education class: drop the Family Code citation and the claim that
--    California courts recognize the certificate.
UPDATE public.courses
SET description = 'Online parent education class covering child development, co-parenting communication, and reducing parental conflict. Check with your court whether this class meets your order; each county court decides which providers it accepts.'
WHERE title = 'California Parent Education Class'
  AND (description ILIKE '%court-ordered%' OR description ILIKE '%recognized by%' OR description ILIKE '%Family Code%');

-- 2. Anger management: drop "(Court-Ordered)" from the title and description. The provider's
--    "Court Ordered Program" site is part of Online Parenting Programs (same domain), so show that name.
UPDATE public.courses
SET title = 'Anger Management for Parents',
    description = 'Online anger management class covering emotional regulation, communication under stress, and conflict de-escalation. If a court or caseworker told you to take a class, check with them whether this one meets the requirement.',
    provider_name = 'Online Parenting Programs'
WHERE title = 'Anger Management for Parents (Court-Ordered)';

-- 3. Texas and Florida rows (hidden below): drop statute, "satisfies" and agency-approval claims
--    too, so the text is neutral if a row is ever shown again.
UPDATE public.courses
SET description = 'Parent education course covering child development, family changes during separation, co-parenting, and reducing conflict. Check with your court whether this course meets your order.'
WHERE title = 'Texas Parent Education & Family Stabilization Course'
  AND (description ILIKE '%Family Code%' OR description ILIKE '%certified%');

UPDATE public.courses
SET description = 'Online co-parenting class covering child-centered parenting, talking with children about divorce in age-appropriate ways, and building a cooperative co-parenting relationship. Check with your court whether this class meets your order.'
WHERE title = 'Texas Online Co-Parenting Class'
  AND description ILIKE '%Satisfies%';

UPDATE public.courses
SET description = 'Co-parenting education covering how children adjust, reducing their exposure to conflict, and effective communication. Available in several lengths. Check with your court whether this program meets your order.'
WHERE title = 'Co-Parenting CARE Program — Texas'
  AND description ILIKE '%court requirements%';

UPDATE public.courses
SET title = 'Parent Education & Family Stabilization Course (FL)',
    description = 'Parenting class covering co-parenting after divorce, children''s developmental needs, conflict resolution, and family stabilization. Check with your court whether this course meets your order.'
WHERE title = 'DCF-Approved Parent Education & Family Stabilization Course (FL)';

UPDATE public.courses
SET description = 'Online co-parenting class covering healthy co-parenting, children''s emotional needs during divorce, and conflict management. Check with your court whether this class meets your order.'
WHERE title = 'Florida Online Co-Parenting Class'
  AND description ILIKE '%requirements%';

-- 4. Hide courses offered only for Texas or Florida (no California or New York).
UPDATE public.courses
SET is_active = false
WHERE is_active = true
  AND jurisdictions && ARRAY['TX', 'FL']::text[]
  AND NOT (jurisdictions && ARRAY['CA', 'NY']::text[]);

-- 5. Multi-state courses stay listed for California only: remove Texas and Florida.
UPDATE public.courses
SET jurisdictions = array_remove(array_remove(jurisdictions, 'TX'), 'FL')
WHERE jurisdictions && ARRAY['CA', 'NY']::text[]
  AND jurisdictions && ARRAY['TX', 'FL']::text[];

-- 6. recognition_source named approval or certification lists the courses were never checked
--    against (no statewide California list exists; each county court publishes its own). Clear it
--    and point California rows to the court finder instead.
UPDATE public.courses
SET recognition_source = NULL,
    official_registry_url = CASE
      WHEN 'CA' = ANY(jurisdictions) THEN 'https://www.courts.ca.gov/find-my-court.htm'
      ELSE NULL
    END
WHERE recognition_source IS NOT NULL
   OR official_registry_url IS DISTINCT FROM (CASE
      WHEN 'CA' = ANY(jurisdictions) THEN 'https://www.courts.ca.gov/find-my-court.htm'
      ELSE NULL
    END);
