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

export const trackEvent = ({ action, category, label, value }: GAEventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
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
