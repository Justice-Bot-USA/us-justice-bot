// Funnel System Type Definitions
// This is the core schema that drives all funnels across jurisdictions

export type Country = 'US' | 'CA';

export type FunnelStep = 
  | 'triage'
  | 'evidence'
  | 'results'      // Plain-language summary of the user's situation (FREE)
  | 'paywall'      // Payment gate
  | 'merit_score'  // Legacy step id - no longer used by any funnel
  | 'form_recommendation' // Legacy step id - no longer used by any funnel
  | 'generate'
  | 'next_steps'
  | 'payment';     // Legacy alias

export type LegalCategory = 
  | 'family'
  | 'small-claims'
  | 'employment'
  | 'housing'
  | 'criminal'
  | 'cps'
  | 'workers-rights'
  | 'human-rights'
  | 'agency-complaints'
  | 'personal-injury'
  | 'immigration'
  | 'bankruptcy'
  | 'consumer-protection';

export interface FunnelConfig {
  id: string;
  country: Country;
  jurisdiction: string; // State code (CA, TX, NY, FL, etc.)
  legalArea: LegalCategory;
  entryPoint: string; // Route path
  steps: FunnelStep[];
  forms: string[]; // Form IDs for this funnel
  courts: string[]; // Court types applicable
  upsell: 'subscription' | 'one_time' | 'free';
  enabled: boolean;
  seo: FunnelSEO;
}

export interface FunnelSEO {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
}

export interface FunnelAnalyticsEvent {
  funnelId: string;
  userId?: string;
  sessionId: string;
  step: FunnelStep;
  action: 'start' | 'complete' | 'drop' | 'skip';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Related case reference for triage
export interface RelatedCaseData {
  id: string;
  courtName: string;
  state: string;
  county: string;
  docketNumber: string;
  caseType: string;
  relationshipDescription: string;
  supportingUploadIds?: string[];
  wasSuggested?: boolean;
}

// Consistency check answer
export interface ConsistencyCheckAnswerData {
  checkId: string;
  answer: 'yes' | 'no' | 'unsure';
}

export interface FunnelState {
  currentStep: FunnelStep;
  completedSteps: FunnelStep[];
  data: {
    caseTitle?: string;
    caseDescription?: string;
    state?: string;
    county?: string;
    legalArea?: string;
    urgency?: string;
    evidence?: string[];
    selectedChannel?: string;
    // Related cases fields
    hasExistingCase?: string;
    relatedCases?: RelatedCaseData[];
    consistencyAnswers?: ConsistencyCheckAnswerData[];
    // Plain-language summary (no score, estimate, strategy or form picks)
    caseId?: string;
    summary?: string;
  };
}

// Helper to generate funnel ID
export const generateFunnelId = (
  country: Country, 
  jurisdiction: string, 
  legalArea: LegalCategory
): string => {
  return `${country.toLowerCase()}-${jurisdiction.toLowerCase()}-${legalArea}`;
};

// State abbreviation to full name mapping
export const US_STATE_NAMES: Record<string, string> = {
  CA: 'California',
  TX: 'Texas',
  NY: 'New York',
  FL: 'Florida',
  PA: 'Pennsylvania',
  IL: 'Illinois',
  OH: 'Ohio',
  GA: 'Georgia',
  NC: 'North Carolina',
  MI: 'Michigan',
  NJ: 'New Jersey',
  VA: 'Virginia',
  WA: 'Washington',
  AZ: 'Arizona',
  MA: 'Massachusetts',
  TN: 'Tennessee',
  IN: 'Indiana',
  MD: 'Maryland',
  MO: 'Missouri',
  WI: 'Wisconsin',
  CO: 'Colorado',
  MN: 'Minnesota',
  SC: 'South Carolina',
  AL: 'Alabama',
  LA: 'Louisiana',
  KY: 'Kentucky',
  OR: 'Oregon',
  OK: 'Oklahoma',
  CT: 'Connecticut',
  UT: 'Utah',
  IA: 'Iowa',
  NV: 'Nevada',
  AR: 'Arkansas',
  MS: 'Mississippi',
  KS: 'Kansas',
  NM: 'New Mexico',
  NE: 'Nebraska',
  ID: 'Idaho',
  WV: 'West Virginia',
  HI: 'Hawaii',
  NH: 'New Hampshire',
  ME: 'Maine',
  RI: 'Rhode Island',
  MT: 'Montana',
  DE: 'Delaware',
  SD: 'South Dakota',
  ND: 'North Dakota',
  AK: 'Alaska',
  VT: 'Vermont',
  WY: 'Wyoming',
  DC: 'District of Columbia',
};

// Legal area display names
export const LEGAL_AREA_NAMES: Record<LegalCategory, string> = {
  'family': 'Family Law & Divorce',
  'small-claims': 'Small Claims',
  'employment': 'Employment Law',
  'housing': 'Housing & Tenant Rights',
  'criminal': 'Criminal Defense',
  'cps': 'CPS & Child Welfare',
  'workers-rights': 'Workers Rights',
  'human-rights': 'Civil Rights',
  'agency-complaints': 'Agency Complaints',
  'personal-injury': 'Personal Injury',
  'immigration': 'Immigration',
  'bankruptcy': 'Bankruptcy',
  'consumer-protection': 'Consumer Protection',
};

// URL-safe slug generation
export const generateSlug = (state: string, legalArea: LegalCategory): string => {
  const stateName = US_STATE_NAMES[state] || state;
  const areaName = LEGAL_AREA_NAMES[legalArea];
  return `${stateName.toLowerCase().replace(/\s+/g, '-')}-${legalArea}-help`;
};
