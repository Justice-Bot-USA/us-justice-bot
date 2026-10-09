// New York forms. PDFs in public/forms/ny/ are the official nycourts.gov files, checked against
// the court's forms pages on 2026-10-09:
//   CIV-SC-50  https://www.nycourts.gov/forms/statement-claim-small-claims (two link annotations
//              that the original lists as form fields were removed so pdf-lib can read it)
//   UCS-FW1    https://www.nycourts.gov/forms/application-waive-court-costs-fees-and-expenses
//              (01/2025, statewide; UCS-FW1S is the Surrogate's Court version)
// Field names below were read from those files.
import type { FillableForm, Question } from './types';
import { compact } from './party';
import { NY_DIVORCE_FORMS } from './nyDivorce';

const upper = (v?: string) => v?.trim().toUpperCase();
const money = (v?: string) => v?.replace(/[$\s]/g, '');

const NY_COUNTIES = [
  'ALBANY', 'ALLEGANY', 'BRONX', 'BROOME', 'CATTARAUGUS', 'CAYUGA', 'CHAUTAUQUA', 'CHEMUNG', 'CHENANGO', 'CLINTON',
  'COLUMBIA', 'CORTLAND', 'DELAWARE', 'DUTCHESS', 'ERIE', 'ESSEX', 'FRANKLIN', 'FULTON', 'GENESEE', 'GREENE',
  'HAMILTON', 'HERKIMER', 'JEFFERSON', 'KINGS', 'LEWIS', 'LIVINGSTON', 'MADISON', 'MONROE', 'MONTGOMERY', 'NASSAU',
  'NEW YORK', 'NIAGARA', 'ONEIDA', 'ONONDAGA', 'ONTARIO', 'ORANGE', 'ORLEANS', 'OSWEGO', 'OTSEGO', 'PUTNAM', 'QUEENS',
  'RENSSELAER', 'RICHMOND', 'ROCKLAND', 'SARATOGA', 'SCHENECTADY', 'SCHOHARIE', 'SCHUYLER', 'SENECA', 'ST. LAWRENCE',
  'STEUBEN', 'SUFFOLK', 'SULLIVAN', 'TIOGA', 'TOMPKINS', 'ULSTER', 'WARREN', 'WASHINGTON', 'WAYNE', 'WESTCHESTER',
  'WYOMING', 'YATES',
];
const NYC_BOROUGH: Record<string, string> = {
  'NEW YORK': 'Manhattan', KINGS: 'Brooklyn', QUEENS: 'Queens', BRONX: 'Bronx', RICHMOND: 'Staten Island',
};
const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const countyQuestion: Question = {
  key: 'nyCounty', label: 'County of the court', type: 'select', required: true,
  options: NY_COUNTIES.map((c) => ({ value: c, label: NYC_BOROUGH[c] ? `${titleCase(c)} (${NYC_BOROUGH[c]})` : titleCase(c) })),
};

// ── CIV-SC-50 ─────────────────────────────────────────────────────────────────
// "Primary reason for claim (check one)": the user picks; each option is one checkbox.
const SC50_REASONS: [string, string, string][] = [
  ['Damage caused to', 'automobile', 'CheckBox3'],
  ['Damage caused to', 'other personal property', 'CheckBox11'],
  ['Damage caused to', 'real property', 'real_property'],
  ['Damage caused to', 'person', 'person'],
  ['Failure to provide', 'proper repairs', 'CheckBox4'],
  ['Failure to provide', 'proper services', 'CheckBox12'],
  ['Failure to provide', 'proper merchandise', 'proper_merchandise'],
  ['Failure to provide', 'goods paid for', 'goods_paid_for'],
  ['Failure to return', 'security', 'CheckBox5'],
  ['Failure to return', 'property', 'CheckBox13'],
  ['Failure to return', 'deposit', 'deposit'],
  ['Failure to return', 'money loaned', 'moneyloaned2'],
  ['Failure to pay', 'salary', 'CheckBox6'],
  ['Failure to pay', 'for services rendered', 'CheckBox14'],
  ['Failure to pay', 'insurance claim', 'insurance_claim'],
  ['Failure to pay', 'rent', 'CheckBox7'],
  ['Failure to pay', 'commissions', 'CheckBox16'],
  ['Failure to pay', 'for goods sold and delivered', 'for_goods_sold_and_delivered'],
  ['Breach of', 'contract', 'CheckBox8'],
  ['Breach of', 'lease', 'CheckBox17'],
  ['Breach of', 'warranty', 'warranty'],
  ['Breach of', 'agreement', 'agreement'],
  ['Loss of', 'luggage', 'CheckBox9'],
  ['Loss of', 'property', 'CheckBox18'],
  ['Loss of', 'time from work', 'time_from_work'],
  ['Loss of', 'use of property', 'use_of_property'],
  ['Returned', 'check (bounced)', 'CheckBox10'],
  ['Returned', 'check (stopped)', 'CheckBox19'],
];

const civSc50: FillableForm = {
  id: 'civ-sc-50',
  state: 'NY',
  formNumber: 'CIV-SC-50',
  title: 'Statement of Claim (Small Claims, NYC Civil Court)',
  description: 'Start a small claims case for up to $10,000 in the Civil Court of the City of New York (all five boroughs).',
  file: '/forms/ny/civsc50.pdf',
  sourceUrl: 'https://www.nycourts.gov/forms/statement-claim-small-claims',
  partyKeys: [],
  questions: [
    { key: 'yourLast', label: 'Your last name', type: 'text', required: true },
    { key: 'yourFirst', label: 'Your first name', type: 'text', required: true },
    { key: 'yourMiddle', label: 'Your middle initial', type: 'text' },
    { key: 'yourStreet', label: 'Your street address (no P.O. box)', type: 'text', required: true },
    { key: 'yourCity', label: 'Your borough, city, town or village', type: 'text', required: true },
    { key: 'yourState', label: 'Your state', type: 'text', help: 'Two letters, e.g. NY' },
    { key: 'yourZip', label: 'Your ZIP code', type: 'text' },
    { key: 'yourOther', label: 'Your other info (optional)', type: 'text', help: 'For example "Doing business as …", "In care of …", or "Attention to …". Circle the matching words on the printed form.' },
    { key: 'yourPhone', label: 'Your phone number', type: 'text' },
    { key: 'yourEmail', label: 'Your email', type: 'text' },
    {
      key: 'defLast', label: "Defendant's last name, or full business name", type: 'text', required: true,
      help: "Use the legal name; you need it to collect a judgment. Look up a business's correct legal name at dos.ny.gov or the County Clerk.",
    },
    { key: 'defFirst', label: "Defendant's first name (leave blank for a business)", type: 'text' },
    { key: 'defMiddle', label: "Defendant's middle initial", type: 'text' },
    { key: 'defStreet', label: "Defendant's street address (no P.O. box)", type: 'text', required: true, help: 'A P.O. box is not accepted.' },
    { key: 'defCity', label: "Defendant's borough, city, town or village", type: 'text', required: true },
    { key: 'defZip', label: "Defendant's ZIP code", type: 'text' },
    { key: 'defOther', label: "Defendant's other info (optional)", type: 'text', help: 'For example "Doing business as …", "In care of …", or "Attention to …".' },
    { key: 'defPhone', label: "Defendant's phone (if known)", type: 'text' },
    { key: 'defEmail', label: "Defendant's email (if known)", type: 'text' },
    { key: 'amount', label: 'Amount you are claiming ($)', type: 'money', required: true, help: 'Maximum $10,000.' },
    { key: 'when', label: 'Date of the occurrence or transaction', type: 'date' },
    {
      key: 'reason', label: 'Primary reason for your claim (pick one)', type: 'select', required: true,
      options: [
        ...SC50_REASONS.map(([group, item]) => ({ value: `${group}:${item}`, label: `${group}: ${item}` })),
        { value: 'other', label: 'Other (describe briefly below)' },
      ],
    },
    { key: 'other', label: 'If "Other", describe briefly', type: 'text' },
    { key: 'autoPlace', label: 'Place of occurrence, if it was a car accident', type: 'text', help: 'Car accident claims must be vehicle owner against vehicle owner.' },
    { key: 'ids', label: 'Identifying numbers (receipt, claim, account, policy, ticket, license or plate numbers)', type: 'text' },
  ],
  stillToDo: [
    'Sign the form. Today\'s date is filled in for you; change it if you sign on a different day.',
    'If you entered "other info", circle "Doing Business As", "In Care Of" or "Attention To" on the printed form.',
    'File it at the Small Claims Part of the Civil Court in the borough where the defendant lives, works, or has a place of business, and pay the filing fee ($15 for claims up to $1,000, $20 over $1,000). If you cannot afford it, ask about a fee waiver (UCS-FW1).',
    'The clerk gives you a hearing date. Bring your evidence and witnesses.',
  ],
  fill: (a) => {
    const reason = SC50_REASONS.find(([g, i]) => `${g}:${i}` === a.reason);
    return {
      text: compact({
        FillText2: upper(a.yourLast),
        FillText3: upper(a.yourFirst),
        FillText4: upper(a.yourMiddle)?.slice(0, 1),
        FillText5: upper(a.yourStreet),
        FillText6: upper(a.yourCity),
        FillText7: upper(a.yourState),
        FillText8: a.yourZip,
        FillText9: upper(a.yourOther),
        Claimant_Phone_No: a.yourPhone,
        Claimant_EMAIL: a.yourEmail,
        DEFENDANTS_LAST_NAME: upper(a.defLast),
        DEFENDANTS_FIRST_NAME: upper(a.defFirst),
        DEFENDANTS_MIDDLE_INITIAL: upper(a.defMiddle)?.slice(0, 1),
        DEFENDANTS_ADDRESS: upper(a.defStreet),
        DEFENDANTS_BOROUGH_CITY: upper(a.defCity),
        DEFENDANTS_ZIP: a.defZip,
        DEFENDANTS_OTHER_INFO: upper(a.defOther),
        Defendants_Phone_No: a.defPhone,
        Defendants_Email: a.defEmail,
        Amount_Claimed: money(a.amount),
        Date_of_Occurrence_or_Transaction: a.when,
        Place_of_occurrence_if_Auto_Accident: upper(a.autoPlace),
        FillText10: a.reason === 'other' ? upper(a.other) : undefined,
        IDENTIFYING_NUMBERS: a.ids,
        TODAYS_DATE: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      }),
      check: reason ? [reason[2]] : [],
    };
  },
};

// ── UCS-FW1 ───────────────────────────────────────────────────────────────────
// Each money line: [answer key, label, item checkbox, amount field, section checkbox].
type Line = [string, string, string, string, string];
const ASSETS: Line[] = [
  ['wages', 'Monthly take-home wages', 'Wages', 'WagesAmount', 'Income'],
  ['spousalSupport', 'Spousal support (alimony) you receive each month', 'SpousalSupport', 'SpousalSupportAmount', 'Income'],
  ['socialSecurity', 'Social Security / SSI / SSID each month', 'SocialSecurity/SSI/SSID', 'SocialSecurity/SSI/SSIDAmount', 'Income'],
  ['otherIncome', 'Other monthly income (amount)', 'OtherIncome', 'OtherIncomeAmount', 'Income'],
  ['checking', 'Total in checking accounts', 'CheckingAccounts', 'CheckingAccountBalance', 'BankAccounts'],
  ['savings', 'Total in savings accounts', 'SavingsAccounts', 'SavingsAccountBalance', 'BankAccounts'],
  ['cash', 'Cash on hand (not in a bank)', 'Cash', 'CashAmount', 'CashBondsSecuritiesOtherInvestments'],
  ['bonds', 'Value of bonds', 'Bonds', 'BondsAmount', 'CashBondsSecuritiesOtherInvestments'],
  ['securities', 'Value of stocks / mutual funds', 'Securities', 'SecuritiesAmount', 'CashBondsSecuritiesOtherInvestments'],
  ['otherInvestments', 'Other investments (value)', 'OtherInvestments', 'OtherInvestmentsAmount', 'CashBondsSecuritiesOtherInvestments'],
];
const EXPENSES: Line[] = [
  ['rent', 'Rent', 'Rent', 'RentPaymentAmount', 'Housing'],
  ['mortgage', 'Mortgage', 'Mortgage', 'MortgagePaymentAmount', 'Housing'],
  ['propertyTaxes', 'Real property taxes (monthly)', 'RealPropertyTaxes', 'RealPropertyTaxesAmount', 'Housing'],
  ['homeInsurance', "Homeowners' insurance (monthly)", 'HomeownersInsurance', 'HomeownersInsuranceAmount', 'Housing'],
  ['hoa', 'HOA / condo fees, maintenance and repairs', 'HOA/CondoFees', 'HOA/CondoFeesAmount', 'Housing'],
  ['medical', 'Out-of-pocket medical or dental', 'Medical/DentalExpenses', 'Medical/DentalExpensesAmount', 'OtherExpenses'],
  ['healthInsurance', 'Health insurance premiums', 'HealthInsurancePremiums', 'HealthInsurancePremiumsAmount', 'OtherExpenses'],
  ['childSupportPaid', 'Child support you pay', 'ChildSupportPayments', 'ChildSupportPaymentsAmount', 'OtherExpenses'],
  ['transportation', 'Transportation (fares, insurance, car loan, gas)', 'TransportationExpenses', 'TransportationExpensesAmount', 'OtherExpenses'],
  ['spousalSupportPaid', 'Spousal support (alimony) you pay', 'SpousalSupportPayments', 'SpousalSupportPaymentsAmount', 'OtherExpenses'],
  ['education', 'Education', 'EducationExpenses', 'EducationExpensesAmount', 'OtherExpenses'],
  ['childcare', 'Childcare', 'Childcare', 'ChildcareAmount', 'OtherExpenses'],
  ['otherExpense', 'Other monthly expense (amount)', 'OtherOtherExpenses', 'OtherOtherExpensesAmount', 'OtherExpenses'],
];
const moneyQ = ([key, label]: Line): Question => ({ key, label: `${label} ($)`, type: 'money' });
const vehicleQs = (n: number): Question[] => [
  { key: `v${n}Make`, label: `Vehicle ${n}: make`, type: 'text' },
  { key: `v${n}Model`, label: `Vehicle ${n}: model`, type: 'text' },
  { key: `v${n}Year`, label: `Vehicle ${n}: year`, type: 'text' },
  { key: `v${n}Value`, label: `Vehicle ${n}: value minus any unpaid loan ($)`, type: 'money' },
];

const ucsFw1: FillableForm = {
  id: 'ucs-fw1',
  state: 'NY',
  formNumber: 'UCS-FW1',
  title: 'Application to Waive Court Costs, Fees, and Expenses',
  description: 'Ask any New York court to waive filing fees and costs because you cannot afford them (CPLR 1101).',
  file: '/forms/ny/ucsfw1.pdf',
  sourceUrl: 'https://www.nycourts.gov/forms/application-waive-court-costs-fees-and-expenses',
  partyKeys: ['yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'caseNumber', 'otherName'],
  otherPartyLabel: 'the opposing party in the case',
  questions: [
    { key: 'courtName', label: 'Court name', type: 'text', required: true, help: 'For example: Supreme, Civil Court of the City of New York, Family, City Court of Buffalo.' },
    countyQuestion,
    {
      key: 'role', label: 'In this case you are the…', type: 'select', required: true,
      options: [{ value: 'plaintiff', label: 'Plaintiff / Petitioner (bringing the case)' }, { value: 'defendant', label: 'Defendant / Respondent' }],
    },
    ...ASSETS.slice(0, 3).map(moneyQ),
    { key: 'otherIncomeSource', label: 'Other income: what is it?', type: 'text' },
    moneyQ(ASSETS[3]),
    ...ASSETS.slice(4, 9).map(moneyQ),
    { key: 'otherInvestmentsType', label: 'Other investments: what are they?', type: 'text' },
    moneyQ(ASSETS[9]),
    { key: 'realEstate', label: 'Address(es) of any real estate you own', type: 'textarea' },
    { key: 'realEstateValue', label: 'Total market value of that real estate ($)', type: 'money' },
    ...vehicleQs(1),
    ...vehicleQs(2),
    ...EXPENSES.slice(0, 5).map(moneyQ),
    { key: 'utilities', label: 'Utilities: internet, phone, water, gas, electric, heating ($/month)', type: 'money' },
    ...EXPENSES.slice(5, 12).map(moneyQ),
    { key: 'otherExpenseType', label: 'Other monthly expense: what is it?', type: 'text' },
    moneyQ(EXPENSES[12]),
    { key: 'hasDependents', label: 'Are you responsible for financially supporting other people?', type: 'yesno', required: true },
    {
      key: 'dependents', label: 'Dependents: one per line as "age, relationship"', type: 'textarea',
      help: 'For example "7, daughter". Do not include names or dates of birth. Up to 4 fit on the form.',
    },
    {
      key: 'request', label: 'What do you want the court to waive?', type: 'select', required: true,
      options: [
        { value: '0', label: 'All court costs, fees, and expenses for this case' },
        { value: '1', label: 'The filing fee for a Notice of Appeal' },
        { value: '2', label: 'Something else (describe below)' },
      ],
    },
    { key: 'requestOther', label: 'If something else: describe it', type: 'text' },
    {
      key: 'alreadyFiled', label: 'Have you already filed a summons and complaint, petition, or order to show cause in this case?', type: 'yesno', required: true,
      help: 'If yes, you must also serve this application with a Notice of Motion (UCS-FW2) and file an Affirmation of Service (UCS-FW3).',
    },
    {
      key: 'facts', label: 'How will you explain the facts of your case?', type: 'select', required: true,
      options: [
        { value: '0', label: 'In my attached court papers (complaint, petition, answer, or affidavit)' },
        { value: '1', label: 'I will explain them here' },
      ],
    },
    { key: 'factsText', label: 'If explaining here: why you have a valid case', type: 'textarea' },
    { key: 'appliedBefore', label: 'Have you applied before to waive fees in this case?', type: 'yesno', required: true },
    { key: 'appliedBeforeWhy', label: 'If yes: why you are applying again', type: 'textarea' },
  ],
  stillToDo: [
    'Check every amount. Item 7 of the form says you have no income or assets other than those listed.',
    'Page 3: fill in the day, month and year, then sign and print your name. You sign under penalty of perjury.',
    'If you have more than 2 vehicles or 4 dependents, add them on the form.',
    'File it with the court clerk. If you already started the case, serve it with a Notice of Motion (UCS-FW2) and file an Affirmation of Service (UCS-FW3).',
    'The judge may ask for proof of income, such as pay stubs or bank statements.',
  ],
  fill: (a) => {
    const check = new Set<string>();
    const text: Record<string, string | undefined> = {};
    for (const [key, , box, amountField, section] of [...ASSETS, ...EXPENSES]) {
      const v = money(a[key]);
      if (v) {
        text[amountField] = v;
        check.add(box);
        check.add(section);
      }
    }
    if (money(a.utilities)) { text.UtilitiesAmount = money(a.utilities); check.add('Utilities'); }
    if (a.realEstate?.trim() || money(a.realEstateValue)) {
      text.RealEstateAddresses = a.realEstate;
      text.OtherRealEstateAmount = money(a.realEstateValue);
      check.add('RealEstate');
    }
    for (const n of [1, 2]) {
      if (a[`v${n}Make`]?.trim() || a[`v${n}Model`]?.trim()) {
        text[`Vehicle${n}Make`] = a[`v${n}Make`];
        text[`Vehicle${n}Model`] = a[`v${n}Model`];
        text[`Vehicle${n}Year`] = a[`v${n}Year`];
        text[`Vehicle${n}Value`] = money(a[`v${n}Value`]);
        check.add('Vehicles');
      }
    }
    if (a.hasDependents === 'yes') {
      (a.dependents ?? '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 4).forEach((l, i) => {
        const [age, ...rel] = l.split(',');
        text[`Dependent${i + 1}Age`] = age.trim();
        text[`Dependent${i + 1}Relationship`] = rel.join(',').trim();
      });
    }

    const address = [a.yourStreet, a.yourCity, [a.yourState, a.yourZip].filter(Boolean).join(' ')].filter((x) => x?.trim()).join(', ');
    const radio: Record<string, number> = {};
    if (a.hasDependents) radio.Dependents = a.hasDependents === 'yes' ? 0 : 1;
    if (a.request) radio.Request = Number(a.request);
    if (a.alreadyFiled) radio.PreviousFiling = a.alreadyFiled === 'yes' ? 0 : 1;
    if (a.facts) radio.Facts = Number(a.facts);
    // Widget 0 is "I have not previously applied", widget 1 is "I have".
    if (a.appliedBefore) radio.PreviousApplication = a.appliedBefore === 'yes' ? 1 : 0;

    return {
      text: compact({
        ...text,
        CourtName: a.courtName,
        Plaintiffs: a.role === 'plaintiff' ? a.yourName : a.otherName,
        Defendants: a.role === 'defendant' ? a.yourName : a.otherName,
        IndexNumber: a.caseNumber,
        ApplicantAddress: address,
        ApplicantName: a.yourName,
        'OtherIncome-specify': a.otherIncomeSource,
        'OtherInvestments-specify': a.otherInvestmentsType,
        'OtherOtherExpenses-specify': a.otherExpenseType,
        CourtOrderOtherSpecify: a.request === '2' ? a.requestOther : undefined,
        FactsSpecify: a.facts === '1' ? a.factsText : undefined,
        PreviousApplicationExplain: a.appliedBefore === 'yes' ? a.appliedBeforeWhy : undefined,
      }),
      check: [...check],
      radio,
      select: a.nyCounty ? { CourtCounty: a.nyCounty } : undefined,
    };
  },
};

export const NY_FILLABLE: FillableForm[] = [civSc50, ucsFw1, ...NY_DIVORCE_FORMS];
