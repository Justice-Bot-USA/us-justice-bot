// New York — Comprehensive forms catalog
// Modular: one export per legal area, all using the shared CourtForm shape.
// The personal-injury forms and pages were checked in Oct 2026 against nycourts.gov,
// dmv.ny.gov, dfs.ny.gov, comptroller.nyc.gov and nysenate.gov (see the note on that list).
// Sources: nycourts.gov, dol.ny.gov, dhr.ny.gov, ocfs.ny.gov, nyc.gov, uscis.gov, dmv.ny.gov,
// dfs.ny.gov, comptroller.nyc.gov, nysenate.gov
import type { CourtForm } from '@/lib/formsLibraryData';

export const NY_CRIMINAL_FORMS: CourtForm[] = [
  { formNumber: 'CPL 160.59', name: 'Motion to Seal Conviction (CPL 160.59)', description: 'Seal up to two eligible non-violent convictions after 10 years.', url: 'https://www.nycourts.gov/help/criminal/criminal-records-sealing', category: 'Record Sealing', feeAmount: 'Free', feeWaiverAvailable: true },
  { formNumber: 'CPL 160.50', name: 'Order to Seal — Case Terminated in Favor of Accused', description: 'Automatic sealing when case ends in acquittal/dismissal.', url: 'https://www.nycourts.gov/help/criminal/criminal-records-sealing', category: 'Record Sealing', feeAmount: 'Free' },
  { formNumber: 'CPL 160.57', name: 'Clean Slate Act: Automatic Sealing (CPL 160.57)', description: 'No form to file. Eligible convictions are sealed automatically 3 years (misdemeanor) or 8 years (felony) after sentencing or release from incarceration, whichever is later, if you are not on probation, parole or post-release supervision and have no pending charge. Sex offenses and non-drug class A felonies are excluded. Sealed records remain available to police, courts and some fingerprint background checks. Courts must finish by Nov 16, 2027; a court form to request review will be posted by then.', url: 'https://www.nycourts.gov/cleanslate', category: 'Record Sealing', feeAmount: 'Free' },
  { formNumber: 'Cert. of Relief', name: 'Certificate of Relief from Disabilities', description: 'Remove statutory bars from a single conviction.', url: 'https://doccs.ny.gov/certificate-relief-good-conduct-restoration-rights', category: 'Certificates', feeAmount: 'Free' },
  { formNumber: 'Cert. of Good Conduct', name: 'Certificate of Good Conduct', description: 'For people with multiple felony convictions seeking employment relief.', url: 'https://doccs.ny.gov/certificate-relief-good-conduct-restoration-rights', category: 'Certificates', feeAmount: 'Free' },
  { formNumber: 'CPL 440.10', name: 'Motion to Vacate Judgment (CPL 440.10)', description: 'Post-conviction motion challenging the conviction.', url: 'https://www.nysenate.gov/legislation/laws/CPL/440.10', category: 'Post-Conviction', feeAmount: 'Free' },
  { formNumber: 'CPL 440.20', name: 'Motion to Set Aside Sentence (CPL 440.20)', description: 'Challenge an illegal sentence.', url: 'https://www.nysenate.gov/legislation/laws/CPL/440.20', category: 'Post-Conviction', feeAmount: 'Free' },
  { formNumber: 'Notice of Appeal', name: 'Criminal Notice of Appeal', description: 'File within 30 days of sentencing with the clerk of the trial court where you were sentenced, and serve a copy on the District Attorney (CPL 460.10(1)). No filing fee in criminal appeals.', url: 'https://www.nycourts.gov/appellate-courts', category: 'Appeals', feeAmount: 'Free', feeWaiverAvailable: true },
  { formNumber: 'Poor Person Relief', name: 'Motion for Poor Person Relief and Assigned Counsel (Criminal Appeal)', description: 'Ask the appellate court hearing your appeal for permission to appeal as a poor person and for a free assigned lawyer. Each appellate court (Appellate Division Department, Appellate Term, or County Court) has its own form and service rules; find yours from this page.', url: 'https://www.nycourts.gov/appellate-courts', category: 'Fee Waiver', feeAmount: 'Free' },
];

export const NY_FAMILY_FORMS: CourtForm[] = [
  // Form numbers from the nycourts.gov Family Court forms list (checked 2026-10-09).
  { formNumber: 'GF-17', name: 'Petition for Custody / Visitation', description: 'Start a custody or visitation (parenting time) case in Family Court.', url: 'https://www.nycourts.gov/forms?search_api_forms_fulltext=&field_case_type%5B1441%5D=1441', category: 'Custody', feeAmount: 'Free' },
  { formNumber: 'GF-40', name: 'Petition for Modification of Order of Custody / Visitation', description: 'Change an existing custody or visitation order after a change in circumstances.', url: 'https://www.nycourts.gov/forms/petition-modification-order-custody-visitation', category: 'Custody', feeAmount: 'Free' },
  { formNumber: '4-3', name: 'Support Petition', description: 'Ask the Support Magistrate to establish child support.', url: 'https://www.nycourts.gov/forms?search_api_forms_fulltext=&field_case_type%5B1436%5D=1436', category: 'Support', feeAmount: 'Free' },
  { formNumber: '4-11', name: 'Petition for Modification of an Order of Support', description: 'Change support after a substantial change in circumstances, 3 years, or a 15% income change.', url: 'https://www.nycourts.gov/forms?search_api_forms_fulltext=&field_case_type%5B1436%5D=1436', category: 'Support', feeAmount: 'Free' },
  { formNumber: '8-2', name: 'Family Offense Petition (Order of Protection)', description: 'Ask for an order of protection against a family or household member.', url: 'https://www.nycourts.gov/forms?search_api_forms_fulltext=&field_case_type%5B4191%5D=4191', category: 'Protection', feeAmount: 'Free' },
  { formNumber: '5-1', name: 'Paternity Petition', description: 'Establish legal parentage.', url: 'https://www.nycourts.gov/forms?search_api_forms_fulltext=&field_case_type%5B1431%5D=1431', category: 'Paternity', feeAmount: 'Free' },
  { formNumber: 'GF-8a', name: 'Violation Petition', description: 'Ask the court to enforce an existing Family Court order that was violated.', url: 'https://www.nycourts.gov/family-forms', category: 'Enforcement', feeAmount: 'Free' },
];

export const NY_DIVORCE_FORMS: CourtForm[] = [
  // Form numbers and names from nycourts.gov "Uncontested Divorce Information and Forms" (checked 2026-10-09).
  { formNumber: 'DIY Divorce', name: 'Free DIY Uncontested Divorce Program (NY Courts)', description: 'The court\'s free online program asks questions and prepares the whole uncontested divorce packet.', url: 'https://www.nycourts.gov/help/diy-forms/uncontested-divorce-program', category: 'Divorce', feeAmount: 'Free' },
  { formNumber: 'UD-1', name: 'Summons with Notice', description: 'Starts an uncontested divorce in Supreme Court (or use UD-1a with UD-2).', url: 'https://www.nycourts.gov/forms/summons-notice', category: 'Divorce', feeAmount: '$210 index number', feeWaiverAvailable: true },
  { formNumber: 'UD-1a', name: 'Summons (with Verified Complaint)', description: 'Starts the case together with the Verified Complaint (UD-2).', url: 'https://www.nycourts.gov/forms/summons', category: 'Divorce', feeAmount: '$210 index number', feeWaiverAvailable: true },
  { formNumber: 'UD-2', name: 'Verified Complaint', description: 'Residency, marriage, children, health plans, grounds and relief.', url: 'https://www.nycourts.gov/forms/verified-complaint', category: 'Divorce' },
  { formNumber: 'UD-3', name: 'Affirmation of Service', description: 'Proof the summons was delivered to your spouse.', url: 'https://www.nycourts.gov/forms/affirmation-service', category: 'Divorce' },
  { formNumber: 'UD-4', name: 'Sworn Statement of Removal of Barriers to Remarriage (and UD-4a)', description: 'Required in every case, with proof of service.', url: 'https://www.nycourts.gov/forms/sworn-statement-removal-barriers-remarriage', category: 'Divorce' },
  { formNumber: 'UD-5', name: 'Affirmation of Regularity', description: 'Tells the court whether your spouse was served, appeared, or defaulted.', url: 'https://www.nycourts.gov/forms/affirmation-affidavit-regularity', category: 'Divorce' },
  { formNumber: 'UD-6', name: 'Sworn Affirmation of Plaintiff', description: 'Your sworn statement supporting the judgment. Required in every case.', url: 'https://www.nycourts.gov/forms/sworn-affirmation-plaintiff', category: 'Divorce' },
  { formNumber: 'UD-7', name: 'Affirmation of Defendant', description: 'Your spouse agrees to the divorce and to the uncontested calendar (if they sign).', url: 'https://www.nycourts.gov/forms/affirmation-defendant', category: 'Divorce' },
  { formNumber: 'UD-8(3)', name: 'Child Support Worksheet', description: 'Calculates child support; UD-8(1) annual income and UD-8(2) maintenance worksheets as needed.', url: 'https://www.nycourts.gov/forms/child-support-worksheet', category: 'Support' },
  { formNumber: 'UD-9', name: 'Note of Issue', description: 'Places the case on the uncontested calendar.', url: 'https://www.nycourts.gov/forms/note-issue', category: 'Case Management', feeAmount: '$125 ($30 if the RJI fee was already paid)' },
  { formNumber: 'UD-10', name: 'Findings of Fact and Conclusions of Law', description: 'Proposed findings for the judge.', url: 'https://www.nycourts.gov/forms/findings-factconclusions-law', category: 'Divorce' },
  { formNumber: 'UD-11', name: 'Judgment of Divorce', description: 'Proposed judgment for the judge to sign.', url: 'https://www.nycourts.gov/forms/judgment-divorce', category: 'Divorce' },
  { formNumber: 'UD-12', name: 'Part 130 Certification', description: 'Required in every case.', url: 'https://www.nycourts.gov/forms/part-130-certification', category: 'Divorce' },
  { formNumber: 'UD-13', name: 'Request for Judicial Intervention (RJI)', description: 'Activates the case. Add UCS-840M if there are children.', url: 'https://www.nycourts.gov/forms/request-judicial-intervention', category: 'Case Management', feeAmount: '$95' },
  { formNumber: 'UD-14', name: 'Notice of Entry', description: 'Notice that the judgment has been entered.', url: 'https://www.nycourts.gov/forms/notice-entry', category: 'Divorce' },
  { formNumber: 'UD-15', name: 'Affirmation of Service by Mail of Judgment of Divorce', description: 'Proof you mailed the signed judgment to your spouse.', url: 'https://www.nycourts.gov/forms/affirmation-service-mail-jod', category: 'Divorce' },
  { formNumber: 'UCS-111', name: 'Child Support Summary Form', description: 'Required in divorces with children.', url: 'https://www.nycourts.gov/forms/child-support-summary-form', category: 'Support' },
  { formNumber: 'Stmt of Net Worth', name: 'Statement of Net Worth', description: 'Sworn financial disclosure in contested matrimonial actions.', url: 'https://www.nycourts.gov/divorce-resources/statewide-divorce-forms', category: 'Financial' },
];

export const NY_CPS_FORMS: CourtForm[] = [
  { formNumber: 'FCA Art. 10', name: 'Responding to an Article 10 Neglect/Abuse Case', description: 'There is no answer form: you respond in court, where you have the right to a lawyer (assigned free if you cannot afford one).', url: 'https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings', category: 'CPS Defense', feeAmount: 'Free' },
  { formNumber: 'Permanency Hearing', name: 'Permanency Hearings (FCA Article 10-A)', description: 'Regular court reviews of a child in foster care; the court sends notice (forms PH-2/PH-3).', url: 'https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings', category: 'Permanency', feeAmount: 'Free' },
  { formNumber: '1028 Hearing', name: 'Application for Return of Child (FCA §1028)', description: 'Demand expedited hearing for return of removed child.', url: 'https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings', category: 'Reunification', feeAmount: 'Free' },
  { formNumber: 'OCFS Appeal', name: 'Appeal of Indicated Report (OCFS Fair Hearing)', description: 'Challenge an indicated SCR report within 90 days.', url: 'https://ocfs.ny.gov/programs/cps/', category: 'Fair Hearing', feeAmount: 'Free' },
  { formNumber: 'Kinship App.', name: 'Application for Kinship Foster Care', description: 'Relative seeking to be placement resource.', url: 'https://ocfs.ny.gov/programs/kinship/', category: 'Placement', feeAmount: 'Free' },
  { formNumber: 'Visitation Pet.', name: 'Visits with a Child in Foster Care', description: 'Ask the Family Court judge in the Article 10 case to order visits (usually by motion in that case).', url: 'https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings', category: 'Visitation', feeAmount: 'Free' },
  { formNumber: 'Service Plan Obj.', name: 'Objection to Service Plan / FASP', description: 'Challenge required services in the family services plan.', url: 'https://ocfs.ny.gov/programs/cps/', category: 'Service Plan', feeAmount: 'Free' },
];

export const NY_IMMIGRATION_FORMS: CourtForm[] = [
  { formNumber: 'I-130', name: 'Petition for Alien Relative', description: 'Sponsor a qualifying relative for a green card.', url: 'https://www.uscis.gov/i-130', category: 'Family-Based', feeAmount: '$675' },
  { formNumber: 'I-485', name: 'Application to Register Permanent Residence', description: 'Adjustment of status to lawful permanent resident.', url: 'https://www.uscis.gov/i-485', category: 'Adjustment', feeAmount: '$1,440' },
  { formNumber: 'I-589', name: 'Application for Asylum and Withholding of Removal', description: 'Must be filed within 1 year of arrival. A $100 fee is due at filing (principal applicant only), plus an annual asylum fee, adjusted for inflation, while the application is pending. Check USCIS fee schedule G-1055 for the current amount.', url: 'https://www.uscis.gov/i-589', category: 'Asylum', feeAmount: '$100 + annual fee' },
  { formNumber: 'I-765', name: 'Application for Employment Authorization', description: 'EAD application for eligible categories. The fee depends on your category and whether you file online or on paper; pending-asylum (c)(8) applicants must also pay an additional Pub. L. 119-21 fee that cannot be waived. Check USCIS fee schedule G-1055.', url: 'https://www.uscis.gov/i-765', category: 'Work Authorization', feeAmount: 'Varies (see G-1055)' },
  { formNumber: 'I-821D', name: 'DACA Renewal Application', description: 'Renew Deferred Action for Childhood Arrivals (renewals only). Fee is $85 for the I-821D plus the required I-765 ($520 paper, $470 online).', url: 'https://www.uscis.gov/i-821d', category: 'DACA', feeAmount: '$605 paper / $555 online' },
  { formNumber: 'I-918', name: 'Petition for U Nonimmigrant Status', description: 'For victims of qualifying crimes who cooperate with law enforcement.', url: 'https://www.uscis.gov/i-918', category: 'Victim Visas', feeAmount: 'Free' },
  { formNumber: 'I-914', name: 'Application for T Nonimmigrant Status', description: 'For victims of human trafficking.', url: 'https://www.uscis.gov/i-914', category: 'Victim Visas', feeAmount: 'Free' },
  { formNumber: 'EOIR-42B', name: 'Application for Cancellation of Removal (Non-LPR)', description: 'Defense to removal in NY immigration court.', url: 'https://www.justice.gov/eoir/page/file/904291/dl?inline', category: 'Removal Defense', feeAmount: '$1,690' },
  { formNumber: 'I-912', name: 'Request for Fee Waiver', description: 'Waive USCIS filing fees if income-eligible.', url: 'https://www.uscis.gov/i-912', category: 'Fee Waiver', feeAmount: 'Free' },
  { formNumber: 'IDNYC', name: 'NYC Municipal ID Application', description: 'Government-issued ID regardless of immigration status (NYC residents).', url: 'https://www.nyc.gov/site/idnyc/about/about.page', category: 'NY-Specific', feeAmount: 'Free' },
];

export const NY_WORKPLACE_FORMS: CourtForm[] = [
  { formNumber: 'LS 223', name: 'Labor Standards Complaint Form (NYSDOL)', description: 'File an unpaid wages or wage theft complaint with the NYS Department of Labor.', url: 'https://dol.ny.gov/LS223-doc', category: 'Wage Claims', feeAmount: 'Free' },
  { formNumber: 'PW 4', name: 'Public Work Complaint (Employee)', description: 'Prevailing wage / public works wage claim.', url: 'https://dol.ny.gov/public-work-and-prevailing-wage-enforcement-forms', category: 'Wage Claims', feeAmount: 'Free' },
  { formNumber: 'WTPA', name: 'Wage Theft Prevention Act: Pay Notice Rules', description: 'Employers must give a written pay rate notice at hire (LS 54 and related DOL templates).', url: 'https://dol.ny.gov/wage-theft-and-labor-standards-law', category: 'Wage Notices', feeAmount: 'Free' },
  { formNumber: 'UI Claim', name: 'Unemployment Insurance Initial Claim', description: 'File for UI benefits with NYSDOL.', url: 'https://dol.ny.gov/unemployment-claimant-benefit-process-0', category: 'Unemployment', feeAmount: 'Free' },
  { formNumber: 'C-3', name: 'Employee Claim (Workers Comp Board)', description: 'Open a workers compensation claim in NY.', url: 'https://www.wcb.ny.gov/content/main/forms/AllForms.jsp', category: 'Workers Comp', feeAmount: 'Free' },
  { formNumber: 'PFL-1', name: 'Paid Family Leave Request', description: 'Apply for NY Paid Family Leave benefits.', url: 'https://paidfamilyleave.ny.gov/forms', category: 'Family Leave', feeAmount: 'Free' },
  { formNumber: 'PESH', name: 'Public Employee Safety Complaint (PESH)', description: 'Workplace safety complaint for public employees, filed with NYSDOL PESH.', url: 'https://dol.ny.gov/public-employee-safety-health', category: 'Safety', feeAmount: 'Free' },
  { formNumber: 'OSHA-7', name: 'Federal OSHA Complaint (Private Employees)', description: 'Federal workplace safety complaint (private sector).', url: 'https://www.osha.gov/form/osha7', category: 'Safety', feeAmount: 'Free' },
  { formNumber: 'NYC DCWP', name: 'NYC Worker Protections Complaint', description: 'Paid sick leave, fair workweek, freelance isn\'t free.', url: 'https://www.nyc.gov/site/dca/workers/worker-rights.page', category: 'NYC Workers', feeAmount: 'Free' },
];

export const NY_CIVIL_FORMS: CourtForm[] = [
  { formNumber: 'CIV-SC-50', name: 'Small Claims Statement of Claim (NYC)', description: 'Start a small claims case up to $10,000 in NYC.', url: 'https://www.nycourts.gov/forms/statement-claim-small-claims', category: 'Small Claims', feeAmount: '$15-$20', feeWaiverAvailable: true },
  { formNumber: 'UCS-FW1', name: 'Application to Waive Court Costs, Fees, and Expenses', description: 'Ask any NY court to waive filing fees if you cannot afford them (CPLR 1101).', url: 'https://www.nycourts.gov/forms/application-waive-court-costs-fees-and-expenses', category: 'Fee Waiver', feeAmount: 'Free' },
  { formNumber: 'SC-Outside-NYC', name: 'Small Claims Filing (City/Town/Village)', description: 'Small claims up to $5,000 outside NYC ($3,000 in Town/Village).', url: 'https://www.nycourts.gov/town-and-village-justice-courts', category: 'Small Claims', feeAmount: '$10-$20' },
  { formNumber: 'L&T Petition (Nonpayment)', name: 'Nonpayment Petition (RPAPL 711(2))', description: 'Landlord initiates eviction for unpaid rent.', url: 'https://www.nycourts.gov/new-york-city-housing-court', category: 'Housing — Landlord', feeAmount: '$45' },
  { formNumber: 'L&T Petition (Holdover)', name: 'Holdover Petition (RPAPL 711(1))', description: 'Landlord seeks possession on grounds other than nonpayment.', url: 'https://www.nycourts.gov/new-york-city-housing-court', category: 'Housing — Landlord', feeAmount: '$45' },
  { formNumber: 'Answer (Housing)', name: 'Answer to Eviction Petition', description: 'Answer in person at the clerk or in writing (NYC Housing Court nonpayment cases: within 10 days of service; holdover cases: at the first court date). Free help: Housing Court Answers, (212) 962-4795.', url: 'https://www.nycourts.gov/new-york-city-housing-court/answering-case-nyc-housing-court', category: 'Housing — Tenant', feeAmount: 'Free' },
  { formNumber: 'HP Action', name: 'HP Action for Repairs and Services', description: 'Tenant sues landlord/HPD for code violations.', url: 'https://www.nycourts.gov/new-york-city-housing-court/starting-hp-proceeding-obtain-repairs', category: 'Housing — Tenant', feeAmount: '$45', feeWaiverAvailable: true },
  { formNumber: 'OSC (Stay Eviction)', name: 'Order to Show Cause to Stay Eviction', description: 'Emergency motion to halt eviction warrant.', url: 'https://www.nycourts.gov/new-york-city-housing-court/nyc-housing-court-orders-show-cause', category: 'Housing — Tenant', feeAmount: 'Free' },
  { formNumber: 'Summons (Supreme Ct.)', name: 'Supreme Court Summons (Consumer/Debt)', description: 'Start a civil action in Supreme Court (claims over $50,000; NYC Civil Court hears up to $50,000).', url: 'https://www.nycourts.gov/forms', category: 'Consumer / Debt', feeAmount: '$210' },
  { formNumber: 'Mechanic\'s Lien', name: 'Notice of Mechanic\'s Lien (Lien Law §10)', description: 'Contractor lien for unpaid work.', url: 'https://www.nysenate.gov/legislation/laws/LIE/10', category: 'Consumer', feeAmount: 'Varies' },
  { formNumber: 'Article 78', name: 'Article 78 Petition', description: 'Challenge an agency action (housing, benefits, licensing).', url: 'https://www.nycourts.gov/node/193946', category: 'Agency Review', feeAmount: '$210 + $95 RJI' },
];

export const NY_HUMAN_RIGHTS_FORMS: CourtForm[] = [
  { formNumber: 'NYSDHR Complaint', name: 'NY State Division of Human Rights Complaint', description: 'Start with a discrimination report (online or by phone at (844) 697-3471); if the law covers it, NYSDHR helps you file the formal complaint. Deadline: 3 years for acts on or after Feb 15, 2024.', url: 'https://dhr.ny.gov/report', category: 'Discrimination', feeAmount: 'Free' },
  { formNumber: 'NYC CHR Intake', name: 'NYC Commission on Human Rights Intake', description: 'NYC-specific discrimination, harassment, retaliation complaint.', url: 'https://www.nyc.gov/site/cchr/about/report-discrimination.page', category: 'NYC', feeAmount: 'Free' },
  { formNumber: 'EEOC Charge', name: 'EEOC Charge of Discrimination', description: 'Federal Title VII / ADA / ADEA charge (180/300-day deadline).', url: 'https://publicportal.eeoc.gov/Portal/Login.aspx', category: 'Federal', feeAmount: 'Free' },
  { formNumber: 'AG Civil Rights', name: 'NY Attorney General Civil Rights Complaint', description: 'Pattern-or-practice civil rights complaint to the OAG.', url: 'https://ag.ny.gov/file-complaint/civil-rights', category: 'Civil Rights', feeAmount: 'Free' },
  { formNumber: 'Voting Rights', name: 'NY Voting Rights Complaint', description: 'Report voter intimidation or access violations.', url: 'https://www.elections.ny.gov/', category: 'Voting', feeAmount: 'Free' },
  { formNumber: 'Hate Crime Report', name: 'NYS Hate Crimes Task Force', description: 'Report bias-motivated threats: hotline 844-NO-2-HATE (844-662-4283).', url: 'https://www.ny.gov/programs/hate-crimes-task-force', category: 'Hate Crimes', feeAmount: 'Free' },
];

export const NY_PERSONAL_INJURY_FORMS: CourtForm[] = [
  // Checked Oct 2026. Most nycourts.gov pages block direct downloads, so several were checked
  // through an index of the official pages. The Application for Pro Se Summons form page
  // (CIV-GP-59) was opened on 2026-10-10; the NYC Civil Court "Answering a Case" page is linked
  // from the court's own pages but was not opened directly. Comptroller form versions were read
  // from the PDFs on comptroller.nyc.gov (2026-10-10).
  // Car crash
  { formNumber: 'MV-104', name: 'Report of Motor Vehicle Crash', description: 'DMV crash report. It must be filed within 10 days if anyone was killed or injured, or property damage to any one person was over $1,000. Mail the original to the Crash Records Center in Albany. Must be signed by the driver or a representative.', url: 'https://dmv.ny.gov/forms/mv104.pdf', category: 'Accident Report', feeAmount: 'Free' },
  { formNumber: 'NF-2', name: 'Application for Motor Vehicle No-Fault Benefits', description: 'DFS-prescribed no-fault application. The insurer fills in its own section and must send you this form within 5 business days of getting notice, unless it pays the claim as submitted within 30 days. You sign it under penalty of perjury and return it to the insurer, not to a court or DFS, with copies of your bills.', url: 'https://www.dfs.ny.gov/apps_and_licensing/property_insurers/nofault/forms/nf-2', category: 'No-Fault', feeAmount: 'Free' },
  // Claims against a city, county, town, village, school district or public authority
  { formNumber: 'Notice of Claim (GML 50-e)', name: 'Notice of Claim (city, county, town, village, school district, public authority)', description: 'GML 50-e(2) sets the required contents: sworn; claimant\'s name and post-office address; nature of the claim; when, where and how it arose; damages or injuries so far. In a notice to a county, town, village or any city other than New York City, do not state a dollar amount of damages; that body may later ask for a supplemental claim with the total, due within 15 days (GML 50-e(2); GML §2). The statute does not prescribe a form. Serve it within 90 days by personal delivery or registered or certified mail; in a city of over one million people (New York City), electronic service in the city\'s prescribed manner is also allowed (GML 50-e(3)(a)). The Port Authority of NY & NJ has its own rule: a sworn notice served at least 60 days before suit, and suit within 1 year (McKinney\'s Unconsolidated Laws §§7107-7108).', url: 'https://www.nysenate.gov/legislation/laws/GMU/50-E', category: 'Notice of Claim', feeAmount: 'No filing fee stated in statute' },
  { formNumber: 'NYC-COMPT-BLA-PI1-F2', name: 'NYC Comptroller Personal Injury Claim Form (eClaim version)', description: 'Notice of claim for a personal injury against the City of New York, filed online through the Comptroller\'s eClaim system within 90 days. Fill it in with Adobe Reader, then upload it. Not for NYCHA, MTA, NYC Transit, NYC Health + Hospitals or other authorities.', url: 'https://comptroller.nyc.gov/wp-content/uploads/2025/12/NYCBLA-PI1.pdf', category: 'Notice of Claim', feeAmount: 'Free' },
  { formNumber: 'NYC-COMPT-BLA-PI1-M3', name: 'NYC Comptroller Personal Injury Claim Form (paper; notarized)', description: 'Paper notice of claim against the City of New York, delivered in person or by registered or certified mail to the Office of the NYC Comptroller, 1 Centre Street, New York, NY 10007, within 90 days. Must be notarized. The form says Room 1225; the Comptroller\'s In Person/Mail Filing page (comptroller.nyc.gov/services/for-the-public/claims/in-person-filing/) currently says Room 1329, so confirm the room before you go.', url: 'https://comptroller.nyc.gov/wp-content/uploads/2025/12/personal-injury.pdf', category: 'Notice of Claim', feeAmount: 'Free' },
  // Claims against the State of New York
  { formNumber: 'Court of Claims Forms', name: 'NYS Court of Claims forms list', description: 'Official list of Court of Claims forms, including the Claim Request, Filing Fee Waiver, Filing Fee Reduction, Affidavit of Service, Filing by Fax Cover, and Consent to Electronic Filing.', url: 'https://www.nycourts.gov/courts/court-claims/forms', category: 'Court of Claims', feeAmount: '$50 filing fee (waiver or reduction available)', feeWaiverAvailable: true },
  { formNumber: 'Court of Claims FAQ', name: 'Court of Claims Frequently Asked Questions', description: 'Official FAQ: the $50 filing fee or a waiver or reduction affidavit must come with the claim; filing counts when the Chief Clerk in Albany receives it; how to serve the Attorney General; venue is the county where the claim accrued.', url: 'https://www.nycourts.gov/courts/court-claims/frequently-asked-questions', category: 'Court of Claims', feeAmount: '$50', feeWaiverAvailable: true },
  // Starting a case
  { formNumber: 'NYC Civil Court (Start)', name: 'Starting a Case in NYC Civil Court', description: 'Official step-by-step guide for self-represented plaintiffs: venue, getting the summons (Application for Pro Se Summons, CIV-GP-59), service methods, affidavit of service, court date. Notes the $50,000 limit for each cause of action.', url: 'https://www.nycourts.gov/new-york-city-civil-court/starting-case-nyc-civil-court', category: 'Starting a Case', feeAmount: '$45 summons', feeWaiverAvailable: true },
  { formNumber: 'CIV-GP-59', name: 'Application for Pro Se Summons (NYC Civil Court)', description: 'Form a self-represented plaintiff fills in so the NYC Civil Court clerk can issue the summons and complaint.', url: 'https://www.nycourts.gov/forms/application-pro-se-summons', category: 'Starting a Case', feeAmount: '$45', feeWaiverAvailable: true },
  { formNumber: 'UCS-840', name: 'Request for Judicial Intervention (RJI)', description: 'Asks the Supreme Court to assign a judge, for example to hear a motion or hold a preliminary conference. Personal injury cases use the Torts section (Motor Vehicle, Products Liability, Other Negligence, Medical/Dental/Podiatric Malpractice, Other Tort). It also has a box for Waiver of Court Costs, Fees, and Expenses. Use this general RJI, not the uncontested-divorce RJI (UD-13).', url: 'https://www.nycourts.gov/legacypdfs/forms/rji/UCS-840.pdf', category: 'Case Management', feeAmount: '$95', feeWaiverAvailable: true },
  { formNumber: 'NYSCEF', name: 'NYS Courts Electronic Filing (NYSCEF): Unrepresented Litigants', description: 'Optional e-filing for people without a lawyer. Unrepresented litigants are exempt from mandatory e-filing and may opt in.', url: 'https://www.nycourts.gov/efile-unrepresented', category: 'E-Filing', feeAmount: 'Same court fees as paper filing', feeWaiverAvailable: true },
  { formNumber: 'NYC Civil Court Fees', name: 'NYC Civil Court Fees', description: 'Official fee schedule: issue a summons $45; filing first paper $45; notice of trial $40; demand for jury trial $70; small claim $15/$20. Personal checks are not accepted.', url: 'https://www.nycourts.gov/new-york-city-civil-court/nyc-civil-court-fees', category: 'Fees' },
  // Small claims and fee waiver
  { formNumber: 'CIV-SC-50', name: 'Statement of Claim (Small Claims), NYC', description: 'Starts a small claims case for money only, up to $10,000, in NYC Civil Court. Fee $15 for claims up to $1,000 and $20 for claims from $1,000.01 to $10,000.', url: 'https://www.nycourts.gov/forms/statement-claim-small-claims', category: 'Small Claims', feeAmount: '$15-$20', feeWaiverAvailable: true },
  { formNumber: 'UCS-FW1', name: 'Application to Waive Court Costs, Fees, and Expenses', description: 'Fee waiver application under CPLR 1101 (version 01/2025). If the case has already started, also serve a Notice of Motion (UCS-FW2) on the other parties and on the Corporation Counsel (NYC) or County Attorney, and file an Affirmation of Service (UCS-FW3).', url: 'https://www.nycourts.gov/forms/application-waive-court-costs-fees-and-expenses', category: 'Fee Waiver', feeAmount: 'Free', feeWaiverAvailable: true },
  // If you are sued
  { formNumber: 'NYC Civil Court (Answer)', name: 'Answering a Case in NYC Civil Court', description: 'Official page for defendants: 20 days to answer if you were handed the summons, 30 days otherwise. You may answer in person at the clerk\'s office using a free answer form, counterclaim, and demand a jury (fee).', url: 'https://www.nycourts.gov/new-york-city-civil-court/answering-case-nyc-civil-court', category: 'Answering a Case', feeAmount: 'No fee to answer; jury demand $70' },
  // Official information and free or low-cost help
  { formNumber: 'CourtHelp', name: 'CourtHelp: NY Courts self-help site', description: 'The court system\'s official self-help site, with topic pages, DIY forms, and Representing Yourself pages such as How Court Cases Start, Filing an Affidavit of Service, and Getting a Judge Assigned (RJI).', url: 'https://www.nycourts.gov/help/courthelp', category: 'Official Help', feeAmount: 'Free' },
  { formNumber: 'NYSBA LRS', name: 'New York State Bar Association Lawyer Referral Service', description: 'Free referrals to screened attorneys, applied for online. It serves selected counties; check its site for coverage (in New York City, see the New York City Bar Legal Referral Service). Consultations are $35 for the first half hour, with exceptions for some case types, including personal injury and medical malpractice. Staff are not attorneys and cannot give legal advice.', url: 'https://nysba.org/new-york-state-bar-association-lawyer-referral-service/', category: 'Legal Help', feeAmount: 'Referral free; $35 consultation (exceptions apply)' },
  { formNumber: 'NYC Bar LRS', name: 'New York City Bar Legal Referral Service', description: 'NYC lawyer referral service, 212-626-7373 (Spanish 212-626-7374). Initial consultations are $35 or free depending on the case type, up to 30 minutes.', url: 'https://www.nycbar.org/get-legal-help/', category: 'Legal Help', feeAmount: 'Consultation: $35 or free, by case type' },
  { formNumber: 'LawHelpNY', name: 'LawHelpNY', description: 'Nonprofit directory of free legal services and legal information in New York State.', url: 'https://www.lawhelpny.org/', category: 'Legal Help', feeAmount: 'Free' },
];

// Form guides a personal-injury funnel delivers, most relevant first: the car crash report and
// no-fault application (shortest deadlines), notices of claim, then the court forms. Guide
// pages and help directories are not forms, so they are left out.
const NY_PI_FUNNEL_ORDER = [
  'MV-104', 'NF-2', 'Notice of Claim (GML 50-e)', 'NYC-COMPT-BLA-PI1-F2', 'CIV-GP-59', 'UCS-840',
  'CIV-SC-50', 'UCS-FW1', 'NYC-COMPT-BLA-PI1-M3', 'Court of Claims Forms',
];
export const NY_PERSONAL_INJURY_FUNNEL_FORMS: CourtForm[] = NY_PI_FUNNEL_ORDER.flatMap((n) =>
  NY_PERSONAL_INJURY_FORMS.filter((f) => f.formNumber === n),
);

export type NyCategoryKey =
  | 'criminal' | 'family' | 'divorce' | 'cps'
  | 'immigration' | 'workplace' | 'civil' | 'human-rights' | 'personal-injury';

export const NY_FORMS_BY_CATEGORY: Record<NyCategoryKey, CourtForm[]> = {
  criminal: NY_CRIMINAL_FORMS,
  family: NY_FAMILY_FORMS,
  divorce: NY_DIVORCE_FORMS,
  cps: NY_CPS_FORMS,
  immigration: NY_IMMIGRATION_FORMS,
  workplace: NY_WORKPLACE_FORMS,
  civil: NY_CIVIL_FORMS,
  'human-rights': NY_HUMAN_RIGHTS_FORMS,
  'personal-injury': NY_PERSONAL_INJURY_FORMS,
};

export function getNyForms(category: NyCategoryKey): CourtForm[] {
  return NY_FORMS_BY_CATEGORY[category] ?? [];
}