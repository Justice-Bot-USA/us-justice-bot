-- selfhelp.courts.ca.gov moved these pages; the old URLs return 404 (checked 2026-10-09).
UPDATE public.form_packages SET official_form_page_url = 'https://selfhelp.courts.ca.gov/jcc-form/FL-305'
  WHERE form_number = 'FL-305' AND official_form_page_url = 'https://selfhelp.courts.ca.gov/temporary-emergency-orders';
UPDATE public.form_packages SET official_form_page_url = 'https://selfhelp.courts.ca.gov/jcc-form/FL-320'
  WHERE form_number = 'FL-320' AND official_form_page_url = 'https://selfhelp.courts.ca.gov/fl-320-responsive-declaration';
