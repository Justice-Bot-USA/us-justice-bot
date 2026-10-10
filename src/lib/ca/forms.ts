// California — Forms catalog
// Modular: one export per legal area, all using the shared CourtForm shape.
// Every Judicial Council form number below was checked against
// selfhelp.courts.ca.gov/jcc-form/<number> (Oct 2026). The personal-injury forms, including the
// DGS government claim forms and the DMV SR-1, were checked in Oct 2026; their fees come from the
// Statewide Civil Fee Schedule effective January 1, 2026.
// Sources: selfhelp.courts.ca.gov, courts.ca.gov, dir.ca.gov, calcivilrights.ca.gov, edd.ca.gov,
// eeoc.gov, dgs.ca.gov, dmv.ca.gov, calbar.ca.gov
import type { CourtForm } from '@/lib/formsLibraryData';

const JCC = (form: string) => `https://selfhelp.courts.ca.gov/jcc-form/${form}`;

export const CA_CRIMINAL_FORMS: CourtForm[] = [
  { formNumber: 'CR-180', name: 'Petition for Dismissal (PC §1203.4)', description: 'Ask the court to dismiss a conviction after probation is completed.', url: JCC('CR-180'), category: 'Record Clearing', feeAmount: 'No filing fee', feeWaiverAvailable: false },
  { formNumber: 'CR-181', name: 'Order for Dismissal', description: 'Proposed order filed with CR-180 for the judge to sign.', url: JCC('CR-181'), category: 'Record Clearing', feeAmount: 'Free' },
  { formNumber: 'Clean Your Record', name: 'California Courts — Clean Your Record Guide', description: 'Dismissal, reduction, sealing, and automatic relief options explained by the courts.', url: 'https://selfhelp.courts.ca.gov/clean-your-record', category: 'Guides', feeAmount: 'Free' },
];

export const CA_FAMILY_FORMS: CourtForm[] = [
  { formNumber: 'FL-300', name: 'Request for Order', description: 'Ask the court to make or change custody, visitation, or support orders.', url: JCC('FL-300'), category: 'Custody / Support', feeAmount: '$60; $85 to change custody or visitation (free in domestic violence cases)', feeWaiverAvailable: true },
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
  { formNumber: 'UD-105', name: 'Answer — Unlawful Detainer', description: 'Tenant\'s answer to an eviction lawsuit. Due within 10 court days of service.', url: JCC('UD-105'), category: 'Housing — Tenant', feeAmount: 'First-paper fee', feeWaiverAvailable: true },
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

export const CA_PERSONAL_INJURY_FORMS: CourtForm[] = [
  // Start a case in superior court
  { formNumber: 'PLD-PI-001', name: 'Complaint — Personal Injury, Property Damage, Wrongful Death', description: 'Starts a personal injury, property damage or wrongful death lawsuit. At least one cause-of-action attachment is required.', url: JCC('PLD-PI-001'), category: 'Start a Case', feeAmount: 'First-paper fee: $225 (up to $10,000), $370 (over $10,000 up to $35,000), $435 (over $35,000). Different in Riverside ($255 / $395 / $450), San Bernardino ($240 / $380 / $435) and San Francisco ($225 / $370 / $450).', feeWaiverAvailable: true },
  { formNumber: 'SUM-100', name: 'Summons', description: 'Tells the defendant a case has started and what can happen if no response is filed within 30 days.', url: JCC('SUM-100'), category: 'Start a Case' },
  { formNumber: 'CM-010', name: 'Civil Case Cover Sheet', description: 'Basic information about the case, filed at the start of all civil cases except family law.', url: JCC('CM-010'), category: 'Start a Case' },
  { formNumber: 'PLD-PI-001(1)', name: 'Cause of Action — Motor Vehicle', description: 'Attachment to PLD-PI-001 for a claim that someone was negligent in a motor vehicle accident.', url: JCC('PLD-PI-001(1)'), category: 'Cause of Action' },
  { formNumber: 'PLD-PI-001(2)', name: 'Cause of Action — General Negligence', description: 'Attachment to PLD-PI-001 for a claim that the other side was negligent in some way and you were harmed as a result.', url: JCC('PLD-PI-001(2)'), category: 'Cause of Action' },
  { formNumber: 'PLD-PI-001(3)', name: 'Cause of Action — Intentional Tort', description: 'Attachment to PLD-PI-001 for a claim that someone intentionally harmed you, such as an assault or battery.', url: JCC('PLD-PI-001(3)'), category: 'Cause of Action' },
  { formNumber: 'PLD-PI-001(4)', name: 'Cause of Action — Premises Liability', description: 'Attachment to PLD-PI-001 for a claim that a condition of someone\'s property harmed you.', url: JCC('PLD-PI-001(4)'), category: 'Cause of Action' },
  { formNumber: 'PLD-PI-001(5)', name: 'Cause of Action — Products Liability', description: 'Attachment to PLD-PI-001 for a claim that a defective product the defendant made or sold harmed you.', url: JCC('PLD-PI-001(5)'), category: 'Cause of Action' },
  { formNumber: 'PLD-PI-001(6)', name: 'Exemplary Damages Attachment', description: 'Attachment to PLD-PI-001 used only if you are asking for exemplary (punitive) damages.', url: JCC('PLD-PI-001(6)'), category: 'Cause of Action' },
  // Service
  { formNumber: 'POS-010', name: 'Proof of Service of Summons', description: 'The server records who was served, and when, where and how. File it within 60 days of filing the complaint.', url: JCC('POS-010'), category: 'Service' },
  { formNumber: 'POS-015', name: 'Notice and Acknowledgment of Receipt — Civil', description: 'Used for service by mail. The defendant must sign and return it, so the courts say it often does not work.', url: JCC('POS-015'), category: 'Service' },
  // Default
  { formNumber: 'CIV-050', name: 'Statement of Damages (Personal Injury or Wrongful Death)', description: 'Tells the defendant the maximum damages sought. Must be served before a default can be taken. Filed with the court only if the defendant defaults.', url: JCC('CIV-050'), category: 'Default' },
  { formNumber: 'CIV-100', name: 'Request for Entry of Default (Application to Enter Default)', description: 'Asks the court to enter a default when the defendant has not responded. Can also request a default judgment.', url: JCC('CIV-100'), category: 'Default' },
  { formNumber: 'JUD-100', name: 'Judgment', description: 'States the court\'s final decision in a limited or unlimited civil case, including a default judgment.', url: JCC('JUD-100'), category: 'Default' },
  // If you are sued
  { formNumber: 'PLD-PI-003', name: 'Answer — Personal Injury, Property Damage, Wrongful Death', description: 'Defendant\'s response that challenges a personal injury complaint and lists possible defenses. Due within 30 days of service.', url: JCC('PLD-PI-003'), category: 'Response (Defendant)', feeAmount: 'First-paper fee: $225 (up to $10,000), $370 (over $10,000 up to $35,000), $435 (over $35,000). Different in Riverside ($255 / $395 / $450), San Bernardino ($240 / $380 / $435) and San Francisco ($225 / $370 / $450).', feeWaiverAvailable: true },
  { formNumber: 'PLD-050', name: 'General Denial', description: 'Denies the complaint and requires each allegation to be proven. Allowed only if the complaint is not verified, or in a limited civil case (CCP §431.30(d)).', url: JCC('PLD-050'), category: 'Response (Defendant)', feeAmount: 'First-paper fee: $225 (up to $10,000), $370 (over $10,000 up to $35,000), $435 (over $35,000). Different in Riverside ($255 / $395 / $450), San Bernardino ($240 / $380 / $435) and San Francisco ($225 / $370 / $450).', feeWaiverAvailable: true },
  { formNumber: 'PLD-PI-002', name: 'Cross-Complaint — Personal Injury, Property Damage, Wrongful Death', description: 'Lets a defendant sue the plaintiff or bring in another party in the same personal injury case.', url: JCC('PLD-PI-002'), category: 'Response (Defendant)' },
  // Small claims
  { formNumber: 'SC-100', name: 'Plaintiff\'s Claim and ORDER to Go to Small Claims Court', description: 'Starts a small claims case for up to $12,500 (individuals) or $6,250 (businesses). Lawyers cannot appear for you in court.', url: JCC('SC-100'), category: 'Small Claims', feeAmount: '$30 (up to $1,500) / $50 (up to $5,000) / $75 (up to $12,500); $100 if you filed more than 12 small claims in California in the past 12 months', feeWaiverAvailable: true },
  { formNumber: 'SC-104', name: 'Proof of Service (Small Claims)', description: 'The server signs it to show the defendant was served with the small claims papers.', url: JCC('SC-104'), category: 'Small Claims' },
  // Fee waiver
  { formNumber: 'FW-001', name: 'Request to Waive Court Fees', description: 'Ask the court to waive filing and other court fees if you get public benefits, have low income, or cannot pay for basic needs and court fees. If you later get money from the case, the court may order the waived fees paid, after notice and a chance for a hearing.', url: JCC('FW-001'), category: 'Fee Waiver', feeAmount: 'Free' },
  { formNumber: 'FW-003', name: 'Order on Court Fee Waiver (Superior Court)', description: 'The court\'s decision on your fee waiver request. File it with FW-001.', url: JCC('FW-003'), category: 'Fee Waiver', feeAmount: 'Free' },
  // Claims against a government agency
  { formNumber: 'DGS ORIM 006', name: 'Government Claim (State of California)', description: 'Claim against a California state agency or employee, presented to the DGS Government Claims Program before suing. It can also be filed online from the DGS File a Claim page. Caltrans claims of $12,500 or less, and claims of $1,000 or less against the CHP, DMV, Department of Consumer Affairs, CDCR or Department of State Hospitals, go directly to that agency instead. Claims against local agencies (city, county, school district, transit) use that agency\'s own claim form.', url: 'https://www.documents.dgs.ca.gov/dgs/fmc/dgs/orim006.pdf', category: 'Government Claim', feeAmount: '$25 per claimant (paid to DGS); waiver or reduction available with ORIM 005', feeWaiverAvailable: true },
  { formNumber: 'DGS ORIM 005', name: 'Fee Waiver or Fee Reduction Request (Government Claims Program)', description: 'Ask DGS to waive or reduce the $25 state claim filing fee.', url: 'https://www.documents.dgs.ca.gov/dgs/fmc/dgs/orim005.pdf', category: 'Government Claim', feeAmount: 'Free' },
  // Car crash report
  { formNumber: 'SR-1', name: 'Report of Traffic Accident Occurring in California (DMV)', description: 'Each driver must file it within 10 days of a crash involving injury, death, or property damage over $1,000 to any one person, whoever was at fault. Not required for a vehicle owned or leased by, or under the direction of, a government agency (Veh. Code §16000). Can be filed online.', url: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/', category: 'DMV' },
  // Official guides and free or low-cost help
  { formNumber: 'Personal Injury Guide', name: 'California Courts — Personal Injury Cases', description: 'The courts\' self-help overview: deadlines, who to sue, where to file, evidence, and the forms for plaintiffs and defendants.', url: 'https://selfhelp.courts.ca.gov/civil-lawsuit/personal-injury', category: 'Guides', feeAmount: 'Free' },
  { formNumber: 'Government Claim Guide', name: 'California Courts — Ask a Government Agency to Pay You', description: 'The courts\' guide to claim deadlines, the 45-day response period, and suing after a denial.', url: 'https://selfhelp.courts.ca.gov/civil-lawsuit/government-claim', category: 'Guides', feeAmount: 'Free' },
  { formNumber: 'State Bar LRS', name: 'State Bar of California — Find a Lawyer Referral Service', description: 'Directory of State Bar-certified lawyer referral services by county. Initial consultation is free or reduced-fee.', url: 'https://www.calbar.ca.gov/public/find-legal-professionals/find-lawyer-referral-service', category: 'Legal Help', feeAmount: 'Free to search' },
  { formNumber: 'LawHelpCA', name: 'LawHelpCA — Find Legal Help', description: 'Directory of legal aid offices and nonprofit groups in California, maintained by the Legal Aid Association of California.', url: 'https://www.lawhelpca.org/find-legal-help', category: 'Legal Help', feeAmount: 'Free' },
];

// Form guides a personal-injury funnel delivers, most relevant first: the forms that start a
// superior court case (with the two most common cause-of-action attachments), service, the
// Statement of Damages and the fee waiver, then the rest. Guides and help directories are not
// forms, so they are left out.
const CA_PI_FUNNEL_ORDER = [
  'PLD-PI-001', 'PLD-PI-001(1)', 'PLD-PI-001(2)', 'SUM-100', 'CM-010', 'POS-010', 'CIV-050', 'FW-001',
  'FW-003', 'SR-1', 'DGS ORIM 006', 'DGS ORIM 005', 'SC-100', 'SC-104', 'PLD-PI-003', 'PLD-050',
];
export const CA_PERSONAL_INJURY_FUNNEL_FORMS: CourtForm[] = [
  ...CA_PI_FUNNEL_ORDER.flatMap((n) => CA_PERSONAL_INJURY_FORMS.filter((f) => f.formNumber === n)),
  ...CA_PERSONAL_INJURY_FORMS.filter(
    (f) => !CA_PI_FUNNEL_ORDER.includes(f.formNumber) && f.category !== 'Guides' && f.category !== 'Legal Help',
  ),
];

export type CaCategoryKey =
  | 'criminal' | 'family' | 'divorce' | 'cps'
  | 'workplace' | 'civil' | 'human-rights' | 'personal-injury';

export const CA_FORMS_BY_CATEGORY: Record<CaCategoryKey, CourtForm[]> = {
  criminal: CA_CRIMINAL_FORMS,
  family: CA_FAMILY_FORMS,
  divorce: CA_DIVORCE_FORMS,
  cps: CA_CPS_FORMS,
  workplace: CA_WORKPLACE_FORMS,
  civil: CA_CIVIL_FORMS,
  'human-rights': CA_HUMAN_RIGHTS_FORMS,
  'personal-injury': CA_PERSONAL_INJURY_FORMS,
};

export function getCaForms(category: CaCategoryKey): CourtForm[] {
  return CA_FORMS_BY_CATEGORY[category] ?? [];
}
