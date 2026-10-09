// New York uncontested divorce: UD-1 (Summons with Notice, Rev. 1/25/16) and UD-2 (Verified
// Complaint, Rev. 3/1/26). nycourts.gov publishes these only as flat PDFs and WordPerfect files
// (checked 2026-10-09), so answers are drawn at measured positions instead of filled into fields.
// Coordinates were read from the official PDFs with pdftotext -bbox (PDF points, origin bottom-left).
// The court also offers a free DIY Uncontested Divorce program that builds the whole packet:
// https://www.nycourts.gov/help/diy-forms/uncontested-divorce-program
import type { Answers, FillableForm, FillPlan, Question } from './types';

type Draw = NonNullable<FillPlan['draw']>[number];
const X = (page: number, x: number, y: number): Draw => ({ page, x, y, text: 'X', size: 10 });
const T = (page: number, x: number, y: number, text: string | undefined, maxWidth: number, size = 10): Draw[] =>
  text?.trim() ? [{ page, x, y, text: text.trim(), size, maxWidth }] : [];

const NY_COUNTIES = [
  'Albany', 'Allegany', 'Bronx', 'Broome', 'Cattaraugus', 'Cayuga', 'Chautauqua', 'Chemung', 'Chenango', 'Clinton',
  'Columbia', 'Cortland', 'Delaware', 'Dutchess', 'Erie', 'Essex', 'Franklin', 'Fulton', 'Genesee', 'Greene',
  'Hamilton', 'Herkimer', 'Jefferson', 'Kings', 'Lewis', 'Livingston', 'Madison', 'Monroe', 'Montgomery', 'Nassau',
  'New York', 'Niagara', 'Oneida', 'Onondaga', 'Ontario', 'Orange', 'Orleans', 'Oswego', 'Otsego', 'Putnam', 'Queens',
  'Rensselaer', 'Richmond', 'Rockland', 'Saratoga', 'Schenectady', 'Schoharie', 'Schuyler', 'Seneca', 'St. Lawrence',
  'Steuben', 'Suffolk', 'Sullivan', 'Tioga', 'Tompkins', 'Ulster', 'Warren', 'Washington', 'Wayne', 'Westchester',
  'Wyoming', 'Yates',
];

const GROUNDS: Record<string, string> = {
  '7': 'irretrievable breakdown in relationship',
  '1': 'cruel and inhuman treatment',
  '2': 'abandonment',
  '3': 'confinement in prison',
  '4': 'adultery',
  '5': 'living apart one year after separation decree or judgment of separation',
  '6': 'living apart one year after execution of a separation agreement',
};

// Questions both forms share.
const shared: Question[] = [
  { key: 'county', label: 'County where you are filing (Supreme Court)', type: 'select', required: true, options: NY_COUNTIES.map((c) => ({ value: c, label: c })) },
  { key: 'indexNo', label: 'Index number (leave blank if you have not bought one yet)', type: 'text' },
  { key: 'plaintiff', label: 'Your full name (you are the Plaintiff)', type: 'text', required: true },
  { key: 'defendant', label: "Your spouse's full name (the Defendant)", type: 'text', required: true },
  { key: 'pStreet', label: 'Your street address', type: 'text', required: true },
  { key: 'pCity', label: 'Your city, state and ZIP', type: 'text', required: true },
  { key: 'dStreet', label: "Your spouse's street address", type: 'text' },
  { key: 'dCity', label: "Your spouse's city, state and ZIP", type: 'text' },
  {
    key: 'ground', label: 'Ground for divorce you are using (DRL §170)', type: 'select', required: true,
    help: 'Most uncontested divorces use subdivision 7 (irretrievable breakdown for at least 6 months). Read the court instructions before choosing.',
    options: Object.entries(GROUNDS).map(([k, v]) => ({ value: k, label: `§170(${k}) — ${v}` })),
  },
  {
    key: 'property', label: 'Marital property', type: 'select',
    options: [
      { value: 'agreement', label: 'To be distributed under our separation agreement/stipulation' },
      { value: 'waive', label: 'I waive distribution of marital property' },
      { value: '', label: 'Neither of these' },
    ],
  },
  {
    key: 'maintenance', label: 'Maintenance (spousal support) for you', type: 'select',
    options: [
      { value: 'none', label: 'I am not seeking maintenance beyond any written agreement' },
      { value: 'seek', label: 'I seek maintenance as described in the Notice of Guideline Maintenance' },
    ],
  },
  { key: 'noAncillary', label: 'Are you asking for NO other relief at all (no custody, support, property, etc.)?', type: 'yesno' },
  { key: 'otherRelief', label: 'Other relief you are asking for (optional)', type: 'text', help: 'For example custody, child support, or resuming a prior name.' },
];

function ancillary(a: Answers, page: number, pos: { text: [number, number, number]; agreement: [number, number]; waive: [number, number]; noMaint: [number, number]; seek: [number, number]; none: [number, number] }): Draw[] {
  const d: Draw[] = [...T(page, pos.text[0], pos.text[1], a.otherRelief, pos.text[2])];
  if (a.property === 'agreement') d.push(X(page, ...pos.agreement));
  if (a.property === 'waive') d.push(X(page, ...pos.waive));
  if (a.maintenance === 'none') d.push(X(page, ...pos.noMaint));
  if (a.maintenance === 'seek') d.push(X(page, ...pos.seek));
  if (a.noAncillary === 'yes') d.push(X(page, ...pos.none));
  return d;
}

const ud1: FillableForm = {
  id: 'ud-1',
  state: 'NY',
  formNumber: 'UD-1',
  title: 'Summons with Notice (Uncontested Divorce)',
  description: 'Starts an uncontested divorce in NY Supreme Court. Served on your spouse with the required notices.',
  file: '/forms/ny/ud1.pdf',
  sourceUrl: 'https://www.nycourts.gov/forms/summons-notice',
  partyKeys: [],
  questions: [
    ...shared,
    { key: 'phone', label: 'Your phone number', type: 'text' },
    {
      key: 'venue', label: 'Why this county? (basis of venue)', type: 'select', required: true,
      options: [
        { value: 'plaintiff', label: 'I live in this county' },
        { value: 'defendant', label: 'My spouse lives in this county' },
      ],
    },
  ],
  stillToDo: [
    'Date and sign the summons.',
    'Buy an index number from the County Clerk ($210, or ask for a fee waiver), and fill in the index number and the date filed.',
    'Have the summons served on your spouse with the Notice of Automatic Orders, Notice of Guideline Maintenance, and the notice about health care coverage (and the Child Support Standards Chart if you have children), within 120 days of filing.',
    'Instead of UD-1 you can start with UD-1a and the Verified Complaint (UD-2). The court\'s free DIY program can prepare the whole packet.',
  ],
  fill: (a) => {
    const d: Draw[] = [
      ...T(0, 148, 730, a.county, 72),
      ...T(0, 450, 744, a.indexNo, 90),
      ...T(0, 492, 715, a.county, 48),
      ...T(0, 398, 673, a.venue === 'defendant' ? "Defendant's residence" : a.venue === 'plaintiff' ? "Plaintiff's residence" : undefined, 140),
      ...T(0, 80, 674, a.plaintiff, 230),
      ...T(0, 80, 602, a.defendant, 230),
      // "Plaintiff/Defendant resides at:" — the residence that is the basis of venue.
      ...T(0, 398, 616, a.venue === 'defendant' ? a.dStreet : a.pStreet, 140),
      ...T(0, 398, 602, a.venue === 'defendant' ? a.dCity : a.pCity, 140),
      X(0, 486.5, 483), // serve a notice of appearance on the Plaintiff (self-represented)
      X(0, 325.5, 384), // signed by Plaintiff
      ...T(0, 397, 355, a.phone, 140),
      ...T(0, 412, 341, a.pStreet, 128),
      ...T(0, 412, 328, a.pCity, 128),
      ...T(0, 313, 292, a.ground, 16),
      ...T(0, 340, 292, GROUNDS[a.ground], 198),
      ...ancillary(a, 0, { text: [70, 221, 468], agreement: [68.5, 192], waive: [68.5, 178], noMaint: [322.5, 162], seek: [269.5, 149], none: [68.5, 121] }),
    ];
    return { text: {}, check: [], draw: d };
  },
};

// UD-2 residency (paragraph SECOND): which box and which party.
const RESIDENCY: { value: string; label: string; marks: [number, number][] }[] = [
  { value: 'A-P', label: 'A: I have lived in New York State continuously for at least 2 years before filing', marks: [[89.5, 477], [123.5, 477]] },
  { value: 'A-D', label: 'A: My spouse has lived in New York State continuously for at least 2 years before filing', marks: [[89.5, 477], [122.5, 461]] },
  { value: 'B-P-a', label: 'B: I have lived in NY for at least 1 year before filing, and we married in NY', marks: [[88.5, 417], [123.5, 417], [156.5, 344]] },
  { value: 'B-P-b', label: 'B: I have lived in NY for at least 1 year before filing, and we lived in NY as a married couple', marks: [[88.5, 417], [123.5, 417], [157.5, 314]] },
  { value: 'B-D-a', label: 'B: My spouse has lived in NY for at least 1 year before filing, and we married in NY', marks: [[88.5, 417], [119.5, 401], [156.5, 344]] },
  { value: 'B-D-b', label: 'B: My spouse has lived in NY for at least 1 year before filing, and we lived in NY as a married couple', marks: [[88.5, 417], [119.5, 401], [157.5, 314]] },
  { value: 'C-P', label: 'C: The grounds happened in NY and I have lived in NY for at least 1 year before filing', marks: [[89.5, 268], [355.5, 268]] },
  { value: 'C-D', label: 'C: The grounds happened in NY and my spouse has lived in NY for at least 1 year before filing', marks: [[89.5, 268], [355.5, 252]] },
  { value: 'D', label: 'D: The grounds happened in NY and we both lived in NY when the case started', marks: [[89.5, 187]] },
];

const CHILD_ROWS = [298, 312, 325, 339, 353];

const ud2: FillableForm = {
  id: 'ud-2',
  state: 'NY',
  formNumber: 'UD-2',
  title: 'Verified Complaint (Uncontested Divorce)',
  description: 'The complaint in an uncontested divorce: residency, marriage, children, health plans and grounds.',
  file: '/forms/ny/ud2.pdf',
  sourceUrl: 'https://www.nycourts.gov/divorce-resources/uncontested-divorce-information-and-forms',
  partyKeys: [],
  questions: [
    ...shared,
    { key: 'residency', label: 'Which residency rule applies? (paragraph SECOND)', type: 'select', required: true, options: RESIDENCY.map(({ value, label }) => ({ value, label })) },
    { key: 'marriedOn', label: 'Date you were married', type: 'date', required: true },
    { key: 'marriedAt', label: 'Where you were married (city, town or village; and state or country)', type: 'text', required: true },
    { key: 'hasChildren', label: 'Are there children of the marriage? (see the court definition: under 21)', type: 'yesno', required: true },
    { key: 'children', label: 'Children: one per line as "name, date of birth, address"', type: 'textarea', help: 'Up to 5 fit on the form.' },
    { key: 'pPlan', label: 'Your group health plan (if any)', type: 'text' },
    { key: 'pPlanAddr', label: 'Your plan: address', type: 'text' },
    { key: 'pPlanId', label: 'Your plan: ID number', type: 'text' },
    { key: 'pPlanAdmin', label: 'Your plan: administrator', type: 'text' },
    { key: 'pPlanType', label: 'Your plan: type of coverage', type: 'text' },
    { key: 'dPlan', label: "Your spouse's group health plan (if any)", type: 'text' },
    { key: 'dPlanAddr', label: "Spouse's plan: address", type: 'text' },
    { key: 'dPlanId', label: "Spouse's plan: ID number", type: 'text' },
    { key: 'dPlanAdmin', label: "Spouse's plan: administrator", type: 'text' },
    { key: 'dPlanType', label: "Spouse's plan: type of coverage", type: 'text' },
  ],
  stillToDo: [
    'Paragraph 8 (page 2): if a religious officiant performed the marriage, cross out "not" and tick the box that applies (barriers to remarriage).',
    'Grounds (pages 2–4): if you chose a ground other than §170(7), tick it and write the facts it asks for.',
    'Paragraph FIRST: leave "herein" if you are representing yourself.',
    'Date and sign page 5, and complete the verification in front of a notary or as an affirmation.',
    'UD-2 is served with a Summons with Verified Complaint (UD-1a). The court\'s free DIY program can prepare the whole packet.',
  ],
  fill: (a) => {
    const res = RESIDENCY.find((r) => r.value === a.residency);
    const d: Draw[] = [
      ...T(0, 141, 697, a.county, 100),
      ...T(0, 442, 664, a.indexNo, 86),
      ...T(0, 80, 668, a.plaintiff, 230),
      ...T(0, 80, 592, a.defendant, 230),
      ...(res?.marks ?? []).map(([x, y]) => X(0, x, y)),
      ...T(0, 388, 143, a.marriedOn, 148),
      ...T(0, 296, 121, a.marriedAt, 243),
      ...T(1, 222, 420, [a.pStreet, a.pCity].filter(Boolean).join(', '), 300),
      ...T(1, 233, 406, [a.dStreet, a.dCity].filter(Boolean).join(', '), 290),
      ...T(1, 170, 335, a.pPlan, 118), ...T(1, 120, 321, a.pPlanAddr, 170), ...T(1, 187, 308, a.pPlanId, 104),
      ...T(1, 171, 294, a.pPlanAdmin, 122), ...T(1, 166, 280, a.pPlanType, 128),
      ...T(1, 411, 335, a.dPlan, 122), ...T(1, 366, 321, a.dPlanAddr, 170), ...T(1, 430, 308, a.dPlanId, 104),
      ...T(1, 413, 294, a.dPlanAdmin, 122), ...T(1, 408, 280, a.dPlanType, 128),
      ...(a.ground === '7' ? [X(3, 73.5, 494)] : []),
      ...ancillary(a, 4, { text: [74, 687, 446], agreement: [73.5, 626], waive: [73.5, 610], noMaint: [324.5, 586], seek: [350.5, 556], none: [73.5, 519] }),
      X(4, 397.5, 437), // signed by Plaintiff
      ...T(4, 452, 406, a.pStreet, 140),
      ...T(4, 452, 393, a.pCity, 140),
      ...T(4, 78, 363, a.plaintiff, 240),
    ];
    if (a.hasChildren === 'no') d.push(X(1, 167.5, 583));
    if (a.hasChildren === 'yes') {
      const rows = (a.children ?? '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 5);
      d.push(X(1, 166.5, 553), ...T(1, 248, 553, rows.length ? String(rows.length) : undefined, 50));
      rows.forEach((row, i) => {
        const [name, dob, ...addr] = row.split(',').map((s) => s.trim());
        const y = 792 - CHILD_ROWS[i] + 3;
        d.push(...T(1, 74, y, name, 146, 9), ...T(1, 245, y, dob, 62, 9), ...T(1, 332, y, addr.join(', '), 206, 9));
      });
    }
    return { text: {}, check: [], draw: d };
  },
};

export const NY_DIVORCE_FORMS: FillableForm[] = [ud1, ud2];
export const NY_DIY_DIVORCE_URL = 'https://www.nycourts.gov/help/diy-forms/uncontested-divorce-program';
