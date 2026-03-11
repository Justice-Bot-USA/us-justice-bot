import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

/**
 * SEO page analytics tracking hook.
 * Tracks: page_view, cta_click, start_intake, start_doc_gen, signup, case_setup_complete
 */
export const useSEOTracking = () => {
  const location = useLocation();

  // Track page view on mount / route change
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: location.pathname,
        page_title: document.title,
        event_category: "seo_content",
      });
    }
  }, [location.pathname]);

  const trackEvent = useCallback((eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", eventName, {
        page_path: location.pathname,
        event_category: "seo_content",
        ...params,
      });
    }
    console.log(`[SEO Track] ${eventName}`, { path: location.pathname, ...params });
  }, [location.pathname]);

  return {
    trackCTAClick: (ctaLabel: string) => trackEvent("cta_click", { cta_label: ctaLabel }),
    trackStartIntake: () => trackEvent("start_intake"),
    trackStartDocGen: () => trackEvent("start_doc_gen"),
    trackSignup: () => trackEvent("signup_from_seo"),
    trackCaseSetupComplete: () => trackEvent("case_setup_complete"),
    trackToolUse: (toolName: string) => trackEvent("tool_use", { tool_name: toolName }),
    trackEvent,
  };
};
