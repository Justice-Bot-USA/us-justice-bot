import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Case } from '@/hooks/useCases';

// Extended case data with all analysis fields
interface CaseExportData {
  id: string;
  case_title: string;
  case_description?: string | null;
  state: string;
  county?: string | null;
  legal_area: string;
  merit_score: number;
  status?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  legal_pathway?: unknown;
  required_forms?: unknown;
  evidence_to_gather?: unknown;
  filing_options?: unknown;
  relevant_laws?: unknown;
  supporting_evidence?: unknown;
  strength_factors?: unknown;
  weakness_factors?: unknown;
  next_steps?: unknown;
}

interface FormItem {
  formName: string;
  formNumber?: string;
  purpose: string;
  where: string;
}

interface EvidenceItem {
  type: string;
  importance: string;
  howToObtain: string;
}

interface FilingOptions {
  proSe?: string;
  withAttorney?: string;
  recommendation?: string;
}

// Helper to safely parse JSON data
const parseJsonField = <T>(field: unknown): T | null => {
  if (!field) return null;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch {
      return null;
    }
  }
  return field as T;
};

// Helper to add wrapped text and return new Y position
const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

// Check if we need a new page
const checkNewPage = (doc: jsPDF, yPos: number, margin: number = 40): number => {
  const pageHeight = doc.internal.pageSize.height;
  if (yPos > pageHeight - margin) {
    doc.addPage();
    return 30;
  }
  return yPos;
};

export const generateCaseSummaryPDF = (caseData: CaseExportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Header
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('US JUSTICE BOT - CASE SUMMARY', margin, yPos);
  doc.text(format(new Date(), 'MMMM d, yyyy'), pageWidth - margin - 40, yPos);

  yPos += 15;

  // Case Title
  doc.setFontSize(20);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  yPos = addWrappedText(doc, caseData.case_title, margin, yPos, contentWidth, 8);

  yPos += 10;

  // Case Info Box
  doc.setDrawColor(200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'FD');

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);

  doc.text(`State: ${caseData.state}${caseData.county ? `, ${caseData.county}` : ''}`, margin + 10, yPos);
  doc.text(`Legal Area: ${caseData.legal_area}`, margin + 10, yPos + 8);
  doc.text(`Status: ${caseData.status?.replace('_', ' ').toUpperCase() || 'PENDING'}`, margin + 100, yPos);
  doc.text(`Created: ${format(new Date(caseData.created_at), 'MMM d, yyyy')}`, margin + 100, yPos + 8);

  // Merit Score
  const meritScore = caseData.merit_score || 0;
  const scoreColor = meritScore >= 70 ? [34, 197, 94] : meritScore >= 40 ? [245, 158, 11] : [239, 68, 68];
  doc.setFontSize(24);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`${meritScore}%`, pageWidth - margin - 30, yPos + 12);
  doc.setFontSize(8);
  doc.text('MERIT', pageWidth - margin - 28, yPos + 18);

  yPos += 45;

  // Case Description
  if (caseData.case_description) {
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Case Description', margin, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    yPos = addWrappedText(doc, caseData.case_description, margin, yPos, contentWidth, 5);
    yPos += 10;
  }

  // Strength & Weakness Factors
  const strengths = parseJsonField<string[]>(caseData.strength_factors) || [];
  const weaknesses = parseJsonField<string[]>(caseData.weakness_factors) || [];

  if (strengths.length > 0 || weaknesses.length > 0) {
    yPos = checkNewPage(doc, yPos);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Case Analysis', margin, yPos);
    yPos += 10;

    if (strengths.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(34, 197, 94);
      doc.setFont('helvetica', 'bold');
      doc.text('Strengths:', margin, yPos);
      yPos += 6;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      strengths.forEach((s) => {
        yPos = checkNewPage(doc, yPos);
        doc.text(`• ${s}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    if (weaknesses.length > 0) {
      yPos = checkNewPage(doc, yPos);
      doc.setFontSize(10);
      doc.setTextColor(239, 68, 68);
      doc.setFont('helvetica', 'bold');
      doc.text('Weaknesses:', margin, yPos);
      yPos += 6;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      weaknesses.forEach((w) => {
        yPos = checkNewPage(doc, yPos);
        doc.text(`• ${w}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
  }

  // Next Steps
  const nextSteps = parseJsonField<string[]>(caseData.next_steps) || [];
  if (nextSteps.length > 0) {
    yPos = checkNewPage(doc, yPos);
    yPos += 5;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Next Steps', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    nextSteps.forEach((step, idx) => {
      yPos = checkNewPage(doc, yPos);
      yPos = addWrappedText(doc, `${idx + 1}. ${step}`, margin, yPos, contentWidth, 5);
      yPos += 3;
    });
  }

  // Notes
  if (caseData.notes) {
    yPos = checkNewPage(doc, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Notes', margin, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    yPos = addWrappedText(doc, caseData.notes, margin, yPos, contentWidth, 5);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated by US Justice Bot | justicebot-usa.com | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'This document is for informational purposes only and does not constitute legal advice.',
      pageWidth / 2,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }

  return doc;
};

export const generateFormsChecklistPDF = (caseData: CaseExportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Header
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('US JUSTICE BOT - FORMS CHECKLIST', margin, yPos);
  doc.text(format(new Date(), 'MMMM d, yyyy'), pageWidth - margin - 40, yPos);

  yPos += 15;

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Required Forms & Documents', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  yPos = addWrappedText(doc, `For: ${caseData.case_title}`, margin, yPos, contentWidth, 5);
  yPos += 10;

  // Forms List
  const forms = parseJsonField<FormItem[]>(caseData.required_forms) || [];

  if (forms.length > 0) {
    forms.forEach((form, idx) => {
      yPos = checkNewPage(doc, yPos, 60);

      // Form box
      doc.setDrawColor(200);
      doc.setFillColor(255, 255, 255);
      const boxHeight = 40;
      doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, 'D');

      // Checkbox
      doc.setDrawColor(100);
      doc.rect(margin + 5, yPos + 5, 8, 8);

      // Form details
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${form.formName}`, margin + 18, yPos + 11);

      if (form.formNumber) {
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Form #: ${form.formNumber}`, pageWidth - margin - 40, yPos + 11);
      }

      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Purpose: ${form.purpose}`, margin + 18, yPos + 22);
      doc.text(`Where to obtain: ${form.where}`, margin + 18, yPos + 32);

      yPos += boxHeight + 8;
    });
  } else {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('No specific forms identified for this case yet.', margin, yPos);
    yPos += 20;
  }

  // Evidence Section
  const evidence = parseJsonField<EvidenceItem[]>(caseData.evidence_to_gather) || [];
  
  if (evidence.length > 0) {
    yPos = checkNewPage(doc, yPos);
    yPos += 10;

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Evidence to Gather', margin, yPos);
    yPos += 12;

    evidence.forEach((item, idx) => {
      yPos = checkNewPage(doc, yPos, 35);

      const priorityColor = item.importance === 'high' ? [239, 68, 68] : 
                            item.importance === 'medium' ? [245, 158, 11] : [100, 100, 100];

      // Checkbox
      doc.setDrawColor(100);
      doc.rect(margin, yPos - 4, 6, 6);

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${item.type}`, margin + 10, yPos);

      // Priority badge
      doc.setFontSize(8);
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.text(`[${item.importance.toUpperCase()}]`, margin + 10 + doc.getTextWidth(`${idx + 1}. ${item.type}`) + 3, yPos);

      yPos += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(doc, `How to obtain: ${item.howToObtain}`, margin + 10, yPos, contentWidth - 15, 4);
      yPos += 8;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated by US Justice Bot | justicebot-usa.com | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const generateCourtReadyPDF = (caseData: CaseExportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 30;

  // Formal Header
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('CASE PREPARATION SUMMARY', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Case identification
  doc.setDrawColor(0);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Matter: ${caseData.case_title}`, margin, yPos);
  yPos += 7;
  doc.text(`Jurisdiction: ${caseData.state}${caseData.county ? `, ${caseData.county} County` : ''}`, margin, yPos);
  yPos += 7;
  doc.text(`Legal Area: ${caseData.legal_area}`, margin, yPos);
  yPos += 7;
  doc.text(`Date Prepared: ${format(new Date(), 'MMMM d, yyyy')}`, margin, yPos);
  yPos += 7;
  doc.text(`Case Merit Assessment: ${caseData.merit_score}%`, margin, yPos);
  
  yPos += 5;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Case Summary Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('I. CASE SUMMARY', margin, yPos);
  yPos += 8;

  if (caseData.case_description) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos = addWrappedText(doc, caseData.case_description, margin, yPos, contentWidth, 5);
    yPos += 10;
  }

  // Legal Pathway
  const pathway = parseJsonField<string[]>(caseData.legal_pathway) || [];
  if (pathway.length > 0) {
    yPos = checkNewPage(doc, yPos);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('II. RECOMMENDED LEGAL PATHWAY', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    pathway.forEach((step, idx) => {
      yPos = checkNewPage(doc, yPos);
      yPos = addWrappedText(doc, `Step ${idx + 1}: ${step}`, margin + 5, yPos, contentWidth - 10, 5);
      yPos += 5;
    });
    yPos += 5;
  }

  // Filing Options
  const filingOptions = parseJsonField<FilingOptions>(caseData.filing_options);
  if (filingOptions) {
    yPos = checkNewPage(doc, yPos);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('III. FILING OPTIONS', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (filingOptions.proSe) {
      doc.setFont('helvetica', 'bold');
      doc.text('A. Pro Se (Self-Representation):', margin + 5, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(doc, filingOptions.proSe, margin + 10, yPos, contentWidth - 15, 5);
      yPos += 8;
    }

    if (filingOptions.withAttorney) {
      yPos = checkNewPage(doc, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text('B. With Legal Representation:', margin + 5, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(doc, filingOptions.withAttorney, margin + 10, yPos, contentWidth - 15, 5);
      yPos += 8;
    }

    if (filingOptions.recommendation) {
      yPos = checkNewPage(doc, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text('C. Recommendation:', margin + 5, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(doc, filingOptions.recommendation, margin + 10, yPos, contentWidth - 15, 5);
      yPos += 8;
    }
  }

  // Relevant Laws
  const laws = parseJsonField<string[]>(caseData.relevant_laws) || [];
  if (laws.length > 0) {
    yPos = checkNewPage(doc, yPos);
    yPos += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IV. RELEVANT LAWS & STATUTES', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    laws.forEach((law) => {
      yPos = checkNewPage(doc, yPos);
      yPos = addWrappedText(doc, `• ${law}`, margin + 5, yPos, contentWidth - 10, 5);
      yPos += 3;
    });
  }

  // Footer with disclaimer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 15, { align: 'center' });
    doc.setFontSize(7);
    doc.text(
      'DISCLAIMER: This document is generated for informational purposes only and does not constitute legal advice.',
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'Consult with a licensed attorney before taking any legal action.',
      pageWidth / 2,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
