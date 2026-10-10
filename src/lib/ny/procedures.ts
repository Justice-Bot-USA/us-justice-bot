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

/** A rule or caution worth knowing that is not a step (shown under "Good to know"). */
export interface ProcedureNote {
  text: string;
  /** Optional reference URL (statute, court page, or agency page). */
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
  notes?: ProcedureNote[];
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
  'personal-injury': {
    category: 'personal-injury',
    title: 'Personal Injury — Starting or Answering an Injury Case',
    venue: 'New York State Supreme Court (no dollar limit). NYC Civil Court hears claims up to $50,000 for each cause of action (CCA §202). City Courts outside NYC hear claims up to $15,000 (UCCA §202). Small claims parts: up to $10,000 in NYC Civil Court (CCA §1801), $5,000 in City Courts (UCCA §1801), $3,000 in Town and Village Courts (UJCA §1801). In NYC Civil Court you generally sue in the county where either party lives; if the City of New York is the defendant, sue in New York County or in the county where the claim arose; if the Transit Authority is the defendant, sue in the county where the claim arose. Claims against the State of New York (and certain State-related bodies such as the Thruway Authority and CUNY) go only to the NYS Court of Claims, which has no power over cities, counties, towns or individual defendants.',
    fees: 'Court and agency fees are separate from the subscription. Supreme Court: index number $210 (CPLR 8018(a): $190 plus $5 and $15 additional fees), Request for Judicial Intervention $95 (CPLR 8020(a)), $30 to place the case on the trial calendar, jury demand $65 (CPLR 8020(c)). NYC Civil Court (court fee schedule): $45 to issue a summons, $40 notice of trial, $70 jury demand; cash, certified check, money order or bank check only, no personal checks. NYC small claims: $15 for claims up to $1,000, $20 for claims from $1,000.01 to $10,000. Court of Claims: $50 filing fee, or a fee waiver/reduction affidavit filed with the claim (Ct. Cl. Act §11-a; 22 NYCRR 206.5-b). Process server and copy costs are extra. If you cannot afford the fees, you can ask the court to waive them (CPLR 1101). If you later recover money, the court may order you to pay waived fees out of the recovery (CPLR 1102(d)).',
    eFilingUrl: 'https://www.nycourts.gov/efile-unrepresented',
    deadlines: [
      // Government bodies first: these deadlines are much shorter.
      'Claim against a city, county, town, village, fire district, school district or other public corporation: serve a written, sworn notice of claim within 90 days after the claim arises (wrongful death: 90 days from appointment of the estate representative) (General Municipal Law §50-e(1)(a)).',
      'Missed the 90 days: you can ask the court for permission to serve a late notice, but no later than the time allowed to start the lawsuit (General Municipal Law §50-e(5)).',
      'Lawsuit against a city, county, town, village, fire district or school district: at least 30 days must pass after serving the notice of claim, and the suit must be started within 1 year and 90 days after the event (wrongful death: 2 years after the death) (General Municipal Law §50-i(1)(b), (c)).',
      'The municipality may demand an oral examination (and a physical exam) of the claimant; the demand must be served within 90 days of filing the notice of claim. If you are served with a demand, you cannot sue until you comply, unless the exam is not held within 90 days of the demand. That exception does not apply if you fail to appear or ask to postpone the exam past the 90 days; then you cannot sue until the exam is held (General Municipal Law §50-h(2), (5)).',
      'Most other public authorities and public benefit corporations entitled to a notice of claim (the Port Authority has its own shorter rule, below): notice within the GML 50-e time, and suit within 1 year and 90 days after the claim accrued (wrongful death excepted) (CPLR 217-a).',
      "Port Authority of New York and New Jersey: the lawsuit must be started within 1 year after the claim arises, and a sworn notice of claim must be served on the Port Authority at least 60 days before the lawsuit is started (McKinney's Unconsolidated Laws §§7107-7108, as applied in Espinal v Port Auth., 213 AD3d 101).",
      'Claim against the State of New York for injury caused by negligence of a State officer or employee: file the claim with the Court of Claims and serve it on the Attorney General within 90 days, or serve a written notice of intention within 90 days and then file and serve the claim within 2 years (Court of Claims Act §10(3)).',
      'Claim against the State for an intentional tort of a State officer or employee: 90 days, or a notice of intention within 90 days and then the claim within 1 year (Court of Claims Act §10(3-b)).',
      'Wrongful death claim against the State: file and serve the claim within 90 days after the executor or administrator is appointed, or serve a notice of intention within that time and then file and serve the claim within 2 years after the death. In any event, the claim must be filed and served on the Attorney General within 2 years after the death, even if the executor or administrator is appointed later (Court of Claims Act §10(2)).',
      'Late claim against the State: the court may allow a late claim if you apply before a similar claim against a private person would be time-barred under CPLR article 2 (Court of Claims Act §10(6)).',
      'Claims against the federal government (for example, a crash with a U.S. Postal Service vehicle) follow a separate federal process: a written claim to the federal agency within 2 years after the claim arises (28 U.S.C. §2401(b); 39 U.S.C. §409(c)). This guide does not cover that process.',
      // Time limits to sue
      'Personal injury from negligence (for example a car crash, slip/trip and fall, or defective product): 3 years (CPLR 214(5)).',
      'Property damage (for example damage to your car): 3 years (CPLR 214(4)).',
      'Injury from the latent effects of exposure to a substance: the 3 years run from when the injury was discovered or should reasonably have been discovered (CPLR 214-c(2)).',
      'Medical, dental or podiatric malpractice: 2 years and 6 months from the act or the last continuous treatment for the same condition (special rules for foreign objects and failure to diagnose cancer) (CPLR 214-a).',
      'Assault, battery or false imprisonment (civil claim): 1 year (CPLR 215(3)).',
      'If a criminal case was started against the same defendant over the same event, you have at least 1 year after the criminal case ends to sue on a CPLR 215 claim (CPLR 215(8)(a)).',
      'Injury arising from domestic violence: 2 years (CPLR 215(9)).',
      'Injury from conduct that is one of the sexual offenses listed in CPLR 213-c: 20 years (CPLR 213-c).',
      'Wrongful death: 2 years after the death (EPTL 5-4.1(1)).',
      'Under 18 or legally insane when the claim arose: for 3-year-or-longer limits, time is extended to 3 years after the disability ends; shorter limits are extended by the period of disability. The extension is capped at 10 years after the claim arose, except for infancy in non-malpractice cases (CPLR 208(a)).',
      // Car crashes
      'DMV accident report (MV-104): every driver in a crash where anyone is killed or injured, or property damage to any one person is over $1,000, must report in writing within 10 days. Failing to report is a misdemeanor and can lead to license suspension (Vehicle and Traffic Law §605(a)).',
      'Car crash, no-fault benefits: written notice to the no-fault insurer no later than 30 days after the accident, unless you give written proof of a clear and reasonable justification for the delay (11 NYCRR 65-1.1).',
      'No-fault proof of claim: medical bills within 45 days after the service; lost wages and other necessary expenses within 90 days (11 NYCRR 65-1.1).',
      // Once a case is filed
      'Serve the summons and complaint (or summons with notice) within 120 days after filing. The court may extend this for good cause or in the interest of justice (CPLR 306-b).',
      "Defendant's time to answer in Supreme Court: 20 days after personal delivery; 30 days after service is complete for other methods (substituted service, nail and mail, service outside the state, etc.) (CPLR 320(a); CPLR 3012(a), (c)). NYC Civil Court: 20 days if the summons was handed to you within New York City; otherwise 30 days after proof of service is filed with the clerk (NYC Civil Court Act §402).",
      'City Courts outside NYC: 10 days to answer if personally handed the summons within the county; 30 days after service is complete otherwise (Uniform City Court Act §402).',
      'A defendant in a personal injury case may ask the plaintiff for a supplemental demand stating total damages; the plaintiff must provide it within 15 days (CPLR 3017(c)).',
    ],
    steps: [
      { title: 'Write down the key dates', detail: 'Note the date of the injury, the date of any criminal case ending, and whether a government body, the State, or a car is involved. The time limits differ by type of claim: 3 years for negligence (CPLR 214(5)), 2 years 6 months for medical malpractice (CPLR 214-a), 1 year for assault or battery (CPLR 215(3)), and 90 days to give notice when a city, county, town, village, school district or public authority is involved (GML 50-e; Port Authority: suit within 1 year, notice at least 60 days before suit). If you miss a deadline, you may lose the claim.', ref: 'https://www.nysenate.gov/legislation/laws/CVP/214' },
      { title: 'Car crash: file the MV-104 with DMV', detail: 'If anyone was killed or injured, or property damage to any one person was over $1,000, each driver must send the Report of Motor Vehicle Crash (MV-104) to DMV within 10 days. The form says to send the original to the Crash Records Center, 6 Empire State Plaza, PO Box 2925, Albany, NY 12220-0925.', ref: 'https://dmv.ny.gov/forms/mv104.pdf' },
      { title: 'Car crash: give written notice to the no-fault insurer', detail: 'Within 30 days of the accident, give written notice to the insurer of the car you were in (driver or passenger), or of the car that hit you if you were a pedestrian. If that car is unknown or uninsured, use the policy of a relative in your household; if there is none, file with MVAIC. If the vehicle was a City of New York vehicle, file the no-fault claim with the NYC Comptroller within 30 days using the Comptroller\'s No Fault Claim Form (NYC Comptroller, File a Claim). Unless the insurer pays the claim as submitted within 30 days, it must send you the Application for Motor Vehicle No-Fault Benefits (NF-2) within 5 business days of getting notice. Fill it in, sign it, and send it back with copies of your bills. Medical bills are due within 45 days of each service and lost-wage claims within 90 days. Motorcycle drivers and passengers are not covered by no-fault.', ref: 'https://www.dfs.ny.gov/consumers/auto_insurance/nofault_faqs' },
      { title: 'Government involved: serve a notice of claim within 90 days', detail: "The notice must be in writing and sworn. It must give each claimant's name and post-office address (and any attorney's), the nature of the claim, when, where and how it arose, and the damages or injuries claimed so far. In a notice to a county, town, village or any city other than New York City, do not state a dollar amount of damages; that body may later ask for a supplemental claim with the total, which you must provide within 15 days (GML 50-e(2); GML §2). Serve it by personal delivery or registered or certified mail on the person who accepts court papers for that body or its regular attorney (GML 50-e(2), (3)). Starting a lawsuit does not replace the notice of claim. For the City of New York, file with the NYC Comptroller online (eClaim), in person, or by registered or certified mail; email is not accepted. Claims against authorities such as NYCHA, the MTA, NYC Transit, NYC Health + Hospitals, the Port Authority and the School Construction Authority must be served on that authority, not the Comptroller. The Port Authority of NY & NJ has its own rule: the notice of claim must be sworn, give the same kind of details, and be served at least 60 days before you sue, either the way court papers are served or by registered mail to its principal office, and the lawsuit must be started within 1 year (McKinney's Unconsolidated Laws §§7107-7108).", ref: 'https://comptroller.nyc.gov/services/for-the-public/claims/file-a-claim/' },
      { title: 'Attend the 50-h examination if one is demanded', detail: 'The city, county, town, village, fire district, ambulance district or school district may demand an oral examination under oath, which may include a physical exam. If you receive a demand, you cannot sue until you comply, unless the exam is not held within 90 days of the demand. That exception does not apply if you fail to appear or ask to postpone the exam past the 90 days (GML 50-h(5)). You may bring a lawyer and your own doctor. The time to sue still runs from the date of the event: 1 year and 90 days, or 2 years after the death in a wrongful death case (GML 50-i(1)(c)).', ref: 'https://www.nysenate.gov/legislation/laws/GMU/50-H' },
      { title: 'Claims against the State: file in the Court of Claims', detail: 'File the claim with the Chief Clerk of the Court of Claims in Albany by personal delivery, regular mail, fax (up to 50 pages, fee paid online first) or NYSCEF. Filing counts when the clerk receives it, not when it is mailed. Also serve a copy on the Attorney General, either personally (to an Assistant Attorney General at an AG office) or by certified mail, return receipt requested. Service counts only when the AG receives it. The claim must state when and where it arose, its nature, and the damages or injuries; a personal injury claim does not need to state a total dollar amount. The claim must be verified like a Supreme Court complaint (Ct. Cl. Act §11(b)). Pay the $50 fee or file a fee waiver or reduction affidavit with the claim. If the defendant is the NYS Thruway Authority, the City University of New York (CUNY) or the NYS Power Authority, serve that defendant as well as the Attorney General. For a tort or wrongful death claim against Roswell Park Cancer Institute Corporation, first serve a notice of claim on Roswell Park under GML 50-e (Court of Claims, How do I commence a claim).', ref: 'https://www.nycourts.gov/courts/court-claims/frequently-asked-questions' },
      { title: 'Pick the court', detail: 'Supreme Court has no dollar limit. NYC Civil Court hears claims up to $50,000, City Courts outside NYC up to $15,000. Small claims parts take money-only claims up to $10,000 in NYC, $5,000 in City Courts and $3,000 in Town and Village Courts. Claims against the State go only to the Court of Claims. A claim against a city, county, town, village, school district or fire district still needs a timely notice of claim, even in small claims.', ref: 'https://www.nysenate.gov/legislation/laws/CCA/202' },
      { title: 'Ask for a fee waiver if you cannot pay', detail: 'Make a motion with a sworn statement of your income and property showing you cannot pay the court costs and fees (CPLR 1101(a)). You can use the Application to Waive Court Costs, Fees, and Expenses (UCS-FW1). If the case has already started, also serve a Notice of Motion (UCS-FW2) on the other parties and on the County Attorney (or the Corporation Counsel in NYC), and file an Affirmation of Service (UCS-FW3). A plaintiff can also start the case without paying by filing the form affidavit under CPLR 1101(d). If the court denies the application, the case will be dismissed unless the fee is paid within 120 days of the court\'s order. If you are represented by a legal aid or legal services organization, fees for filing and service are waived without a motion (CPLR 1101(e)).', ref: 'https://www.nysenate.gov/legislation/laws/CVP/1101' },
      { title: 'Start the case (Supreme Court)', detail: 'You start the case by filing a summons and complaint, or a summons with notice, with the County Clerk and buying an index number ($210). The summons must state the basis for venue. A summons with notice must say what the case is about, the relief you want, and (except in medical malpractice) the sum of money for which judgment may be taken if the defendant defaults (CPLR 305(b)). In a personal injury complaint, do not state a dollar amount. In Supreme Court, the complaint must say whether the damages sought exceed the limits of the lower courts (CPLR 3017(c)). Self-represented plaintiffs do not have to file the malpractice certificate of merit (CPLR 3012-a(f)). E-filing is optional for people without a lawyer (22 NYCRR 202.5-bb). You fill in the papers with your own answers.', ref: 'https://www.nysenate.gov/legislation/laws/CVP/304' },
      { title: 'Start the case (NYC Civil Court)', detail: 'Fill in the Application for Pro Se Summons (CIV-GP-59), or use your own summons form. Submit it to the clerk in the right county with the $45 fee, paid by cash, certified check, money order or bank check. The clerk issues the summons and complaint and assigns an index number.', ref: 'https://www.nycourts.gov/new-york-city-civil-court/starting-case-nyc-civil-court' },
      { title: 'Have the papers served and file proof', detail: 'Any adult over 18 who is not a party, or a process server, may serve. Use personal delivery or substituted delivery (left with a person of suitable age and discretion, plus a mailing within 20 days). If neither works after diligent effort, use conspicuous place service (affixed to the door, plus a mailing). Papers in a civil case may not be served on a Sunday; Sunday service is void in every New York court unless a statute specially allows it (General Business Law §11). The server fills in and signs an Affidavit of Service before a notary, and you file it with the court. In Supreme, County and City Courts, after substituted or conspicuous service, the affidavit must be filed within 20 days; service is complete 10 days after filing. Serve within 120 days of filing (CPLR 306-b).', ref: 'https://www.nycourts.gov/help/representing-yourself-court/filing-affidavit-service' },
      { title: 'Get a judge assigned (RJI)', detail: 'In Supreme Court, no judge is assigned until a party files a Request for Judicial Intervention (UCS-840) and pays $95, for example to make a motion or request a preliminary conference. Personal injury cases use the Torts section of the form (Motor Vehicle, Products Liability, Other Negligence, Medical Malpractice, Other Tort). Serve a copy on the other side along with the papers it relates to.', ref: 'https://www.nycourts.gov/help/representing-yourself-court/getting-judge-assigned-your-case-rji' },
      { title: 'If you are sued: find your answer deadline', detail: "Check how and when you were served. In Supreme Court you have 20 days after the papers were handed to you, or 30 days after service is complete if they were served another way. In NYC Civil Court you have 20 days if the papers were handed to you within New York City; otherwise 30 days after proof of service is filed with the clerk (NYC Civil Court Act §402). In a City Court outside NYC you have 10 days if personally handed the papers in the county, otherwise 30 days after service is complete (Uniform City Court Act §402). After substituted or conspicuous service, your time starts only once service is complete (see the court's affidavit-of-service rules).", ref: 'https://www.nysenate.gov/legislation/laws/CVP/320' },
      { title: 'If you are sued: answer in writing', detail: "Your answer responds to each numbered paragraph of the complaint: admit it, deny it, or say you lack enough knowledge to admit or deny. Any allegation you do not respond to counts as admitted. Include any defenses and counterclaims. If the complaint is verified, your answer must be verified too. Serve the answer on the plaintiff (or the plaintiff's attorney) and all other parties; mail service by a non-party is enough. In NYC Civil Court you may answer in person at the clerk's office using the court's free answer form, bring the summons, and mail a copy of the answer to the plaintiff. You may demand a jury trial when you answer, which requires a jury fee.", ref: 'https://www.nycourts.gov/LegacyPDFS/courts/5jd/onondaga/helpcenter/ComplaintAnswerPacket.pdf' },
      { title: 'If you are sued: what happens if you do not answer', detail: 'If you do not answer or move to dismiss in time, the plaintiff can ask for a default judgment. NYC Civil Court has a page on vacating a default judgment. As a defendant in a personal injury case, you may ask the plaintiff for a supplemental demand stating total damages; the plaintiff must answer within 15 days.', ref: 'https://www.nycourts.gov/help/representing-yourself-court/how-court-cases-start' },
      { title: 'Get free court information or find a lawyer', detail: 'CourtHelp (the court system\'s self-help site) and the free Help Centers in every NYC Civil Court building give legal and procedural information but not legal advice. LawHelpNY lists free legal services. The NYS Bar Association Lawyer Referral Service makes free referrals in the counties it serves (check its site for coverage); consultations are $35 for 30 minutes, with exceptions for some case types, including personal injury and medical malpractice. In NYC, the New York City Bar Legal Referral Service (212-626-7373; Spanish 212-626-7374) offers initial consultations of up to 30 minutes that are $35 or free depending on the type of case.', ref: 'https://www.nycourts.gov/help/courthelp' },
    ],
    notes: [
      { text: 'Car crash cases between people covered by no-fault: you cannot recover non-economic loss (such as pain and suffering) unless the injury is a "serious injury" as defined by law (Insurance Law §5104(a); §5102(d)). The definition changed for actions started on or after May 26, 2026; older articles may describe the prior law (DFS Insurance Circular Letter No. 3 (2026)).', ref: 'https://www.dfs.ny.gov/industry-guidance/circular-letters/c32026-01' },
      { text: 'Comparative fault: in most injury cases, your own share of fault does not bar recovery but reduces it in proportion (CPLR 1411(a)). In personal injury cases under the no-fault law (Insurance Law article 51) that were started on or after May 26, 2026, an injured person whose fault is greater than the fault of the defendant, or of all the defendants combined, cannot recover (CPLR 1411(b)).', ref: 'https://www.nysenate.gov/legislation/laws/CVP/1411' },
      { text: 'Injuries from a defect on a New York State highway need a separate claim with the State. Claims involving NYCHA, the MTA, NYC Transit, MaBSTOA, Staten Island Rapid Transit, MTA Bus, NYC Health + Hospitals, the School Construction Authority, Battery Park City Authority, Triborough Bridge and Tunnel Authority or the Port Authority must be served on that authority, not the NYC Comptroller (NYC Comptroller, File a Claim). The Port Authority has its own notice and lawsuit deadlines (see the deadlines above).', ref: 'https://comptroller.nyc.gov/services/for-the-public/claims/file-a-claim/' },
      { text: 'For a defective NYC sidewalk, the owner of the property next to the sidewalk is usually the one responsible, not the City. The exception is a sidewalk next to an owner-occupied 1-, 2- or 3-family home used only as a residence (NYC Administrative Code §7-210, as applied in Gallis v 23-21 33 Rd., LLC, 2021 NY Slip Op 05549).', ref: 'https://nycourts.gov/reporter/3dseries/2021/2021_05549.htm' },
      { text: 'For streets, and for sidewalks the City remains responsible for, the City generally cannot be held liable unless it had prior written notice of the defect, with limited exceptions (NYC Administrative Code §7-201(c)(2), as quoted by the NYC Comptroller).', ref: 'https://comptroller.nyc.gov/services/for-the-public/claims/file-a-claim/' },
      { text: "Court of Claims: a claim is filed only when the Chief Clerk in Albany receives it. Claims cannot be filed at district offices or judges' chambers. Express mail, registered mail, or certified mail without a return receipt is not valid service on the Attorney General. Delivery to a secretary or clerk at the AG's office is not valid personal service (Court of Claims Act §11(a); NYS Court of Claims, How do I commence a claim).", ref: 'https://www.nycourts.gov/node/60941' },
      { text: "No-fault benefits do not cover motorcycle drivers or passengers. A pedestrian hit by a motorcycle files with the motorcycle's insurer (DFS, Consumer FAQs About No-Fault Insurance).", ref: 'https://www.dfs.ny.gov/consumers/auto_insurance/nofault_faqs' },
      { text: 'If you sue someone who is not covered by New York no-fault (an action under Insurance Law §5104(b)), send a copy of the summons and complaint to your no-fault insurer as soon as practicable (11 NYCRR 65-1.1).', ref: 'https://www.dfs.ny.gov/apps-and-licensing/property-insurers/nofault/full-reg68-text' },
    ],
    sources: [
      'https://www.nysenate.gov/legislation/laws/CVP/214',
      'https://www.nysenate.gov/legislation/laws/CVP/215',
      'https://www.nysenate.gov/legislation/laws/GMU/50-E',
      'https://www.nysenate.gov/legislation/laws/GMU/50-I',
      'https://www.nysenate.gov/legislation/laws/CTC/10',
      'https://www.nysenate.gov/legislation/laws/CVP/1101',
      'https://www.nysenate.gov/legislation/laws/GBS/11',
      'https://nycourts.gov/reporter/3dseries/2023/2023_00844.htm',
      'https://nycourts.gov/reporter/3dseries/2021/2021_05549.htm',
      'https://www.nycourts.gov/node/60941',
      'https://uscode.house.gov/view.xhtml?req=(title:28%20section:2401%20edition:prelim)',
      'https://www.nysenate.gov/legislation/laws/VAT/605',
      'https://www.nysenate.gov/legislation/laws/CVP/320',
      'https://www.dfs.ny.gov/apps-and-licensing/property-insurers/nofault/full-reg68-text',
      'https://www.nycourts.gov/help/courthelp',
      'https://www.nycourts.gov/new-york-city-civil-court/starting-case-nyc-civil-court',
      'https://www.nycourts.gov/courts/court-claims/frequently-asked-questions',
      'https://comptroller.nyc.gov/services/for-the-public/claims/file-a-claim/',
    ],
  },
};

export function getNyProcedure(category: NyCategoryKey): FilingProcedure {
  return NY_PROCEDURES[category];
}