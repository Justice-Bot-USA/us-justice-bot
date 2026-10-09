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
  /** Radio group name → index of the button to select (in widget order). Indexes, not export
   *  values, because some official PDFs reuse one export value for every button in a group. */
  radio?: Record<string, number>;
  /** Dropdown name → option to select. */
  select?: Record<string, string>;
  /** Text placed at fixed positions, for official forms published without fillable fields.
   *  page is 0-based; x/y are PDF points from the bottom-left (y is the text baseline). */
  draw?: { page: number; x: number; y: number; text: string; size?: number; maxWidth?: number }[];
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
