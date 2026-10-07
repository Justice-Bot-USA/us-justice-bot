// California — Forms catalog
// Modular: one export per legal area, all using the shared CourtForm shape.
// Every Judicial Council form number below was checked against
// selfhelp.courts.ca.gov/jcc-form/<number> (Oct 2026).
// Sources: selfhelp.courts.ca.gov, dir.ca.gov, calcivilrights.ca.gov, edd.ca.gov, eeoc.gov
import type { CourtForm } from '@/lib/formsLibraryData';

const JCC = (form: string) => `https://selfhelp.courts.ca.gov/jcc-form/${form}`;

export const CA_CRIMINAL_FORMS: CourtForm[] = [
  { formNumber: 'CR-180', name: 'Petition for Dismissal (PC §1203.4)', description: 'Ask the court to dismiss a conviction after probation is completed.', url: JCC('CR-180'), category: 'Record Clearing', feeAmount: 'Up to $150 (county-set); waiver available', feeWaiverAvailable: true },
  { formNumber: 'CR-181', name: 'Order for Dismissal', description: 'Proposed order filed with CR-180 for the judge to sign.', url: JCC('CR-181'), category: 'Record Clearing', feeAmount: 'Free' },
  { formNumber: 'Clean Your Record', name: 'California Courts — Clean Your Record Guide', description: 'Dismissal, reduction, sealing, and automatic relief options explained by the courts.', url: 'https://selfhelp.courts.ca.gov/clean-your-record', category: 'Guides', feeAmount: 'Free' },
];

export const CA_FAMILY_FORMS: CourtForm[] = [
  { formNumber: 'FL-300', name: 'Request for Order', description: 'Ask the court to make or change custody, visitation, or support orders.', url: JCC('FL-300'), category: 'Custody / Support', feeAmount: '$60 (often free for custody/support-only)', feeWaiverAvailable: true },
  { formNumber: 'FL-311', name: 'Child Custody and Visitation (Parenting Time) Application Attachment', description: 'Describe the parenting schedule you are asking for.', url: JCC('FL-311'), category: 'Custody', feeAmount: 'Free' },
  { formNumber: 'FL-105', name: 'Declaration Under UCCJEA', description: 'Where the child has lived for the last 5 years — required in custody cases.', url: JCC('FL-105'), category: 'Custody', feeAmount: 'Free' },
  { formNumber: 'FL-150', name: 'Income and Expense Declaration', description: 'Financial disclosure used to calculate child and spousal support.', url: JCC('FL-150'), category: 'Support', feeAmount: 'Free' },
  { formNumber: 'DV-100', name: 'Request for Domestic Violence Restraining Order', description: 'Ask for protection from an abusive family or household member or partner.', url: JCC('DV-100'), category: 'Protection Orders', feeAmount: 'Free' },
  { formNumber: 'DV-109', name: 'Notice of Court Hearing (Domestic Violence Prevention)', description: 'Sets the hearing date; filed with DV-100.', url: JCC('DV-109'), category: 'Protection Orders', feeAmount: 'Free' },
  { formNumber: 'DV-110', name: 'Temporary Restraining Order', description: 'Proposed temporary order until the hearing.', url: JCC('DV-110'), category: 'Protection Orders', feeAmount: 'Free' },
];

export const CA_DIVORCE_FORMS: CourtForm[] = [
  { formNumber: 'FL-100', name: 'Petition — Marriage/Domestic Partnership', description: 'Start a divorce, legal separation, or nullity case.', url: JCC('FL-100'), category: 'Divorce', feeAmount: '$435–$450', feeWaiverAvailable: true },
  { formNumber: 'FL-110', name: 'Summons (Family Law)', description: 'Served on your spouse with the petition; includes automatic restraining orders.', url: JCC('FL-110'), category: 'Divorce' },
  { formNumber: 'FL-115', name: 'Proof of Service of Summons', description: 'Shows the court your spouse was served. The 6-month waiting period starts on service.', url: JCC('FL-115'), category: 'Divorce' },
  { formNumber: 'FL-120', name: 'Response — Marriage/Domestic Partnership', description: 'Respond to a divorce petition within 30 days of service.', url: JCC('FL-120'), category: 'Divorce', feeAmount: '$435–$450', feeWaiverAvailable: true },
  { formNumber: 'FL-140', name: 'Declaration of Disclosure', description: 'Mandatory financial disclosure exchanged between spouses.', url: JCC('FL-140'), category: 'Financial' },
  { formNumber: 'FL-142', name: 'Schedule of Assets and Debts', description: 'Lists community and separate property and debts.', url: JCC('FL-142'), category: 'Financial' },
  { formNumber: 'FL-150', name: 'Income and Expense Declaration', description: 'Required with disclosure; used for support.', url: JCC('FL-150'), category: 'Financial' },
  { formNumber: 'FL-180', name: 'Judgment', description: 'Final judgment submitted for the judge to sign.', url: JCC('FL-180'), category: 'Divorce' },
];

export const CA_CPS_FORMS: CourtForm[] = [
  { formNumber: 'JV-180', name: 'Request to Change Court Order', description: 'Ask the juvenile court to change an order (e.g., placement, visitation, services) based on new facts.', url: JCC('JV-180'), category: 'Modification', feeAmount: 'Free' },
  { formNumber: 'JV-140', name: 'Notification of Mailing Address', description: 'Keep the court and agency able to reach you — missed notices can cost you hearings.', url: JCC('JV-140'), category: 'Case Management', feeAmount: 'Free' },
  { formNumber: 'JV-285', name: 'Relative Information', description: 'Relatives share information about the child with the court.', url: JCC('JV-285'), category: 'Placement', feeAmount: 'Free' },
  { formNumber: 'JV-820', name: 'Notice of Intent to File Writ Petition (WIC §366.26)', description: 'Short-deadline filing to seek review when the court sets a permanency (366.26) hearing.', url: JCC('JV-820'), category: 'Appeals / Writs', feeAmount: 'Free' },
];

export const CA_WORKPLACE_FORMS: CourtForm[] = [
  { formNumber: 'DLSE 1', name: 'Labor Commissioner Wage Claim', description: 'Claim unpaid wages, overtime, or final pay with the Labor Commissioner (DLSE).', url: 'https://www.dir.ca.gov/dlse/howtofilewageclaim.htm', category: 'Wage Claims', feeAmount: 'Free' },
  { formNumber: 'Retaliation Complaint', name: 'Labor Commissioner Retaliation Complaint', description: 'Report being punished for asserting workplace rights.', url: 'https://www.dir.ca.gov/dlse/howtofileretaliationcomplaint.htm', category: 'Retaliation', feeAmount: 'Free' },
  { formNumber: 'DWC-1', name: 'Workers\' Compensation Claim Form', description: 'Give to your employer to open a workers\' comp claim after a work injury.', url: 'https://www.dir.ca.gov/dwc/DWCForm1.pdf', category: 'Workers Comp', feeAmount: 'Free' },
  { formNumber: 'Cal/OSHA', name: 'Cal/OSHA Safety Complaint', description: 'Report unsafe working conditions.', url: 'https://www.dir.ca.gov/dosh/complaint.htm', category: 'Safety', feeAmount: 'Free' },
  { formNumber: 'EDD UI', name: 'Unemployment Insurance Claim (EDD)', description: 'Apply for unemployment benefits.', url: 'https://edd.ca.gov/en/unemployment/', category: 'Unemployment', feeAmount: 'Free' },
];

export const CA_CIVIL_FORMS: CourtForm[] = [
  { formNumber: 'SC-100', name: 'Plaintiff\'s Claim and Order to Go to Small Claims Court', description: 'Sue for up to $12,500 (individuals) or $6,250 (businesses).', url: JCC('SC-100'), category: 'Small Claims', feeAmount: '$30 / $50 / $75 by amount', feeWaiverAvailable: true },
  { formNumber: 'SC-104', name: 'Proof of Service (Small Claims)', description: 'Shows the defendant was served before the hearing.', url: JCC('SC-104'), category: 'Small Claims' },
  { formNumber: 'SC-120', name: 'Defendant\'s Claim', description: 'Sue the plaintiff back in the same small claims case.', url: JCC('SC-120'), category: 'Small Claims', feeAmount: '$30 / $50 / $75 by amount', feeWaiverAvailable: true },
  { formNumber: 'SC-130', name: 'Notice of Entry of Judgment', description: 'The court\'s decision; starts the appeal clock.', url: JCC('SC-130'), category: 'Small Claims' },
  { formNumber: 'SC-140', name: 'Notice of Appeal (Small Claims)', description: 'Only the defendant (or plaintiff on a defendant\'s claim) may appeal; 30 days.', url: JCC('SC-140'), category: 'Small Claims', feeAmount: '$75' },
  { formNumber: 'UD-105', name: 'Answer — Unlawful Detainer', description: 'Tenant\'s answer to an eviction lawsuit. Due within 10 court days of service.', url: JCC('UD-105'), category: 'Housing — Tenant', feeAmount: 'First-paper fee; waiver available', feeWaiverAvailable: true },
  { formNumber: 'CP10.5', name: 'Prejudgment Claim of Right to Possession', description: 'For occupants not named in the eviction who want to be heard.', url: JCC('CP10.5'), category: 'Housing — Tenant' },
  { formNumber: 'UD-100', name: 'Complaint — Unlawful Detainer', description: 'Landlord\'s eviction complaint (so tenants can read what they were served).', url: JCC('UD-100'), category: 'Housing — Landlord' },
  { formNumber: 'SUM-130', name: 'Summons — Eviction', description: 'Served with the complaint; states the 10-court-day response deadline.', url: JCC('SUM-130'), category: 'Housing' },
  { formNumber: 'CH-100', name: 'Request for Civil Harassment Restraining Orders', description: 'Protection from a neighbor, coworker, or other non-family harasser.', url: JCC('CH-100'), category: 'Restraining Orders', feeAmount: 'Fee may apply; free if violence, threats, or stalking alleged' },
  { formNumber: 'FW-001', name: 'Request to Waive Court Fees', description: 'Ask the court to waive filing fees if you receive benefits or have low income.', url: JCC('FW-001'), category: 'Fee Waiver', feeAmount: 'Free' },
  { formNumber: 'FW-003', name: 'Order on Court Fee Waiver', description: 'Proposed order filed with FW-001.', url: JCC('FW-003'), category: 'Fee Waiver', feeAmount: 'Free' },
];

export const CA_HUMAN_RIGHTS_FORMS: CourtForm[] = [
  { formNumber: 'CRD Intake', name: 'California Civil Rights Department Complaint', description: 'Employment, housing, and public accommodation discrimination under FEHA and the Unruh Act.', url: 'https://ccrs.calcivilrights.ca.gov/', category: 'Discrimination', feeAmount: 'Free' },
  { formNumber: 'EEOC Charge', name: 'EEOC Charge of Discrimination', description: 'Federal Title VII / ADA / ADEA charge (300-day deadline in California).', url: 'https://publicportal.eeoc.gov/', category: 'Federal', feeAmount: 'Free' },
  { formNumber: 'AG Complaint', name: 'California Attorney General Consumer Complaint', description: 'Report unfair business practices to the AG.', url: 'https://oag.ca.gov/contact/consumer-complaint-against-business-or-company', category: 'Consumer', feeAmount: 'Free' },
];

export type CaCategoryKey =
  | 'criminal' | 'family' | 'divorce' | 'cps'
  | 'workplace' | 'civil' | 'human-rights';

export const CA_FORMS_BY_CATEGORY: Record<CaCategoryKey, CourtForm[]> = {
  criminal: CA_CRIMINAL_FORMS,
  family: CA_FAMILY_FORMS,
  divorce: CA_DIVORCE_FORMS,
  cps: CA_CPS_FORMS,
  workplace: CA_WORKPLACE_FORMS,
  civil: CA_CIVIL_FORMS,
  'human-rights': CA_HUMAN_RIGHTS_FORMS,
};

export function getCaForms(category: CaCategoryKey): CourtForm[] {
  return CA_FORMS_BY_CATEGORY[category] ?? [];
}
