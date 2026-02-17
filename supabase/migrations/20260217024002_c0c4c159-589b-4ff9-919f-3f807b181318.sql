
INSERT INTO public.courses (title, description, provider_name, provider_url, course_type, acceptance_label, jurisdictions, hours_required, lms_launch_url, lms_type, is_active) VALUES

-- CALIFORNIA
('Children in Between — Co-Parenting After Divorce (CA)', 
 'Research-based co-parenting education program helping parents reduce the negative impact of divorce and separation on children. Covers communication, conflict reduction, and child-centered decision making.', 
 'Center for Divorce Education', 'https://divorce-education.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['CA'], 4, 
 'https://divorce-education.com/ca', 'link', true),

('California Parent Education Class', 
 'Court-ordered parent education class per California Family Code Section 3200-3204. Covers child development, co-parenting communication, and reducing parental conflict. Certificate recognized by California courts that allow distance learning.', 
 'Course For Parents', 'https://courseforparents.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['CA'], 4, 
 'https://courseforparents.com/states/CA', 'link', true),

('Online Co-Parenting Class — California', 
 'County-specific co-parenting and divorce education class. Covers impact of divorce on children, effective communication strategies, and healthy co-parenting techniques.', 
 'Online Parenting Programs', 'https://www.onlineparentingprograms.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['CA'], 6, 
 'https://ca.onlineparentingprograms.com/', 'link', true),

('High-Conflict Co-Parenting — California', 
 'Specialized program for high-conflict custody situations. Addresses parallel parenting, boundary setting, managing hostile communication, and protecting children from parental conflict.', 
 'Online Parenting Programs', 'https://www.onlineparentingprograms.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['CA'], 8, 
 'https://ca.onlineparentingprograms.com/', 'link', true),

-- TEXAS
('Texas Parent Education & Family Stabilization Course', 
 'Satisfies Texas Family Code 105.009 requirements. Covers child development, family dynamics during separation, effective co-parenting, and reducing conflict. Judicial system security-certified certificates.', 
 'Putting Kids First', 'https://puttingkidsfirst.org/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['TX'], 4, 
 'https://puttingkidsfirst.org/texascourtapprovedonlineparentingclasses.html', 'link', true),

('Texas Online Co-Parenting Class', 
 'Satisfies Family Court orders and custody requirements in Texas. Covers child-centered parenting, age-appropriate communication about divorce, and building a cooperative co-parenting relationship.', 
 'Modern Parenting Solutions', 'https://modernparentingsolutions.org/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['TX'], 4, 
 'https://modernparentingsolutions.org/texas-online-coparenting-class/', 'link', true),

('Co-Parenting CARE Program — Texas', 
 'Comprehensive co-parenting education covering child adjustment, reducing exposure to conflict, and effective communication. Available in multiple durations based on court requirements.', 
 'Online Parenting Programs', 'https://www.onlineparentingprograms.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['TX'], 8, 
 'https://www.onlineparentingprograms.com/texas-parenting-programs.html', 'link', true),

-- FLORIDA
('DCF-Approved Parent Education & Family Stabilization Course (FL)', 
 'Florida DCF-approved parenting class. Covers co-parenting after divorce, child developmental needs, conflict resolution, and family stabilization. Satisfies Florida Statute 61.21 requirements.', 
 'Center for Divorce Education', 'https://divorce-education.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['FL'], 4, 
 'https://divorce-education.com/fl', 'link', true),

('Florida Online Co-Parenting Class', 
 'Covers Florida-specific requirements for parent education and family stabilization. Topics include healthy co-parenting, children''s emotional needs during divorce, and conflict management.', 
 'Online Parent Class', 'https://www.onlineparentclass.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['FL'], 4, 
 'https://www.onlineparentclass.com/', 'link', true),

('Florida High-Conflict Parenting Program', 
 'Designed for high-conflict custody disputes. Covers parallel parenting strategies, disengagement techniques, and protecting children in hostile co-parenting environments.', 
 'Online Parenting Programs', 'https://www.onlineparentingprograms.com/', 'parenting', 
 'Commonly Accepted in Some Jurisdictions', ARRAY['FL'], 12, 
 'https://fl.onlineparentingprograms.com/', 'link', true),

-- MULTI-STATE / SUPPLEMENTARY
('High Road to Reunification Workshop', 
 'Whole-family reunification program for parents navigating child welfare proceedings. Four phases: New Family Paradigm, Reintegration, Maintenance, and Autonomy. Facilitated by trained professionals.', 
 'Conscious Co-Parenting Institute', 'https://consciouscoparentinginstitute.com/', 'reunification', 
 'Supplementary / Skill-Building', ARRAY['CA','TX','FL'], NULL, 
 'https://consciouscoparentinginstitute.com/reunification/', 'link', true),

('Anger Management for Parents (Court-Ordered)', 
 'Online anger management class addressing emotional regulation, communication under stress, and conflict de-escalation. Appropriate for court-ordered or self-referred parents.', 
 'Court Ordered Program', 'https://courtorderedprogram.onlineparentingprograms.com/', 'skill-building', 
 'Supplementary / Skill-Building', ARRAY['CA','TX','FL'], 12, 
 'https://courtorderedprogram.onlineparentingprograms.com/all-online-classes.html', 'link', true),

('Parenting Skills & Child Development', 
 'General parenting skills covering child development stages, positive discipline, nurturing communication, and building secure attachment. Suitable as supplementary education for any jurisdiction.', 
 'Online Parent Class', 'https://www.onlineparentclass.com/', 'supplementary', 
 'Supplementary / Skill-Building', ARRAY['CA','TX','FL'], 8, 
 'https://www.onlineparentclass.com/', 'link', true);
