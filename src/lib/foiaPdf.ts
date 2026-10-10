import jsPDF from 'jspdf';
import { format } from 'date-fns';

/** PDF of a public records (FOIA) request letter. */
export function generateFoiaLetterPdf(letterText: string, isBundle: boolean): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255);
  doc.setFont('helvetica', 'bold');
  doc.text('PUBLIC RECORDS REQUEST', pageWidth / 2, 22, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    isBundle ? 'Request + Follow-Up + Appeal Template' : 'Official Request Letter',
    pageWidth / 2,
    34,
    { align: 'center' }
  );

  // Date
  let yPos = 55;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;

  // Letter body
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.setFont('helvetica', 'normal');

  const lines = doc.splitTextToSize(letterText, contentWidth);
  const lineHeight = 5;

  for (let i = 0; i < lines.length; i++) {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 25;
    }
    doc.text(lines[i], margin, yPos);
    yPos += lineHeight;
  }

  // If bundle, add follow-up and appeal template pages
  if (isBundle) {
    // Follow-Up Template
    doc.addPage();
    yPos = 25;
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.setFont('helvetica', 'bold');
    doc.text('FOLLOW-UP LETTER TEMPLATE', margin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.setFont('helvetica', 'normal');
    const followUp = [
      '[Your Name]',
      '[Your Address]',
      '',
      '[Date]',
      '',
      '[Agency Name]',
      '[Agency Address]',
      '',
      'RE: Follow-Up — Public Records Request Submitted [Original Date]',
      '',
      'Dear Records Custodian,',
      '',
      'I am writing to follow up on my public records request submitted on [original date].',
      'As of today, I have not received the requested records nor a response indicating',
      'the status of my request.',
      '',
      'Under applicable state law, agencies are required to respond within a reasonable',
      'time frame. I respectfully request an update on the status of my request and an',
      'estimated date for the production of the requested records.',
      '',
      'If any records are being withheld, please provide a written explanation citing',
      'the specific statutory exemption(s) relied upon.',
      '',
      'Thank you for your prompt attention to this matter.',
      '',
      'Sincerely,',
      '[Your Name]',
    ];
    const followUpText = followUp.join('\n');
    const followUpLines = doc.splitTextToSize(followUpText, contentWidth);
    for (const line of followUpLines) {
      if (yPos > pageHeight - 25) { doc.addPage(); yPos = 25; }
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    }

    // Appeal Template
    doc.addPage();
    yPos = 25;
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.setFont('helvetica', 'bold');
    doc.text('APPEAL LETTER TEMPLATE', margin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.setFont('helvetica', 'normal');
    const appeal = [
      '[Your Name]',
      '[Your Address]',
      '',
      '[Date]',
      '',
      '[Supervising Authority / Attorney General\'s Office]',
      '[Address]',
      '',
      'RE: Appeal of Denied Public Records Request',
      '',
      'Dear [Authority],',
      '',
      'I am appealing the denial of my public records request originally submitted to',
      '[Agency Name] on [original date]. The request was denied on [denial date] with',
      'the following justification: [reason given].',
      '',
      'I believe this denial is improper for the following reasons:',
      '',
      '1. The records requested are public records under [State] law.',
      '2. The cited exemption does not apply to the records I requested.',
      '3. [Additional specific arguments based on your situation].',
      '',
      'I respectfully request that you review this denial and order the release of',
      'the requested records. I am prepared to pursue all available legal remedies',
      'if this appeal is not resolved satisfactorily.',
      '',
      'Sincerely,',
      '[Your Name]',
    ];
    const appealText = appeal.join('\n');
    const appealLines = doc.splitTextToSize(appealText, contentWidth);
    for (const line of appealLines) {
      if (yPos > pageHeight - 25) { doc.addPage(); yPos = 25; }
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    }
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      'Legal information, not legal advice. Our content has not yet been reviewed by a licensed attorney.',
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' }
    );
    doc.text(
      `Generated by Justice Bot USA | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}
