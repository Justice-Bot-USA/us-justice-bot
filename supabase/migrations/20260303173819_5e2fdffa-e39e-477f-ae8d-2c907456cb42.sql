
-- Seed CA Custody/Visitation Issue Hub
INSERT INTO public.issue_hubs (id, slug, category, title, summary, icon, sort_order)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'custody-visitation',
  'family',
  'Custody & Visitation (Parenting Time)',
  'Understand custody and visitation rights, find the right forms, and get step-by-step guidance for your state. Whether you are requesting, modifying, or enforcing a parenting order — start here.',
  'Users',
  1
);

-- LEARN sections for CA
INSERT INTO public.issue_sections (hub_id, section_type, title, content_md, sort_order, jurisdiction_code) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'learn', 'What is Custody?', E'In California, there are two types of custody:\n\n• **Legal custody** — who makes important decisions about a child''s health, education, and welfare.\n• **Physical custody** — where the child lives day-to-day.\n\nEither type can be **joint** (shared) or **sole** (one parent). The court decides based on the child''s best interest.', 1, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'learn', 'Types of Visitation / Parenting Time', E'• **Scheduled visitation** — specific days and times written in the order.\n• **Reasonable visitation** — parents agree on a schedule without court-set times.\n• **Supervised visitation** — visits happen with another adult or agency present.\n• **No visitation** — rare, only when a child''s safety is at risk.', 2, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'learn', 'What is a Parenting Plan?', E'A parenting plan is a written agreement that describes how parents will share time and responsibilities. It can include:\n\n• Regular schedule (weekdays, weekends)\n• Holiday and vacation schedule\n• Transportation arrangements\n• Communication rules\n• Decision-making process\n\nYou can create a plan together or ask the court to decide.', 3, 'CA');

-- DO sections for CA
INSERT INTO public.issue_sections (hub_id, section_type, title, content_md, sort_order, jurisdiction_code) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'do', 'Make a Parenting Plan', 'If you and the other parent can agree, you can write your own parenting plan and submit it to the court for approval. This is usually faster and less stressful than going to trial.', 1, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'do', 'Ask for a Custody/Visitation Order', 'If you cannot agree, you can file a Request for Order (FL-300) asking the judge to make custody and visitation decisions. You will need to attend a hearing.', 2, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'do', 'Modify an Existing Order', 'If circumstances have changed significantly, you can ask the court to modify your custody or visitation order by filing a new Request for Order.', 3, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'do', 'Enforce an Order', 'If the other parent is not following the court order, you can file a motion to enforce it. The court may hold the other parent in contempt.', 4, 'CA');

-- TIMELINE sections for CA
INSERT INTO public.issue_sections (hub_id, section_type, title, content_md, sort_order, jurisdiction_code) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'timeline', 'File Your Paperwork', 'Complete and file the Request for Order (FL-300) and the Child Custody and Visitation Application Attachment (FL-311) with your local court. Pay the filing fee or request a fee waiver.', 1, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'timeline', 'Serve the Other Parent', 'Have someone 18+ (not you) serve copies of all filed documents on the other parent at least 16 court days before the hearing.', 2, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'timeline', 'Attend Mediation', 'In most California counties, you must attend Family Court Services mediation before your hearing. The mediator will try to help you reach an agreement.', 3, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'timeline', 'Attend the Hearing', 'If mediation does not resolve everything, go to court on your hearing date. Bring copies of all paperwork and any evidence. The judge will make orders.', 4, 'CA'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'timeline', 'Get Your Order Signed', 'After the hearing, prepare the order using form FL-341 and related attachments. Have the judge sign it. File the signed order with the clerk.', 5, 'CA');

-- HELP sections
INSERT INTO public.issue_sections (hub_id, section_type, title, content_md, sort_order, jurisdiction_code) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'help', 'Court Self-Help Centers', 'Most California courthouses have free self-help centers that can help you fill out forms, understand the process, and prepare for court. They cannot give legal advice, but they can explain procedures.', 1, 'CA');

-- CA Form Packages (core custody forms)
INSERT INTO public.form_packages (hub_id, jurisdiction_code, form_number, form_name, description, url, category, sort_order, is_required) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-300', 'Request for Order', 'Use this form to ask the court for custody, visitation, or other family law orders.', 'https://www.courts.ca.gov/documents/fl300.pdf', 'start', 1, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-300-INFO', 'Information Sheet for Request for Order', 'Instructions and information about the Request for Order process.', 'https://www.courts.ca.gov/documents/fl300info.pdf', 'start', 2, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-305', 'Temporary Emergency (Ex Parte) Orders', 'Use when you need emergency custody or visitation orders before a hearing.', 'https://www.courts.ca.gov/documents/fl305.pdf', 'emergency', 3, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-311', 'Child Custody and Visitation Application Attachment', 'Attach to FL-300 to describe the custody and visitation orders you are requesting.', 'https://www.courts.ca.gov/documents/fl311.pdf', 'start', 4, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-311-INFO', 'What Are Visitation or Parenting Time Orders?', 'Plain-language explanation of visitation and parenting time orders.', 'https://www.courts.ca.gov/documents/fl311info.pdf', 'start', 5, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-320', 'Responsive Declaration to Request for Order', 'Use if the other parent filed a Request for Order and you want to respond.', 'https://www.courts.ca.gov/documents/fl320.pdf', 'respond', 6, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-341', 'Child Custody and Visitation Order Attachment', 'The order attachment the judge signs — describes the custody/visitation arrangement.', 'https://www.courts.ca.gov/documents/fl341.pdf', 'order', 7, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-341(A)', 'Supervised Visitation and Exchanges Order', 'Attachment for orders requiring supervised visitation or monitored exchanges.', 'https://www.courts.ca.gov/documents/fl341a.pdf', 'attachment', 8, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-341(B)', 'Child Abduction Prevention Order Attachment', 'Attachment for orders to prevent a parent from taking the child out of jurisdiction.', 'https://www.courts.ca.gov/documents/fl341b.pdf', 'attachment', 9, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-341(C)', 'Children''s Holiday Schedule Attachment', 'Attachment to specify holiday and vacation parenting time.', 'https://www.courts.ca.gov/documents/fl341c.pdf', 'attachment', 10, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-341(D)', 'Additional Provisions — Physical Custody Attachment', 'Attachment for additional physical custody provisions.', 'https://www.courts.ca.gov/documents/fl341d.pdf', 'attachment', 11, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'FL-341(E)', 'Joint Legal Custody Attachment', 'Attachment for joint legal custody details and decision-making.', 'https://www.courts.ca.gov/documents/fl341e.pdf', 'attachment', 12, false);

-- Resource Links for CA
INSERT INTO public.resource_links (hub_id, jurisdiction_code, label, url, description, category, sort_order) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'California Courts Self-Help: Custody & Parenting Time', 'https://selfhelp.courts.ca.gov/custody-parenting-time', 'Official California Courts self-help center for custody and parenting time.', 'self-help', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'California Courts: All Family Law Forms', 'https://courts.ca.gov/rules-forms/court-forms', 'Browse all California court forms by category.', 'official', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'LawHelpCA: Family Law Resources', 'https://www.lawhelpca.org/issues/family-and-children', 'Find free legal help and resources for family law in California.', 'legal-aid', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CA', 'National Domestic Violence Hotline', 'https://www.thehotline.org/', 'If you or your children are in danger. Call 1-800-799-7233.', 'emergency', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'LawHelp.org', 'https://www.lawhelp.org/', 'Find free legal aid in your state.', 'legal-aid', 5);
