import { PDFDocument, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFTextField, StandardFonts, type PDFFont } from 'pdf-lib';
import type { Answers, FillableForm } from './types';

const AUTO_SIZE_PT = 9;

/** The size a field asks for in its /DA string. Judicial Council PDFs write it with octal
 *  escapes ("11\\05600 Tf" = 11.00), which pdf-lib misreads as auto-size; auto-size (0) renders
 *  short answers huge, so it falls back to a fixed size. */
function fontSizeOf(field: PDFTextField, value: string, font: PDFFont): number {
  const da = (field.acroField.getDefaultAppearance() ?? '').replace(/\\([0-7]{3})/g, (_, o) =>
    String.fromCharCode(parseInt(o, 8)),
  );
  const size = Number(da.match(/([\d.]+)\s+Tf/)?.[1]);
  if (size > 0) return size;
  // Auto-size field: shrink a long single-line answer to fit the box instead of cutting it off.
  const width = field.acroField.getWidgets()[0]?.getRectangle().width ?? 0;
  const perPt = font.widthOfTextAtSize(value, 1);
  if (field.isMultiline() || !width || !perPt) return AUTO_SIZE_PT;
  return Math.max(6, Math.min(AUTO_SIZE_PT, Math.floor(((width - 4) / perPt) * 10) / 10));
}

export interface FillResult {
  bytes: Uint8Array;
  filled: number;
  missing: string[];
}

/** Fills an official PDF with the plan from `form.fill(answers)`. Fields stay editable so the
 *  user can finish the parts we do not fill (choices only they can make, signatures). */
export async function fillPdf(form: FillableForm, answers: Answers, pdfBytes?: ArrayBuffer | Uint8Array): Promise<FillResult> {
  const src = pdfBytes ?? (await (await fetch(form.file)).arrayBuffer());
  const doc = await PDFDocument.load(src);
  const pdfForm = doc.getForm();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const plan = form.fill(answers);
  const missing: string[] = [];
  let filled = 0;

  for (const [name, value] of Object.entries(plan.text)) {
    const field = pdfForm.getFieldMaybe(name);
    if (field instanceof PDFTextField) {
      const max = field.getMaxLength();
      // Rewrite /DA in plain form; pdf-lib cannot parse the escaped original.
      const text = max !== undefined ? value.slice(0, max) : value;
      field.acroField.setDefaultAppearance(`/Helv ${fontSizeOf(field, text, font)} Tf 0 g`);
      field.setText(text);
      filled++;
    } else missing.push(name);
  }
  for (const name of plan.check) {
    const field = pdfForm.getFieldMaybe(name);
    if (field instanceof PDFCheckBox) {
      field.check();
      filled++;
    } else missing.push(name);
  }

  for (const [name, index] of Object.entries(plan.radio ?? {})) {
    const field = pdfForm.getFieldMaybe(name);
    const on = field instanceof PDFRadioGroup ? field.acroField.getWidgets()[index]?.getOnValue() : undefined;
    if (field instanceof PDFRadioGroup && on) {
      field.acroField.setValue(on);
      filled++;
    } else missing.push(name);
  }
  for (const [name, value] of Object.entries(plan.select ?? {})) {
    const field = pdfForm.getFieldMaybe(name);
    if (field instanceof PDFDropdown && field.getOptions().includes(value)) {
      field.select(value);
      filled++;
    } else missing.push(name);
  }

  const pages = doc.getPages();
  for (const d of plan.draw ?? []) {
    const page = pages[d.page];
    if (!page || !d.text) continue;
    const size = d.size ?? 10;
    let text = d.text;
    // Shrink to fit the blank when a width is given, down to 6pt, then truncate.
    if (d.maxWidth) {
      let s = size;
      while (s > 6 && font.widthOfTextAtSize(text, s) > d.maxWidth) s -= 0.5;
      while (text.length > 1 && font.widthOfTextAtSize(text, s) > d.maxWidth) text = text.slice(0, -1);
      page.drawText(text, { x: d.x, y: d.y, size: s, font });
    } else {
      page.drawText(text, { x: d.x, y: d.y, size, font });
    }
    filled++;
  }

  if (pdfForm.getFields().length) pdfForm.updateFieldAppearances(font);
  doc.setTitle(`${form.formNumber} — ${form.title}`);
  doc.setProducer('Justice Bot USA');
  return { bytes: await doc.save(), filled, missing };
}
