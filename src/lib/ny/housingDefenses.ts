// Common defenses in an NYC Housing Court nonpayment case, in plain language.
// Based on the court's "Answer in Person" fact sheets (CIV-LT-91, defenses #1–#7), checked against
// current law on 2026-10-09. The court's fact sheet for #5 (CIV-RC-83, December 2006) predates the
// 2019 Housing Stability and Tenant Protection Act and is out of date: the rent demand must now be
// written, give at least 14 days' notice (RPAPL 711(2)), and include the Good Cause Eviction notice
// (RPL 231-c). Legal information only; NOT yet reviewed by a New York-licensed attorney.

export interface HousingDefense {
  number: string;
  title: string;
  says: string;
  detail: string;
  bring?: string;
  links?: { label: string; url: string }[];
}

export const NYC_NONPAYMENT_DEFENSES: HousingDefense[] = [
  {
    number: '1–2',
    title: 'Improper service',
    says: 'You never got the Notice of Petition and Petition, or they were not delivered the way the law requires.',
    detail:
      'The papers must be delivered by personal delivery, by giving them to a suitable person who lives or works in your home, or by posting them on your door after two tries, and the last two methods also require mailing copies to you (RPAPL 735). Raise this the first time you answer; you may lose it if you wait.',
  },
  {
    number: '3',
    title: 'You are named wrongly, or not named',
    says: 'The papers use the wrong name for you, or leave you out.',
    detail:
      'A tenant who can be evicted must be correctly named. A small misspelling may not matter. Family members or roommates who are not on the lease can be listed as "John Doe" or "Jane Doe". If the judge agrees, the case is dismissed "without prejudice", which means the landlord can start over.',
  },
  {
    number: '4',
    title: 'The petitioner is not your landlord or owner',
    says: 'Whoever started the case does not own or have the legal right to rent your home.',
    detail:
      'Buildings with three or more apartments must register their owner with the city. Look up the registered owner on HPD Online, or the deed on ACRIS.',
    links: [
      { label: 'HPD Online (registered owner)', url: 'https://hpdonline.nyc.gov/hpdonline/' },
      { label: 'ACRIS (property records)', url: 'https://a836-acris.nyc.gov/CP/' },
    ],
  },
  {
    number: '5',
    title: 'No proper rent demand',
    says: 'The landlord did not give you a proper written demand for the rent before starting the case.',
    detail:
      'Before a nonpayment case, the landlord must serve a written rent demand at least 14 days ahead, listing the months and amounts owed, with the Good Cause Eviction notice attached (RPAPL 711(2)). The landlord must also send a written notice by certified mail when rent is 5 days late (RPL 235-e(d)). The court\'s 2006 fact sheet for this defense describes the old 3-day rule and is out of date.',
    bring: 'Any rent demand or late notice you received, with the envelope.',
  },
  {
    number: '6',
    title: 'You tried to pay and the landlord refused',
    says: 'You offered the full rent and the landlord would not take it.',
    detail:
      'Refusing includes not cashing your check or money order, returning your payment, or avoiding you so you cannot pay. If the judge agrees, the nonpayment case is dismissed, but you still owe the rent and the landlord can sue for it in Civil Court.',
    bring: 'Letters, uncashed money orders, receipts, or a witness.',
  },
  {
    number: '7',
    title: 'The rent amount is wrong',
    says: 'The rent in the petition is not your legal rent or the amount in your current lease.',
    detail:
      'Rent stabilized: the landlord can only ask for the legal registered rent or your lease rent, whichever is lower; you can request your rent history from NYS Homes and Community Renewal (HCR). NYCHA: rent is generally based on 30% of your household income (or the flat rent if you chose it); NYCHA must recalculate it when your income is reviewed.',
    bring: 'Your leases and renewal leases, the lease rider, and any rent letters.',
    links: [{ label: 'NYS Homes and Community Renewal', url: 'https://hcr.ny.gov/' }],
  },
];

export const NYC_HOUSING_HELP = {
  rightToCounsel:
    'NYC tenants facing eviction in Housing Court can get a free lawyer or legal advice, in every ZIP code and regardless of immigration status. At your first court date, say "I would like an attorney."',
  rightToCounselUrl: 'https://www.nyc.gov/site/hra/help/legal-services-for-tenants.page',
  hotline: 'Housing Court Answers hotline: (212) 962-4795, Monday–Friday 9am–5pm.',
  hotlineUrl: 'https://housingcourtanswers.org/contact-us/',
  officialUrl: 'https://www.nycourts.gov/new-york-city-housing-court/answering-case-nyc-housing-court',
};
