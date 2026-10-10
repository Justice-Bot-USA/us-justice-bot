// New York — Filing procedures for each legal area.
// General legal information. Always paired with the "legal information, not advice"
// disclaimer at the UI layer.
// NOT yet reviewed by a New York-licensed attorney — required before marketing launch.
import type { NyCategoryKey } from './forms';

export interface ProcedureStep {
  title: string;
  detail: string;
  /** Optional reference URL (statute, court page, or form). */
  ref?: string;
}

export interface FilingProcedure {
  category: NyCategoryKey;
  title: string;
  venue: string;
  fees: string;
  deadlines: string[];
  eFilingUrl?: string;
  steps: ProcedureStep[];
  sources: string[];
}

const NYSCEF = 'https://iapps.courts.state.ny.us/nyscef/HomePage';

export const NY_PROCEDURES: Record<NyCategoryKey, FilingProcedure> = {
  criminal: {
    category: 'criminal',
    title: 'Criminal — Sealing, Vacatur, and Appeals',
    venue: 'County Court or Supreme Court (Criminal Term) where you were convicted.',
    fees: 'Most post-conviction motions are free. No fee to file a criminal Notice of Appeal; you can ask for a free assigned appellate lawyer.',
    deadlines: [
      'Notice of Appeal: 30 days from sentencing (CPL §460.10).',
      'CPL §160.59 sealing: 10 years from sentence/release.',
      'Clean Slate Act (CPL §160.57, in effect since Nov 16, 2024): eligible convictions are sealed automatically, misdemeanors 3 years and felonies 8 years after sentencing or release from incarceration, whichever is later. Courts have until Nov 16, 2027 to finish sealing.',
      'CPL §440.10 motion: no statutory deadline, but raise promptly.',
    ],
    steps: [
      { title: 'Pull your RAP sheet', detail: 'Request from NYS DCJS so you know which convictions exist and whether they qualify.', ref: 'https://www.criminaljustice.ny.gov/ojis/recordreview.htm' },
      { title: 'Check for automatic Clean Slate sealing', detail: 'Under CPL §160.57 most convictions qualify for automatic sealing once the waiting period passes (3 years for a misdemeanor, 8 for a felony, counted from sentencing or release from incarceration, whichever is later), you are not on probation, parole, or post-release supervision, and no new charge is pending. A new conviction before sealing restarts the waiting period. Sex offenses and non-drug class A felonies are excluded. You do not need to file anything. Courts have until Nov 16, 2027 to finish sealing, so yours may not be sealed yet; check your RAP sheet with DCJS. Sealed records stay available to police, courts and some fingerprint-based background checks (for example, jobs with children or vulnerable people, and gun licenses).', ref: 'https://www.nycourts.gov/cleanslate' },
      { title: 'Confirm eligibility', detail: 'CPL §160.59 covers up to 2 convictions, max one felony, none violent or sex offenses.' },
      { title: 'Prepare the motion + supporting affidavits', detail: 'Include certificate of disposition for every prior conviction.' },
      { title: 'Serve the District Attorney', detail: 'DA has 45 days to respond and may consent or oppose.' },
      { title: 'File with the sentencing court', detail: 'File the motion with the clerk; request a hearing if DA opposes.' },
      { title: 'Attend hearing (if any)', detail: 'Court weighs rehabilitation, time elapsed, and victim input.' },
      { title: 'Obtain sealing order', detail: 'Court forwards order to DCJS and arresting agency.' },
    ],
    sources: ['https://www.nycourts.gov/help/criminal/criminal-records-sealing', 'https://www.nycourts.gov/cleanslate'],
  },
  family: {
    category: 'family',
    title: 'Family — Custody, Visitation, Support, Orders of Protection',
    venue: 'NY Family Court, usually in the county where the child lives or where either party lives. Support petitions: the county where either party lives (FCA §421). Family offense (order of protection) petitions: the county where the incident happened or where either party lives, including a shelter (FCA §818).',
    fees: 'Free. Family Court does not charge filing fees.',
    deadlines: [
      'Family Offense (Order of Protection): emergency relief available same-day.',
      'Support modification: substantial change in circumstances, 3 years since the last order, or a 15% change in either parent\'s income (FCA §451).',
      'Custody modification: change in circumstances affecting child\'s best interests.',
    ],
    steps: [
      { title: 'Choose the right petition', detail: 'Custody (GF-17), Visitation (GF-17), Custody/Visitation Modification (GF-40), Support (4-3), Family Offense (8-2), or Support Modification (4-11).' },
      { title: 'File at the Family Court intake clerk', detail: 'Walk-ins accepted; many counties offer Petition Room help.' },
      { title: 'Service of process', detail: 'Court issues a summons that must be delivered to the respondent before the court date: at least 8 days before for support petitions (FCA §427), at least 24 hours before for family offense petitions (FCA §826). Follow the service instructions on your summons.' },
      { title: 'Initial appearance', detail: 'Judge may issue temporary orders, refer to mediation, or appoint an Attorney for the Child.' },
      { title: 'Discovery / forensic eval (if ordered)', detail: 'Custody cases may include 18-B counsel, supervised visitation, or 730 evaluations.' },
      { title: 'Trial or settlement', detail: 'Many cases settle on consent. Trials are bench trials before the judge.' },
      { title: 'Final order and enforcement', detail: 'Violation petitions enforce; appeals run to the Appellate Division within 30 days.' },
    ],
    sources: ['https://www.nycourts.gov/help/family-issues-divorce'],
  },
  divorce: {
    category: 'divorce',
    title: 'Divorce — Uncontested and Contested',
    venue: 'NY Supreme Court in the county of residence (DRL §230 residency rules apply).',
    fees: 'Index Number $210, RJI $95, Note of Issue $30. Poor-Person relief available.',
    eFilingUrl: NYSCEF,
    deadlines: [
      'Residency (DRL §230): usually 1 or 2 years of continuous residence before filing, depending on your ties to New York; no minimum if the grounds happened in New York and both spouses live here when the case is filed.',
      'Defendant has 20 days (personal service) or 30 days (other) to answer.',
      'Statement of Net Worth and financial disclosure due at least 10 days before the preliminary conference (22 NYCRR 202.16(f)).',
    ],
    steps: [
      { title: 'Buy an Index Number', detail: 'County Clerk issues Index Number ($210); required to file anything.' },
      { title: 'Prepare the uncontested packet', detail: 'Start with UD-1 (Summons with Notice) or UD-1a with UD-2 (Verified Complaint). The packet also includes UD-3 to UD-7, UD-9 to UD-14, the UD-8 income, maintenance and child support worksheets if needed, and the UD-4 barriers-to-remarriage statement in every case. You can fill UD-1 and UD-2 here.' },
      { title: 'Or use the court\'s free DIY program', detail: 'NY Courts runs a free online program that asks questions and prepares the whole uncontested packet.', ref: 'https://www.nycourts.gov/help/diy-forms/uncontested-divorce-program' },
      { title: 'Serve the defendant', detail: 'Personal service required for divorce. Use a process server who is not a party.' },
      { title: 'Wait the answer period', detail: '20 or 30 days depending on service method.' },
      { title: 'File the calendaring papers', detail: 'Request for Judicial Intervention (RJI) and Note of Issue for uncontested calendar.' },
      { title: 'Submit judgment package', detail: 'Findings of Fact (UD-10) + Judgment of Divorce (UD-11) to the matrimonial clerk.' },
      { title: 'Judgment signed and entered', detail: 'Once signed, serve Notice of Entry on the other party — divorce is final on entry, not service.' },
    ],
    sources: ['https://www.nycourts.gov/divorce-resources'],
  },
  cps: {
    category: 'cps',
    title: 'CPS / Article 10 — Defending Neglect and Abuse Cases',
    venue: 'Family Court (Article 10 part) in the county where the child resides.',
    fees: 'Free. 18-B (assigned) counsel available for indigent parents.',
    deadlines: [
      '§1028 Application: must be heard within 3 court days of demand.',
      'Indicated SCR report appeal: 90 days from notice (OCFS).',
      'Permanency hearings: the first must start no later than 6 months after the date 60 days after removal (about 8 months), then at least every 6 months (FCA §1089).',
    ],
    steps: [
      { title: 'Request 18-B counsel at first appearance', detail: 'Do not waive counsel. ACS / DSS will already have an attorney present.' },
      { title: 'Demand a §1028 hearing immediately', detail: 'Forces ACS/DSS to prove imminent risk to continue removal.' },
      { title: 'Comply with court-ordered services', detail: 'Random drug screens, parenting classes, mental health eval as ordered.' },
      { title: 'File OCFS appeal in parallel', detail: 'Indicated SCR reports are appealed separately to OCFS — 90-day deadline.' },
      { title: 'Push for kinship placement', detail: 'Ask the court to place your child with a relative or family friend (FCA §1017).' },
      { title: 'Attend every permanency hearing', detail: 'The first must be held no later than about 8 months after removal, then at least every 6 months. Goal can shift from return-to-parent to TPR.' },
      { title: 'Trial (Fact-Finding) or consent disposition', detail: 'ACS must prove abuse or neglect by a preponderance of the evidence (FCA §1046). Clear and convincing evidence is required only for severe or repeated abuse findings and termination of parental rights.' },
    ],
    sources: ['https://www.nycourts.gov/new-york-city-family-court/child-protective-proceedings', 'https://ocfs.ny.gov/programs/cps/'],
  },
  immigration: {
    category: 'immigration',
    title: 'Immigration — Filings in NY and EOIR Removal Defense',
    venue: 'USCIS service centers; EOIR — NY Immigration Court (Federal Plaza, Broadway, Varick St.).',
    fees: 'See uscis.gov fee schedule; many fees waivable via I-912.',
    deadlines: [
      'Asylum (I-589): within 1 year of arrival.',
      'Motion to Reopen (EOIR): typically 90 days from final order.',
      'EAD renewal: file 180 days before expiration.',
      'U-visa: no deadline to file the I-918, but the law enforcement certification (Supplement B) must be signed within the 6 months before you file (8 CFR 214.14(c)(2)(i)).',
    ],
    steps: [
      { title: 'Confirm immigration status and any prior orders', detail: 'Pull your EOIR record (1-800-898-7180) and FOIA your A-file if in proceedings.' },
      { title: 'Choose the right relief', detail: 'Family petitions, asylum, U/T visa, cancellation of removal, adjustment, DACA renewal.' },
      { title: 'Assemble evidence', detail: 'Identity, relationships, country conditions, certified translations, supporting declarations.' },
      { title: 'File with the correct agency', detail: 'USCIS for affirmative cases; EOIR for defensive cases in immigration court.' },
      { title: 'Biometrics + interview', detail: 'Attend USCIS biometrics within 30 days of notice; bring originals to interview.' },
      { title: 'EOIR hearings', detail: 'Master calendar then individual merits. NY immigration courts use WebEx for many hearings.' },
      { title: 'Appeal if denied', detail: 'BIA appeal within 30 days; Second Circuit petition for review within 30 days of BIA decision.' },
    ],
    sources: ['https://www.uscis.gov/forms/all-forms', 'https://www.justice.gov/eoir'],
  },
  workplace: {
    category: 'workplace',
    title: 'Workplace — Wage Theft, UI, Workers Comp, PFL, Safety',
    venue: 'NYS DOL / WCB / your employer\'s Paid Family Leave insurance carrier / NYC DCWP — most are administrative, not court.',
    fees: 'Free across all NY labor agencies.',
    deadlines: [
      'Wage claim (NYSDOL): 6 years from non-payment.',
      'WTPA private suit: 6 years.',
      'Workers Comp: notify employer within 30 days; file C-3 within 2 years.',
      'UI: file as soon as separation occurs; backdating limited.',
    ],
    steps: [
      { title: 'Document the violation', detail: 'Pay stubs, schedules, texts, hours worked, WTPA pay rate notice at hire (DOL templates such as LS 54 to LS 59).' },
      { title: 'Pick the correct agency', detail: 'NYSDOL (wages), WCB (injury), your employer\'s PFL insurance carrier (PFL benefits; WCB for PFL job protection/retaliation), NYC DCWP (sick/safe time, fair workweek).' },
      { title: 'File the claim form', detail: 'LS 223 for wages, C-3 for comp, PFL-1 (to the PFL carrier) for paid family leave, UI online for unemployment.' },
      { title: 'Cooperate with investigation', detail: 'Respond to information requests within deadlines; keep copies of everything.' },
      { title: 'Hearing (if contested)', detail: 'NYSDOL informal conference; WCB holds hearings before a Workers\' Compensation Law Judge, including for Paid Family Leave discrimination/retaliation complaints (first ask your employer to reinstate you on PFL-DC-119; if they do not, file PFL-DC-120 with the WCB). A denied PFL benefit claim goes to arbitration through National Arbitration and Mediation (NAM), not a hearing.' },
      { title: 'Determination and appeal', detail: 'UI appeals to ALJ then Appeal Board; WCB to Board Panel then Appellate Division 3rd Dept.' },
      { title: 'Consider private suit in parallel', detail: 'NYLL §198 allows liquidated damages + attorney fees in court; statute of limitations is 6 years.' },
    ],
    sources: ['https://dol.ny.gov', 'https://www.wcb.ny.gov', 'https://paidfamilyleave.ny.gov'],
  },
  civil: {
    category: 'civil',
    title: 'Civil — Small Claims, Housing, Consumer, Article 78',
    venue: 'Civil Court (NYC), City/Town/Village Court (outside NYC), Housing Court, or Supreme Court.',
    fees: 'Small claims $15–$20 in NYC and City Courts, $10–$15 in Town and Village Courts; Housing Court $45; Supreme Court Index Number $210; Article 78 $210 + $95 RJI.',
    eFilingUrl: NYSCEF,
    deadlines: [
      'Small claims default judgment: ask the court to vacate it within 1 year after you were served with a copy of the judgment, for an excusable default (CPLR 5015(a)(1)); no time limit if the summons was never properly served.',
      'Housing, nonpayment case: in NYC Housing Court, and in other courts whose rules adopt RPAPL 732, answer within 10 days of being served, in person at the clerk or in writing. The notice of petition must say if this applies (RPAPL 732(4)).',
      'Housing, holdover cases, and nonpayment cases in courts that do not use RPAPL 732: answer at the first court date, orally or in writing (RPAPL 743).',
      'Article 78: 4 months from final agency action.',
      'Breach of contract: generally 6 years, but a lawsuit against a consumer over a consumer credit debt (such as a credit card or personal loan) must be started within 3 years (CPLR 214-i). Once that time runs out, a later payment does not restart it. Consumer fraud: 3 years.',
    ],
    steps: [
      { title: 'Pick the right court', detail: 'Small Claims limits: $10,000 in NYC Civil Court, $5,000 in City Courts (and District Courts in Nassau and Suffolk), $3,000 in Town and Village Courts. NYC Civil Court hears claims up to $50,000 (CCA §202). Outside NYC, City Courts hear up to $15,000 (UCCA §202) and County Courts up to $25,000 (Judiciary Law §190). Larger claims go to Supreme Court.' },
      { title: 'Draft the claim or petition', detail: 'Plain English statement of facts and dollar amount sought, or for housing the RPAPL ground for relief.' },
      { title: 'Pay the filing fee or apply for poor person relief', detail: 'Fee waivers granted on financial affidavit (CPLR 1101).' },
      { title: 'Serve the defendant', detail: 'Small claims served by the clerk via mail; Supreme Court requires personal service via CPLR 308.' },
      { title: 'Answer / appear', detail: 'Defendant has 20–30 days to answer in higher courts; small claims uses pre-scheduled hearings.' },
      { title: 'Facing eviction in NYC? Get free help first', detail: 'Housing Court Answers runs a free hotline, (212) 962-4795, Monday–Friday 9am–5pm, with information tables in Manhattan, Brooklyn, the Bronx and Queens. It explains Housing Court procedure and refers tenants to free lawyers.', ref: 'https://housingcourtanswers.org/contact-us/' },
      { title: 'Trial / arbitration', detail: 'Small claims defaults to arbitration if both consent; otherwise bench trial.' },
      { title: 'Judgment + enforcement', detail: 'Use Information Subpoena, Wage Garnishment (CPLR 5231), or Property Execution to collect.' },
    ],
    sources: ['https://www.nycourts.gov/courthelp/', 'https://www.nycourts.gov/new-york-city-housing-court/answering-case-nyc-housing-court', 'https://housingcourtanswers.org/'],
  },
  'human-rights': {
    category: 'human-rights',
    title: 'Human Rights — Discrimination and Civil Rights',
    venue: 'NYS Division of Human Rights, NYC Commission on Human Rights, or EEOC.',
    fees: 'Free at all three agencies.',
    deadlines: [
      'NYSDHR complaint: 3 years for discrimination that occurred on or after February 15, 2024 (Exec. Law §297(5)). For earlier acts it depends on the type: 3 years for workplace sexual harassment; for all other claims the 1-year deadline has already expired.',
      'NYC CHR complaint: 1 year; 3 years for gender-based harassment.',
      'EEOC charge: 300 days in NY (deferral state).',
      'Election of remedies: filing with NYSDHR generally bars later court suit on same facts.',
    ],
    steps: [
      { title: 'Choose the forum carefully', detail: 'NYSDHR vs NYC CHR vs EEOC — election of remedies rules apply. Court directly may preserve more options.' },
      { title: 'File the verified complaint', detail: 'Identify protected class, adverse action, and causal link; attach supporting documents.' },
      { title: 'Respondent answers', detail: 'Employer/landlord has 20 days to file a verified answer.' },
      { title: 'Investigation', detail: 'Investigator may interview witnesses, request documents, and hold a fact-finding conference.' },
      { title: 'Probable cause determination', detail: 'If found, case proceeds to public hearing before an ALJ.' },
      { title: 'Public hearing and order', detail: 'ALJ issues recommended order; Commissioner adopts/modifies. Remedies include back pay, civil penalties, injunctive relief.' },
      { title: 'Court review of the order', detail: 'Petition for review of the NYSDHR order in State Supreme Court within 60 days of service (Exec. Law §298).' },
    ],
    sources: ['https://dhr.ny.gov', 'https://www.nyc.gov/site/cchr/'],
  },
};

export function getNyProcedure(category: NyCategoryKey): FilingProcedure {
  return NY_PROCEDURES[category];
}