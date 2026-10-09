// New York — Comprehensive forms catalog
// Modular: one export per legal area, all using the shared CourtForm shape.
// Sources: nycourts.gov, dol.ny.gov, dhr.ny.gov, ocfs.ny.gov, nyc.gov, uscis.gov
import type { CourtForm } from '@/lib/formsLibraryData';

export const NY_CRIMINAL_FORMS: CourtForm[] = [
  { formNumber: 'CPL 160.59', name: 'Motion to Seal Conviction (CPL 160.59)', description: 'Seal up to two eligible non-violent convictions after 10 years.', url: 'https://www.nycourts.gov/courthelp/Criminal/sealingRecords.shtml', category: 'Record Sealing', feeAmount: 'Free', feeWaiverAvailable: true },
  { formNumber: 'CPL 160.50', name: 'Order to Seal — Case Terminated in Favor of Accused', description: 'Automatic sealing when case ends in acquittal/dismissal.', url: 'https://www.nycourts.gov/courthelp/Criminal/sealingRecords.shtml', category: 'Record Sealing', feeAmount: 'Free' },
  { formNumber: 'Cert. of Relief', name: 'Certificate of Relief from Disabilities', description: 'Remove statutory bars from a single conviction.', url: 'https://doccs.ny.gov/certificates-relief-disabilities-and-good-conduct', category: 'Certificates', feeAmount: 'Free' },
  { formNumber: 'Cert. of Good Conduct', name: 'Certificate of Good Conduct', description: 'For people with multiple felony convictions seeking employment relief.', url: 'https://doccs.ny.gov/certificates-relief-disabilities-and-good-conduct', category: 'Certificates', feeAmount: 'Free' },
  { formNumber: 'CPL 440.10', name: 'Motion to Vacate Judgment (CPL 440.10)', description: 'Post-conviction motion challenging the conviction.', url: 'https://ww2.nycourts.gov/courts/ad1/calendar/List_Word/2018/02_Feb/13/PDF/CPL%20440.10.pdf', category: 'Post-Conviction', feeAmount: 'Free' },
  { formNumber: 'CPL 440.20', name: 'Motion to Set Aside Sentence (CPL 440.20)', description: 'Challenge an illegal sentence.', url: 'https://www.nycourts.gov', category: 'Post-Conviction', feeAmount: 'Free' },
  { formNumber: 'Notice of Appeal', name: 'Criminal Notice of Appeal', description: 'File within 30 days of sentencing to preserve appellate rights.', url: 'https://www.nycourts.gov/courts/appellate.shtml', category: 'Appeals', feeAmount: '$65', feeWaiverAvailable: true },
  { formNumber: 'Poor Person Relief', name: 'Application for Poor Person Relief (Criminal Appeal)', description: 'Request assigned counsel and fee waiver on appeal.', url: 'https://www.nycourts.gov/courthelp/goingtocourt/feeWaiver.shtml', category: 'Fee Waiver', feeAmount: 'Free' },
];

export const NY_FAMILY_FORMS: CourtForm[] = [
  { formNumber: 'GF-5', name: 'Family Court Petition — Custody', description: 'Start a custody case in Family Court.', url: 'https://ww2.nycourts.gov/forms/familycourt/custodyvisitation.shtml', category: 'Custody', feeAmount: 'Free' },
  { formNumber: 'GF-5b', name: 'Family Court Petition — Visitation', description: 'Request visitation/parenting time.', url: 'https://ww2.nycourts.gov/forms/familycourt/custodyvisitation.shtml', category: 'Visitation', feeAmount: 'Free' },
  { formNumber: '4-2', name: 'Petition for Child Support', description: 'Establish or enforce child support through Support Magistrate.', url: 'https://ww2.nycourts.gov/forms/familycourt/childsupport.shtml', category: 'Support', feeAmount: 'Free' },
  { formNumber: '4-3', name: 'Petition to Modify Order of Support', description: 'Request a change based on substantial change in circumstances.', url: 'https://ww2.nycourts.gov/forms/familycourt/childsupport.shtml', category: 'Support', feeAmount: 'Free' },
  { formNumber: '8-1', name: 'Family Offense Petition (Order of Protection)', description: 'Request protection from a family/household member.', url: 'https://ww2.nycourts.gov/forms/familycourt/familyoffense.shtml', category: 'Protection Orders', feeAmount: 'Free' },
  { formNumber: 'GF-17', name: 'Paternity Petition', description: 'Establish legal parentage.', url: 'https://ww2.nycourts.gov/forms/familycourt/paternity.shtml', category: 'Paternity', feeAmount: 'Free' },
  { formNumber: 'V-3', name: 'Petition for Modification of Custody/Visitation', description: 'Modify an existing custody or visitation order.', url: 'https://ww2.nycourts.gov/forms/familycourt/custodyvisitation.shtml', category: 'Custody', feeAmount: 'Free' },
  { formNumber: 'GF-25', name: 'Petition for Enforcement / Violation', description: 'Enforce an existing Family Court order.', url: 'https://ww2.nycourts.gov/forms/familycourt/', category: 'Enforcement', feeAmount: 'Free' },
];

export const NY_DIVORCE_FORMS: CourtForm[] = [
  { formNumber: 'UD-1', name: 'Summons with Notice (Uncontested Divorce)', description: 'Start an uncontested divorce in Supreme Court.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce', feeAmount: '$210 index fee', feeWaiverAvailable: true },
  { formNumber: 'UD-2', name: 'Verified Complaint Action for Divorce', description: 'State the grounds and relief sought (DRL §170(7) no-fault).', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce' },
  { formNumber: 'UD-3', name: 'Affidavit of Defendant', description: 'Defendant\'s waiver/appearance in uncontested action.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce' },
  { formNumber: 'UD-6', name: 'Affidavit of Plaintiff', description: 'Plaintiff\'s sworn statement supporting the judgment.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce' },
  { formNumber: 'UD-7', name: 'Child Support Worksheet (CSSA)', description: 'Calculate basic child support under DRL §240.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Support' },
  { formNumber: 'UD-8', name: 'Sworn Statement of Removal of Barriers to Remarriage', description: 'Required where one party is from a religion with such barriers.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce' },
  { formNumber: 'UD-10', name: 'Findings of Fact and Conclusions of Law', description: 'Proposed findings for the court.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce' },
  { formNumber: 'UD-11', name: 'Judgment of Divorce', description: 'Proposed judgment for court signature.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce', feeAmount: '$125 RJI' },
  { formNumber: 'UCS-111', name: 'Notice of Entry', description: 'Notice that judgment has been entered.', url: 'https://ww2.nycourts.gov/divorce/forms.shtml', category: 'Divorce' },
  { formNumber: 'RJI', name: 'Request for Judicial Intervention', description: 'Activates the case in the court system.', url: 'https://www.nycourts.gov/forms/index.shtml', category: 'Case Management', feeAmount: '$95' },
  { formNumber: 'Stmt of Net Worth', name: 'Statement of Net Worth', description: 'Sworn financial disclosure in contested matrimonial actions.', url: 'https://ww2.nycourts.gov/forms/matrimonial/', category: 'Financial' },
];

export const NY_CPS_FORMS: CourtForm[] = [
  { formNumber: 'FCA Art. 10', name: 'Answer to Article 10 Neglect/Abuse Petition', description: 'Respond to ACS / county DSS allegations.', url: 'https://www.nycourts.gov/courthelp/family/cps.shtml', category: 'CPS Defense', feeAmount: 'Free' },
  { formNumber: '10-A Petition', name: 'Article 10-A Permanency Hearing Notice', description: 'Notice for permanency hearings on placed children.', url: 'https://www.nycourts.gov/courthelp/family/cps.shtml', category: 'Permanency', feeAmount: 'Free' },
  { formNumber: '1028 Hearing', name: 'Application for Return of Child (FCA §1028)', description: 'Demand expedited hearing for return of removed child.', url: 'https://www.nycourts.gov/courthelp/family/cps.shtml', category: 'Reunification', feeAmount: 'Free' },
  { formNumber: 'OCFS Appeal', name: 'Appeal of Indicated Report (OCFS Fair Hearing)', description: 'Challenge an indicated SCR report within 90 days.', url: 'https://ocfs.ny.gov/programs/cps/', category: 'Fair Hearing', feeAmount: 'Free' },
  { formNumber: 'Kinship App.', name: 'Application for Kinship Foster Care', description: 'Relative seeking to be placement resource.', url: 'https://ocfs.ny.gov/programs/fostercare/kinship/', category: 'Placement', feeAmount: 'Free' },
  { formNumber: 'Visitation Pet.', name: 'Petition for Visitation with Child in Foster Care', description: 'Request court-ordered visits.', url: 'https://www.nycourts.gov/courthelp/family/visitation.shtml', category: 'Visitation', feeAmount: 'Free' },
  { formNumber: 'Service Plan Obj.', name: 'Objection to Service Plan / FASP', description: 'Challenge required services in the family services plan.', url: 'https://ocfs.ny.gov/programs/cps/', category: 'Service Plan', feeAmount: 'Free' },
];

export const NY_IMMIGRATION_FORMS: CourtForm[] = [
  { formNumber: 'I-130', name: 'Petition for Alien Relative', description: 'Sponsor a qualifying relative for a green card.', url: 'https://www.uscis.gov/i-130', category: 'Family-Based', feeAmount: '$675' },
  { formNumber: 'I-485', name: 'Application to Register Permanent Residence', description: 'Adjustment of status to lawful permanent resident.', url: 'https://www.uscis.gov/i-485', category: 'Adjustment', feeAmount: '$1,440' },
  { formNumber: 'I-589', name: 'Application for Asylum and Withholding of Removal', description: 'Must be filed within 1 year of arrival.', url: 'https://www.uscis.gov/i-589', category: 'Asylum', feeAmount: 'Free' },
  { formNumber: 'I-765', name: 'Application for Employment Authorization', description: 'EAD application for eligible categories.', url: 'https://www.uscis.gov/i-765', category: 'Work Authorization', feeAmount: '$520' },
  { formNumber: 'I-821D', name: 'DACA Renewal Application', description: 'Renew Deferred Action for Childhood Arrivals (renewals only).', url: 'https://www.uscis.gov/i-821d', category: 'DACA', feeAmount: '$555' },
  { formNumber: 'I-918', name: 'Petition for U Nonimmigrant Status', description: 'For victims of qualifying crimes who cooperate with law enforcement.', url: 'https://www.uscis.gov/i-918', category: 'Victim Visas', feeAmount: 'Free' },
  { formNumber: 'I-914', name: 'Application for T Nonimmigrant Status', description: 'For victims of human trafficking.', url: 'https://www.uscis.gov/i-914', category: 'Victim Visas', feeAmount: 'Free' },
  { formNumber: 'EOIR-42B', name: 'Application for Cancellation of Removal (Non-LPR)', description: 'Defense to removal in NY immigration court.', url: 'https://www.justice.gov/eoir/page/file/eoir42b/download', category: 'Removal Defense', feeAmount: '$100' },
  { formNumber: 'I-912', name: 'Request for Fee Waiver', description: 'Waive USCIS filing fees if income-eligible.', url: 'https://www.uscis.gov/i-912', category: 'Fee Waiver', feeAmount: 'Free' },
  { formNumber: 'IDNYC', name: 'NYC Municipal ID Application', description: 'Government-issued ID regardless of immigration status (NYC residents).', url: 'https://www.nyc.gov/site/idnyc/about/about.page', category: 'NY-Specific', feeAmount: 'Free' },
];

export const NY_WORKPLACE_FORMS: CourtForm[] = [
  { formNumber: 'LS 223', name: 'Claim for Unpaid Wages (NYSDOL)', description: 'File a wage theft complaint with the NYS Department of Labor.', url: 'https://dol.ny.gov/system/files/documents/2021/03/ls223_0.pdf', category: 'Wage Claims', feeAmount: 'Free' },
  { formNumber: 'LS 425', name: 'Public Work Wage Complaint', description: 'Prevailing wage / public works wage claim.', url: 'https://dol.ny.gov/public-work-and-prevailing-wage', category: 'Wage Claims', feeAmount: 'Free' },
  { formNumber: 'LS 605', name: 'WTPA Notice of Pay Rate', description: 'Wage Theft Prevention Act notice required at hire.', url: 'https://dol.ny.gov/wage-theft-prevention-act', category: 'Wage Notices', feeAmount: 'Free' },
  { formNumber: 'UI Claim', name: 'Unemployment Insurance Initial Claim', description: 'File for UI benefits with NYSDOL.', url: 'https://dol.ny.gov/unemployment/file-your-first-claim-background', category: 'Unemployment', feeAmount: 'Free' },
  { formNumber: 'C-3', name: 'Employee Claim (Workers Comp Board)', description: 'Open a workers compensation claim in NY.', url: 'https://www.wcb.ny.gov/content/main/forms/AllForms.jsp', category: 'Workers Comp', feeAmount: 'Free' },
  { formNumber: 'PFL-1', name: 'Paid Family Leave Request', description: 'Apply for NY Paid Family Leave benefits.', url: 'https://paidfamilyleave.ny.gov/paid-family-leave-forms', category: 'Family Leave', feeAmount: 'Free' },
  { formNumber: 'SH-900', name: 'Public Employer Safety Complaint', description: 'PESH workplace safety complaint (public employees).', url: 'https://dol.ny.gov/public-employees-safety-and-health-program', category: 'Safety', feeAmount: 'Free' },
  { formNumber: 'OSHA-7', name: 'Federal OSHA Complaint (Private Employees)', description: 'Federal workplace safety complaint (private sector).', url: 'https://www.osha.gov/form/osha7', category: 'Safety', feeAmount: 'Free' },
  { formNumber: 'NYC DCWP', name: 'NYC Worker Protections Complaint', description: 'Paid sick leave, fair workweek, freelance isn\'t free.', url: 'https://www.nyc.gov/site/dca/workers/workersrights.page', category: 'NYC Workers', feeAmount: 'Free' },
];

export const NY_CIVIL_FORMS: CourtForm[] = [
  { formNumber: 'CIV-SC-50', name: 'Small Claims Statement of Claim (NYC)', description: 'Start a small claims case up to $10,000 in NYC.', url: 'https://www.nycourts.gov/forms/statement-claim-small-claims', category: 'Small Claims', feeAmount: '$15-$20', feeWaiverAvailable: true },
  { formNumber: 'UCS-FW1', name: 'Application to Waive Court Costs, Fees, and Expenses', description: 'Ask any NY court to waive filing fees if you cannot afford them (CPLR 1101).', url: 'https://www.nycourts.gov/forms/application-waive-court-costs-fees-and-expenses', category: 'Fee Waiver', feeAmount: 'Free' },
  { formNumber: 'SC-Outside-NYC', name: 'Small Claims Filing (City/Town/Village)', description: 'Small claims up to $5,000 outside NYC ($3,000 in Town/Village).', url: 'https://www.nycourts.gov/courts/townandvillage/forms.shtml', category: 'Small Claims', feeAmount: '$10-$20' },
  { formNumber: 'L&T Petition (Nonpayment)', name: 'Nonpayment Petition (RPAPL 711(2))', description: 'Landlord initiates eviction for unpaid rent.', url: 'https://www.nycourts.gov/courts/nyc/housing/index.shtml', category: 'Housing — Landlord', feeAmount: '$45' },
  { formNumber: 'L&T Petition (Holdover)', name: 'Holdover Petition (RPAPL 711(1))', description: 'Landlord seeks possession on grounds other than nonpayment.', url: 'https://www.nycourts.gov/courts/nyc/housing/index.shtml', category: 'Housing — Landlord', feeAmount: '$45' },
  { formNumber: 'Answer (Housing)', name: 'Answer to Eviction Petition', description: 'Answer in person at the clerk (nonpayment: within 10 days of service) or in writing. Free help: Housing Court Answers, (212) 962-4795.', url: 'https://nycourts.gov/new-york-city-housing-court/answering-case-nyc-housing-court', category: 'Housing — Tenant', feeAmount: 'Free' },
  { formNumber: 'HP Action', name: 'HP Action for Repairs and Services', description: 'Tenant sues landlord/HPD for code violations.', url: 'https://www.nycourts.gov/courthelp/Homes/repairs.shtml', category: 'Housing — Tenant', feeAmount: 'Free' },
  { formNumber: 'OSC (Stay Eviction)', name: 'Order to Show Cause to Stay Eviction', description: 'Emergency motion to halt eviction warrant.', url: 'https://www.nycourts.gov/courts/nyc/housing/orderstoshowcause.shtml', category: 'Housing — Tenant', feeAmount: 'Free' },
  { formNumber: 'Summons (Supreme Ct.)', name: 'Supreme Court Summons (Consumer/Debt)', description: 'Initiate civil action in Supreme Court ($25k+).', url: 'https://www.nycourts.gov/forms/index.shtml', category: 'Consumer / Debt', feeAmount: '$210' },
  { formNumber: 'Mechanic\'s Lien', name: 'Notice of Mechanic\'s Lien (Lien Law §10)', description: 'Contractor lien for unpaid work.', url: 'https://dos.ny.gov/lien-law', category: 'Consumer', feeAmount: 'Varies' },
  { formNumber: 'Article 78', name: 'Article 78 Petition', description: 'Challenge an agency action (housing, benefits, licensing).', url: 'https://www.nycourts.gov/courthelp/goingtocourt/article78.shtml', category: 'Agency Review', feeAmount: '$210' },
];

export const NY_HUMAN_RIGHTS_FORMS: CourtForm[] = [
  { formNumber: 'NYSDHR Complaint', name: 'NY State Division of Human Rights Complaint', description: 'File a discrimination complaint with NYSDHR within 3 years.', url: 'https://dhr.ny.gov/complaint', category: 'Discrimination', feeAmount: 'Free' },
  { formNumber: 'NYC CHR Intake', name: 'NYC Commission on Human Rights Intake', description: 'NYC-specific discrimination, harassment, retaliation complaint.', url: 'https://www.nyc.gov/site/cchr/about/report-discrimination.page', category: 'NYC', feeAmount: 'Free' },
  { formNumber: 'EEOC Charge', name: 'EEOC Charge of Discrimination', description: 'Federal Title VII / ADA / ADEA charge (180/300-day deadline).', url: 'https://publicportal.eeoc.gov/Portal/Login.aspx', category: 'Federal', feeAmount: 'Free' },
  { formNumber: 'Pre-Complaint', name: 'NYSDHR Pre-Complaint Inquiry', description: 'Initial screening before formal NYSDHR complaint.', url: 'https://dhr.ny.gov/file-complaint', category: 'Discrimination', feeAmount: 'Free' },
  { formNumber: 'AG Civil Rights', name: 'NY Attorney General Civil Rights Complaint', description: 'Pattern-or-practice civil rights complaint to the OAG.', url: 'https://ag.ny.gov/civil-rights/complaint-form', category: 'Civil Rights', feeAmount: 'Free' },
  { formNumber: 'Voting Rights', name: 'NY Voting Rights Complaint', description: 'Report voter intimidation or access violations.', url: 'https://www.elections.ny.gov/', category: 'Voting', feeAmount: 'Free' },
  { formNumber: 'Hate Crime Report', name: 'NYS Hate Crimes Task Force Report', description: 'Report bias-motivated incidents.', url: 'https://www.criminaljustice.ny.gov/pio/hatecrime/hate-crime-list.htm', category: 'Hate Crimes', feeAmount: 'Free' },
];

export type NyCategoryKey =
  | 'criminal' | 'family' | 'divorce' | 'cps'
  | 'immigration' | 'workplace' | 'civil' | 'human-rights';

export const NY_FORMS_BY_CATEGORY: Record<NyCategoryKey, CourtForm[]> = {
  criminal: NY_CRIMINAL_FORMS,
  family: NY_FAMILY_FORMS,
  divorce: NY_DIVORCE_FORMS,
  cps: NY_CPS_FORMS,
  immigration: NY_IMMIGRATION_FORMS,
  workplace: NY_WORKPLACE_FORMS,
  civil: NY_CIVIL_FORMS,
  'human-rights': NY_HUMAN_RIGHTS_FORMS,
};

export function getNyForms(category: NyCategoryKey): CourtForm[] {
  return NY_FORMS_BY_CATEGORY[category] ?? [];
}