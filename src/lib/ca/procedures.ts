// California — Filing procedures for each legal area.
// General legal information, sourced from selfhelp.courts.ca.gov and dir.ca.gov.
// Always paired with the "legal information, not advice" disclaimer at the UI layer.
// NOT yet reviewed by a California-licensed attorney — required before marketing launch.
import type { CaCategoryKey } from './forms';
import type { ProcedureStep } from '@/lib/ny/procedures';

export interface CaFilingProcedure {
  category: CaCategoryKey;
  title: string;
  venue: string;
  fees: string;
  deadlines: string[];
  eFilingUrl?: string;
  steps: ProcedureStep[];
  sources: string[];
}

const SELF_HELP = 'https://selfhelp.courts.ca.gov';

export const CA_PROCEDURES: Record<CaCategoryKey, CaFilingProcedure> = {
  criminal: {
    category: 'criminal',
    title: 'Criminal — Dismissal and Record Clearing',
    venue: 'Superior Court in the county where you were convicted.',
    fees: 'No filing fee for a PC §1203.4 petition.',
    deadlines: [
      'PC §1203.4 dismissal: after probation is completed (or terminated early).',
      'Some convictions qualify for automatic relief under PC §1203.425 — check before filing.',
    ],
    steps: [
      { title: 'Get your record', detail: 'Request your California criminal history from the DOJ so you know every case and its outcome.', ref: 'https://oag.ca.gov/fingerprints/record-review' },
      { title: 'Check eligibility', detail: 'Use the courts\' Clean Your Record guide to see whether dismissal, reduction, or another remedy applies.', ref: `${SELF_HELP}/clean-your-record` },
      { title: 'Fill out CR-180 and CR-181', detail: 'One petition per case. Attach any required proof of completed probation.' },
      { title: 'File with the clerk', detail: 'File in the convicting court. There is no filing fee.' },
      { title: 'Serve the prosecutor', detail: 'The prosecuting agency must receive notice; the court can tell you how.' },
      { title: 'Hearing (if set)', detail: 'Some courts decide on paper; others set a hearing.' },
      { title: 'Get the signed order', detail: 'Keep certified copies. Dismissal does not erase the record but changes how it can be used.' },
    ],
    sources: [`${SELF_HELP}/clean-your-record`],
  },
  family: {
    category: 'family',
    title: 'Family — Custody, Support, and Domestic Violence Orders',
    venue: 'Superior Court (Family Division). If there is already a family case about the child in California (such as a divorce or parentage case), ask for custody or support orders in that case. Domestic violence restraining orders can be filed in the county where you live or are staying, where the other person lives, or where the abuse happened (Family Code §6301).',
    fees: 'Request for Order (FL-300): $60, or $85 to change or enforce custody or visitation. No fee in domestic violence cases or for papers filed by the local child support agency.',
    deadlines: [
      'DV temporary orders: usually decided within 1 business day of filing.',
      'Opposing papers to a Request for Order are generally due 9 court days before the hearing.',
      'Custody mediation (Child Custody Recommending Counseling) is required before most custody hearings.',
    ],
    steps: [
      { title: 'Pick the right forms', detail: 'Custody/support changes: FL-300 (+ FL-311, FL-105, FL-150). Protection from abuse: DV-100, DV-109, DV-110.' },
      { title: 'File with the family clerk', detail: 'Many courthouses have a free Family Law Facilitator or Self-Help Center that will review your forms.', ref: `${SELF_HELP}/child-custody` },
      { title: 'Serve the other parent', detail: 'Someone 18+ who is not you must serve the papers and complete a proof of service.' },
      { title: 'Attend mediation', detail: 'Required for contested custody; the mediator may make a recommendation to the judge.' },
      { title: 'Go to the hearing', detail: 'Bring copies of everything filed. The judge may make temporary or final orders.' },
      { title: 'Prepare the order', detail: 'Use the Findings and Order After Hearing forms; the order is enforceable once signed.' },
    ],
    sources: [`${SELF_HELP}/child-custody`, `${SELF_HELP}/child-support`, `${SELF_HELP}/DV-restraining-order`],
  },
  divorce: {
    category: 'divorce',
    title: 'Divorce — Dissolution of Marriage or Domestic Partnership',
    venue: 'Superior Court (Family Division) in the county where you or your spouse lives.',
    fees: 'First-paper fee $435–$450 for the petition and for the response. Fee waiver available (FW-001).',
    deadlines: [
      'Residency: one spouse must have lived in California 6 months and in the county 3 months.',
      'Your spouse has 30 days after service to file a Response (FL-120).',
      'Waiting period: divorce cannot be final until at least 6 months after service of the summons.',
    ],
    steps: [
      { title: 'Fill out the petition', detail: 'FL-100 Petition and FL-110 Summons (plus FL-105 if you have minor children).', ref: `${SELF_HELP}/divorce/start-divorce/forms` },
      { title: 'File and pay (or request a waiver)', detail: 'File with the family clerk. Keep the stamped copies.', ref: `${SELF_HELP}/divorce/start-divorce/file` },
      { title: 'Serve your spouse', detail: 'Someone 18+ (not you) serves the papers, then files FL-115 Proof of Service. The 6-month clock starts here.' },
      { title: 'Exchange financial disclosures', detail: 'FL-140, FL-142 and FL-150 — required even if you agree on everything.' },
      { title: 'Settle or go to trial', detail: 'Reach a written agreement or ask the court to decide contested issues.' },
      { title: 'Submit the judgment', detail: 'File FL-180 and attachments. The court reviews and signs.' },
    ],
    sources: [`${SELF_HELP}/divorce-california`],
  },
  cps: {
    category: 'cps',
    title: 'Juvenile Dependency (CPS) — Parents\' Rights',
    venue: 'Superior Court (Juvenile Division) in the county where the case was filed.',
    fees: 'No filing fees. If you cannot afford a lawyer, the court must appoint one when your child is placed outside your home, that is recommended, or your child is an Indian child; otherwise it may appoint one (WIC §317). The county may later ask you to repay part of the lawyer\'s cost if a financial review finds you can pay (WIC §903.1).',
    deadlines: [
      'Detention hearing: generally within 1 court day after the petition is filed when a child is removed.',
      'JV-820 Notice of Intent to File Writ: very short deadline after a 366.26 hearing is set — ask your attorney immediately.',
    ],
    steps: [
      { title: 'Ask for your appointed attorney', detail: 'You have the right to a lawyer in dependency court. Ask at your first hearing.', ref: `${SELF_HELP}/juvenile-dependency` },
      { title: 'Keep your address current', detail: 'File JV-140 so you receive every notice.' },
      { title: 'Follow the case plan', detail: 'Services ordered by the court (classes, counseling, testing) affect reunification.' },
      { title: 'Request changes when facts change', detail: 'Use JV-180 to ask for a change in placement, visitation, or services.' },
      { title: 'Protect appeal / writ rights', detail: 'Deadlines are short. Talk to your attorney the same day an adverse order is made.' },
    ],
    sources: [`${SELF_HELP}/juvenile-dependency`],
  },
  workplace: {
    category: 'workplace',
    title: 'Workplace — Wage Claims, Retaliation, Workers\' Comp',
    venue: 'California Labor Commissioner (DLSE), Division of Workers\' Compensation, Cal/OSHA, or EDD.',
    fees: 'Free to file.',
    deadlines: [
      'Wage claims: generally 3 years (statutory wages); 4 years for written contract claims.',
      'Labor Commissioner retaliation complaint: generally within 1 year.',
      'Workers\' comp: report the injury to your employer within 30 days.',
    ],
    steps: [
      { title: 'Gather records', detail: 'Pay stubs, schedules, texts, and any written policies.' },
      { title: 'File the right claim', detail: 'Unpaid wages → DLSE wage claim. Punished for complaining → retaliation complaint. Injury → DWC-1 to employer.', ref: 'https://www.dir.ca.gov/dlse/howtofilewageclaim.htm' },
      { title: 'Attend the settlement conference', detail: 'The Labor Commissioner usually holds a conference before a hearing.' },
      { title: 'Hearing and decision', detail: 'If not settled, a hearing officer decides. Either side can appeal to Superior Court.' },
    ],
    sources: ['https://www.dir.ca.gov/dlse/howtofilewageclaim.htm', 'https://www.dir.ca.gov/dwc/forms.html'],
  },
  civil: {
    category: 'civil',
    title: 'Civil — Small Claims, Evictions, Harassment Orders',
    venue: 'Superior Court in the county where the defendant lives or the dispute happened.',
    fees: 'Small claims: $30 (≤$1,500), $50 (≤$5,000), $75 (≤$12,500); $100 if you filed more than 12 small claims in the last 12 months. Fee waiver available (FW-001).',
    deadlines: [
      'Eviction: tenants have 10 court days after service to file an Answer (UD-105) — effective Jan 1, 2025 (AB 2347).',
      'Small claims limit: $12,500 for individuals, $6,250 for businesses.',
      'Small claims appeal (defendant only): 30 days after the Notice of Entry of Judgment.',
    ],
    steps: [
      { title: 'Small claims: demand payment first', detail: 'Courts expect you to ask the other side to pay before filing.', ref: `${SELF_HELP}/small-claims-california` },
      { title: 'Small claims: file SC-100', detail: 'File in the right county and pay the fee or request a waiver.', ref: `${SELF_HELP}/small-claims/start-case/file` },
      { title: 'Small claims: serve and file SC-104', detail: 'An adult who is not you must serve the defendant at least 15 days before the court date, or 20 days if they live outside the county (substituted service needs 10 days more). File SC-104 proof of service at least 5 days before the hearing.', ref: `${SELF_HELP}/small-claims/start-case/serve` },
      { title: 'Eviction: answer on time', detail: 'If served with SUM-130 and UD-100, file UD-105 within 10 court days or you can lose by default. If the papers were left with someone else or posted and mailed, service finishes later, which moves the deadline; ask the self-help center to count it.', ref: `${SELF_HELP}/eviction-tenant` },
      { title: 'Eviction: find free help', detail: 'Many counties have free tenant legal help — check your court\'s self-help center.' },
      { title: 'Go to court prepared', detail: 'Bring evidence, witnesses, and copies of everything filed.' },
    ],
    sources: [`${SELF_HELP}/small-claims-california`, `${SELF_HELP}/eviction-tenant`, `${SELF_HELP}/CH-restraining-order`],
  },
  'human-rights': {
    category: 'human-rights',
    title: 'Civil Rights — Discrimination Complaints',
    venue: 'California Civil Rights Department (CRD), EEOC, or civil court.',
    fees: 'Free to file with CRD or EEOC.',
    deadlines: [
      'CRD employment complaint (FEHA): generally 3 years from the last act.',
      'EEOC charge: 300 days in California.',
    ],
    steps: [
      { title: 'Write down what happened', detail: 'Dates, people involved, witnesses, and documents.' },
      { title: 'File an intake with CRD', detail: 'CRD complaints are usually dual-filed with the EEOC for employment claims.', ref: 'https://ccrs.calcivilrights.ca.gov/' },
      { title: 'Intake interview', detail: 'CRD decides whether to investigate or issue a right-to-sue notice.' },
      { title: 'Investigation or right-to-sue', detail: 'With a right-to-sue notice you can take the claim to court — consider talking to an attorney.' },
    ],
    sources: ['https://calcivilrights.ca.gov/complaintprocess/'],
  },
};
