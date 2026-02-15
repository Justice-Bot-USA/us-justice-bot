
-- Seed all 50 US states + DC + Federal
INSERT INTO public.jurisdictions (country, code, name, short_code) VALUES
  ('US', 'US-AL', 'Alabama', 'AL'),
  ('US', 'US-AK', 'Alaska', 'AK'),
  ('US', 'US-AZ', 'Arizona', 'AZ'),
  ('US', 'US-AR', 'Arkansas', 'AR'),
  ('US', 'US-CA', 'California', 'CA'),
  ('US', 'US-CO', 'Colorado', 'CO'),
  ('US', 'US-CT', 'Connecticut', 'CT'),
  ('US', 'US-DE', 'Delaware', 'DE'),
  ('US', 'US-FL', 'Florida', 'FL'),
  ('US', 'US-GA', 'Georgia', 'GA'),
  ('US', 'US-HI', 'Hawaii', 'HI'),
  ('US', 'US-ID', 'Idaho', 'ID'),
  ('US', 'US-IL', 'Illinois', 'IL'),
  ('US', 'US-IN', 'Indiana', 'IN'),
  ('US', 'US-IA', 'Iowa', 'IA'),
  ('US', 'US-KS', 'Kansas', 'KS'),
  ('US', 'US-KY', 'Kentucky', 'KY'),
  ('US', 'US-LA', 'Louisiana', 'LA'),
  ('US', 'US-ME', 'Maine', 'ME'),
  ('US', 'US-MD', 'Maryland', 'MD'),
  ('US', 'US-MA', 'Massachusetts', 'MA'),
  ('US', 'US-MI', 'Michigan', 'MI'),
  ('US', 'US-MN', 'Minnesota', 'MN'),
  ('US', 'US-MS', 'Mississippi', 'MS'),
  ('US', 'US-MO', 'Missouri', 'MO'),
  ('US', 'US-MT', 'Montana', 'MT'),
  ('US', 'US-NE', 'Nebraska', 'NE'),
  ('US', 'US-NV', 'Nevada', 'NV'),
  ('US', 'US-NH', 'New Hampshire', 'NH'),
  ('US', 'US-NJ', 'New Jersey', 'NJ'),
  ('US', 'US-NM', 'New Mexico', 'NM'),
  ('US', 'US-NY', 'New York', 'NY'),
  ('US', 'US-NC', 'North Carolina', 'NC'),
  ('US', 'US-ND', 'North Dakota', 'ND'),
  ('US', 'US-OH', 'Ohio', 'OH'),
  ('US', 'US-OK', 'Oklahoma', 'OK'),
  ('US', 'US-OR', 'Oregon', 'OR'),
  ('US', 'US-PA', 'Pennsylvania', 'PA'),
  ('US', 'US-RI', 'Rhode Island', 'RI'),
  ('US', 'US-SC', 'South Carolina', 'SC'),
  ('US', 'US-SD', 'South Dakota', 'SD'),
  ('US', 'US-TN', 'Tennessee', 'TN'),
  ('US', 'US-TX', 'Texas', 'TX'),
  ('US', 'US-UT', 'Utah', 'UT'),
  ('US', 'US-VT', 'Vermont', 'VT'),
  ('US', 'US-VA', 'Virginia', 'VA'),
  ('US', 'US-WA', 'Washington', 'WA'),
  ('US', 'US-WV', 'West Virginia', 'WV'),
  ('US', 'US-WI', 'Wisconsin', 'WI'),
  ('US', 'US-WY', 'Wyoming', 'WY'),
  ('US', 'US-DC', 'District of Columbia', 'DC'),
  ('US', 'US-FED', 'Federal', 'FED');

-- Seed form_sources for US-FED + 10 launch states
INSERT INTO public.form_sources (country, jurisdiction_code, source_name, source_url, source_type, category) VALUES
  -- Federal
  ('US', 'US-FED', 'US Courts Forms', 'https://www.uscourts.gov/forms', 'federal_agency', 'general'),
  ('US', 'US-FED', 'USCIS Immigration Forms', 'https://www.uscis.gov/forms/all-forms', 'federal_agency', 'immigration'),
  ('US', 'US-FED', 'DOL Workers Rights', 'https://www.dol.gov/general/forms', 'federal_agency', 'workers-rights'),
  ('US', 'US-FED', 'EEOC Complaint Forms', 'https://www.eeoc.gov/filing-charge-discrimination', 'federal_agency', 'employment'),
  ('US', 'US-FED', 'OSHA Complaint Forms', 'https://www.osha.gov/workers/file-complaint', 'federal_agency', 'workers-rights'),
  -- California
  ('US', 'US-CA', 'California Courts Self-Help', 'https://www.courts.ca.gov/forms.htm', 'court_website', 'general'),
  ('US', 'US-CA', 'CA Family Law Forms', 'https://www.courts.ca.gov/forms.htm?filter=FL', 'court_website', 'family'),
  ('US', 'US-CA', 'CA Small Claims Forms', 'https://www.courts.ca.gov/forms.htm?filter=SC', 'court_website', 'small-claims'),
  -- New York
  ('US', 'US-NY', 'NY Courts Forms', 'https://www.nycourts.gov/forms/', 'court_website', 'general'),
  ('US', 'US-NY', 'NY Family Court Forms', 'https://www.nycourts.gov/forms/familycourt/', 'court_website', 'family'),
  -- Texas
  ('US', 'US-TX', 'Texas Courts Forms', 'https://www.txcourts.gov/rules-forms/forms/', 'court_website', 'general'),
  ('US', 'US-TX', 'TX Family Law Forms', 'https://www.txcourts.gov/rules-forms/forms/family-law-forms/', 'court_website', 'family'),
  -- Florida
  ('US', 'US-FL', 'Florida Courts Self-Help', 'https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms', 'court_website', 'family'),
  ('US', 'US-FL', 'FL Supreme Court Forms', 'https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms', 'court_website', 'general'),
  -- Illinois
  ('US', 'US-IL', 'Illinois Courts Forms', 'https://www.illinoiscourts.gov/forms/', 'court_website', 'general'),
  ('US', 'US-IL', 'IL Legal Aid Forms', 'https://www.illinoislegalaid.org/legal-information/court-forms', 'legal_aid', 'general'),
  -- Washington
  ('US', 'US-WA', 'Washington Courts Forms', 'https://www.courts.wa.gov/forms/', 'court_website', 'general'),
  ('US', 'US-WA', 'WA Family Law Forms', 'https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=31', 'court_website', 'family'),
  -- Massachusetts
  ('US', 'US-MA', 'Massachusetts Court Forms', 'https://www.mass.gov/court-forms', 'court_website', 'general'),
  ('US', 'US-MA', 'MA Probate and Family Court', 'https://www.mass.gov/orgs/probate-and-family-court', 'court_website', 'family'),
  -- Pennsylvania
  ('US', 'US-PA', 'Pennsylvania Court Forms', 'https://www.pacourts.us/forms', 'court_website', 'general'),
  -- Georgia
  ('US', 'US-GA', 'Georgia Court Forms', 'https://georgiacourts.gov/court-forms/', 'court_website', 'general'),
  ('US', 'US-GA', 'GA Self-Help Resources', 'https://www.georgialegalaid.org/issues/courts-and-legal-system/court-forms', 'legal_aid', 'general'),
  -- New Jersey
  ('US', 'US-NJ', 'New Jersey Court Forms', 'https://www.njcourts.gov/self-help/forms', 'court_website', 'general'),
  ('US', 'US-NJ', 'NJ Family Division Forms', 'https://www.njcourts.gov/self-help/forms#family', 'court_website', 'family');
