// Fixed wording for the class tracker and the Course Hub. Lines marked "exact" come from the legal
// review (scratchpad/toolkit-critique-legal.json, spec v2 §3.4) and must not be reworded.
//
// Every sentence here must stay true of what the code does: the app never works out, checks,
// compares or suggests hours, dates or requirements, and never says a class meets an order.
// Words never used about a class: complete, compliant, satisfies, counts toward, approved, met,
// on track, overdue, missed, late, hours left.

/** Exact. Shown on the class tracker page and in the class records PDF. */
export const ONLY_THE_COURT = "Only the court (or whoever ordered the class) can tell you whether a class meets an order.";

/** Exact. Shown on every Course Hub listing and when tracking a class from the Course Hub. */
export const PROVIDER_NOTE =
  "Provider websites may say their classes are court-approved. We have not checked that. Only your court (or whoever ordered the class) can tell you which classes it accepts.";

/** What the tracker is. Everything in it is typed by the person. */
export const SELF_REPORTED =
  "Everything here is what you typed in. Justice Bot USA does not check classes, hours or dates with any provider or court.";

/** The two hours lines (spec v1 §3.4). Shown side by side with the same styling; nothing is ever worked out between them. */
export const HOURS_LOGGED_LABEL = "Hours you logged";
export const HOURS_FROM_ORDER_LABEL = "Hours you typed from your order";

export const DUE_DATE_LABEL = "Due date (from your papers)";
export const DUE_DATE_SOURCE_LABEL = "Where this date came from";

/** Title of the class records PDF (legal review important #4: "Your class records (self-reported)"). */
export const RECORDS_TITLE = "Your class records (self-reported)";

/** Footer lines of the class records PDF. */
export const RECORDS_FOOTER = [
  "You typed everything in this record. Justice Bot USA has not checked it with any course provider or court.",
  ONLY_THE_COURT,
  "Legal information, not legal advice. Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc.",
];

/** Shown when logging a new session needs the plan. */
export const SESSIONS_LOCKED =
  "Logging new sessions needs the Toolkit plan. You can still change or delete sessions you already logged.";

/** What tracking a Course Hub listing saves. Must match trackerFromCourse(). */
export const TRACK_SAVES =
  "This adds the class name, the provider and the provider's link to your class tracker. You type in the hours, the due date and anything else from your own papers.";
