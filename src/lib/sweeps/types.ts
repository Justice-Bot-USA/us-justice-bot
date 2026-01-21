// ============================================================
// CaseProfile Schema - The canonical object all sweeps write to
// ============================================================

export type SweepStatus = 'pending' | 'running' | 'completed' | 'failed';

// Sweep 0 - Intake & Normalization
export interface IntakeData {
  issueSummary: string;
  keyDates: Array<{
    date: string;
    description: string;
    source: 'user_statement' | 'document';
  }>;
  parties: Array<{
    role: string; // plaintiff, defendant, petitioner, respondent, etc.
    name: string;
    relationship?: string;
  }>;
  locationHints: {
    country: string;
    state?: string;
    county?: string;
    city?: string;
  };
  urgentFlags: Array<{
    type: 'deadline' | 'eviction' | 'protection_order' | 'court_date' | 'arrest' | 'custody';
    description: string;
    date?: string;
    severity: 'critical' | 'high' | 'medium';
  }>;
  confidence: number;
  normalizedAt: string;
}

// Sweep 1 - Evidence Index
export interface EvidenceItem {
  docId: string;
  filename: string;
  fileType: string;
  docType: 'notice' | 'email' | 'lease' | 'order' | 'police_report' | 'contract' | 'receipt' | 'photo' | 'text_message' | 'letter' | 'medical_record' | 'financial' | 'other';
  extractedText: string;
  entities: Array<{
    type: 'name' | 'address' | 'case_number' | 'date' | 'amount' | 'phone' | 'email';
    value: string;
    context?: string;
  }>;
  keyDates: Array<{
    date: string;
    description: string;
  }>;
  credibility: {
    isOfficial: boolean;
    isSigned: boolean;
    isScreenshot: boolean;
    hasNotarization: boolean;
    notes: string;
  };
  relevanceScore: number;
  indexedAt: string;
}

export interface EvidenceIndex {
  items: EvidenceItem[];
  totalDocuments: number;
  strongestEvidence: string[];
  gapsIdentified: string[];
  indexedAt: string;
}

// Sweep 2 - Issue Classification
export interface Classification {
  primaryCategory: 'housing' | 'family' | 'consumer' | 'employment' | 'civil_rights' | 'immigration' | 'criminal' | 'small_claims' | 'personal_injury' | 'bankruptcy' | 'other';
  subIssues: string[];
  forumType: 'state_court' | 'federal_court' | 'tribunal' | 'small_claims' | 'housing_court' | 'family_court' | 'administrative' | 'arbitration';
  courtLevel: string;
  confidence: number;
  reasoning: string;
  alternativeClassifications?: Array<{
    category: string;
    confidence: number;
    reason: string;
  }>;
  classifiedAt: string;
}

// Sweep 3 - Venue Resolution
export interface Venue {
  jurisdiction: {
    country: string;
    state: string;
    county?: string;
    city?: string;
  };
  venueType: string;
  courtName: string;
  courtAddress?: string;
  courtWebsite?: string;
  eFilingUrl?: string;
  localRulesUrl?: string;
  filingFees?: {
    amount: number;
    description: string;
    waiverAvailable: boolean;
  };
  status: 'confirmed' | 'uncertain' | 'needs_verification';
  notes: string;
  resolvedAt: string;
}

// Sweep 4 - Timeline
export interface TimelineEvent {
  date: string;
  dateType: 'exact' | 'approximate' | 'range';
  endDate?: string;
  eventType: 'notice_served' | 'repair_request' | 'payment' | 'threat' | 'inspection' | 'hearing' | 'filing' | 'incident' | 'communication' | 'other';
  description: string;
  source: {
    type: 'document' | 'user_statement';
    docId?: string;
    quote?: string;
  };
  importance: 'critical' | 'high' | 'medium' | 'low';
  legalSignificance?: string;
}

export interface Timeline {
  events: TimelineEvent[];
  statuteOfLimitationsDeadlines: Array<{
    claimType: string;
    deadline: string;
    daysRemaining: number;
    status: 'expired' | 'critical' | 'approaching' | 'safe';
  }>;
  upcomingDeadlines: Array<{
    deadline: string;
    description: string;
    source: string;
  }>;
  builtAt: string;
}

// Sweep 5 - Authority/Precedent
export interface AuthorityResult {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  relevanceScore: number;
  holdings: string[];
  outcome: 'favorable' | 'unfavorable' | 'mixed' | 'neutral';
  remediesAwarded?: string[];
  keyQuotes?: string[];
  howItApplies: string;
}

export interface AuthoritySweep {
  searchQueries: string[];
  results: AuthorityResult[];
  statutes: Array<{
    citation: string;
    title: string;
    relevance: string;
    fullText?: string;
  }>;
  regulations: Array<{
    citation: string;
    agency: string;
    relevance: string;
  }>;
  favorablePrecedentCount: number;
  unfavorablePrecedentCount: number;
  notes: string;
  sweptAt: string;
  source: 'live_search' | 'cached_library' | 'fallback';
}

// Sweep 6 - Analysis Report
export interface AnalysisReport {
  meritScore: number;
  meritScoreJustification: string;
  estimatedSuccessRate: number;
  
  strongestClaims: Array<{
    claim: string;
    evidenceReferences: string[]; // doc_ids
    legalBasis: string;
    precedentSupport: string[];
    strength: 'strong' | 'moderate' | 'weak';
  }>;
  
  weakestPoints: Array<{
    issue: string;
    impact: string;
    mitigation?: string;
    missingProof?: string[];
  }>;
  
  likelyRemedies: Array<{
    remedy: string;
    likelihood: number;
    estimatedValue?: number;
    conditions?: string;
  }>;
  
  riskWarnings: Array<{
    risk: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    deadline?: string;
    mitigation?: string;
  }>;
  
  nextSteps: Array<{
    step: number;
    action: string;
    deadline?: string;
    priority: 'immediate' | 'soon' | 'when_ready';
    details?: string;
  }>;
  
  settlementRange?: {
    min: number;
    max: number;
    likely: number;
    basis: string;
  };
  
  timeToResolution: {
    minMonths: number;
    maxMonths: number;
    factors: string[];
  };
  
  requiredForms: Array<{
    formName: string;
    formNumber: string;
    purpose: string;
    filingOrder: number;
    url?: string;
    fee?: number;
    deadline?: string;
  }>;
  
  analyzedAt: string;
}

// The master CaseProfile object
export interface CaseProfile {
  caseId: string;
  userId?: string;
  sessionId?: string;
  status: 'intake' | 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
  
  // User input
  userStory: string;
  uploadedFileIds: string[];
  
  // Sweep outputs (each can be null/undefined until that sweep completes)
  intake?: IntakeData;
  evidenceIndex?: EvidenceIndex;
  classification?: Classification;
  venue?: Venue;
  timeline?: Timeline;
  authoritySweep?: AuthoritySweep;
  analysisReport?: AnalysisReport;
  
  // Sweep status tracking
  sweepStatus: {
    intake: SweepStatus;
    evidenceIndex: SweepStatus;
    classification: SweepStatus;
    venue: SweepStatus;
    timeline: SweepStatus;
    authority: SweepStatus;
    analysis: SweepStatus;
  };
  
  // Error tracking
  errors: Array<{
    sweep: string;
    message: string;
    timestamp: string;
  }>;
}

// Sweep names for iteration
export type SweepName = 'intake' | 'evidenceIndex' | 'classification' | 'venue' | 'timeline' | 'authority' | 'analysis';

export const SWEEP_ORDER: SweepName[] = [
  'intake',
  'evidenceIndex', 
  'classification',
  'venue',
  'timeline',
  'authority',
  'analysis'
];

export const SWEEP_DISPLAY_NAMES: Record<SweepName, string> = {
  intake: 'Intake & Normalization',
  evidenceIndex: 'Evidence Indexing',
  classification: 'Issue Classification',
  venue: 'Jurisdiction & Venue',
  timeline: 'Timeline Building',
  authority: 'Legal Precedent Search',
  analysis: 'Final Analysis'
};

// Helper to create empty case profile
export function createEmptyCaseProfile(caseId: string, userStory: string, fileIds: string[], userId?: string): CaseProfile {
  const now = new Date().toISOString();
  return {
    caseId,
    userId,
    status: 'intake',
    createdAt: now,
    updatedAt: now,
    userStory,
    uploadedFileIds: fileIds,
    sweepStatus: {
      intake: 'pending',
      evidenceIndex: 'pending',
      classification: 'pending',
      venue: 'pending',
      timeline: 'pending',
      authority: 'pending',
      analysis: 'pending'
    },
    errors: []
  };
}
