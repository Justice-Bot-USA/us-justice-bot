import type { FillableForm } from './types';
import { CA_FILLABLE } from './ca';
import { NY_FILLABLE } from './ny';

export * from './types';
export { PARTY_QUESTIONS } from './party';

export const FILLABLE_FORMS: FillableForm[] = [...CA_FILLABLE, ...NY_FILLABLE];

/** Everything else is included in the subscription. Free to everyone:
 *  - CA:UD-105, until California counsel confirms that charging for it does not require unlawful
 *    detainer assistant registration (Bus. & Prof. Code §6400).
 *  - NY:CIV-SC-50, which states on its face "No fee may be charged to fill in this form." */
export const FREE_FORMS = new Set(['CA:UD-105', 'NY:CIV-SC-50']);
export const isFreeForm = (f: FillableForm) => FREE_FORMS.has(`${f.state}:${f.formNumber}`);

export const getFillableForm = (state: string, id: string) =>
  FILLABLE_FORMS.find((f) => f.state === state.toUpperCase() && f.id === id.toLowerCase());

export const getFillableByFormNumber = (state: string, formNumber: string) =>
  FILLABLE_FORMS.find((f) => f.state === state.toUpperCase() && f.formNumber === formNumber);

export const fillableForState = (state: string) => FILLABLE_FORMS.filter((f) => f.state === state.toUpperCase());
