// California Judicial Council forms. PDFs in public/forms/ca/ are the official
// courts.ca.gov files with the owner password and XFA layer removed so every PDF
// reader shows the filled AcroForm fields (computer-produced forms: Cal. Rules of
// Court, rule 1.31). Field names below were read from those files.
import type { FillableForm } from './types';
import { compact } from './party';

const SRC = (n: string) => `https://www.courts.ca.gov/documents/${n}.pdf`;
const line = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(', ');

const SC = 'SC-100[0].';
const sc100: FillableForm = {
  id: 'sc-100',
  state: 'CA',
  formNumber: 'SC-100',
  title: "Plaintiff's Claim and ORDER to Go to Small Claims Court",
  description: 'Start a small claims case for up to $12,500 (individuals) or $6,250 (businesses).',
  file: '/forms/ca/sc100.pdf',
  sourceUrl: SRC('sc100'),
  partyKeys: ['county', 'yourName', 'yourPhone', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourEmail',
    'otherName', 'otherPhone', 'otherStreet', 'otherCity', 'otherState', 'otherZip'],
  otherPartyLabel: 'Defendant (the person or business you are suing)',
  questions: [
    { key: 'amount', label: 'Amount you are claiming ($)', type: 'money', required: true },
    { key: 'why', label: 'Why does the defendant owe you money?', type: 'textarea', required: true },
    { key: 'when', label: 'When did this happen? (date)', type: 'date' },
    { key: 'how', label: 'How did you calculate the amount?', type: 'textarea' },
    { key: 'asked', label: 'Did you ask the defendant to pay before suing?', type: 'yesno', required: true },
    { key: 'askedWhyNot', label: 'If no, explain why not', type: 'textarea' },
    { key: 'zip', label: 'ZIP code of the place where the defendant lives or the dispute happened (if known)', type: 'text' },
  ],
  stillToDo: [
    'Item 5: check the box for why you are filing at this courthouse.',
    'Items 7–10: answer the yes/no questions (attorney fee dispute, public entity, number of claims filed).',
    'Sign and date page 4.',
    'File with the small claims clerk and pay the filing fee, or file FW-001 to ask for a fee waiver.',
  ],
  fill: (a) => {
    const p2 = SC + 'Page2[0].', p3 = SC + 'Page3[0].', p4 = SC + 'Page4[0].';
    const amount = (a.amount || '').replace(/[$\s]/g, '');
    const check: string[] = [];
    if (a.asked === 'yes') check.push(p3 + 'List4[0].Item4[0].Checkbox50[0]');
    if (a.asked === 'no') check.push(p3 + 'List4[0].Item4[0].Checkbox50[1]');
    const n = Number(amount.replace(/,/g, ''));
    if (!Number.isNaN(n) && amount) check.push(p4 + `List10[0].li10[0].Checkbox63[${n > 2500 ? 0 : 1}]`);
    return {
      text: compact({
        [SC + 'Page1[0].CaptionRight[0].County[0].CourtInfo[0]']: a.county,
        [p2 + 'PxCaption[0].Plaintiff[0]']: a.yourName,
        [p3 + 'PxCaption[0].Plaintiff[0]']: a.yourName,
        [p4 + 'PxCaption[0].Plaintiff[0]']: a.yourName,
        [p2 + 'List1[0].Item1[0].PlaintiffName1[0]']: a.yourName,
        [p2 + 'List1[0].Item1[0].PlaintiffPhone1[0]']: a.yourPhone,
        [p2 + 'List1[0].Item1[0].PlaintiffAddress1[0]']: a.yourStreet,
        [p2 + 'List1[0].Item1[0].PlaintiffCity1[0]']: a.yourCity,
        [p2 + 'List1[0].Item1[0].PlaintiffState1[0]']: a.yourState,
        [p2 + 'List1[0].Item1[0].PlaintiffZip1[0]']: a.yourZip,
        [p2 + 'List1[0].Item1[0].EmailAdd1[0]']: a.yourEmail,
        [p2 + 'List2[0].item2[0].DefendantName1[0]']: a.otherName,
        [p2 + 'List2[0].item2[0].DefendantPhone1[0]']: a.otherPhone,
        [p2 + 'List2[0].item2[0].DefendantAddress1[0]']: a.otherStreet,
        [p2 + 'List2[0].item2[0].DefendantCity1[0]']: a.otherCity,
        [p2 + 'List2[0].item2[0].DefendantState1[0]']: a.otherState,
        [p2 + 'List2[0].item2[0].DefendantZip1[0]']: a.otherZip,
        [p2 + 'List3[0].PlaintiffClaimAmount1[0]']: amount,
        [p2 + 'List3[0].Lia[0].FillField2[0]']: a.why,
        [p3 + 'List3[0].Lib[0].Date1[0]']: a.when,
        [p3 + 'List3[0].Lic[0].FillField1[0]']: a.how,
        [p3 + 'List4[0].Item4[0].FillField2[0]']: a.asked === 'no' ? a.askedWhyNot : undefined,
        [p3 + 'List6[0].item6[0].ZipCode1[0]']: a.zip,
        [p4 + 'Sign[0].PlaintiffName1[0]']: a.yourName,
      }),
      check,
    };
  },
};

const FW = 'FW-001[0].';
const fw001: FillableForm = {
  id: 'fw-001',
  state: 'CA',
  formNumber: 'FW-001',
  title: 'Request to Waive Court Fees',
  description: 'Ask the court to waive filing fees if you receive public benefits or have low income.',
  file: '/forms/ca/fw001.pdf',
  sourceUrl: SRC('fw001'),
  partyKeys: ['county', 'caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourPhone'],
  questions: [
    { key: 'caseName', label: 'Case name (e.g. "Smith v. Jones"), if you have one', type: 'text' },
    { key: 'jobTitle', label: 'Your job title (if employed)', type: 'text' },
    { key: 'employer', label: 'Employer name', type: 'text' },
    { key: 'employerAddress', label: 'Employer address', type: 'text' },
    {
      key: 'benefits', label: 'Do you receive any of these public benefits? (SNAP/CalFresh, SSI, SSP, Medi-Cal, County Relief, IHSS, CalWORKs/TANF, CAPI, WIC, Unemployment)',
      type: 'yesno', help: 'You will tick which ones on the form itself.',
    },
  ],
  stillToDo: [
    'Item 5: tick the benefits you receive, or the income box that applies to you.',
    'Page 2 (if required by item 5): list your income, household members, money and property, and monthly expenses.',
    'Sign and date page 1.',
    'File it together with your court papers. Also bring the court order form FW-003.',
  ],
  fill: (a) => ({
    text: compact({
      [FW + 'Page1[0].RightCaption[0].CourtInfo[0]']: a.county,
      [FW + 'Page1[0].RightCaption[0].CaseNumber[0]']: a.caseNumber,
      [FW + 'Page1[0].RightCaption[0].CaseName[0]']: a.caseName,
      [FW + 'Page1[0].List1[0].item1[0].PetitionerName1[0]']: a.yourName,
      [FW + 'Page1[0].List1[0].item1[0].PetitionerStrAddress[0]']: a.yourStreet,
      [FW + 'Page1[0].List1[0].item1[0].PetitionerCity[0]']: a.yourCity,
      [FW + 'Page1[0].List1[0].item1[0].PetitionerState[0]']: a.yourState,
      [FW + 'Page1[0].List1[0].item1[0].PetitionerZip[0]']: a.yourZip,
      [FW + 'Page1[0].List1[0].item1[0].PetitionerTel[0]']: a.yourPhone,
      [FW + 'Page1[0].List2[0].item2[0].PetitionerJobTitle[0]']: a.jobTitle,
      [FW + 'Page1[0].List2[0].item2[0].PetitionerEmployerName[0]']: a.employer,
      [FW + 'Page1[0].List2[0].item2[0].PetitionerEmployerAdd[0]']: a.employerAddress,
      [FW + 'Page1[0].Sign[0].PetitionerName[0]']: a.yourName,
      [FW + 'Page2[0].pXCaption[0].PetitionerName1[0]']: a.yourName,
      [FW + 'Page2[0].pXCaption[0].CaseNumber[0]']: a.caseNumber,
    }),
    check: [
      FW + 'Page1[0].List4[0].item4[0].WaiveSuperiorCrtFee[0]',
      ...(a.benefits === 'yes' ? [FW + 'Page1[0].List5[0].Lia[0].PublicBenefitReceived[0]'] : []),
    ],
  }),
};

const FW3 = 'FW-003[0].';
const fw003: FillableForm = {
  id: 'fw-003',
  state: 'CA',
  formNumber: 'FW-003',
  title: 'Order on Court Fee Waiver (Superior Court)',
  description: 'The order the judge signs on your fee waiver request. File it with FW-001.',
  file: '/forms/ca/fw003.pdf',
  sourceUrl: SRC('fw003'),
  partyKeys: ['county', 'caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip'],
  questions: [
    { key: 'caseName', label: 'Case name, if you have one', type: 'text' },
  ],
  stillToDo: ['Leave the rest blank. The court fills in its decision.'],
  fill: (a) => ({
    text: compact({
      [FW3 + 'Page1[0].Stamp_court_case[0].CourtInfo_ft[0]']: a.county,
      [FW3 + 'Page1[0].Stamp_court_case[0].CaseNumber_ft[0]']: a.caseNumber,
      [FW3 + 'Page1[0].Stamp_court_case[0].CaseName_ft[0]']: a.caseName,
      [FW3 + 'Page1[0].PersonWaivingName_ft[0]']: a.yourName,
      [FW3 + 'Page1[0].FillText23[0]']: a.yourStreet,
      [FW3 + 'Page1[0].FillText21[0]']: a.yourCity,
      [FW3 + 'Page1[0].FillText20[0]']: a.yourState,
      [FW3 + 'Page1[0].FillText22[0]']: a.yourZip,
      [FW3 + 'Page2[0].PE_P2Header_gp[0].PersonWaivingName_ft[0]']: a.yourName,
      [FW3 + 'Page2[0].PE_P2Header_gp[0].CaseNumber_ft[0]']: a.caseNumber,
    }),
    check: [],
  }),
};

// Shared caption block used by UD-105, CR-180 and CR-181 (Judicial Council "AttyPartyInfo").
const partyCaption = (base: string, a: Record<string, string>) => ({
  [base + 'AttyPartyInfo[0].Name[0]']: a.yourName,
  [base + 'AttyPartyInfo[0].Street[0]']: a.yourStreet,
  [base + 'AttyPartyInfo[0].City[0]']: a.yourCity,
  [base + 'AttyPartyInfo[0].State[0]']: a.yourState,
  [base + 'AttyPartyInfo[0].Zip[0]']: a.yourZip,
  [base + 'AttyPartyInfo[0].Phone[0]']: a.yourPhone,
  [base + 'AttyPartyInfo[0].Email[0]']: a.yourEmail,
  [base + 'CourtInfo[0].CrtCounty[0]']: a.county,
});

const UD = 'UD-105[0].';
const ud105: FillableForm = {
  id: 'ud-105',
  state: 'CA',
  formNumber: 'UD-105',
  title: 'Answer — Unlawful Detainer (Eviction)',
  description: 'Your written answer to an eviction lawsuit. Due within 10 court days of being served.',
  file: '/forms/ca/ud105.pdf',
  sourceUrl: SRC('ud105'),
  partyKeys: ['county', 'caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourPhone', 'yourEmail', 'otherName'],
  otherPartyLabel: 'Plaintiff (your landlord, as named on the complaint)',
  questions: [],
  stillToDo: [
    'Item 2: choose a general denial or specific denials. Read the instructions on the form.',
    'Item 3: tick each defense that applies to you, and write the facts in item 3t.',
    'Items 4–6: other statements and what you ask the court for.',
    'Item 7: answer the unlawful detainer assistant question.',
    'Sign and verify page 4. File within 10 court days of being served, then serve a copy on the landlord.',
  ],
  fill: (a) => {
    const pages: Record<string, string> = {};
    for (const p of [2, 3, 4]) {
      const c = `${UD}Page${p}[0].PxCaption[0].`;
      Object.assign(pages, {
        [c + 'CaseNumber[0].CaseNumber[0]']: a.caseNumber,
        [c + 'TitlePartyName[0].Party1[0]']: a.otherName,
        [c + 'TitlePartyName[0].Party2[0]']: a.yourName,
      });
    }
    const c1 = UD + 'Page1[0].P1Caption[0].';
    return {
      text: compact({
        ...partyCaption(c1, a),
        [c1 + 'CaptionSub[0].CaseNumber[0].CaseNumber[0]']: a.caseNumber,
        [c1 + 'TitlePartyName[0].Party1[0]']: a.otherName,
        [c1 + 'TitlePartyName[0].Party2[0]']: a.yourName,
        [UD + 'Page1[0].List1[0].item1[0].FillField1[0]']: a.yourName,
        ...pages,
        [UD + 'Page4[0].Sign[0].PrintName1[0]']: a.yourName,
        [UD + 'Page4[0].Verification[0].PrintName3[0]']: a.yourName,
      }),
      check: [],
    };
  },
};

const FL = 'FL-100[0].';
const fl100: FillableForm = {
  id: 'fl-100',
  state: 'CA',
  formNumber: 'FL-100',
  title: 'Petition — Marriage/Domestic Partnership',
  description: 'Start a divorce, legal separation, or nullity case.',
  file: '/forms/ca/fl100.pdf',
  sourceUrl: SRC('fl100'),
  partyKeys: ['county', 'caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourPhone', 'yourEmail', 'otherName'],
  otherPartyLabel: 'Respondent (your spouse or domestic partner)',
  questions: [
    { key: 'marriageDate', label: 'Date of marriage', type: 'date' },
    { key: 'separationDate', label: 'Date of separation', type: 'date' },
    { key: 'yourResidence', label: 'City and county where you live', type: 'text', help: 'For example: Oakland, Alameda County' },
    { key: 'spouseResidence', label: 'City and county where your spouse lives', type: 'text' },
  ],
  stillToDo: [
    'Caption: tick Dissolution, Legal Separation, or Nullity, and Marriage or Domestic Partnership.',
    'Item 2: confirm that you meet the residency requirement (6 months in California, 3 months in the county).',
    'Items 3–10: children, grounds, property, support, and other requests.',
    'If you have minor children, also complete FL-105.',
    'Sign and date page 3.',
  ],
  fill: (a) => {
    const c = FL + 'Page1[0].CaptionP1_sf[0].';
    const pageParties: Record<string, string> = {};
    for (const p of [2, 3]) {
      Object.assign(pageParties, {
        [`${FL}Page${p}[0].CaseNumber[0].CaseNumber_ft[0]`]: a.caseNumber,
        [`${FL}Page${p}[0].Parties[0].Party1_ft[0]`]: a.yourName,
        [`${FL}Page${p}[0].Parties[0].Party2_ft[0]`]: a.otherName,
      });
    }
    return {
      text: compact({
        [c + 'AttyInfo[0].AttyName_ft[0]']: a.yourName,
        [c + 'AttyInfo[0].AttyStreet_ft[0]']: a.yourStreet,
        [c + 'AttyInfo[0].AttyCity_ft[0]']: a.yourCity,
        [c + 'AttyInfo[0].AttyState_ft[0]']: a.yourState,
        [c + 'AttyInfo[0].AttyZip_ft[0]']: a.yourZip,
        [c + 'AttyInfo[0].Phone_ft[0]']: a.yourPhone,
        [c + 'AttyInfo[0].Email_ft[0]']: a.yourEmail,
        [c + 'CourtInfo[0].CrtCounty_ft[0]']: a.county,
        [c + 'TitlePartyName[0].Party1_ft[0]']: a.yourName,
        [c + 'TitlePartyName[0].Party2_ft[0]']: a.otherName,
        [c + 'CaseNumber[0].CaseNumber_ft[0]']: a.caseNumber,
        [FL + 'Page1[0].DateOfMarriage_dt[0]']: a.marriageDate,
        [FL + 'Page1[0].DateOfSeparation_dt[0]']: a.separationDate,
        [FL + 'Page1[0].PetitionersResidence_tf[0]']: a.yourResidence,
        [FL + 'Page1[0].RespondentsResidence_tf[0]']: a.spouseResidence,
        ...pageParties,
        [FL + 'Page3[0].PrintPetitionerName_tf[0]']: a.yourName,
      }),
      check: [],
    };
  },
};

const fl110: FillableForm = {
  id: 'fl-110',
  state: 'CA',
  formNumber: 'FL-110',
  title: 'Summons (Family Law)',
  description: 'Served on your spouse together with the petition.',
  file: '/forms/ca/fl110.pdf',
  sourceUrl: SRC('fl110'),
  partyKeys: ['caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourPhone', 'otherName'],
  otherPartyLabel: 'Respondent (your spouse or domestic partner)',
  questions: [],
  stillToDo: ['The clerk issues the summons. Have it served on your spouse with the petition, then file FL-115 (proof of service).'],
  fill: (a) => {
    const P = 'topmostSubform[0].Page1[0].';
    return {
      text: compact({
        [P + 'T33[0]']: a.caseNumber,
        [P + 'TextField2[0]']: a.otherName,
        [P + 'TextField2[1]']: a.yourName,
        [P + 'T89[0]']: [a.yourName, line(a.yourStreet, a.yourCity, [a.yourState, a.yourZip].filter(Boolean).join(' ')), a.yourPhone]
          .filter(Boolean).join('\n'),
      }),
      check: [],
    };
  },
};

const CR = 'CR-180[0].';
const cr180: FillableForm = {
  id: 'cr-180',
  state: 'CA',
  formNumber: 'CR-180',
  title: 'Petition for Dismissal',
  description: 'Ask the court to dismiss a conviction (for example under Penal Code §1203.4) after probation.',
  file: '/forms/ca/cr180.pdf',
  sourceUrl: SRC('cr180'),
  partyKeys: ['county', 'caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourPhone', 'yourEmail'],
  questions: [
    { key: 'convictionDate', label: 'Date of conviction', type: 'date' },
    { key: 'code1', label: 'Conviction 1: code (e.g. Penal, Vehicle)', type: 'text' },
    { key: 'section1', label: 'Conviction 1: section number', type: 'text' },
    { key: 'type1', label: 'Conviction 1: felony, misdemeanor, or infraction', type: 'select',
      options: [{ value: 'Felony', label: 'Felony' }, { value: 'Misdemeanor', label: 'Misdemeanor' }, { value: 'Infraction', label: 'Infraction' }] },
  ],
  stillToDo: [
    'Item 1: add any other convictions in this case.',
    'Items 2–7: tick the boxes that describe your situation and the relief you are asking for.',
    'Sign and date page 3. File it with CR-181 in the court where you were convicted.',
  ],
  fill: (a) => {
    const c = CR + 'Page1[0].P1Caption[0].';
    const row = CR + 'Page1[0].LI1[0].li1[0].ConvTable[0].Row1[0].';
    return {
      text: compact({
        ...partyCaption(c, a),
        [c + 'HeaderSub[0].Stmp[0].CaseNumber[0].CaseNumber1[0]']: a.caseNumber,
        [c + 'TitlePartyName[0].Defendant[0]']: a.yourName,
        [CR + 'Page1[0].LI1[0].li1[0].ConvictionDate[0]']: a.convictionDate,
        [row + 'Code1[0]']: a.code1,
        [row + 'Section1[0]']: a.section1,
        [row + 'TypeOff1[0]']: a.type1,
        [CR + 'Page2[0].pXCaption[0].CaseNumber1[0]']: a.caseNumber,
        [CR + 'Page2[0].pXCaption[0].Defendant[0]']: a.yourName,
        [CR + 'Page3[0].pXCaption[0].CaseNumber1[0]']: a.caseNumber,
        [CR + 'Page3[0].pXCaption[0].Defendant[0]']: a.yourName,
        [CR + 'Page3[0].SigName[0]']: a.yourName,
      }),
      check: [],
    };
  },
};

const CR1 = 'CR-181[0].';
const cr181: FillableForm = {
  id: 'cr-181',
  state: 'CA',
  formNumber: 'CR-181',
  title: 'Order for Dismissal',
  description: 'The order the judge signs on your CR-180 petition. File it with CR-180.',
  file: '/forms/ca/cr181.pdf',
  sourceUrl: SRC('cr181'),
  partyKeys: ['county', 'caseNumber', 'yourName', 'yourStreet', 'yourCity', 'yourState', 'yourZip', 'yourPhone', 'yourEmail'],
  questions: [],
  stillToDo: ['Leave the order section blank. The judge completes it.'],
  fill: (a) => {
    const c = CR1 + 'Page1[0].Caption[0].';
    return {
      text: compact({
        ...partyCaption(c, a),
        [c + 'HeaderSub[0].CaseNumber[0].CaseNumber2[0]']: a.caseNumber,
        [c + 'TitlePartyName[0].Party1[0]']: a.yourName,
        [CR1 + 'Page2[0].P2Header[0].CaseNumber2[0]']: a.caseNumber,
        [CR1 + 'Page2[0].P2Header[0].Party1[0]']: a.yourName ? `People v. ${a.yourName}` : undefined,
      }),
      check: [],
    };
  },
};

export const CA_FILLABLE: FillableForm[] = [sc100, fw001, fw003, ud105, fl100, fl110, cr180, cr181];

