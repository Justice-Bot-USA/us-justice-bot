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
export const trackTriageCompleted = (legalArea: string, jurisdiction: string, country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'triage_completed', {
      legal_area: legalArea,
      jurisdiction,
      country,
    });
    console.log('[GA4] triage_completed:', { legalArea, jurisdiction, country });
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
  value: number = 25
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
export const trackBeginCheckout = (value: number = 25, country: 'US' | 'CA' = 'US') => {
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
  value: number = 25,
  itemId: string = ''
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const currency = country === 'US' ? 'USD' : 'CAD';
    const transactionId = crypto.randomUUID();
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency,
      value,
      items: [{
        item_id: itemId || itemName.toLowerCase().replace(/\s+/g, '_'),
        item_name: itemName,
        country,
        state,
      }],
    });
    console.log('[GA4] purchase event fired:', { transactionId, itemId, itemName, state, country, value, currency });
  }
};

// ===============================
// USA-SPECIFIC CONVERSION EVENTS
// ===============================

// us_lookup_started — user begins a free lookup (warrant, sex offender, court form)
export const trackUSLookupStarted = (lookupType: string, state: string = '') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_lookup_started', {
      lookup_type: lookupType,
      state,
      country: 'US',
    });
    console.log('[GA4] us_lookup_started:', { lookupType, state });
  }
};

// us_lookup_completed — free lookup returns results
export const trackUSLookupCompleted = (lookupType: string, state: string = '', resultCount: number = 0) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_lookup_completed', {
      lookup_type: lookupType,
      state,
      result_count: resultCount,
      country: 'US',
    });
    console.log('[GA4] us_lookup_completed:', { lookupType, state, resultCount });
  }
};

// us_prepare_clicked — user clicks "Prepare a Filing Packet" CTA
export const trackUSPrepareClicked = (source: string = '', state: string = '', legalArea: string = '') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_prepare_clicked', {
      source,
      state,
      legal_area: legalArea,
      country: 'US',
    });
    console.log('[GA4] us_prepare_clicked:', { source, state, legalArea });
  }
};

// us_checkout_started — user hits checkout / paywall
export const trackUSCheckoutStarted = (product: string = 'filing_pack', value: number = 9.99) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_checkout_started', {
      product,
      value,
      currency: 'USD',
      country: 'US',
    });
    console.log('[GA4] us_checkout_started:', { product, value });
  }
};

// us_purchase_success — payment confirmed
export const trackUSPurchaseSuccess = (product: string = 'filing_pack', value: number = 9.99) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const transactionId = crypto.randomUUID();
    window.gtag('event', 'us_purchase_success', {
      transaction_id: transactionId,
      product,
      value,
      currency: 'USD',
      country: 'US',
    });
    console.log('[GA4] us_purchase_success:', { transactionId, product, value });
  }
};

// us_prep_started — user begins form preparation wizard
export const trackUSPrepStarted = (legalArea: string = '', state: string = '') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_prep_started', {
      legal_area: legalArea,
      state,
      country: 'US',
    });
    console.log('[GA4] us_prep_started:', { legalArea, state });
  }
};

// us_export_completed — user downloads/exports filing packet PDF
export const trackUSExportCompleted = (exportType: string = 'pdf', formCount: number = 1) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_export_completed', {
      export_type: exportType,
      form_count: formCount,
      country: 'US',
    });
    console.log('[GA4] us_export_completed:', { exportType, formCount });
  }
};

// us_subscribe_clicked — user clicks subscription CTA
export const trackUSSubscribeClicked = (plan: string = 'monthly', source: string = '') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_subscribe_clicked', {
      plan,
      source,
      country: 'US',
    });
    console.log('[GA4] us_subscribe_clicked:', { plan, source });
  }
};

// us_subscribe_success — subscription confirmed
export const trackUSSubscribeSuccess = (plan: string = 'monthly', value: number = 25) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'us_subscribe_success', {
      plan,
      value,
      currency: 'USD',
      country: 'US',
    });
    console.log('[GA4] us_subscribe_success:', { plan, value });
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

  triageCompleted: (legalArea: string, jurisdiction: string) => {
    trackTriageCompleted(legalArea, jurisdiction, getDetectedCountry());
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

  caseAnalysisCompleted: (legalArea?: string, jurisdiction?: string) => {
    // Fire both legacy and new event for transition
    trackTriageCompleted(legalArea || '', jurisdiction || '', getDetectedCountry());
    trackEvent({
      action: 'case_analysis_completed',
      category: 'Case Analysis',
      label: `${legalArea || ''} - ${jurisdiction || ''}`,
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

  // USA conversion funnel
  usLookupStarted: (lookupType: string, state?: string) => trackUSLookupStarted(lookupType, state),
  usLookupCompleted: (lookupType: string, state?: string, resultCount?: number) => trackUSLookupCompleted(lookupType, state, resultCount),
  usPrepareClicked: (source?: string, state?: string, legalArea?: string) => trackUSPrepareClicked(source, state, legalArea),
  usCheckoutStarted: (product?: string, value?: number) => trackUSCheckoutStarted(product, value),
  usPurchaseSuccess: (product?: string, value?: number) => trackUSPurchaseSuccess(product, value),
  usPrepStarted: (legalArea?: string, state?: string) => trackUSPrepStarted(legalArea, state),
  usExportCompleted: (exportType?: string, formCount?: number) => trackUSExportCompleted(exportType, formCount),
  usSubscribeClicked: (plan?: string, source?: string) => trackUSSubscribeClicked(plan, source),
  usSubscribeSuccess: (plan?: string, value?: number) => trackUSSubscribeSuccess(plan, value),
};

export const useAnalytics = () => {
  return analytics;
};
