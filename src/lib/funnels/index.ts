// Funnel System Index
// Re-exports all funnel-related types and utilities

export * from './types';
export * from './us-funnels';
export * from './analytics';

// Quick access to common operations
import { US_FUNNELS, getFunnelByRoute, getFunnelById, isStateEnabled } from './us-funnels';
import { FunnelConfig, FunnelState, FunnelStep } from './types';

// Initialize empty funnel state
export const createInitialFunnelState = (config: FunnelConfig): FunnelState => ({
  currentStep: config.steps[0],
  completedSteps: [],
  data: {
    state: config.jurisdiction,
    legalArea: config.legalArea,
  },
});

// Get next step in funnel
export const getNextStep = (config: FunnelConfig, currentStep: FunnelStep): FunnelStep | null => {
  const currentIndex = config.steps.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === config.steps.length - 1) {
    return null;
  }
  return config.steps[currentIndex + 1];
};

// Get previous step in funnel
export const getPreviousStep = (config: FunnelConfig, currentStep: FunnelStep): FunnelStep | null => {
  const currentIndex = config.steps.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return config.steps[currentIndex - 1];
};

// Calculate progress percentage
export const calculateProgress = (config: FunnelConfig, completedSteps: FunnelStep[]): number => {
  return Math.round((completedSteps.length / config.steps.length) * 100);
};

// Export for convenience
export { US_FUNNELS, getFunnelByRoute, getFunnelById, isStateEnabled };
