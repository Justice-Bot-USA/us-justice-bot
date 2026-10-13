// Fixed wording for the hearing calendar. Lines marked "exact" come from the legal review
// (scratchpad/toolkit-critique-legal.json and spec v2 §3.3) and must not be reworded.
//
// Every sentence here must stay true of what the code does: the app never works out, checks,
// compares or suggests a court date, and alerts only exist in the calendar file the person
// downloads.

/** Exact. Shown under the date field. */
export const TIME_PERIOD_NOTE =
  'If your papers give a time period instead of a date (for example, "within 30 days of service"), Justice Bot USA can\'t work out the date for you. Ask the court clerk, the court\'s self-help center, or a lawyer.';

/** Exact. Shown next to every calendar-file download. */
export const LOCK_SCREEN_WARNING =
  'Your phone may show event titles on your lock screen, and calendars are often shared or synced with other people. Use a title you are comfortable with others seeing (for example, "Appointment"). Notes you add are included in the calendar file.';

/** Exact. The per-download privacy option (buildIcs `private: true`). */
export const LEAVE_DETAILS_OUT_LABEL = "Leave court details out of the calendar file";

/** What the privacy option does. Must match buildIcs: title "Appointment", no place, no notes. */
export const LEAVE_DETAILS_OUT_HINT = 'The file will say "Appointment", with no place and no notes.';

/** Exact. Shown after a date is changed or deleted. */
export const OLD_EVENT_NOTE =
  "Your phone's calendar still has the old event. Delete it there too, and add the new file if the date changed.";

/** Lead-in so OLD_EVENT_NOTE is only read as true for people who added the date to their phone. */
export const OLD_EVENT_LEAD = "If you added this date to your phone's calendar";

/** Exact (same qualifier as the Pricing line in TOOLKIT_FEATURES). */
export const ALERTS_QUALIFIER = "Alerts come from your calendar app; some apps don't keep them, so check after adding.";

/** Alerts are VALARMs inside the downloaded file; nothing is sent by Justice Bot USA. */
export const ALERTS_HOW = "Alerts work only after you add the date to your phone's calendar.";

/** Spec v1 §3.3 wording rules. */
export const TYPE_EXACTLY = "Type the date exactly as it appears on your court papers.";
export const ASK_IF_UNSURE = "If you are not sure of a date, ask the court clerk or a lawyer.";

/** Terms responsibilities line (legal review minor 10). */
export const CHECK_AGAINST_PAPERS =
  "Check every date you enter against your court papers. The calendar only shows what you typed.";

/** Label for an entry whose date is before today. Nothing else is ever said about past entries. */
export const PAST_LABEL = "Past";
