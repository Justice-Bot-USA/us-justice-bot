// "Your class records (self-reported)": a plain PDF of what the person typed into the class
// tracker (and, from the Course Hub, the certificates they saved there). Free for everyone,
// including people whose plan ended, because it is their own data.
//
// It repeats what was typed and nothing else: no totals against the order, no "hours left", no
// statuses the person didn't choose, no verification wording. The person's notes are left out,
// because a printout is often handed to someone else. jsPDF loads only when a PDF is made.

import { formatPlanDate } from "@/lib/toolkit/access";
import type { ClassSessionRow, ClassTrackerRow } from "@/lib/toolkit/types";
import { formatHours, hoursText, longDate, orderedByLabel, safeProviderUrl, statusLabel, sumLoggedHours } from "./classModel";
import {
  DUE_DATE_LABEL,
  DUE_DATE_SOURCE_LABEL,
  HOURS_FROM_ORDER_LABEL,
  HOURS_LOGGED_LABEL,
  RECORDS_FOOTER,
  RECORDS_TITLE,
} from "./copy";

export interface ClassRecordForPdf {
  tracker: ClassTrackerRow;
  sessions: ClassSessionRow[];
  /** The proof file's name as the person sees it in their binder, or null. */
  proofFileLabel: string | null;
}

export interface CertificateForPdf {
  courseTitle: string;
  provider: string;
  hours: number | string | null;
  /** 'yyyy-MM-dd' as typed. */
  completionDate: string;
  referenceId: string;
}

export interface SavedCourseForPdf {
  courseTitle: string;
  provider: string;
  /** ISO timestamp the listing was saved, or null. */
  addedAt: string | null;
}

export interface ClassRecordsPdfInput {
  classes: ClassRecordForPdf[];
  /** Certificates saved in the Course Hub. Left out when undefined. */
  certificates?: CertificateForPdf[];
  /** Listings saved to the Course Hub's older course list. Left out when empty or undefined. */
  savedCourses?: SavedCourseForPdf[];
  /** Reference for this export (Course Hub), if any. */
  reference?: string | null;
  /** When the PDF is made (ISO timestamp). */
  generatedAt: string;
}

/** What the PDF says about notes. Must stay true: notes are never printed. */
export const RECORDS_NOTES_LEFT_OUT = "Notes you added are not included.";

/** Neutral file name: no class names. */
export function classRecordsFileName(today: string): string {
  return `class-records-${today}.pdf`;
}

/**
 * Text the PDF's standard fonts can draw (Latin-1). Curly quotes and dashes become plain ones;
 * anything else outside Latin-1 becomes "?".
 */
export function pdfText(value: string): string {
  return value
    .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u00A0\u2007\u202F]/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\n -~\u00A1-\u00FF]/gu, "?");
}

/** The lines printed under one class name (exported for tests). Notes are never included. */
export function classLines(record: ClassRecordForPdf): string[] {
  const t = record.tracker;
  const lines: string[] = [];
  lines.push(`Where you are (your record): ${statusLabel(t.status)}`);
  const orderedBy = orderedByLabel(t.ordered_by);
  if (orderedBy) lines.push(`Who told you to take it: ${orderedBy}`);
  const wording = (t.order_wording ?? "").trim();
  if (wording) lines.push(`What your order says (as you typed it): ${wording}`);
  if (t.required_hours !== null && t.required_hours !== undefined) {
    lines.push(`${HOURS_FROM_ORDER_LABEL}: ${formatHours(t.required_hours)}`);
  }
  if (t.due_date) lines.push(`${DUE_DATE_LABEL}: ${longDate(t.due_date)}`);
  const source = (t.due_date_source ?? "").trim();
  if (source) lines.push(`${DUE_DATE_SOURCE_LABEL}: ${source}`);
  const provider = (t.provider_name ?? "").trim();
  const url = safeProviderUrl(t.provider_url);
  if (provider || url) lines.push(`Who gives the class: ${[provider, url].filter(Boolean).join(", ")}`);
  if (record.sessions.length === 0) {
    lines.push("Sessions you logged: none");
  } else {
    lines.push("Sessions you logged:");
    for (const s of record.sessions) lines.push(`    ${longDate(s.session_date)}: ${hoursText(s.hours) || "no hours typed"}`);
  }
  lines.push(`${HOURS_LOGGED_LABEL}: ${formatHours(sumLoggedHours(record.sessions))}`);
  if (t.proof_file_id) lines.push(`Proof file (in your case binder): ${record.proofFileLabel ?? "a file in your case binder"}`);
  if (t.proof_sent_on) lines.push(`When you sent proof: ${longDate(t.proof_sent_on)}`);
  const how = (t.proof_sent_how ?? "").trim();
  if (how) lines.push(`How you sent it: ${how}`);
  return lines;
}

/** Builds the PDF and returns it as a Blob. */
export async function buildClassRecordsPdf(input: ClassRecordsPdfInput): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 54;
  const bottom = pageH - 60;
  const width = pageW - margin * 2;
  let y = margin;

  const write = (text: string, opts: { size?: number; bold?: boolean; grey?: boolean; indent?: number; gapAfter?: number } = {}) => {
    const size = opts.size ?? 10.5;
    const indent = opts.indent ?? 0;
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(opts.grey ? 90 : 20);
    const lineH = size * 1.3;
    const lines = doc.splitTextToSize(pdfText(text), width - indent) as string[];
    for (const line of lines) {
      if (y + lineH > bottom) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + indent, y + size);
      y += lineH;
    }
    y += opts.gapAfter ?? 2;
  };

  const rule = () => {
    if (y + 12 > bottom) {
      doc.addPage();
      y = margin;
    }
    doc.setDrawColor(200);
    doc.line(margin, y + 4, pageW - margin, y + 4);
    y += 14;
  };

  write(RECORDS_TITLE, { size: 18, bold: true, gapAfter: 6 });
  const made = formatPlanDate(input.generatedAt);
  write(`Made with Justice Bot USA${made ? ` on ${made}` : ""}.`, { grey: true });
  if (input.reference) write(`Reference: ${input.reference}`, { grey: true });
  write(`This is a list of what you typed into Justice Bot USA. ${RECORDS_NOTES_LEFT_OUT}`, { gapAfter: 6 });
  rule();

  write("Classes in your class tracker", { size: 13, bold: true, gapAfter: 6 });
  if (input.classes.length === 0) {
    write("None.", { grey: true });
  } else {
    input.classes.forEach((record, i) => {
      write(`${i + 1}. ${record.tracker.class_name}`, { size: 12, bold: true, gapAfter: 3 });
      for (const line of classLines(record)) write(line, { indent: 14 });
      y += 8;
    });
  }

  if (input.certificates) {
    rule();
    write("Certificates you saved in the Course Hub", { size: 13, bold: true, gapAfter: 6 });
    if (input.certificates.length === 0) {
      write("None.", { grey: true });
    } else {
      input.certificates.forEach((c, i) => {
        write(`${i + 1}. ${c.courseTitle}`, { size: 12, bold: true, gapAfter: 3 });
        write(`Provider: ${c.provider}`, { indent: 14 });
        const hours = hoursText(c.hours);
        if (hours) write(`Hours (as you typed them): ${hours}`, { indent: 14 });
        write(`Date on the certificate (as you typed it): ${longDate(c.completionDate) || c.completionDate}`, { indent: 14 });
        write(`Reference ID: ${c.referenceId}`, { indent: 14 });
        y += 8;
      });
    }
  }

  if (input.savedCourses && input.savedCourses.length > 0) {
    rule();
    write("Listings you saved to the Course Hub's older course list", { size: 13, bold: true, gapAfter: 6 });
    input.savedCourses.forEach((c, i) => {
      write(`${i + 1}. ${c.courseTitle}`, { size: 12, bold: true, gapAfter: 3 });
      write(`Provider: ${c.provider}`, { indent: 14 });
      const added = formatPlanDate(c.addedAt);
      if (added) write(`Saved on: ${added}`, { indent: 14 });
      y += 8;
    });
  }

  rule();
  for (const line of RECORDS_FOOTER) write(line, { size: 9, grey: true });

  const pages = doc.getNumberOfPages();
  for (let n = 1; n <= pages; n++) {
    doc.setPage(n);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(90);
    doc.text(pdfText(`${RECORDS_TITLE} - Page ${n} of ${pages}`), pageW / 2, pageH - 30, { align: "center" });
  }

  return doc.output("blob");
}

/** Saves a Blob as a download (object URL and a temporary link). */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  a.style.display = "none";
  // Keep this synthetic click away from page-wide click listeners (analytics).
  a.addEventListener("click", (e) => e.stopPropagation());
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
