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

// Related case reference for PDF generation
interface RelatedCaseForPDF {
  courtName?: string | null;
  state: string;
  county?: string | null;
  docketNumber?: string | null;
  caseType?: string | null;
  relationshipDescription?: string | null;
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
      `Generated by A.I. ANAL | justicebot-usa.com | Page ${i} of ${pageCount}`,
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
      `Generated by A.I. ANAL | justicebot-usa.com | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const generateCourtReadyPDF = (
  caseData: CaseExportData,
  relatedCases?: RelatedCaseForPDF[]
): jsPDF => {
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

  // Related Proceedings Section
  if (relatedCases && relatedCases.length > 0) {
    yPos = checkNewPage(doc, yPos);
    yPos += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IV. RELATED PROCEEDINGS', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    doc.text('The following related matters exist, as provided by the user:', margin + 5, yPos);
    yPos += 10;

    relatedCases.forEach((rc, idx) => {
      yPos = checkNewPage(doc, yPos);
      
      const caseTypeName = rc.caseType ? rc.caseType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Related Case';
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${caseTypeName}`, margin + 5, yPos);
      yPos += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      
      if (rc.courtName) {
        doc.text(`Court: ${rc.courtName}`, margin + 10, yPos);
        yPos += 5;
      }
      
      if (rc.docketNumber) {
        doc.text(`Case Number: ${rc.docketNumber}`, margin + 10, yPos);
        yPos += 5;
      }
      
      const jurisdiction = [rc.county, rc.state].filter(Boolean).join(', ');
      if (jurisdiction) {
        doc.text(`Jurisdiction: ${jurisdiction}`, margin + 10, yPos);
        yPos += 5;
      }
      
      if (rc.relationshipDescription) {
        yPos = addWrappedText(doc, `Relationship: ${rc.relationshipDescription}`, margin + 10, yPos, contentWidth - 20, 5);
      }
      
      yPos += 5;
    });

    // Disclaimer about related cases
    yPos = checkNewPage(doc, yPos);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    yPos = addWrappedText(
      doc,
      'Note: The above related proceedings are based on user-provided information. No outcomes or determinations are stated unless supported by uploaded evidence.',
      margin + 5,
      yPos,
      contentWidth - 10,
      4
    );
    yPos += 10;
  }

  // Relevant Laws
  const laws = parseJsonField<string[]>(caseData.relevant_laws) || [];
  if (laws.length > 0) {
    yPos = checkNewPage(doc, yPos);
    yPos += 5;

    const sectionNumber = relatedCases && relatedCases.length > 0 ? 'V' : 'IV';
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(`${sectionNumber}. RELEVANT LAWS & STATUTES`, margin, yPos);
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

// Book of Documents PDF with numbered exhibits and table of contents
interface BookOfDocumentsFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  description?: string | null;
  tags?: string[] | null;
  created_at?: string | null;
  bucket_name: string;
}

interface BookOfDocumentsCase {
  case_title: string;
  legal_area: string;
  state: string;
  county?: string | null;
}

interface ExhibitItem {
  exhibitNumber: string;
  fileName: string;
  fileType: string;
  description: string;
  dateAdded: string;
  pageNumber: number;
}

export const generateBookOfDocumentsPDF = (
  files: BookOfDocumentsFile[],
  caseInfo?: BookOfDocumentsCase,
  relatedCases?: RelatedCaseForPDF[]
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  
  // Build exhibit list with numbering
  const exhibits: ExhibitItem[] = files.map((file, idx) => ({
    exhibitNumber: `${String.fromCharCode(65 + Math.floor(idx / 26))}${(idx % 26) + 1}`.replace('A', ''),
    fileName: file.file_name,
    fileType: file.file_type,
    description: file.description || getDefaultDescription(file.file_type),
    dateAdded: file.created_at ? format(new Date(file.created_at), 'MMM d, yyyy') : 'N/A',
    pageNumber: 0 // Will be calculated
  }));

  // Renumber exhibits as Exhibit 1, Exhibit 2, etc.
  exhibits.forEach((exhibit, idx) => {
    exhibit.exhibitNumber = `${idx + 1}`;
  });

  let currentPage = 1;

  // ============ COVER PAGE ============
  let yPos = 60;
  
  // Title
  doc.setFontSize(28);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOK OF DOCUMENTS', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  doc.text('Evidence & Supporting Materials', pageWidth / 2, yPos, { align: 'center' });

  yPos += 40;
  
  // Case info box
  if (caseInfo) {
    doc.setDrawColor(200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 20, yPos, contentWidth - 40, 50, 3, 3, 'FD');
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('RE:', margin + 30, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(caseInfo.case_title, margin + 45, yPos);
    
    yPos += 12;
    doc.text(`Legal Area: ${caseInfo.legal_area}`, margin + 30, yPos);
    
    yPos += 12;
    doc.text(`Jurisdiction: ${caseInfo.state}${caseInfo.county ? `, ${caseInfo.county} County` : ''}`, margin + 30, yPos);
  }

  yPos += 50;
  
  // Document stats
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Summary', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  doc.text(`Total Exhibits: ${exhibits.length}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.text(`Date Compiled: ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, yPos, { align: 'center' });

  // Related Cases Count
  if (relatedCases && relatedCases.length > 0) {
    yPos += 8;
    doc.text(`Related Proceedings: ${relatedCases.length}`, pageWidth / 2, yPos, { align: 'center' });
  }

  // Footer on cover
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Prepared using A.I. ANAL', pageWidth / 2, pageHeight - 30, { align: 'center' });
  doc.text('justicebot-usa.com', pageWidth / 2, pageHeight - 22, { align: 'center' });

  currentPage++;

  // ============ TABLE OF CONTENTS ============
  doc.addPage();
  yPos = 30;

  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('TABLE OF CONTENTS', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin + 40, yPos, pageWidth - margin - 40, yPos);
  
  yPos += 20;

  // Table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Exhibit', margin, yPos);
  doc.text('Description', margin + 25, yPos);
  doc.text('Type', pageWidth - margin - 50, yPos);
  doc.text('Page', pageWidth - margin - 10, yPos);
  
  yPos += 3;
  doc.setLineWidth(0.2);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Calculate page numbers (each exhibit gets its own page for now)
  let tocStartPage = currentPage + 1; // TOC is page 2, exhibits start after
  
  // List exhibits in TOC
  doc.setFont('helvetica', 'normal');
  exhibits.forEach((exhibit, idx) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      currentPage++;
      yPos = 30;
      
      // Repeat header
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Exhibit', margin, yPos);
      doc.text('Description', margin + 25, yPos);
      doc.text('Type', pageWidth - margin - 50, yPos);
      doc.text('Page', pageWidth - margin - 10, yPos);
      yPos += 3;
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
    }

    const exhibitPageNum = tocStartPage + idx;
    exhibit.pageNumber = exhibitPageNum;

    doc.setFontSize(9);
    doc.text(`Ex. ${exhibit.exhibitNumber}`, margin, yPos);
    
    // Truncate description if too long
    const maxDescWidth = pageWidth - margin - 90;
    let desc = exhibit.description;
    while (doc.getTextWidth(desc) > maxDescWidth && desc.length > 10) {
      desc = desc.substring(0, desc.length - 4) + '...';
    }
    doc.text(desc, margin + 25, yPos);
    
    // File type badge
    const typeLabel = getFileTypeLabel(exhibit.fileType);
    doc.text(typeLabel, pageWidth - margin - 50, yPos);
    
    doc.text(String(exhibitPageNum), pageWidth - margin - 5, yPos);
    
    yPos += 8;
  });

  currentPage++;

  // ============ RELATED PROCEEDINGS PAGE ============
  if (relatedCases && relatedCases.length > 0) {
    doc.addPage();
    currentPage++;
    yPos = 30;

    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATED PROCEEDINGS', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin + 40, yPos, pageWidth - margin - 40, yPos);
    
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    yPos = addWrappedText(
      doc,
      'The following related matters exist, as provided by the user. These proceedings may affect or be affected by the primary case.',
      margin,
      yPos,
      contentWidth,
      5
    );
    yPos += 15;

    relatedCases.forEach((rc, idx) => {
      yPos = checkNewPage(doc, yPos, 60);
      
      // Related case box
      doc.setDrawColor(200);
      doc.setFillColor(250, 250, 250);
      const boxStartY = yPos;
      
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      
      const caseTypeName = rc.caseType 
        ? rc.caseType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
        : 'Related Case';
      doc.text(`${idx + 1}. ${caseTypeName}`, margin + 5, yPos + 5);
      yPos += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);

      if (rc.courtName) {
        doc.text(`Court: ${rc.courtName}`, margin + 10, yPos);
        yPos += 7;
      }
      
      if (rc.docketNumber) {
        doc.setFont('helvetica', 'bold');
        doc.text(`Case Number: `, margin + 10, yPos);
        doc.setFont('courier', 'normal');
        doc.text(rc.docketNumber, margin + 45, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 7;
      }
      
      const jurisdiction = [rc.county, rc.state].filter(Boolean).join(', ');
      if (jurisdiction) {
        doc.text(`Jurisdiction: ${jurisdiction}`, margin + 10, yPos);
        yPos += 7;
      }
      
      if (rc.relationshipDescription) {
        yPos = addWrappedText(
          doc, 
          `Relationship: ${rc.relationshipDescription}`, 
          margin + 10, 
          yPos, 
          contentWidth - 20, 
          5
        );
        yPos += 2;
      }

      // Draw box around this entry
      const boxHeight = yPos - boxStartY + 5;
      doc.roundedRect(margin, boxStartY - 8, contentWidth, boxHeight, 2, 2, 'D');
      
      yPos += 10;
    });

    // Disclaimer
    yPos = checkNewPage(doc, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    yPos = addWrappedText(
      doc,
      'Note: Related proceedings are based on user-provided information only. No outcomes or determinations are stated unless supported by uploaded evidence.',
      margin,
      yPos,
      contentWidth,
      4
    );
  }

  // ============ EXHIBIT PAGES ============
  exhibits.forEach((exhibit, idx) => {
    doc.addPage();
    currentPage++;
    yPos = 25;

    // Exhibit header
    doc.setFillColor(30, 64, 175); // Blue header
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.text(`EXHIBIT ${exhibit.exhibitNumber}`, margin, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(exhibit.fileName, margin, 32);
    
    // Page indicator on right
    doc.setFontSize(10);
    doc.text(`Page ${exhibit.pageNumber}`, pageWidth - margin - 20, 20);

    yPos = 60;

    // Document details box
    doc.setDrawColor(200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin, yPos, contentWidth, 70, 3, 3, 'FD');
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Document Information', margin + 10, yPos);
    
    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    
    doc.text(`File Name:`, margin + 10, yPos);
    doc.setTextColor(0);
    doc.text(exhibit.fileName, margin + 50, yPos);
    
    yPos += 10;
    doc.setTextColor(60);
    doc.text(`Type:`, margin + 10, yPos);
    doc.setTextColor(0);
    doc.text(getFileTypeLabel(exhibit.fileType), margin + 50, yPos);
    
    yPos += 10;
    doc.setTextColor(60);
    doc.text(`Date Added:`, margin + 10, yPos);
    doc.setTextColor(0);
    doc.text(exhibit.dateAdded, margin + 50, yPos);
    
    yPos += 10;
    doc.setTextColor(60);
    doc.text(`Description:`, margin + 10, yPos);
    doc.setTextColor(0);
    const descLines = doc.splitTextToSize(exhibit.description, contentWidth - 60);
    doc.text(descLines[0] || 'N/A', margin + 50, yPos);

    yPos += 30;

    // Placeholder for actual document
    doc.setDrawColor(180);
    doc.setFillColor(255, 255, 255);
    doc.setLineDashPattern([3, 3], 0);
    doc.roundedRect(margin, yPos, contentWidth, 120, 3, 3, 'FD');
    doc.setLineDashPattern([], 0);
    
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text('[Document Content]', pageWidth / 2, yPos + 50, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Attach original document here', pageWidth / 2, yPos + 65, { align: 'center' });
    doc.text('or reference the uploaded file in your digital records', pageWidth / 2, yPos + 77, { align: 'center' });

    // Bottom note
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `This exhibit page serves as a cover sheet for ${exhibit.fileName}`,
      pageWidth / 2,
      pageHeight - 25,
      { align: 'center' }
    );
  });

  // ============ ADD PAGE NUMBERS TO ALL PAGES ============
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    if (i > 1) { // Skip cover page
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Add disclaimer to all pages
    doc.text(
      'A.I. ANAL | justicebot-usa.com',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  return doc;
};

// Helper to get default description based on file type
function getDefaultDescription(fileType: string): string {
  if (fileType.startsWith('image/')) return 'Photographic evidence';
  if (fileType.includes('pdf')) return 'PDF document';
  if (fileType.includes('word') || fileType.includes('document')) return 'Word document';
  if (fileType.startsWith('video/')) return 'Video recording';
  if (fileType.startsWith('audio/')) return 'Audio recording';
  if (fileType.startsWith('cloud/')) return 'Cloud-linked document';
  return 'Supporting document';
}

// Helper to get readable file type label
function getFileTypeLabel(fileType: string): string {
  if (fileType.startsWith('image/')) return 'Image';
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('word') || fileType.includes('document')) return 'Document';
  if (fileType.startsWith('video/')) return 'Video';
  if (fileType.startsWith('audio/')) return 'Audio';
  if (fileType.startsWith('cloud/')) return 'Cloud Link';
  return 'File';
}

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
