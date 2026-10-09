import { PDFDocument, PDFCheckBox, PDFTextField, StandardFonts } from 'pdf-lib';
import type { Answers, FillableForm } from './types';

const AUTO_SIZE_PT = 9;

/** The size a field asks for in its /DA string. Judicial Council PDFs write it with octal
 *  escapes ("11\\05600 Tf" = 11.00), which pdf-lib misreads as auto-size; auto-size (0) renders
 *  short answers huge, so it falls back to a fixed size. */
function fontSizeOf(field: PDFTextField): number {
  const da = (field.acroField.getDefaultAppearance() ?? '').replace(/\\([0-7]{3})/g, (_, o) =>
    String.fromCharCode(parseInt(o, 8)),
  );
  const size = Number(da.match(/([\d.]+)\s+Tf/)?.[1]);
  return size > 0 ? size : AUTO_SIZE_PT;
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
      field.acroField.setDefaultAppearance(`/Helv ${fontSizeOf(field)} Tf 0 g`);
      field.setText(max !== undefined ? value.slice(0, max) : value);
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

  pdfForm.updateFieldAppearances(font);
  doc.setTitle(`${form.formNumber} — ${form.title}`);
  doc.setProducer('Justice Bot USA');
  return { bytes: await doc.save(), filled, missing };
}
