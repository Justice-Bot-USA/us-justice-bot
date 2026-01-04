// Funnel Analytics Tracking
// Tracks user progress through funnels

import { supabase } from '@/integrations/supabase/client';
import { FunnelStep, FunnelAnalyticsEvent } from './types';

// Generate session ID for anonymous tracking
export const generateSessionId = (): string => {
  const stored = sessionStorage.getItem('funnel_session_id');
  if (stored) return stored;
  
  const newId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('funnel_session_id', newId);
  return newId;
};

// Track funnel event
export const trackFunnelEvent = async (
  funnelId: string,
  step: FunnelStep,
  action: 'start' | 'complete' | 'drop' | 'skip',
  metadata?: Record<string, unknown>
): Promise<void> => {
  try {
    const sessionId = generateSessionId();
    const { data: { user } } = await supabase.auth.getUser();
    
    const event: FunnelAnalyticsEvent = {
      funnelId,
      userId: user?.id,
      sessionId,
      step,
      action,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Log to console for now (will be saved to DB once table is created)
    console.log('[Funnel Analytics]', event);

    // Also track in Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', `funnel_${action}`, {
        event_category: 'funnel',
        event_label: funnelId,
        funnel_step: step,
        ...metadata,
      });
    }

    // TODO: Insert into funnel_analytics table once created
    // await supabase.from('funnel_analytics').insert(event);
    
  } catch (error) {
    console.error('Error tracking funnel event:', error);
  }
};

// Track funnel start
export const trackFunnelStart = (funnelId: string, step: FunnelStep = 'triage') => 
  trackFunnelEvent(funnelId, step, 'start');

// Track step completion
export const trackStepComplete = (funnelId: string, step: FunnelStep) => 
  trackFunnelEvent(funnelId, step, 'complete');

// Track step drop-off
export const trackStepDrop = (funnelId: string, step: FunnelStep) => 
  trackFunnelEvent(funnelId, step, 'drop');

// Track step skip
export const trackStepSkip = (funnelId: string, step: FunnelStep) => 
  trackFunnelEvent(funnelId, step, 'skip');

// Track paywall interaction
export const trackPaywallHit = (funnelId: string, converted: boolean) => 
  trackFunnelEvent(funnelId, 'payment', converted ? 'complete' : 'drop', { converted });

// Track form generation
export const trackFormGenerated = (funnelId: string, formIds: string[]) => 
  trackFunnelEvent(funnelId, 'generate', 'complete', { forms: formIds, formCount: formIds.length });

// Track conversion (full funnel completion)
export const trackConversion = (funnelId: string, value?: number) => 
  trackFunnelEvent(funnelId, 'next_steps', 'complete', { converted: true, value });

// Get funnel analytics summary (placeholder - will query DB)
export interface FunnelAnalyticsSummary {
  funnelId: string;
  totalStarts: number;
  completedSteps: Record<FunnelStep, number>;
  dropOffRates: Record<FunnelStep, number>;
  conversionRate: number;
  averageTimeToConversion: number;
}

export const getFunnelAnalytics = async (funnelId: string): Promise<FunnelAnalyticsSummary | null> => {
  // TODO: Implement once funnel_analytics table is created
  console.log('Fetching analytics for funnel:', funnelId);
  return null;
};
