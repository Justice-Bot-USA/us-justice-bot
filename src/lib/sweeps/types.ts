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
  };
  indexedAt: string;
}

// Lists the user's own uploads only. No relevance ratings or "missing evidence".
export interface EvidenceIndex {
  items: EvidenceItem[];
  totalDocuments: number;
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
}

export interface Timeline {
  events: TimelineEvent[];
  upcomingDeadlines: Array<{
    deadline: string;
    description: string;
    source: string;
  }>;
  builtAt: string;
}

// Sweep 5 - Authority (general background sources, not applied to the user's facts)
export interface AuthorityResult {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  holdings: string[];
  keyQuotes?: string[];
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
  notes: string;
  sweptAt: string;
  source: 'live_search' | 'cached_library' | 'fallback';
}

// Sweep 6 - Plain-language summary
// Founder decision (Oct 2026): no merit score, success rate, money or time
// estimate, strategy, or choosing/ordering of forms. Only what the user told
// us, the general legal area, general information and official links.
export interface AnalysisReport {
  summary: string;
  legalArea: string;
  generalInfo: string[];
  officialSources: Array<{
    name: string;
    url: string;
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
  authority: 'General Legal Sources',
  analysis: 'Plain-Language Summary'
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
