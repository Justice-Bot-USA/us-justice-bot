import type { Question } from './types';

// Questions shared by most forms. Each form lists the keys it needs in `partyKeys`.
export const PARTY_QUESTIONS: Record<string, Question> = {
  yourName: { key: 'yourName', label: 'Your full legal name', type: 'text', required: true },
  yourStreet: { key: 'yourStreet', label: 'Your street address', type: 'text' },
  yourCity: { key: 'yourCity', label: 'City', type: 'text' },
  yourState: { key: 'yourState', label: 'State', type: 'text' },
  yourZip: { key: 'yourZip', label: 'ZIP code', type: 'text' },
  yourPhone: { key: 'yourPhone', label: 'Your phone number', type: 'text' },
  yourEmail: { key: 'yourEmail', label: 'Your email (optional)', type: 'text' },
  county: { key: 'county', label: 'County of the court', type: 'text', help: 'For example: Los Angeles' },
  caseNumber: { key: 'caseNumber', label: 'Case number (leave blank if you are starting a new case)', type: 'text' },
  otherName: { key: 'otherName', label: "Other party's full name", type: 'text' },
  otherStreet: { key: 'otherStreet', label: "Other party's street address", type: 'text' },
  otherCity: { key: 'otherCity', label: 'City', type: 'text' },
  otherState: { key: 'otherState', label: 'State', type: 'text' },
  otherZip: { key: 'otherZip', label: 'ZIP code', type: 'text' },
  otherPhone: { key: 'otherPhone', label: "Other party's phone (if known)", type: 'text' },
};

export const today = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

/** Drops empty values so blank answers never overwrite a field. */
export const compact = (o: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v && v.trim())) as Record<string, string>;
