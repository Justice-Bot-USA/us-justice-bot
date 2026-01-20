// Forms Library Index - Re-exports all form data modules
export * from './cpsFormsData';
export * from './workersRightsFormsData';
export * from './humanRightsFormsData';
export * from './agencyComplaintsData';
export * from './additionalStatesData';

// Convenience function to get all expanded forms for a state
import { getCPSForms } from './cpsFormsData';
import { getWorkersRightsForms } from './workersRightsFormsData';
import { getHumanRightsForms } from './humanRightsFormsData';
import { getAllAgencyComplaintForms } from './agencyComplaintsData';
import { getAdditionalStateData } from './additionalStatesData';
import { stateFormsLibrary, type StateFormsData, type CourtForm } from '../formsLibraryData';
export type { CourtForm, StateFormsData } from '../formsLibraryData';

export interface ExpandedStateFormsData extends StateFormsData {
  forms: Record<string, CourtForm[]>;
}

export function getExpandedStateFormsData(stateCode: string): ExpandedStateFormsData {
  // Get base state data from main library or additional states
  const baseData = stateFormsLibrary[stateCode] || getAdditionalStateData(stateCode);
  
  if (!baseData) {
    // Return default structure for unknown states
    return {
      stateName: stateCode,
      courtWebsite: "",
      selfHelpUrl: "",
      forms: {
        "cps": getCPSForms(stateCode),
        "workers-rights": getWorkersRightsForms(stateCode),
        "human-rights": getHumanRightsForms(stateCode),
        "agency-complaints": getAllAgencyComplaintForms(stateCode),
      }
    };
  }

  // Merge base forms with expanded categories
  return {
    ...baseData,
    forms: {
      ...baseData.forms,
      "cps": getCPSForms(stateCode),
      "workers-rights": getWorkersRightsForms(stateCode),
      "human-rights": getHumanRightsForms(stateCode),
      "agency-complaints": getAllAgencyComplaintForms(stateCode),
    }
  };
}
