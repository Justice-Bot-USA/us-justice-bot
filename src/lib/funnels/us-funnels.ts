// US Funnel Configurations
// These define all funnels for US jurisdictions

import { 
  FunnelConfig, 
  LegalCategory, 
  FunnelStep,
  generateFunnelId,
  generateSlug,
  US_STATE_NAMES,
  LEGAL_AREA_NAMES
} from './types';

// Default steps for most funnels
const STANDARD_STEPS: FunnelStep[] = [
  'triage',
  'evidence',
  'merit_score',
  'form_recommendation',
  'generate',
  'next_steps'
];

// Steps with payment
const PAID_STEPS: FunnelStep[] = [
  'triage',
  'evidence',
  'merit_score',
  'payment',
  'form_recommendation',
  'generate',
  'next_steps'
];

// Enabled states (Top 4 for initial rollout)
export const ENABLED_STATES = ['CA', 'TX', 'NY', 'FL'] as const;

// All legal areas we support
const ALL_LEGAL_AREAS: LegalCategory[] = [
  'family',
  'small-claims',
  'employment',
  'housing',
  'criminal',
  'cps',
  'workers-rights',
  'human-rights',
  'agency-complaints',
];

// State-specific form mappings
const STATE_FORMS: Record<string, Record<LegalCategory, string[]>> = {
  CA: {
    'family': ['FL-100', 'FL-110', 'FL-150', 'FL-300', 'DV-100'],
    'small-claims': ['SC-100', 'SC-104', 'SC-500'],
    'employment': ['DLSE-1', 'CRD Complaint', 'DWC-1'],
    'housing': ['UD-100', 'UD-105', 'SC-500A'],
    'criminal': ['CR-180', 'CR-181', 'CR-105'],
    'cps': ['JV-100', 'JV-180', 'JV-200'],
    'workers-rights': ['DIR-1', 'OSHA-7', 'WC-1'],
    'human-rights': ['CRD-1', 'OCR-1', 'EEOC-5'],
    'agency-complaints': ['PCC-1', 'MBC-1', 'SBA-1'],
    'personal-injury': ['CM-010', 'PLD-PI-001'],
    'immigration': ['I-130', 'I-485', 'I-765'],
    'bankruptcy': ['B-101', 'B-106', 'B-122'],
    'consumer-protection': ['CFPB-1', 'FTC-1'],
  },
  TX: {
    'family': ['Original Petition for Divorce', 'SAPCR Petition', 'Application for Protective Order'],
    'small-claims': ['Petition (Small Claims)', 'Citation', 'Answer'],
    'employment': ['TWC Initial Claim', 'TWC Wage Claim', 'EEOC Charge'],
    'housing': ['Eviction Petition', 'Answer to Eviction', 'Request for Jury Trial'],
    'criminal': ['Expunction Petition', 'Order of Nondisclosure'],
    'cps': ['DFPS-2200', 'DFPS-K-908-2254'],
    'workers-rights': ['TWC-1', 'OSHA-7', 'TDI-1'],
    'human-rights': ['THR-1', 'EEOC-5'],
    'agency-complaints': ['TSBME-1', 'TBLS-1'],
    'personal-injury': ['Civil Case Cover Sheet', 'Original Petition'],
    'immigration': ['I-130', 'I-485', 'I-765'],
    'bankruptcy': ['B-101', 'B-106'],
    'consumer-protection': ['OAG Consumer Complaint'],
  },
  NY: {
    'family': ['UD-2', 'UD-11', 'Order of Protection Petition', 'Custody Petition'],
    'small-claims': ['CIV-SC-50', 'Commercial Claims Form', 'Motion to Vacate Default'],
    'employment': ['DOL UI-1', 'DOL LS-223', 'DHR Complaint'],
    'housing': ['NYLP-1', 'Answer in Eviction', 'HP Action'],
    'criminal': ['CPL 160.59 Motion', 'Certificate of Relief'],
    'cps': ['Family Court Petition', 'JD-1'],
    'workers-rights': ['WCB-C3', 'OSHA-7'],
    'human-rights': ['DHR-1', 'EEOC-5'],
    'agency-complaints': ['OPMC-1', 'CCRB-1'],
    'personal-injury': ['Civil Court Summons', 'Verified Complaint'],
    'immigration': ['I-130', 'I-485', 'I-765'],
    'bankruptcy': ['B-101', 'B-106'],
    'consumer-protection': ['AG Consumer Complaint'],
  },
  FL: {
    'family': ['Form 12.901(a)', 'Form 12.901(b)(1)', 'Form 12.902(b)', 'Form 12.995(a)'],
    'small-claims': ['Statement of Claim', 'Summons', 'Affidavit of Non-Military Service'],
    'employment': ['DEO Claim', 'FCHR Complaint', 'EEOC Charge'],
    'housing': ['Eviction Summons', 'Answer to Eviction', 'Motion to Determine Rent'],
    'criminal': ['Motion to Seal', 'Motion to Expunge'],
    'cps': ['DCF-1', 'Dependency Petition'],
    'workers-rights': ['DFS-F2-DWC-1', 'OSHA-7'],
    'human-rights': ['FCHR-1', 'EEOC-5'],
    'agency-complaints': ['DOH-MQA', 'FDLE Complaint'],
    'personal-injury': ['Civil Cover Sheet', 'Complaint'],
    'immigration': ['I-130', 'I-485', 'I-765'],
    'bankruptcy': ['B-101', 'B-106'],
    'consumer-protection': ['FDACS Consumer Complaint'],
  },
};

// State-specific court mappings
const STATE_COURTS: Record<string, Record<LegalCategory, string[]>> = {
  CA: {
    'family': ['Superior Court - Family Division'],
    'small-claims': ['Small Claims Court'],
    'employment': ['Labor Commissioner', 'Civil Rights Dept', 'Superior Court'],
    'housing': ['Superior Court - Unlawful Detainer', 'Small Claims Court'],
    'criminal': ['Superior Court - Criminal Division'],
    'cps': ['Juvenile Court'],
    'workers-rights': ['DIR', 'WCAB', 'OSHA'],
    'human-rights': ['Civil Rights Dept', 'EEOC', 'Federal Court'],
    'agency-complaints': ['Medical Board', 'State Bar', 'POST'],
    'personal-injury': ['Superior Court - Civil'],
    'immigration': ['Immigration Court', 'USCIS'],
    'bankruptcy': ['Bankruptcy Court'],
    'consumer-protection': ['AG Office', 'Small Claims'],
  },
  TX: {
    'family': ['District Court - Family', 'County Court at Law'],
    'small-claims': ['Justice Court', 'Small Claims Court'],
    'employment': ['TWC', 'EEOC', 'District Court'],
    'housing': ['Justice Court', 'County Court at Law'],
    'criminal': ['District Court', 'County Court'],
    'cps': ['District Court'],
    'workers-rights': ['TWC', 'TDI', 'OSHA'],
    'human-rights': ['THR', 'EEOC', 'Federal Court'],
    'agency-complaints': ['TSBME', 'State Bar', 'TCOLE'],
    'personal-injury': ['District Court', 'County Court'],
    'immigration': ['Immigration Court', 'USCIS'],
    'bankruptcy': ['Bankruptcy Court'],
    'consumer-protection': ['OAG', 'Justice Court'],
  },
  NY: {
    'family': ['Supreme Court', 'Family Court'],
    'small-claims': ['Small Claims Court', 'Civil Court'],
    'employment': ['DOL', 'DHR', 'EEOC', 'Supreme Court'],
    'housing': ['Housing Court', 'Civil Court'],
    'criminal': ['Supreme Court', 'Criminal Court'],
    'cps': ['Family Court'],
    'workers-rights': ['WCB', 'DOL', 'OSHA'],
    'human-rights': ['DHR', 'EEOC', 'Federal Court'],
    'agency-complaints': ['OPMC', 'State Bar', 'CCRB'],
    'personal-injury': ['Supreme Court', 'Civil Court'],
    'immigration': ['Immigration Court', 'USCIS'],
    'bankruptcy': ['Bankruptcy Court'],
    'consumer-protection': ['AG Office', 'Small Claims'],
  },
  FL: {
    'family': ['Circuit Court - Family Division'],
    'small-claims': ['County Court - Small Claims'],
    'employment': ['DEO', 'FCHR', 'EEOC', 'Circuit Court'],
    'housing': ['County Court', 'Circuit Court'],
    'criminal': ['Circuit Court', 'County Court'],
    'cps': ['Circuit Court - Dependency'],
    'workers-rights': ['DFS', 'OSHA'],
    'human-rights': ['FCHR', 'EEOC', 'Federal Court'],
    'agency-complaints': ['DOH', 'State Bar', 'FDLE'],
    'personal-injury': ['Circuit Court'],
    'immigration': ['Immigration Court', 'USCIS'],
    'bankruptcy': ['Bankruptcy Court'],
    'consumer-protection': ['FDACS', 'AG Office'],
  },
};

// Generate SEO data for a funnel
const generateSEO = (state: string, legalArea: LegalCategory): FunnelConfig['seo'] => {
  const stateName = US_STATE_NAMES[state];
  const areaName = LEGAL_AREA_NAMES[legalArea];
  
  const seoTemplates: Record<LegalCategory, { title: string; description: string; keywords: string[]; h1: string }> = {
    'family': {
      title: `${stateName} Divorce & Family Law Self-Help | Free ${stateName} Forms`,
      description: `Navigate ${stateName} family court without an attorney. Get divorce forms, custody help, and step-by-step guidance for ${stateName} family law matters.`,
      keywords: [`${stateName} divorce`, `${stateName} family law`, `${stateName} custody`, `${stateName} divorce forms`, 'pro se divorce'],
      h1: `${stateName} Family Law Self-Help Center`,
    },
    'small-claims': {
      title: `${stateName} Small Claims Court Guide | File Without a Lawyer`,
      description: `Sue in ${stateName} small claims court without an attorney. Learn the process, filing fees, limits, and get the right forms for your case.`,
      keywords: [`${stateName} small claims`, `${stateName} small claims forms`, `${stateName} sue`, 'small claims limit'],
      h1: `${stateName} Small Claims Court Help`,
    },
    'employment': {
      title: `${stateName} Employment Law Help | Wrongful Termination & Wage Claims`,
      description: `File employment complaints in ${stateName}. Get help with wrongful termination, wage theft, discrimination, and workplace violations.`,
      keywords: [`${stateName} wrongful termination`, `${stateName} wage claim`, `${stateName} employment lawyer`, 'workplace discrimination'],
      h1: `${stateName} Employment Rights Self-Help`,
    },
    'housing': {
      title: `${stateName} Tenant Rights | Eviction Defense & Housing Help`,
      description: `Know your rights as a ${stateName} tenant. Get help with evictions, security deposits, repairs, and landlord disputes.`,
      keywords: [`${stateName} eviction`, `${stateName} tenant rights`, `${stateName} landlord`, 'security deposit'],
      h1: `${stateName} Housing & Tenant Rights Help`,
    },
    'criminal': {
      title: `${stateName} Criminal Defense Self-Help | Expungement & Record Sealing`,
      description: `Understand your rights in ${stateName} criminal court. Get help with expungement, record sealing, and criminal defense resources.`,
      keywords: [`${stateName} expungement`, `${stateName} criminal defense`, `${stateName} record sealing`, 'criminal record'],
      h1: `${stateName} Criminal Defense Resources`,
    },
    'cps': {
      title: `${stateName} CPS Defense | Child Welfare & Dependency Court Help`,
      description: `Navigate ${stateName} CPS investigations and dependency court. Get resources for parents facing child welfare proceedings.`,
      keywords: [`${stateName} CPS`, `${stateName} child welfare`, `${stateName} dependency court`, 'CPS investigation'],
      h1: `${stateName} CPS & Child Welfare Help`,
    },
    'workers-rights': {
      title: `${stateName} Workers Rights | OSHA & Workers Comp Help`,
      description: `File workers compensation claims and OSHA complaints in ${stateName}. Get help with workplace safety violations.`,
      keywords: [`${stateName} workers comp`, `${stateName} OSHA`, `${stateName} workplace injury`, 'workers compensation'],
      h1: `${stateName} Workers Rights & Safety`,
    },
    'human-rights': {
      title: `${stateName} Civil Rights | Discrimination Complaints & Help`,
      description: `File discrimination complaints in ${stateName}. Get help with civil rights violations, discrimination, and equality issues.`,
      keywords: [`${stateName} discrimination`, `${stateName} civil rights`, `${stateName} human rights`, 'discrimination complaint'],
      h1: `${stateName} Civil Rights Self-Help`,
    },
    'agency-complaints': {
      title: `${stateName} Agency Complaints | File Against Doctors, Police, Lawyers`,
      description: `File complaints against professionals in ${stateName}. Get help with medical board, bar association, and police complaints.`,
      keywords: [`${stateName} medical board complaint`, `${stateName} bar complaint`, `${stateName} police complaint`, 'professional misconduct'],
      h1: `${stateName} Professional Complaints Help`,
    },
    'personal-injury': {
      title: `${stateName} Personal Injury Self-Help | Accident Claims Guide`,
      description: `Navigate personal injury claims in ${stateName}. Get help with accident cases, medical bills, and injury compensation.`,
      keywords: [`${stateName} personal injury`, `${stateName} accident claim`, `${stateName} injury lawyer`, 'accident compensation'],
      h1: `${stateName} Personal Injury Resources`,
    },
    'immigration': {
      title: `${stateName} Immigration Help | Visa, Green Card & Citizenship`,
      description: `Get immigration help in ${stateName}. Navigate visa applications, green cards, and citizenship processes.`,
      keywords: [`${stateName} immigration`, `${stateName} green card`, `${stateName} visa`, 'immigration lawyer'],
      h1: `${stateName} Immigration Self-Help`,
    },
    'bankruptcy': {
      title: `${stateName} Bankruptcy Help | Chapter 7 & 13 Self-Filing`,
      description: `File bankruptcy in ${stateName} without an attorney. Get help with Chapter 7 and Chapter 13 bankruptcy forms.`,
      keywords: [`${stateName} bankruptcy`, `${stateName} chapter 7`, `${stateName} chapter 13`, 'bankruptcy lawyer'],
      h1: `${stateName} Bankruptcy Self-Help`,
    },
    'consumer-protection': {
      title: `${stateName} Consumer Protection | Fraud & Scam Complaints`,
      description: `File consumer complaints in ${stateName}. Get help with fraud, scams, and consumer protection issues.`,
      keywords: [`${stateName} consumer protection`, `${stateName} fraud`, `${stateName} scam`, 'consumer complaint'],
      h1: `${stateName} Consumer Protection Help`,
    },
  };

  return seoTemplates[legalArea];
};

// Generate all funnels for enabled states
export const generateUSFunnels = (): FunnelConfig[] => {
  const funnels: FunnelConfig[] = [];

  for (const state of ENABLED_STATES) {
    for (const legalArea of ALL_LEGAL_AREAS) {
      const funnelId = generateFunnelId('US', state, legalArea);
      const entryPoint = `/${generateSlug(state, legalArea)}`;
      
      funnels.push({
        id: funnelId,
        country: 'US',
        jurisdiction: state,
        legalArea,
        entryPoint,
        steps: STANDARD_STEPS,
        forms: STATE_FORMS[state]?.[legalArea] || [],
        courts: STATE_COURTS[state]?.[legalArea] || [],
        upsell: legalArea === 'criminal' ? 'one_time' : 'subscription',
        enabled: true,
        seo: generateSEO(state, legalArea),
      });
    }
  }

  return funnels;
};

// Pre-generated funnels
export const US_FUNNELS = generateUSFunnels();

// Get funnel by ID
export const getFunnelById = (id: string): FunnelConfig | undefined => {
  return US_FUNNELS.find(f => f.id === id);
};

// Get funnel by entry point
export const getFunnelByRoute = (route: string): FunnelConfig | undefined => {
  return US_FUNNELS.find(f => f.entryPoint === route);
};

// Get all funnels for a state
export const getFunnelsForState = (state: string): FunnelConfig[] => {
  return US_FUNNELS.filter(f => f.jurisdiction === state);
};

// Get all funnels for a legal area
export const getFunnelsForLegalArea = (legalArea: LegalCategory): FunnelConfig[] => {
  return US_FUNNELS.filter(f => f.legalArea === legalArea);
};

// Check if a state is enabled
export const isStateEnabled = (state: string): boolean => {
  return ENABLED_STATES.includes(state as typeof ENABLED_STATES[number]);
};

// Get all enabled entry routes
export const getAllEntryRoutes = (): string[] => {
  return US_FUNNELS.filter(f => f.enabled).map(f => f.entryPoint);
};
