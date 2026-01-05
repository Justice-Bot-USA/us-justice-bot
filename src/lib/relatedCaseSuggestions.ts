// Related Case Suggestions Map
// Auto-suggests related case types based on primary legal area during triage

import { LegalCategory } from './funnels/types';

export interface RelatedCaseSuggestion {
  caseType: string;
  label: string;
  description: string;
  /** Keywords that trigger this suggestion when found in case description */
  triggerKeywords?: string[];
}

export interface ConsistencyCheck {
  id: string;
  question: string;
  triggerKeywords: string[];
  /** The related case types this check suggests */
  suggestedCaseTypes: string[];
  helpText: string;
}

// Maps primary legal area to suggested related case types
export const RELATED_CASE_SUGGESTIONS: Record<LegalCategory, RelatedCaseSuggestion[]> = {
  'housing': [
    {
      caseType: 'housing-inspection',
      label: 'Housing Inspection / Code Enforcement',
      description: 'City or county housing inspection complaint',
      triggerKeywords: ['mold', 'repair', 'habitability', 'condition', 'unsafe', 'violation', 'code'],
    },
    {
      caseType: 'health-department',
      label: 'Health Department Complaint',
      description: 'Filed a complaint with the health department',
      triggerKeywords: ['mold', 'pest', 'rodent', 'roach', 'health hazard', 'sanitation'],
    },
    {
      caseType: 'rent-escrow',
      label: 'Rent Escrow / Habitability Claim',
      description: 'Rent escrow action due to uninhabitable conditions',
      triggerKeywords: ['rent', 'escrow', 'habitability', 'withhold'],
    },
    {
      caseType: 'small-claims-housing',
      label: 'Small Claims (Repairs/Deposit)',
      description: 'Small claims case for repairs or security deposit',
      triggerKeywords: ['deposit', 'repair', 'damage', 'reimbursement', 'small claims'],
    },
    {
      caseType: 'protection-order',
      label: 'Protection / Restraining Order',
      description: 'Protection order due to landlord harassment',
      triggerKeywords: ['harassment', 'threat', 'intimidation', 'retaliation', 'stalking'],
    },
  ],
  'family': [
    {
      caseType: 'child-support',
      label: 'Child Support Case',
      description: 'Child support order or modification',
      triggerKeywords: ['support', 'payment', 'child support'],
    },
    {
      caseType: 'protection-order',
      label: 'Protection / Restraining Order',
      description: 'Domestic violence protection order',
      triggerKeywords: ['abuse', 'violence', 'domestic', 'protection', 'restraining', 'safety'],
    },
    {
      caseType: 'custody-modification',
      label: 'Custody Modification / Relocation',
      description: 'Motion to modify custody or relocate',
      triggerKeywords: ['modify', 'change', 'relocate', 'move', 'modification'],
    },
    {
      caseType: 'paternity',
      label: 'Paternity Case',
      description: 'Paternity establishment or dispute',
      triggerKeywords: ['paternity', 'father', 'DNA', 'biological'],
    },
    {
      caseType: 'divorce',
      label: 'Divorce Proceeding',
      description: 'Divorce or dissolution of marriage',
      triggerKeywords: ['divorce', 'dissolution', 'separation', 'marriage'],
    },
  ],
  'cps': [
    {
      caseType: 'dependency',
      label: 'Dependency / Family Court Case',
      description: 'Juvenile dependency court case',
      triggerKeywords: ['dependency', 'removal', 'foster', 'placement', 'hearing'],
    },
    {
      caseType: 'protection-order',
      label: 'Protection Order',
      description: 'Protection order involving the child or parent',
      triggerKeywords: ['protection', 'restraining', 'safety', 'abuse'],
    },
    {
      caseType: 'criminal',
      label: 'Related Criminal Case',
      description: 'Criminal charges related to the CPS matter',
      triggerKeywords: ['arrest', 'criminal', 'charge', 'police', 'felony', 'misdemeanor'],
    },
    {
      caseType: 'custody',
      label: 'Custody Case',
      description: 'Related family court custody matter',
      triggerKeywords: ['custody', 'visitation', 'parenting time'],
    },
  ],
  'employment': [
    {
      caseType: 'eeoc',
      label: 'EEOC / State Agency Complaint',
      description: 'Discrimination complaint with EEOC or state agency',
      triggerKeywords: ['discrimination', 'eeoc', 'harassment', 'retaliation', 'civil rights'],
    },
    {
      caseType: 'unemployment',
      label: 'Unemployment Appeal',
      description: 'Unemployment benefits appeal',
      triggerKeywords: ['unemployment', 'benefits', 'denied', 'appeal', 'fired', 'terminated'],
    },
    {
      caseType: 'wage-claim',
      label: 'Wage Claim / Labor Board',
      description: 'Unpaid wages claim with labor board',
      triggerKeywords: ['wage', 'unpaid', 'overtime', 'minimum wage', 'paycheck', 'labor board'],
    },
    {
      caseType: 'workers-comp',
      label: "Workers' Compensation",
      description: "Workers' comp claim for workplace injury",
      triggerKeywords: ['injury', 'workers comp', 'workplace accident', 'hurt at work'],
    },
  ],
  'small-claims': [
    {
      caseType: 'consumer-complaint',
      label: 'Consumer Protection Complaint',
      description: 'Complaint filed with consumer protection agency',
      triggerKeywords: ['scam', 'fraud', 'consumer', 'company', 'business'],
    },
    {
      caseType: 'credit-dispute',
      label: 'Credit Report Dispute',
      description: 'Dispute with credit bureaus',
      triggerKeywords: ['credit', 'report', 'score', 'bureau', 'dispute'],
    },
  ],
  'criminal': [
    {
      caseType: 'protection-order',
      label: 'Related Protection Order',
      description: 'Protection or no-contact order in the case',
      triggerKeywords: ['protection', 'restraining', 'no contact', 'victim'],
    },
    {
      caseType: 'civil-suit',
      label: 'Related Civil Lawsuit',
      description: 'Civil lawsuit arising from the same incident',
      triggerKeywords: ['lawsuit', 'civil', 'damages', 'sue'],
    },
    {
      caseType: 'probation',
      label: 'Probation / Parole Matter',
      description: 'Probation or parole violation case',
      triggerKeywords: ['probation', 'parole', 'violation', 'supervision'],
    },
  ],
  'workers-rights': [
    {
      caseType: 'osha',
      label: 'OSHA Complaint',
      description: 'Workplace safety complaint with OSHA',
      triggerKeywords: ['safety', 'osha', 'hazard', 'dangerous', 'injury'],
    },
    {
      caseType: 'nlrb',
      label: 'NLRB Complaint',
      description: 'Unfair labor practice with NLRB',
      triggerKeywords: ['union', 'organize', 'labor', 'nlrb', 'collective'],
    },
    {
      caseType: 'wage-claim',
      label: 'Wage Claim',
      description: 'Unpaid wages or overtime claim',
      triggerKeywords: ['wage', 'unpaid', 'overtime', 'minimum wage'],
    },
  ],
  'human-rights': [
    {
      caseType: 'eeoc',
      label: 'EEOC Complaint',
      description: 'Federal discrimination complaint',
      triggerKeywords: ['discrimination', 'eeoc', 'civil rights', 'title vii'],
    },
    {
      caseType: 'state-civil-rights',
      label: 'State Civil Rights Agency',
      description: 'Complaint with state civil rights agency',
      triggerKeywords: ['state', 'civil rights', 'discrimination', 'agency'],
    },
    {
      caseType: 'hud',
      label: 'HUD Complaint',
      description: 'Fair housing complaint with HUD',
      triggerKeywords: ['housing', 'fair housing', 'hud', 'rental discrimination'],
    },
  ],
  'agency-complaints': [
    {
      caseType: 'appeal',
      label: 'Administrative Appeal',
      description: 'Appeal of agency decision',
      triggerKeywords: ['appeal', 'decision', 'denied', 'hearing'],
    },
    {
      caseType: 'court-review',
      label: 'Court Review of Agency Action',
      description: 'Judicial review in state or federal court',
      triggerKeywords: ['court', 'review', 'judicial', 'lawsuit'],
    },
  ],
  'personal-injury': [
    {
      caseType: 'insurance-claim',
      label: 'Insurance Claim',
      description: 'Insurance claim for the injury',
      triggerKeywords: ['insurance', 'claim', 'adjuster', 'coverage'],
    },
    {
      caseType: 'workers-comp',
      label: "Workers' Compensation",
      description: 'Work-related injury claim',
      triggerKeywords: ['work', 'job', 'workplace', 'employer'],
    },
    {
      caseType: 'criminal',
      label: 'Related Criminal Case',
      description: 'Criminal case against the at-fault party',
      triggerKeywords: ['arrest', 'criminal', 'drunk', 'dui', 'assault'],
    },
  ],
  'immigration': [
    {
      caseType: 'removal',
      label: 'Removal / Deportation Case',
      description: 'Immigration court removal proceedings',
      triggerKeywords: ['removal', 'deportation', 'immigration court', 'ice'],
    },
    {
      caseType: 'asylum',
      label: 'Asylum Application',
      description: 'Pending asylum case',
      triggerKeywords: ['asylum', 'refugee', 'persecution', 'fear'],
    },
    {
      caseType: 'criminal-immigration',
      label: 'Criminal Case Affecting Immigration',
      description: 'Criminal case with immigration consequences',
      triggerKeywords: ['criminal', 'conviction', 'arrest', 'crime'],
    },
  ],
  'bankruptcy': [
    {
      caseType: 'collection',
      label: 'Collection Lawsuit',
      description: 'Debt collection lawsuit',
      triggerKeywords: ['collection', 'debt', 'creditor', 'lawsuit', 'sue'],
    },
    {
      caseType: 'foreclosure',
      label: 'Foreclosure',
      description: 'Home foreclosure proceeding',
      triggerKeywords: ['foreclosure', 'mortgage', 'house', 'home'],
    },
    {
      caseType: 'repossession',
      label: 'Vehicle Repossession',
      description: 'Vehicle repo case',
      triggerKeywords: ['repo', 'repossession', 'car', 'vehicle', 'auto'],
    },
  ],
  'consumer-protection': [
    {
      caseType: 'ftc-complaint',
      label: 'FTC Complaint',
      description: 'Federal Trade Commission complaint',
      triggerKeywords: ['ftc', 'scam', 'fraud', 'deceptive'],
    },
    {
      caseType: 'cfpb-complaint',
      label: 'CFPB Complaint',
      description: 'Consumer Financial Protection Bureau complaint',
      triggerKeywords: ['bank', 'loan', 'credit', 'cfpb', 'financial'],
    },
    {
      caseType: 'state-ag',
      label: 'State Attorney General Complaint',
      description: 'Complaint with state AG consumer protection',
      triggerKeywords: ['attorney general', 'state', 'consumer protection'],
    },
  ],
};

// Consistency checks that prompt users for potentially missing information
export const CONSISTENCY_CHECKS: Record<LegalCategory, ConsistencyCheck[]> = {
  'housing': [
    {
      id: 'housing-inspection-check',
      question: 'Have you contacted housing inspection or code enforcement about these conditions?',
      triggerKeywords: ['mold', 'repair', 'unsafe', 'habitability', 'broken', 'condition', 'infestation'],
      suggestedCaseTypes: ['housing-inspection', 'health-department'],
      helpText: 'Documentation from housing inspection can strengthen your case.',
    },
    {
      id: 'rent-withhold-check',
      question: 'Have you withheld rent or placed it in escrow due to these conditions?',
      triggerKeywords: ['uninhabitable', 'not paying', 'withheld', 'escrow'],
      suggestedCaseTypes: ['rent-escrow'],
      helpText: 'Some states allow rent withholding for serious habitability issues.',
    },
  ],
  'family': [
    {
      id: 'protection-order-custody',
      question: 'Is there a protection order that affects parenting time or custody arrangements?',
      triggerKeywords: ['protection order', 'restraining', 'domestic violence', 'abuse', 'safety'],
      suggestedCaseTypes: ['protection-order'],
      helpText: 'Protection orders often include custody and visitation provisions.',
    },
    {
      id: 'support-modification',
      question: 'Has your income or living situation changed significantly since the last order?',
      triggerKeywords: ['income', 'job', 'lost job', 'pay', 'change', 'modify'],
      suggestedCaseTypes: ['custody-modification', 'child-support'],
      helpText: 'Significant changes may warrant a modification of existing orders.',
    },
  ],
  'cps': [
    {
      id: 'cps-court-dates',
      question: 'Have you received any court petitions, notices, or hearing dates from the dependency court?',
      triggerKeywords: ['cps', 'dcfs', 'investigation', 'social worker', 'child welfare'],
      suggestedCaseTypes: ['dependency'],
      helpText: 'Dependency court hearings have strict deadlines. Missing them can result in adverse orders.',
    },
    {
      id: 'cps-criminal',
      question: 'Are there any criminal charges related to this CPS matter?',
      triggerKeywords: ['arrest', 'police', 'charged', 'criminal', 'investigation'],
      suggestedCaseTypes: ['criminal'],
      helpText: 'Criminal cases and CPS cases often run parallel and can affect each other.',
    },
  ],
  'employment': [
    {
      id: 'eeoc-filed',
      question: 'Have you filed a complaint with the EEOC or a state civil rights agency?',
      triggerKeywords: ['discrimination', 'harassment', 'retaliation', 'fired', 'terminated'],
      suggestedCaseTypes: ['eeoc'],
      helpText: 'Many employment discrimination claims require filing with the EEOC first.',
    },
    {
      id: 'unemployment-appeal',
      question: 'If you were terminated, have you applied for unemployment benefits?',
      triggerKeywords: ['fired', 'terminated', 'let go', 'laid off'],
      suggestedCaseTypes: ['unemployment'],
      helpText: 'Unemployment appeals can provide additional documentation for your case.',
    },
  ],
  'small-claims': [],
  'criminal': [
    {
      id: 'civil-damages',
      question: 'Is there a civil lawsuit for damages arising from the same incident?',
      triggerKeywords: ['accident', 'injury', 'property damage', 'victim'],
      suggestedCaseTypes: ['civil-suit'],
      helpText: 'Civil and criminal cases from the same incident should be coordinated.',
    },
  ],
  'workers-rights': [
    {
      id: 'osha-check',
      question: 'Have you reported unsafe conditions to OSHA?',
      triggerKeywords: ['unsafe', 'dangerous', 'injury', 'hazard', 'safety violation'],
      suggestedCaseTypes: ['osha'],
      helpText: 'OSHA documentation can support retaliation claims.',
    },
  ],
  'human-rights': [],
  'agency-complaints': [],
  'personal-injury': [
    {
      id: 'insurance-check',
      question: 'Have you filed a claim with any insurance company (yours or the at-fault party)?',
      triggerKeywords: ['accident', 'injury', 'crash', 'hurt'],
      suggestedCaseTypes: ['insurance-claim'],
      helpText: 'Insurance claim records are important for your case documentation.',
    },
  ],
  'immigration': [
    {
      id: 'removal-proceedings',
      question: 'Have you received a Notice to Appear (NTA) or are you in removal proceedings?',
      triggerKeywords: ['deport', 'ice', 'immigration court', 'removal'],
      suggestedCaseTypes: ['removal'],
      helpText: 'Removal proceedings have strict deadlines that must be followed.',
    },
  ],
  'bankruptcy': [
    {
      id: 'foreclosure-check',
      question: 'Are you facing foreclosure on your home?',
      triggerKeywords: ['mortgage', 'house', 'behind on payments', 'foreclosure'],
      suggestedCaseTypes: ['foreclosure'],
      helpText: 'Bankruptcy can temporarily stop foreclosure proceedings.',
    },
  ],
  'consumer-protection': [],
};

/**
 * Get suggested related case types based on legal area and case description
 */
export function getSuggestedRelatedCases(
  legalArea: LegalCategory,
  caseDescription?: string
): RelatedCaseSuggestion[] {
  const suggestions = RELATED_CASE_SUGGESTIONS[legalArea] || [];
  
  if (!caseDescription) {
    return suggestions;
  }
  
  const descLower = caseDescription.toLowerCase();
  
  // Sort by relevance - put keyword matches first
  return suggestions.sort((a, b) => {
    const aMatches = a.triggerKeywords?.some(kw => descLower.includes(kw.toLowerCase())) || false;
    const bMatches = b.triggerKeywords?.some(kw => descLower.includes(kw.toLowerCase())) || false;
    
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return 0;
  });
}

/**
 * Get applicable consistency checks based on legal area and case description
 */
export function getApplicableConsistencyChecks(
  legalArea: LegalCategory,
  caseDescription?: string
): ConsistencyCheck[] {
  const checks = CONSISTENCY_CHECKS[legalArea] || [];
  
  if (!caseDescription) {
    return [];
  }
  
  const descLower = caseDescription.toLowerCase();
  
  // Return only checks where trigger keywords are found in the description
  return checks.filter(check => 
    check.triggerKeywords.some(kw => descLower.includes(kw.toLowerCase()))
  );
}

/**
 * Get all related case type options (for dropdowns)
 */
export const ALL_RELATED_CASE_TYPES = [
  // Housing
  { value: 'housing-inspection', label: 'Housing Inspection / Code Enforcement' },
  { value: 'health-department', label: 'Health Department Complaint' },
  { value: 'rent-escrow', label: 'Rent Escrow / Habitability Claim' },
  { value: 'small-claims-housing', label: 'Small Claims (Repairs/Deposit)' },
  // Family
  { value: 'child-support', label: 'Child Support Case' },
  { value: 'custody', label: 'Custody / Visitation' },
  { value: 'custody-modification', label: 'Custody Modification / Relocation' },
  { value: 'paternity', label: 'Paternity Case' },
  { value: 'divorce', label: 'Divorce Proceeding' },
  // Protection
  { value: 'protection-order', label: 'Protection / Restraining Order' },
  // CPS
  { value: 'dependency', label: 'Dependency / Family Court Case' },
  // Criminal
  { value: 'criminal', label: 'Criminal Case' },
  { value: 'probation', label: 'Probation / Parole Matter' },
  // Employment
  { value: 'eeoc', label: 'EEOC / State Agency Complaint' },
  { value: 'unemployment', label: 'Unemployment Appeal' },
  { value: 'wage-claim', label: 'Wage Claim / Labor Board' },
  { value: 'workers-comp', label: "Workers' Compensation" },
  { value: 'osha', label: 'OSHA Complaint' },
  { value: 'nlrb', label: 'NLRB Complaint' },
  // Civil Rights
  { value: 'state-civil-rights', label: 'State Civil Rights Agency' },
  { value: 'hud', label: 'HUD Fair Housing Complaint' },
  // Other
  { value: 'civil-suit', label: 'Civil Lawsuit' },
  { value: 'appeal', label: 'Administrative Appeal' },
  { value: 'court-review', label: 'Court Review of Agency Action' },
  { value: 'insurance-claim', label: 'Insurance Claim' },
  { value: 'collection', label: 'Collection Lawsuit' },
  { value: 'foreclosure', label: 'Foreclosure' },
  { value: 'repossession', label: 'Vehicle Repossession' },
  { value: 'consumer-complaint', label: 'Consumer Protection Complaint' },
  { value: 'credit-dispute', label: 'Credit Report Dispute' },
  { value: 'ftc-complaint', label: 'FTC Complaint' },
  { value: 'cfpb-complaint', label: 'CFPB Complaint' },
  { value: 'state-ag', label: 'State Attorney General Complaint' },
  // Immigration
  { value: 'removal', label: 'Removal / Deportation Case' },
  { value: 'asylum', label: 'Asylum Application' },
  { value: 'criminal-immigration', label: 'Criminal Case (Immigration Consequences)' },
  { value: 'other', label: 'Other' },
];
