// Builds the Toolkit case binder: one PDF holding the person's own uploaded documents, in the
// order they chose, with a cover page, a table of contents and (optionally) page numbers. It runs
// in the browser with pdf-lib and only ever reads the person's own files. It is pure (bytes in,
// bytes out), so node tests can run it.
//
// The binder is an organizer. It is not a court filing and makes no claim to meet any court's
// rules, so it avoids court labels such as "exhibit" or "book of documents".
//
// Robustness rules (engineering review):
// - Files are handled one at a time: loaded, copied in, then released, so only one source file is
//   in memory at once. Any failure for one file puts it on the "Not included" pages with a reason;
//   it never stops the build.
// - What a file is (PDF, JPEG or PNG) comes from its bytes, not its saved type.
// - Filled forms are flattened first, so typed values become part of the page.
// - With page numbers on, each document page is shrunk to 95% inside its own visible area, with its
//   links and comments moved by exactly the same amount, leaving an empty band at the bottom of the
//   page as it is shown (rotation and crop box respected) for "Page N of M".
// - The contents pages are drawn last and inserted after the cover, so their page numbers are
//   right however many contents pages there are.

import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFFont,
  PDFName,
  PDFNumber,
  PDFPage,
  StandardFonts,
  clip,
  concatTransformationMatrix,
  degrees,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
} from "pdf-lib";
import { formatLongDate, formatShortDate } from "@/lib/calendar/dates";
import { SECTION_LABELS } from "@/lib/toolkit/types";
import { BINDER_MAX_PAGES, CONFIDENTIAL_RECORDS_NOTICE, detectFileKind } from "./prepareFiles";

// One source for the section words (src/lib/toolkit/types.ts) and the notice (prepareFiles.ts).
// Both are re-exported so existing imports keep working.
export { SECTION_LABELS, CONFIDENTIAL_RECORDS_NOTICE };

export const LETTER = { width: 612, height: 792 };
const MARGIN = 54;

/** With page numbers on, document pages are shrunk to this size to leave a band for the number. */
export const PAGE_NUMBER_SCALE = 0.95;

export type ExcludedCode =
  | "secured"
  | "unreadable"
  | "picture_unreadable"
  | "not_supported"
  | "no_pages"
  | "too_many_pages"
  | "download_failed"
  | "link"
  | "other";

/** Plain reasons printed on the "Not included" pages and shown on screen. */
export const EXCLUDED_REASONS: Record<ExcludedCode, string> = {
  secured: "This PDF has security settings, so it can't be added. Download it separately.",
  unreadable: "This PDF couldn't be read. Download it separately.",
  picture_unreadable: "This picture couldn't be read. Download it separately.",
  not_supported: "Only PDF, JPG and PNG files can go in a binder PDF. Download it separately.",
  no_pages: "This PDF has no pages.",
  too_many_pages: "The binder reached its page limit. Make another binder with the rest of your files.",
  download_failed: "This file couldn't be downloaded. Try making the binder again.",
  link: "This is a saved link to a file stored somewhere else, not a file in your binder.",
  other: "This file couldn't be added. Download it separately.",
};

export interface BinderSourceFile {
  /** What the person calls the file (their display name, or the file name). Printed in the contents. */
  name: string;
  section?: string | null;
  /** 'yyyy-MM-dd' as typed by the person, if any. Printed as typed; never checked or compared. */
  documentDate?: string | null;
  /** Kept for callers; the builder decides PDF or picture from the bytes, never from this. */
  mimeType?: string;
  /** The file's bytes. Or pass `load` so the file is only fetched when the builder reaches it. */
  bytes?: Uint8Array;
  /** Fetches the bytes when the builder reaches this file (one file in memory at a time). */
  load?: () => Promise<Uint8Array>;
  /** The caller already knows this file can't go in (for example a Word file or a saved link). */
  skip?: { code: ExcludedCode; reason?: string };
  /** The caller's own id for this file, passed back in the result. Never printed. */
  ref?: string;
}

export interface BinderProgress {
  /** Files handled so far (included or not). */
  done: number;
  total: number;
}

export interface BinderInput {
  caseTitle: string;
  /** 'yyyy-MM-dd', the person's local date. */
  generatedOn: string;
  files: BinderSourceFile[];
  /** Add "Page N of M" in a bottom margin band (documents are scaled to 95% so nothing is covered). Default true. */
  pageNumbers?: boolean;
  /** Most document pages to include (default BINDER_MAX_PAGES). Files past the limit are listed as not included. */
  maxPages?: number;
  onProgress?: (progress: BinderProgress) => void;
  /** Stops the build between files (throws an Error named "AbortError"). */
  signal?: AbortSignal;
}

export interface BinderIncluded {
  name: string;
  ref?: string;
  /** First page of this document in the binder (1-based, counting the cover). */
  startPage: number;
  pages: number;
}

export interface BinderExcluded {
  name: string;
  ref?: string;
  code: ExcludedCode;
  reason: string;
}

export interface BinderResult {
  pdfBytes: Uint8Array;
  pageCount: number;
  included: BinderIncluded[];
  excluded: BinderExcluded[];
  /** Pages of contents (after the cover). */
  contentsPages: number;
  /** First "Not included" page (1-based), or null when every file went in. */
  notIncludedPage: number | null;
}

/** Standard PDF fonts only cover Windows-1252; replace anything else so drawing never throws. */
export function pdfSafeText(value: string): string {
  const map: Record<string, string> = {
    "‘": "'",
    "’": "'",
    "“": '"',
    "”": '"',
    "–": "-",
    "—": "-",
    "…": "...",
    " ": " ",
  };
  let out = "";
  for (const ch of value.normalize("NFC")) {
    const mapped = map[ch];
    if (mapped !== undefined) out += mapped;
    else if (ch === "\n" || ch === "\t" || ch === "\r") out += " ";
    else {
      const code = ch.codePointAt(0) ?? 0;
      out += (code >= 0x20 && code <= 0x7e) || (code >= 0xa1 && code <= 0xff) ? ch : "?";
    }
  }
  return out;
}

function truncateToWidth(text: string, font: PDFFont, size: number, maxWidth: number): string {
  const safe = pdfSafeText(text);
  if (font.widthOfTextAtSize(safe, size) <= maxWidth) return safe;
  let lo = 0;
  let hi = safe.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (font.widthOfTextAtSize(safe.slice(0, mid) + "...", size) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return safe.slice(0, lo) + "...";
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = pdfSafeText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
    else {
      if (line) lines.push(line);
      line = font.widthOfTextAtSize(word, size) <= maxWidth ? word : truncateToWidth(word, font, size, maxWidth);
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------------------------------------------------------------------------------------------
// Contents pages
// ---------------------------------------------------------------------------------------------

const TOC_FIRST_PAGE_ROWS = 22;
const TOC_ROWS_PER_PAGE = 30;

/** How many contents pages a binder with this many documents needs (one truncated line per document). */
export function tocPageCount(entries: number): number {
  if (entries <= TOC_FIRST_PAGE_ROWS) return 1;
  return 1 + Math.ceil((entries - TOC_FIRST_PAGE_ROWS) / TOC_ROWS_PER_PAGE);
}

// ---------------------------------------------------------------------------------------------
// Page geometry: the page as it is shown (crop box plus rotation)
// ---------------------------------------------------------------------------------------------

type Rotation = 0 | 90 | 180 | 270;

/** 0, 90, 180 or 270 (clockwise, as /Rotate means). */
function rotationOf(page: PDFPage): Rotation {
  const raw = page.getRotation().angle;
  return ((((Math.round(raw / 90) * 90) % 360) + 360) % 360) as Rotation;
}

/**
 * Where the shrunk content goes. Along each axis, the value is the share of the free space placed
 * on the low side: 0.5 centers; 1 or 0 pushes all of it to one side, which is where the empty band
 * ends up (the bottom of the page as shown).
 */
function bandShares(rotation: Rotation): { ax: number; ay: number } {
  switch (rotation) {
    case 90:
      return { ax: 0, ay: 0.5 }; // shown bottom = right edge of the unrotated page
    case 180:
      return { ax: 0.5, ay: 0 }; // shown bottom = top edge
    case 270:
      return { ax: 1, ay: 0.5 }; // shown bottom = left edge
    default:
      return { ax: 0.5, ay: 1 }; // shown bottom = bottom edge
  }
}

/** Adds (tx, ty) to every coordinate pair in an annotation array (Rect, QuadPoints, Vertices, L, CL). */
function shiftPairs(list: PDFArray, tx: number, ty: number) {
  for (let i = 0; i < list.size(); i++) {
    const el = list.lookup(i);
    if (el instanceof PDFNumber) list.set(i, PDFNumber.of(el.asNumber() + (i % 2 === 0 ? tx : ty)));
  }
}

/** Moves every annotation on the page (links, comments, any form fields left) by (tx, ty). */
function shiftAnnotations(page: PDFPage, tx: number, ty: number) {
  const annots = page.node.Annots();
  if (!annots) return;
  for (let i = 0; i < annots.size(); i++) {
    const annot = annots.lookup(i);
    if (!(annot instanceof PDFDict)) continue;
    for (const key of ["Rect", "QuadPoints", "Vertices", "L", "CL"]) {
      const list = annot.lookup(PDFName.of(key));
      if (list instanceof PDFArray) shiftPairs(list, tx, ty);
    }
    const ink = annot.lookup(PDFName.of("InkList"));
    if (ink instanceof PDFArray) {
      for (let j = 0; j < ink.size(); j++) {
        const stroke = ink.lookup(j);
        if (stroke instanceof PDFArray) shiftPairs(stroke, tx, ty);
      }
    }
  }
}

/**
 * Shrinks a copied document page to PAGE_NUMBER_SCALE inside its visible area (the crop box),
 * leaving the empty band at the bottom of the page as shown. The page content and its annotations
 * get exactly the same transform (scale about the origin, then translate), and the original
 * content is clipped to its old visible area so nothing hidden outside it shows up in the band.
 */
function shrinkIntoBand(page: PDFPage, s: number = PAGE_NUMBER_SCALE) {
  const crop = page.getCropBox();
  const { ax, ay } = bandShares(rotationOf(page));
  const tx = (1 - s) * crop.x + ax * (1 - s) * crop.width;
  const ty = (1 - s) * crop.y + ay * (1 - s) * crop.height;

  page.node.normalize();
  const context = page.doc.context;
  const start = context.register(
    context.contentStream([
      pushGraphicsState(),
      concatTransformationMatrix(s, 0, 0, s, tx, ty),
      rectangle(crop.x, crop.y, crop.width, crop.height),
      clip(),
      endPath(),
    ]),
  );
  const end = context.register(context.contentStream([popGraphicsState()]));
  page.node.wrapContentStreams(start, end);

  page.scaleAnnotations(s, s);
  shiftAnnotations(page, tx, ty);
}

/**
 * "Page N of M", centered in the bottom band of the page as it is shown (crop box and rotation
 * respected), drawn upright for the reader.
 */
function drawFooter(page: PDFPage, font: PDFFont, n: number, total: number) {
  const label = `Page ${n} of ${total}`;
  const crop = page.getCropBox();
  const rotation = rotationOf(page);
  const sideways = rotation === 90 || rotation === 270;
  const shownWidth = sideways ? crop.height : crop.width;
  const shownHeight = sideways ? crop.width : crop.height;
  const band = (1 - PAGE_NUMBER_SCALE) * shownHeight;
  const size = Math.max(5, Math.min(16, (8 * shownWidth) / LETTER.width, band * 0.45));
  const baseline = Math.max(3, Math.min(14, band * 0.3));
  const w = font.widthOfTextAtSize(label, size);
  const { x: x0, y: y0, width, height } = crop;

  let x: number;
  let y: number;
  switch (rotation) {
    case 90:
      x = x0 + width - baseline;
      y = y0 + (height - w) / 2;
      break;
    case 180:
      x = x0 + (width + w) / 2;
      y = y0 + height - baseline;
      break;
    case 270:
      x = x0 + baseline;
      y = y0 + (height + w) / 2;
      break;
    default:
      x = x0 + (width - w) / 2;
      y = y0 + baseline;
  }
  page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.2, 0.2), rotate: degrees(rotation) });
}

// ---------------------------------------------------------------------------------------------
// Adding one file
// ---------------------------------------------------------------------------------------------

class SkipFile extends Error {
  readonly code: ExcludedCode;
  constructor(code: ExcludedCode) {
    super(code);
    this.name = "SkipFile";
    this.code = code;
  }
}

function abortError(): Error {
  const err = new Error("The binder was stopped.");
  err.name = "AbortError";
  return err;
}

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

const INK = rgb(0.07, 0.09, 0.15);
const MUTED = rgb(0.3, 0.33, 0.38);

/** Copies every page of one PDF into the binder. Returns the number of pages added. */
async function addPdf(out: PDFDocument, bytes: Uint8Array, opts: { pageNumbers: boolean; roomLeft: number }): Promise<number> {
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (err) {
    const text = err instanceof Error ? `${err.name} ${err.message}` : String(err);
    throw new SkipFile(/encrypt/i.test(text) ? "secured" : "unreadable");
  }
  const count = src.getPageCount();
  if (count === 0) throw new SkipFile("no_pages");
  if (count > opts.roomLeft) throw new SkipFile("too_many_pages");

  // Filled forms: make the typed values part of the page so they print and move with it.
  try {
    src.getForm().flatten();
  } catch {
    // Keep the form as it is; its fields are moved together with the page below.
  }

  let copied: PDFPage[];
  try {
    copied = await out.copyPages(src, src.getPageIndices());
    if (opts.pageNumbers) copied.forEach((page) => shrinkIntoBand(page));
  } catch {
    throw new SkipFile("unreadable");
  }
  copied.forEach((page) => out.addPage(page));
  return count;
}

/** Places one picture on a US Letter page, scaled to fit inside the margins. */
async function addImage(out: PDFDocument, bytes: Uint8Array, kind: "jpeg" | "png", name: string, fonts: Fonts) {
  let image;
  try {
    image = kind === "png" ? await out.embedPng(bytes) : await out.embedJpg(bytes);
    // Embed now, so a bad picture fails here (and is listed) rather than when the binder is saved.
    await image.embed();
  } catch {
    throw new SkipFile("picture_unreadable");
  }
  if (!image.width || !image.height) throw new SkipFile("picture_unreadable");
  const page = out.addPage([LETTER.width, LETTER.height]);
  const maxW = LETTER.width - 2 * MARGIN;
  const maxH = LETTER.height - 2 * MARGIN - 24;
  const scale = Math.min(maxW / image.width, maxH / image.height, 1);
  const w = image.width * scale;
  const h = image.height * scale;
  page.drawText(truncateToWidth(name, fonts.regular, 9, maxW), {
    x: MARGIN,
    y: LETTER.height - MARGIN + 6,
    size: 9,
    font: fonts.regular,
    color: MUTED,
  });
  page.drawImage(image, { x: (LETTER.width - w) / 2, y: MARGIN + (maxH - h) / 2, width: w, height: h });
}

// ---------------------------------------------------------------------------------------------
// Cover, contents and "Not included" pages
// ---------------------------------------------------------------------------------------------

function drawCover(page: PDFPage, input: BinderInput, documents: number, pageNumbers: boolean, fonts: Fonts) {
  const width = LETTER.width - 2 * MARGIN;
  let y = LETTER.height - MARGIN - 40;
  page.drawText("Case binder", { x: MARGIN, y, size: 30, font: fonts.bold, color: INK });
  y -= 44;
  for (const line of wrapText(input.caseTitle || "My documents", fonts.bold, 18, width).slice(0, 6)) {
    page.drawText(line, { x: MARGIN, y, size: 18, font: fonts.bold, color: INK });
    y -= 24;
  }
  y -= 10;
  page.drawText(pdfSafeText(`Made on ${formatLongDate(input.generatedOn)}`), { x: MARGIN, y, size: 12, font: fonts.regular, color: MUTED });
  y -= 18;
  page.drawText(`${documents} document${documents === 1 ? "" : "s"}`, { x: MARGIN, y, size: 12, font: fonts.regular, color: MUTED });

  // Counsel's cover text. Branding appears on the cover only.
  const note = [
    "Documents put in order by the person who uploaded them, using Justice Bot USA software. Not reviewed by a lawyer, a court or Justice Bot USA. This is not a court filing and is not formatted to any court's rules.",
    ...(pageNumbers ? ["Page numbers in this binder were added by the binder tool and are not part of the original documents."] : []),
    "Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc. Legal information, not legal advice.",
  ];
  let ny = MARGIN + 90;
  for (const para of note) {
    for (const line of wrapText(para, fonts.regular, 10, width)) {
      page.drawText(line, { x: MARGIN, y: ny, size: 10, font: fonts.regular, color: MUTED });
      ny -= 14;
    }
    ny -= 6;
  }
}

interface ContentsRow {
  name: string;
  section?: string | null;
  documentDate?: string | null;
  startPage: number;
}

function drawContents(
  out: PDFDocument,
  rows: ContentsRow[],
  tocPages: number,
  excludedCount: number,
  notIncludedPage: number | null,
  fonts: Fonts,
) {
  const colNo = MARGIN;
  const colSection = MARGIN + 28;
  const colName = MARGIN + 150;
  const colDate = LETTER.width - MARGIN - 130;
  const colPage = LETTER.width - MARGIN - 36;
  const f = fonts.regular;
  let row = 0;
  for (let t = 0; t < tocPages; t++) {
    const page = out.insertPage(1 + t, [LETTER.width, LETTER.height]);
    let ty = LETTER.height - MARGIN;
    if (t === 0) {
      page.drawText("Contents", { x: MARGIN, y: ty - 16, size: 20, font: fonts.bold, color: INK });
      ty -= 52;
    } else {
      page.drawText("Contents (continued)", { x: MARGIN, y: ty - 4, size: 12, font: fonts.bold, color: MUTED });
      ty -= 24;
    }
    page.drawText("#", { x: colNo, y: ty, size: 9, font: fonts.bold, color: MUTED });
    page.drawText("Section", { x: colSection, y: ty, size: 9, font: fonts.bold, color: MUTED });
    page.drawText("Document", { x: colName, y: ty, size: 9, font: fonts.bold, color: MUTED });
    page.drawText("Date (as typed)", { x: colDate, y: ty, size: 9, font: fonts.bold, color: MUTED });
    page.drawText("Page", { x: colPage, y: ty, size: 9, font: fonts.bold, color: MUTED });
    ty -= 8;
    page.drawLine({ start: { x: MARGIN, y: ty }, end: { x: LETTER.width - MARGIN, y: ty }, thickness: 0.5, color: MUTED });
    ty -= 16;
    const perPage = t === 0 ? TOC_FIRST_PAGE_ROWS : TOC_ROWS_PER_PAGE;
    for (let r = 0; r < perPage && row < rows.length; r++, row++) {
      const entry = rows[row];
      const section = SECTION_LABELS[(entry.section ?? "") as keyof typeof SECTION_LABELS] ?? "";
      page.drawText(String(row + 1), { x: colNo, y: ty, size: 10, font: f, color: INK });
      page.drawText(truncateToWidth(section, f, 10, colName - colSection - 8), { x: colSection, y: ty, size: 10, font: f, color: INK });
      page.drawText(truncateToWidth(entry.name, f, 10, colDate - colName - 8), { x: colName, y: ty, size: 10, font: f, color: INK });
      if (entry.documentDate) {
        page.drawText(truncateToWidth(formatShortDate(entry.documentDate), f, 10, colPage - colDate - 8), {
          x: colDate,
          y: ty,
          size: 10,
          font: f,
          color: INK,
        });
      }
      page.drawText(String(entry.startPage), { x: colPage, y: ty, size: 10, font: f, color: INK });
      ty -= 20;
    }
    if (rows.length === 0 && t === 0) {
      page.drawText("No documents could be added to this binder.", { x: MARGIN, y: ty, size: 10, font: f, color: INK });
      ty -= 20;
    }
    if (t === tocPages - 1 && excludedCount > 0 && notIncludedPage !== null) {
      ty -= 10;
      const text = `${excludedCount} file${excludedCount === 1 ? " is" : "s are"} not in this binder. See the list on page ${notIncludedPage}.`;
      page.drawText(pdfSafeText(text), { x: MARGIN, y: ty, size: 10, font: fonts.bold, color: INK });
    }
  }
}

/** Lists every file that is not in the binder, on as many pages as it takes. Returns the pages added. */
function drawNotIncluded(out: PDFDocument, excluded: BinderExcluded[], fonts: Fonts): number {
  if (excluded.length === 0) return 0;
  const width = LETTER.width - 2 * MARGIN;
  const bottom = MARGIN + 30; // stay clear of the page number band
  let pages = 0;

  const newPage = (): { page: PDFPage; y: number } => {
    const page = out.addPage([LETTER.width, LETTER.height]);
    pages += 1;
    let y = LETTER.height - MARGIN - 16;
    const first = pages === 1;
    page.drawText(first ? "Not included in this binder" : "Not included in this binder (continued)", {
      x: MARGIN,
      y,
      size: first ? 18 : 14,
      font: fonts.bold,
      color: INK,
    });
    y -= first ? 22 : 20;
    if (first) {
      for (const line of wrapText("These files are still in your account. Open or download them separately.", fonts.regular, 10, width)) {
        page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: MUTED });
        y -= 14;
      }
      y -= 10;
    }
    return { page, y };
  };

  let at = newPage();
  for (const ex of excluded) {
    const reasonLines = wrapText(ex.reason, fonts.regular, 10, width);
    const needed = 15 + reasonLines.length * 14 + 8;
    if (at.y - needed < bottom) at = newPage();
    at.page.drawText(truncateToWidth(ex.name, fonts.bold, 11, width), { x: MARGIN, y: at.y, size: 11, font: fonts.bold, color: INK });
    at.y -= 15;
    for (const line of reasonLines) {
      at.page.drawText(line, { x: MARGIN, y: at.y, size: 10, font: fonts.regular, color: MUTED });
      at.y -= 14;
    }
    at.y -= 8;
  }
  return pages;
}

// ---------------------------------------------------------------------------------------------
// The builder
// ---------------------------------------------------------------------------------------------

/** Builds the binder. Files are used in the order given, one at a time. */
export async function buildBinderPdf(input: BinderInput): Promise<BinderResult> {
  const pageNumbers = input.pageNumbers !== false;
  const maxPages = Math.max(1, input.maxPages ?? BINDER_MAX_PAGES);
  const total = input.files.length;

  const out = await PDFDocument.create();
  out.setTitle(pdfSafeText(`Case binder: ${input.caseTitle || "My documents"}`));
  out.setProducer("Justice Bot USA binder tool");
  out.setCreator("Justice Bot USA binder tool");
  const fonts: Fonts = {
    regular: await out.embedFont(StandardFonts.Helvetica),
    bold: await out.embedFont(StandardFonts.HelveticaBold),
  };

  // The cover is page 1; it is drawn at the end, once the document count is known.
  const cover = out.addPage([LETTER.width, LETTER.height]);

  const placed: { file: BinderSourceFile; contentIndex: number; pages: number }[] = [];
  const excluded: BinderExcluded[] = [];
  let contentPages = 0;

  const exclude = (file: BinderSourceFile, code: ExcludedCode, reason?: string) => {
    excluded.push({ name: file.name, ref: file.ref, code, reason: reason || EXCLUDED_REASONS[code] });
  };

  for (let i = 0; i < total; i++) {
    if (input.signal?.aborted) throw abortError();
    const file = input.files[i];
    try {
      if (file.skip) {
        exclude(file, file.skip.code, file.skip.reason);
        continue;
      }

      let bytes: Uint8Array | undefined;
      try {
        bytes = file.bytes ?? (file.load ? await file.load() : undefined);
      } catch {
        if (input.signal?.aborted) throw abortError();
        exclude(file, "download_failed");
        continue;
      }
      if (!bytes || bytes.length === 0) {
        exclude(file, "unreadable");
        continue;
      }

      const kind = detectFileKind(bytes.subarray(0, 1024));
      const startIndex = out.getPageCount();
      try {
        if (kind === "pdf") {
          const pages = await addPdf(out, bytes, { pageNumbers, roomLeft: maxPages - contentPages });
          placed.push({ file, contentIndex: startIndex, pages });
          contentPages += pages;
        } else if (kind === "jpeg" || kind === "png") {
          if (contentPages + 1 > maxPages) throw new SkipFile("too_many_pages");
          await addImage(out, bytes, kind, file.name, fonts);
          placed.push({ file, contentIndex: startIndex, pages: 1 });
          contentPages += 1;
        } else {
          exclude(file, "not_supported");
        }
      } catch (err) {
        // Take back any pages this file added before it failed.
        while (out.getPageCount() > startIndex) out.removePage(out.getPageCount() - 1);
        const fallback: ExcludedCode = kind === "pdf" ? "unreadable" : kind ? "picture_unreadable" : "other";
        exclude(file, err instanceof SkipFile ? err.code : fallback);
      }
      // `bytes` goes out of scope here, so the file can be released before the next one loads.
    } finally {
      input.onProgress?.({ done: i + 1, total });
    }
  }

  // "Not included" pages go after the documents.
  const notIncludedPages = drawNotIncluded(out, excluded, fonts);

  // Contents pages go after the cover; every start page shifts by their count.
  const tocPages = tocPageCount(placed.length);
  const included: BinderIncluded[] = placed.map((p) => ({
    name: p.file.name,
    ref: p.file.ref,
    startPage: p.contentIndex + tocPages + 1,
    pages: p.pages,
  }));
  const notIncludedPage = notIncludedPages > 0 ? 1 + tocPages + contentPages + 1 : null;
  drawContents(
    out,
    placed.map((p, i) => ({
      name: p.file.name,
      section: p.file.section,
      documentDate: p.file.documentDate,
      startPage: included[i].startPage,
    })),
    tocPages,
    excluded.length,
    notIncludedPage,
    fonts,
  );

  drawCover(cover, input, placed.length, pageNumbers, fonts);

  const pageCount = out.getPageCount();
  if (pageNumbers) out.getPages().forEach((page, i) => drawFooter(page, fonts.regular, i + 1, pageCount));
  const pdfBytes = await out.save();
  return { pdfBytes, pageCount, included, excluded, contentsPages: tocPages, notIncludedPage };
}
