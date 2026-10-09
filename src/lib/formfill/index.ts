import type { FillableForm } from './types';
import { CA_FILLABLE } from './ca';

export * from './types';
export { PARTY_QUESTIONS } from './party';

export const FILLABLE_FORMS: FillableForm[] = [...CA_FILLABLE];

/** Free to download. UD-105 stays free until California counsel confirms that charging for it
 *  does not require unlawful detainer assistant registration (Bus. & Prof. Code §6400). */
export const FREE_FORMS = new Set(['CA:UD-105']);
export const isFreeForm = (f: FillableForm) => FREE_FORMS.has(`${f.state}:${f.formNumber}`);

export const getFillableForm = (state: string, id: string) =>
  FILLABLE_FORMS.find((f) => f.state === state.toUpperCase() && f.id === id.toLowerCase());

export const getFillableByFormNumber = (state: string, formNumber: string) =>
  FILLABLE_FORMS.find((f) => f.state === state.toUpperCase() && f.formNumber === formNumber);

export const fillableForState = (state: string) => FILLABLE_FORMS.filter((f) => f.state === state.toUpperCase());
