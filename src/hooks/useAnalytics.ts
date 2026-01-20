// Google Analytics event tracking hook
// GA4 Event Naming Parity with Canadian Site

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type GAEventParams = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Generic event tracker
export const trackEvent = ({ action, category, label, value }: GAEventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Detect user country (cached)
let detectedCountry: 'US' | 'CA' | null = null;

export const getDetectedCountry = (): 'US' | 'CA' => {
  return detectedCountry || 'US';
};

export const setDetectedCountry = (country: 'US' | 'CA') => {
  detectedCountry = country;
};

// ===============================
// CORE FUNNEL EVENTS (CA/US PARITY)
// These events must match exactly between CA and US sites
// ===============================

// 1️⃣ triage_started - Fired when user begins triage flow
export const trackTriageStarted = (legalArea: string, jurisdiction: string, country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'triage_started', {
      legal_area: legalArea,
      jurisdiction,
      country,
    });
    console.log('[GA4] triage_started:', { legalArea, jurisdiction, country });
  }
};

// 2️⃣ triage_completed - Fired when triage/assessment is complete
export const trackTriageCompleted = (meritScore: number, legalArea: string, jurisdiction: string, country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'triage_completed', {
      merit_score: meritScore,
      legal_area: legalArea,
      jurisdiction,
      country,
    });
    console.log('[GA4] triage_completed:', { meritScore, legalArea, jurisdiction, country });
  }
};

// 3️⃣ evidence_uploaded - Fired when user uploads evidence during triage
export const trackEvidenceUploaded = (fileType: string, fileCount: number, country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'evidence_uploaded', {
      file_type: fileType,
      file_count: fileCount,
      country,
    });
    console.log('[GA4] evidence_uploaded:', { fileType, fileCount, country });
  }
};

// 4️⃣ signup_completed - Fired after successful account creation
export const trackSignupCompleted = (method: string = 'email', country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'signup_completed', {
      method,
      country,
    });
    console.log('[GA4] signup_completed:', { method, country });
  }
};

// 5️⃣ generate_document - Fired ONLY after successful document generation
export const trackGenerateDocument = (documentType: string, legalArea: string, jurisdiction: string, country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_document', {
      document_type: documentType,
      legal_area: legalArea,
      jurisdiction,
      country,
    });
    console.log('[GA4] generate_document:', { documentType, legalArea, jurisdiction, country });
  }
};

// 6️⃣ country_selected - Fired when user selects country (with parameter)
export const trackCountrySelected = (country: 'US' | 'CA') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'country_selected', {
      country,
    });
    console.log('[GA4] country_selected:', { country });
  }
};

// 7️⃣ merit_score_viewed - Fired when user views their merit score results (per brief)
export const trackMeritScoreViewed = (
  meritScore: number,
  legalArea: string,
  jurisdiction: string,
  country: 'US' | 'CA' = 'US'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'merit_score_viewed', {
      merit_score: meritScore,
      legal_area: legalArea,
      jurisdiction,
      country,
    });
    console.log('[GA4] merit_score_viewed:', { meritScore, legalArea, jurisdiction, country });
  }
};

// ===============================
// USA PURCHASE FUNNEL EVENTS
// ===============================

// Legacy sign_up (keep for backwards compatibility, but use signup_completed for funnel parity)
export const trackSignUp = (method: string = 'email', country: 'US' | 'CA' = 'US') => {
  // Fire both events for transition period
  trackSignupCompleted(method, country);
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method,
      country,
    });
  }
};

// Add to Cart Conversion (Critical for Funnel)
export const trackAddToCart = (
  itemName: string = 'Case Assessment',
  state: string = '',
  country: 'US' | 'CA' = 'US',
  value: number = 7.99
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const currency = country === 'US' ? 'USD' : 'CAD';
    window.gtag('event', 'add_to_cart', {
      currency,
      value,
      items: [{
        item_name: itemName,
        item_category: 'Legal',
        country,
        state,
      }],
    });
    console.log('[GA4] add_to_cart event fired:', { itemName, state, country, value, currency });
  }
};

// Checkout Started
export const trackBeginCheckout = (value: number = 7.99, country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    const currency = country === 'US' ? 'USD' : 'CAD';
    window.gtag('event', 'begin_checkout', {
      currency,
      value,
    });
    console.log('[GA4] begin_checkout event fired:', { value, currency });
  }
};

// Purchase Completed
export const trackPurchase = (
  itemName: string = 'Case Assessment',
  state: string = '',
  country: 'US' | 'CA' = 'US',
  value: number = 7.99
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const currency = country === 'US' ? 'USD' : 'CAD';
    const transactionId = crypto.randomUUID();
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency,
      value,
      items: [{
        item_name: itemName,
        country,
        state,
      }],
    });
    console.log('[GA4] purchase event fired:', { transactionId, itemName, state, country, value, currency });
  }
};

// ===============================
// FUNNEL STAGES (for reporting)
// first_visit → triage_started → triage_completed → signup_completed → generate_document
// ===============================
export const trackFirstVisit = (country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Check if already tracked this session
    const alreadyTracked = sessionStorage.getItem('first_visit_tracked');
    if (!alreadyTracked) {
      window.gtag('event', 'first_visit', { country });
      sessionStorage.setItem('first_visit_tracked', 'true');
      console.log('[GA4] first_visit:', { country });
    }
  }
};

// Pre-defined tracking events for consistency
export const analytics = {
  // Core funnel events (CA/US parity)
  triageStarted: (legalArea: string, jurisdiction: string) => {
    trackTriageStarted(legalArea, jurisdiction, getDetectedCountry());
  },

  triageCompleted: (meritScore: number, legalArea: string, jurisdiction: string) => {
    trackTriageCompleted(meritScore, legalArea, jurisdiction, getDetectedCountry());
  },

  evidenceUploaded: (fileType: string, fileCount: number = 1) => {
    trackEvidenceUploaded(fileType, fileCount, getDetectedCountry());
  },

  signupCompleted: (method: string = 'email') => {
    trackSignupCompleted(method, getDetectedCountry());
  },

  generateDocument: (documentType: string, legalArea: string, jurisdiction: string) => {
    trackGenerateDocument(documentType, legalArea, jurisdiction, getDetectedCountry());
  },

  countrySelected: (country: 'US' | 'CA') => {
    trackCountrySelected(country);
  },

  meritScoreViewed: (meritScore: number, legalArea: string, jurisdiction: string) => {
    trackMeritScoreViewed(meritScore, legalArea, jurisdiction, getDetectedCountry());
  },

  firstVisit: () => {
    trackFirstVisit(getDetectedCountry());
  },

  // Form interactions (legacy, but kept for backwards compatibility)
  formSubmission: (formType: string, state?: string) => {
    trackEvent({
      action: 'form_submission',
      category: 'Forms',
      label: `${formType}${state ? ` - ${state}` : ''}`,
    });
  },

  formDownload: (formName: string) => {
    trackEvent({
      action: 'form_download',
      category: 'Forms',
      label: formName,
    });
  },

  // Case analysis (legacy names, now map to triage events)
  caseAnalysisStarted: (legalArea: string, state: string) => {
    // Fire both legacy and new event for transition
    trackTriageStarted(legalArea, state, getDetectedCountry());
    trackEvent({
      action: 'case_analysis_started',
      category: 'Case Analysis',
      label: `${legalArea} - ${state}`,
    });
  },

  caseAnalysisCompleted: (meritScore: number, legalArea?: string, jurisdiction?: string) => {
    // Fire both legacy and new event for transition
    trackTriageCompleted(meritScore, legalArea || '', jurisdiction || '', getDetectedCountry());
    trackEvent({
      action: 'case_analysis_completed',
      category: 'Case Analysis',
      value: meritScore,
    });
  },

  // Chatbot interactions
  chatMessage: (legalSection: string, state: string) => {
    trackEvent({
      action: 'chat_message_sent',
      category: 'Chatbot',
      label: `${legalSection} - ${state}`,
    });
  },

  chatSessionStarted: (legalSection: string) => {
    trackEvent({
      action: 'chat_session_started',
      category: 'Chatbot',
      label: legalSection,
    });
  },

  // Case law search
  caseLawSearch: (legalArea: string, state: string) => {
    trackEvent({
      action: 'case_law_search',
      category: 'Case Law',
      label: `${legalArea} - ${state}`,
    });
  },

  // Document uploads (legacy, now maps to evidence_uploaded)
  documentUpload: (fileType: string) => {
    // Fire both legacy and new event
    trackEvidenceUploaded(fileType, 1, getDetectedCountry());
    trackEvent({
      action: 'document_upload',
      category: 'Documents',
      label: fileType,
    });
  },

  // Navigation
  pageView: (pageName: string) => {
    trackEvent({
      action: 'page_view',
      category: 'Navigation',
      label: pageName,
    });
  },

  // User engagement
  ctaClick: (ctaName: string, location: string) => {
    trackEvent({
      action: 'cta_click',
      category: 'Engagement',
      label: `${ctaName} - ${location}`,
    });
  },

  // Authentication
  signUp: (method: string) => {
    trackSignUp(method, getDetectedCountry());
  },

  login: (method: string) => {
    trackEvent({
      action: 'login',
      category: 'Authentication',
      label: method,
    });
  },

  // Payments
  paymentInitiated: (planType: string, amount: number) => {
    trackEvent({
      action: 'payment_initiated',
      category: 'Payments',
      label: planType,
      value: amount,
    });
  },

  paymentCompleted: (planType: string, amount: number) => {
    trackEvent({
      action: 'payment_completed',
      category: 'Payments',
      label: planType,
      value: amount,
    });
  },

  // State selection
  stateSelected: (state: string) => {
    trackEvent({
      action: 'state_selected',
      category: 'User Preferences',
      label: state,
    });
  },

  // Legal area selection
  legalAreaSelected: (area: string) => {
    trackEvent({
      action: 'legal_area_selected',
      category: 'User Preferences',
      label: area,
    });
  },
};

export const useAnalytics = () => {
  return analytics;
};
