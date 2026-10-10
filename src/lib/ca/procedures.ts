// California — Filing procedures for each legal area.
// General legal information, sourced from selfhelp.courts.ca.gov and dir.ca.gov; personal injury
// also from leginfo.legislature.ca.gov, courts.ca.gov, dgs.ca.gov, dmv.ca.gov and dot.ca.gov (checked Oct 2026).
// Always paired with the "legal information, not advice" disclaimer at the UI layer.
// NOT yet reviewed by a California-licensed attorney — required before marketing launch.
import type { CaCategoryKey } from './forms';
import type { ProcedureNote, ProcedureStep } from '@/lib/ny/procedures';

export interface CaFilingProcedure {
  category: CaCategoryKey;
  title: string;
  venue: string;
  fees: string;
  deadlines: string[];
  eFilingUrl?: string;
  steps: ProcedureStep[];
  notes?: ProcedureNote[];
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
  'personal-injury': {
    category: 'personal-injury',
    title: 'Personal Injury — Bringing a Claim After an Injury, or Responding to an Injury Lawsuit',
    venue: 'Superior Court of California. Small claims handles money claims up to $12,500 for an individual ($6,250 for a business). A limited civil case is up to $35,000, and an unlimited civil case is over $35,000. You usually file in the county where the injury happened or where the defendant lives or does business. If a government agency is involved, you must first present a written claim to that agency: the state Government Claims Program (Department of General Services) for state agencies, or the city, county, school district or transit agency itself for local agencies (Gov. Code §915(a), (b)).',
    fees: 'Court and agency fees are separate from the subscription. From the Statewide Civil Fee Schedule (effective January 1, 2026): a complaint, or an answer from each defendant, costs $225 in a limited civil case up to $10,000, $370 in a limited civil case over $10,000 up to $35,000, and $435 in an unlimited civil case (over $35,000). Riverside, San Bernardino and San Francisco add a local courthouse surcharge; for example, an unlimited case costs $450 in Riverside and San Francisco. Small claims costs $30 (claims up to $1,500), $50 (up to $5,000) or $75 (up to $12,500), and $100 if you filed more than 12 small claims in California in the previous 12 months. Other common court fees: a motion that needs a hearing is $60, a motion for summary judgment is $500, and the advance jury fee is $150 (nonrefundable). Having the sheriff serve your papers costs extra unless you have a fee waiver. A private process server charges its own fee; the fees a court fee waiver covers include the sheriff\'s, not a private server\'s (Cal. Rules of Court, rule 3.55). Any adult 18 or older who is not part of the case can serve the papers. Claims against the State of California cost $25 per claimant at the Government Claims Program; you can ask for a waiver or reduction with DGS ORIM 005. If you cannot afford court fees, file FW-001 and FW-003 to ask the court to waive them. Even with a fee waiver, the court may later order you to pay some or all of the waived fees if your finances get better or you get money from the case; it must tell you first and give you a chance to ask for a hearing.',
    deadlines: [
      // Government agencies first: these deadlines are much shorter.
      'Government agency or government employee involved (city, county, state, school district, transit, or someone working for one at the time): present a written claim to the agency within 6 months of the injury, before you can sue the agency or the employee (Gov. Code §§911.2(a), 950.2).',
      'Missed the 6-month claim deadline: you can apply to the agency for permission to present a late claim. Apply within a reasonable time, and no later than 1 year after the injury, with the proposed claim attached. Time as a minor counts toward this year (Gov. Code §911.4(b), (c)(1)).',
      'The agency has 45 days to grant or deny a late-claim application; if it does not act, the application is treated as denied. If it is denied, you have 6 months to ask the superior court for relief from the claim requirement. If the court grants relief, you must file your lawsuit within 30 days (Gov. Code §§911.6(a), (c); 946.6(b), (f)).',
      'The agency has 45 days to act on your claim. If it does not act in time, the claim is treated as rejected (Gov. Code §912.4(a), (c)).',
      'Suing after a rejected government claim: within 6 months after the written rejection notice was delivered or mailed. If no written notice was given, within 2 years of the injury (Gov. Code §945.6(a)).',
      // Time limits to sue
      'Injury to a person (car crash, fall, dog bite, defective product, or an assault or battery that is not sexual assault or domestic violence): generally 2 years from the date of injury (Code Civ. Proc. §335.1).',
      'Domestic violence (as defined in Family Code §6211): the later of 3 years from the last act of domestic violence or 3 years after you discovered (or should have discovered) that it caused your injury (Code Civ. Proc. §340.15(a)).',
      'Sexual assault of an adult: the later of 10 years from the last act or 3 years after you discovered (or should have discovered) the injury (Code Civ. Proc. §340.16(a)). Childhood sexual assault on or after January 1, 2024: no time limit, and no government claim is needed first (Code Civ. Proc. §340.1(a), (p), (q)). Childhood sexual assault on or before December 31, 2023: the time limits in the law as it read on that date still apply (Code Civ. Proc. §340.1(p)).',
      'Damage to property (for example, your car in a crash): generally 3 years (Code Civ. Proc. §338(b), (c)(1)).',
      'Medical negligence by a health care provider: 3 years after the injury or 1 year after you discovered it (or should have), whichever comes first. Minors have their own rule in the same section (Code Civ. Proc. §340.5).',
      "Before suing a health care provider for professional negligence, you must give at least 90 days' written notice. If you serve the notice within the last 90 days before the deadline, the deadline is extended 90 days from service of the notice (Code Civ. Proc. §364(a), (d)).",
      "Injury from exposure to a hazardous material or toxic substance: 2 years from the injury, or 2 years after you knew or should have known of the injury, its physical cause and that someone's wrongful act caused it, whichever is later (Code Civ. Proc. §340.8(a)). This rule does not cover asbestos claims, which have their own deadline (Code Civ. Proc. §340.2), or medical negligence (Code Civ. Proc. §340.8(c)(1)).",
      'Minors: time while the injured person is under 18 generally does not count toward the deadline. This pause does not apply to claims that must first be presented to a government agency (Code Civ. Proc. §352(a), (b)).',
      // Car crashes
      'Car crash with an injury or death: the driver must make, or have someone make, a written report to the CHP (or, inside a city, the CHP or city police) within 24 hours (Veh. Code §20008(a)).',
      'Car crash: each driver involved must report it to the DMV on form SR-1 within 10 days if anyone was injured or killed, or if property damage to any one person is over $1,000. This applies whoever was at fault (Veh. Code §16000(a)). It does not apply to a driver of a vehicle owned or leased by, or under the direction of, the United States, a state or a local agency; no SR-1 is filed for that vehicle (§16000(b)).',
      // Once a case is filed
      'If you are sued: file a written response within 30 days after the Summons and Complaint are served on you. The 30 days include weekends and holidays (Code Civ. Proc. §412.20(a)(3); California Courts Self-Help Guide).',
      'If the papers were left with someone else at your home or work and then mailed to you (substituted service), you have 40 days after the mailing to respond (California Courts Self-Help Guide).',
      'The two sides can agree to one 15-day extension of the 30-day response time without asking the court (Cal. Rules of Court, rule 3.110(d)).',
      'Plaintiff: serve every defendant and file the proofs of service within 60 days after filing the complaint (Cal. Rules of Court, rule 3.110(b)).',
      'In a personal injury case, the plaintiff must serve a Statement of Damages (CIV-050) on the defendant before a default can be taken. If the defendant asks for one, the plaintiff has 15 days to serve it (Code Civ. Proc. §425.11(b), (c)).',
      'If the defendant does not respond in time, the plaintiff must request entry of default within 10 days after the response time ends, then get a default judgment within 45 days after the default is entered (Cal. Rules of Court, rule 3.110(g), (h)).',
    ],
    steps: [
      { title: 'Write down the injury date', detail: "Most deadlines are counted from the date of the injury. Note it, and read the courts' deadline guide for your type of claim.", ref: `${SELF_HELP}/civil-lawsuit/statute-limitations` },
      { title: 'Car crash: report it to the police or CHP and file the DMV SR-1', detail: 'If anyone was hurt or killed, the driver must make, or have someone make, a written report to the CHP (or, inside a city, the CHP or city police) within 24 hours. Each driver, or their insurance agent, broker or legal representative, must also send an SR-1 to the DMV within 10 days if anyone was hurt or killed or property damage is over $1,000. Drivers of government-owned or government-leased vehicles do not file an SR-1 for that vehicle. You can file the SR-1 online or on paper. It is separate from any police, CHP or insurance report.', ref: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { title: 'Keep your records and check your insurance', detail: 'Keep photos of the scene and your injuries, medical bills and doctor reports, witness statements, and police reports. If you have insurance, contact your insurer. If someone says you caused an injury, your policy may require you to report it.', ref: `${SELF_HELP}/civil-lawsuit/personal-injury` },
      { title: 'If a government agency or one of its employees is involved, present a claim first', detail: 'This also applies if you plan to sue only the employee for something done on the job (Gov. Code §950.2). Claims against a state agency go to the DGS Government Claims Program. Use form DGS ORIM 006 (online or by mail) with the $25 fee or a fee waiver request (ORIM 005). The program does not accept emailed claim forms, and its staff cannot help fill out the form or represent you. Injury, death or property claims against Caltrans of $12,500 or less can be filed directly with the Caltrans district claims office for the county where it happened, on form DOTLD-0274, with no filing fee. For potholes and other damage on state highways, DGS says claims of $12,500 or less need to be filed directly with Caltrans. Claims of $1,000 or less against the CHP, DMV, Department of Consumer Affairs, CDCR or Department of State Hospitals go directly to that agency; DGS warns that a claim filed with the wrong office risks being rejected. Claims against a city, county, school district or other local agency go to that agency. Use its own claim form and deliver or mail it to its clerk, secretary, auditor or governing body. You generally have 6 months.', ref: `${SELF_HELP}/civil-lawsuit/government-claim` },
      { title: "Medical negligence: give 90 days' notice first", detail: "Before suing a health care provider for professional negligence, give the provider at least 90 days' written notice of the legal basis of the claim and the injuries suffered. No particular form is required. The courts say these cases are complex and expensive.", ref: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=364' },
      { title: 'Find which court level matches the amount', detail: 'Small claims handles up to $12,500 for an individual ($6,250 for a business). You cannot have a lawyer with you in court, and the person who started the case cannot appeal. You can file only two small claims over $2,500 per calendar year. A limited civil case is up to $35,000; an unlimited civil case is over $35,000.', ref: `${SELF_HELP}/small-claims-california` },
      { title: 'Fill out the forms to start a case', detail: 'For superior court: Summons (SUM-100), Civil Case Cover Sheet (CM-010), and Complaint (PLD-PI-001) with at least one cause-of-action attachment: Motor Vehicle (1), General Negligence (2), Intentional Tort (3), Premises Liability (4) or Products Liability (5). Add the Exemplary Damages Attachment (6) only if you are asking for punitive damages. For small claims, use SC-100. You fill in the official forms with your own answers.', ref: `${SELF_HELP}/civil-lawsuit/personal-injury` },
      { title: 'File and pay the court fee, or ask for a waiver', detail: 'File in the superior court of the county where the injury happened or where the defendant lives or does business. Fees follow the Statewide Civil Fee Schedule ($225, $370 or $435 depending on the amount). If you cannot afford the fee, file FW-001 and FW-003 with your papers. Some courts require local forms; check with the clerk.', ref: 'https://courts.ca.gov/system/files/file/statewide-civil-fee-schedule-eff-01012026.pdf' },
      { title: 'Have the defendant served', detail: 'An adult who is 18 or older and not part of the case delivers the filed papers. The server completes Proof of Service of Summons (POS-010), and you file it within 60 days of filing the complaint. The sheriff charges for service unless you have a fee waiver.', ref: `${SELF_HELP}/civil-lawsuit/plaintiff/serve` },
      { title: 'Serve a Statement of Damages before any default', detail: 'In a personal injury case, serve CIV-050 on the defendant before asking for a default. If the defendant has not filed anything in the case, CIV-050 must be served the same way as the Summons, for example by personal service (Code Civ. Proc. §425.11(c), (d)(1)). It is not filed with the court unless the defendant defaults.', ref: `${SELF_HELP}/jcc-form/CIV-050` },
      { title: 'If the defendant does not respond', detail: 'Request entry of default with CIV-100 within 10 days after the response deadline passes. Then ask for a default judgment (JUD-100) within 45 days after the default is entered.', ref: `${SELF_HELP}/civil-lawsuit/plaintiff/request-default` },
      { title: 'If you are sued: count your 30 days', detail: 'Day 1 is the day after you were handed the Summons and Complaint. If the last day falls on a weekend or court holiday, you have until the next court day. With substituted service, you have 40 days after the mailing. The courts also say to contact your insurer right away.', ref: `${SELF_HELP}/civil-lawsuit/defendant/served` },
      { title: 'If you are sued: file a response', detail: 'You can use the Answer (PLD-PI-003). You can use a General Denial (PLD-050) only if the complaint is not verified or the case is a limited civil case. To sue the plaintiff or someone else in the same case, use the Cross-Complaint (PLD-PI-002). Serve the plaintiff, then file with the court and pay the first-paper fee or ask for a waiver. If you do not respond, the plaintiff can ask for a default.', ref: `${SELF_HELP}/civil-lawsuit/defendant/answer` },
      { title: 'Get free or low-cost help', detail: 'Your courthouse Self-Help Center is free. Lawyers referred by a State Bar-certified lawyer referral service offer a first consultation for a reduced fee or no fee. LawHelpCA lists legal aid offices.', ref: 'https://www.calbar.ca.gov/public/find-legal-professionals/find-lawyer-referral-service' },
    ],
    notes: [
      { text: 'Injured at work: a workers\' compensation claim may apply, and sometimes there is also a separate claim against whoever caused the injury (California Courts, Personal injury cases).', ref: `${SELF_HELP}/civil-lawsuit/personal-injury` },
      { text: "Being partly at fault does not by itself bar a claim. If the injured person's own negligence helped cause the harm, their damages are reduced by their percentage of responsibility (CACI No. 405).", ref: 'https://courts.ca.gov/system/files/file/judicial_council_of_california_civil_jury_instructions_2026.pdf' },
      { text: 'Uninsured drivers and owners: in a vehicle case, an injured person who owned an uninsured vehicle in the crash, or who drove without the required financial responsibility, cannot recover non-economic damages such as pain and suffering. The same applies to a driver convicted of DUI for that crash. One exception: an uninsured owner hurt by a driver convicted of DUI can still recover them (Civ. Code §3333.4(a), (c)).', ref: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3333.4' },
      { text: "Dog bites: a dog's owner is responsible for bites to a person in a public place or lawfully on private property, even if the dog was never vicious before. There are limits for police and military dogs (Civ. Code §3342(a), (b)).", ref: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3342' },
      { text: "Medical negligence cases have their own deadline rules, including 90 days' notice before suing. The courts' personal injury guide does not cover them and calls them very complex and expensive (Code Civ. Proc. §§340.5, 364).", ref: `${SELF_HELP}/civil-lawsuit/personal-injury` },
      { text: 'If you are sued and do not respond in time, the plaintiff can ask for a default, and the court can decide the case without you (Code Civ. Proc. §412.20(a)(4)). A request to set aside a default for mistake, inadvertence, surprise or excusable neglect must be made within a reasonable time, and no later than 6 months after the default (Code Civ. Proc. §473(b)).', ref: `${SELF_HELP}/civil-lawsuit/defendant/options` },
    ],
    sources: [
      `${SELF_HELP}/civil-lawsuit/personal-injury`,
      `${SELF_HELP}/civil-lawsuit/government-claim`,
      `${SELF_HELP}/civil-lawsuit/statute-limitations`,
      `${SELF_HELP}/civil-lawsuit/defendant/served`,
      `${SELF_HELP}/civil-lawsuit/plaintiff/serve`,
      `${SELF_HELP}/fee-waiver`,
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=335.1',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=340.16',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=340.1',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=340.15',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=425.11',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=473',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=911.2',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=911.6',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=915',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=945.6',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=946.6',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=950.2',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=16000',
      'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=20008',
      'https://courts.ca.gov/cms/rules/index/three/rule3_55',
      'https://courts.ca.gov/cms/rules/index/three/rule3_110',
      'https://courts.ca.gov/system/files/file/statewide-civil-fee-schedule-eff-01012026.pdf',
      'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/',
      'https://www.dgs.ca.gov/ORIM/File-a-Claim',
      'https://www.dgs.ca.gov/-/media/Divisions/ORIM/GCP-FAQ.pdf',
      'https://dot.ca.gov/online-services/submit-damage-claim',
    ],
  },
};
