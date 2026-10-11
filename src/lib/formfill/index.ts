import type { FillableForm } from './types';
import { CA_FILLABLE } from './ca';
import { NY_FILLABLE } from './ny';

export * from './types';
export { PARTY_QUESTIONS } from './party';

export const FILLABLE_FORMS: FillableForm[] = [...CA_FILLABLE, ...NY_FILLABLE];

/** Whether search engines may index the /fill pages and list them in the sitemap. Off until the owner
 *  decides that search listing is not a "marketing launch", which the README holds until a licensed
 *  attorney has reviewed the NY and CA content. Flipping this one value is the whole switch. */
export const FILL_PAGES_INDEXABLE = false;

// Every fillable form is free to fill and download, with no account or plan (owner's decision,
// 2026-10-10). Courts still charge their own filing fees; see THIRD_PARTY_FEES_NOTE.

export const getFillableForm = (state: string, id: string) =>
  FILLABLE_FORMS.find((f) => f.state === state.toUpperCase() && f.id === id.toLowerCase());

export const getFillableByFormNumber = (state: string, formNumber: string) =>
  FILLABLE_FORMS.find((f) => f.state === state.toUpperCase() && f.formNumber === formNumber);

export const fillableForState = (state: string) => FILLABLE_FORMS.filter((f) => f.state === state.toUpperCase());
