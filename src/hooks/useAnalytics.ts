// Google Analytics event tracking hook

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
// USA PURCHASE FUNNEL EVENTS
// ===============================

// 1️⃣ Signup Conversion (USA)
export const trackSignUp = (method: string = 'email', country: 'US' | 'CA' = 'US') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method,
      country,
    });
    console.log('[GA4] sign_up event fired:', { method, country });
  }
};

// 2️⃣ Add to Cart Conversion (Critical for Funnel)
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

// 3️⃣ Checkout Started
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

// 4️⃣ Purchase Completed (Required)
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

// Pre-defined tracking events for consistency
export const analytics = {
  // Form interactions
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

  // Case analysis
  caseAnalysisStarted: (legalArea: string, state: string) => {
    trackEvent({
      action: 'case_analysis_started',
      category: 'Case Analysis',
      label: `${legalArea} - ${state}`,
    });
  },

  caseAnalysisCompleted: (meritScore: number) => {
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

  // Document uploads
  documentUpload: (fileType: string) => {
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
    trackEvent({
      action: 'sign_up',
      category: 'Authentication',
      label: method,
    });
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
