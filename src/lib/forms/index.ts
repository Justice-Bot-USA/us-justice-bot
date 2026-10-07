// Forms Library Index - Re-exports all form data modules
export * from './cpsFormsData';
export * from './workersRightsFormsData';
export * from './humanRightsFormsData';
export * from './immigrationFormsData';
export * from './agencyComplaintsData';
export * from './additionalStatesData';

// Convenience function to get all expanded forms for a state
import { getCPSForms } from './cpsFormsData';
import { getWorkersRightsForms } from './workersRightsFormsData';
import { getHumanRightsForms } from './humanRightsFormsData';
import { getImmigrationForms } from './immigrationFormsData';
import { getAllAgencyComplaintForms } from './agencyComplaintsData';
import { getAdditionalStateData } from './additionalStatesData';
import { stateFormsLibrary, type StateFormsData, type CourtForm } from '../formsLibraryData';
import {
  CA_CRIMINAL_FORMS, CA_FAMILY_FORMS, CA_DIVORCE_FORMS, CA_CPS_FORMS,
  CA_WORKPLACE_FORMS, CA_CIVIL_FORMS, CA_HUMAN_RIGHTS_FORMS,
} from '../ca/forms';
import {
  NY_CRIMINAL_FORMS, NY_FAMILY_FORMS, NY_DIVORCE_FORMS, NY_CPS_FORMS,
  NY_IMMIGRATION_FORMS, NY_WORKPLACE_FORMS, NY_CIVIL_FORMS, NY_HUMAN_RIGHTS_FORMS,
} from '../ny/forms';
export type { CourtForm, StateFormsData } from '../formsLibraryData';

export interface ExpandedStateFormsData extends StateFormsData {
  forms: Record<string, CourtForm[]>;
}

const isHousing = (f: CourtForm) => f.category.startsWith('Housing');
const isSmallClaims = (f: CourtForm) => f.category === 'Small Claims' || f.category === 'Fee Waiver';

// Launch states use their dedicated, source-checked catalogs (src/lib/ca, src/lib/ny)
// instead of the generic multi-state data. Keys line up with the funnel legal areas
// matched in useFormsPdfGenerator (LEGAL_AREA_TO_CATEGORY).
const LAUNCH_STATE_FORMS: Record<string, Record<string, CourtForm[]>> = {
  CA: {
    family: [...CA_FAMILY_FORMS, ...CA_DIVORCE_FORMS],
    'small-claims': CA_CIVIL_FORMS.filter(isSmallClaims),
    housing: [...CA_CIVIL_FORMS.filter(isHousing), ...CA_CIVIL_FORMS.filter(f => f.category === 'Fee Waiver')],
    criminal: CA_CRIMINAL_FORMS,
    cps: CA_CPS_FORMS,
    employment: CA_WORKPLACE_FORMS,
    'human-rights': CA_HUMAN_RIGHTS_FORMS,
  },
  NY: {
    family: [...NY_FAMILY_FORMS, ...NY_DIVORCE_FORMS],
    'small-claims': NY_CIVIL_FORMS.filter(isSmallClaims),
    housing: NY_CIVIL_FORMS.filter(isHousing),
    criminal: NY_CRIMINAL_FORMS,
    cps: NY_CPS_FORMS,
    employment: NY_WORKPLACE_FORMS,
    'human-rights': NY_HUMAN_RIGHTS_FORMS,
    immigration: NY_IMMIGRATION_FORMS,
  },
};

export function getExpandedStateFormsData(stateCode: string): ExpandedStateFormsData {
  const launchForms = LAUNCH_STATE_FORMS[stateCode];
  const launchBase = launchForms && (stateFormsLibrary[stateCode] || getAdditionalStateData(stateCode));
  if (launchForms && launchBase) {
    return {
      ...launchBase,
      forms: {
        ...launchForms,
        ...(launchForms.immigration ? {} : { immigration: getImmigrationForms(stateCode) }),
        'agency-complaints': getAllAgencyComplaintForms(stateCode),
      },
    };
  }

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
        "immigration": getImmigrationForms(stateCode),
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
      "immigration": getImmigrationForms(stateCode),
      "agency-complaints": getAllAgencyComplaintForms(stateCode),
    }
  };
}
