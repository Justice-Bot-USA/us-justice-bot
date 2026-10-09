// Form filling: official court PDFs (bundled under public/forms/) filled with the
// user's own answers. We place the user's words in the fields they correspond to;
// we never choose legal options (defenses, grounds, claims) on the user's behalf.

export type QuestionType = 'text' | 'textarea' | 'date' | 'money' | 'yesno' | 'select';

export interface Question {
  key: string;
  label: string;
  type: QuestionType;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export type Answers = Record<string, string>;

export interface FillPlan {
  /** Full AcroForm field name → value. */
  text: Record<string, string>;
  /** Full AcroForm field names of checkboxes to tick. */
  check: string[];
}

export interface FillableForm {
  /** URL-safe id, e.g. "sc-100". */
  id: string;
  state: 'CA' | 'NY';
  formNumber: string;
  title: string;
  description: string;
  /** Path under /public, e.g. "/forms/ca/sc100.pdf". */
  file: string;
  /** Official source the bundled PDF was taken from. */
  sourceUrl: string;
  /** Shared party/court questions this form uses (keys of PARTY_QUESTIONS). */
  partyKeys: string[];
  /** Label for the other party on this form, e.g. "Defendant". */
  otherPartyLabel?: string;
  /** Form-specific questions. */
  questions: Question[];
  /** What the user still has to do by hand after download. */
  stillToDo: string[];
  fill(a: Answers): FillPlan;
}

/** Stripe form_type used to unlock the download of one filled form. */
export const fillFormType = (f: Pick<FillableForm, 'state' | 'formNumber'>) =>
  `fill:${f.state}:${f.formNumber}`;
