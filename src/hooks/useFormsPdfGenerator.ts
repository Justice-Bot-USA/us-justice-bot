import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { getExpandedStateFormsData, type CourtForm } from '@/lib/forms';
import { US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';

interface GeneratedFormPdf {
  id: string;
  name: string;
  formNumber: string;
  blob: Blob;
  url: string;
  category: string;
}

interface CaseContext {
  caseTitle?: string;
  caseDescription?: string;
  state: string;
  county?: string;
  legalArea: string;
  meritScore?: number;
  filingDeadline?: string;
}

// Map funnel legal areas to forms library categories
const LEGAL_AREA_TO_CATEGORY: Record<string, string[]> = {
  'family': ['family-law', 'divorce', 'Family Law', 'Divorce', 'Family'],
  'small-claims': ['small-claims', 'Small Claims', 'Civil'],
  'criminal': ['criminal', 'Criminal Defense', 'Criminal'],
  'cps': ['cps', 'CPS Defense', 'Child Welfare', 'CPS'],
  'workers-rights': ['workers-rights', 'Workers Rights', 'Employment'],
  'human-rights': ['human-rights', 'Human Rights', 'Civil Rights'],
  'housing': ['housing', 'Housing', 'Eviction', 'Tenant Rights'],
  'employment': ['employment', 'Employment', 'Workers Rights'],
  'agency-complaints': ['agency-complaints', 'Police Accountability', 'Professional Complaints'],
};

function getFormsForCase(state: string, legalArea: string): CourtForm[] {
  const stateData = getExpandedStateFormsData(state);
  const relevantCategories = LEGAL_AREA_TO_CATEGORY[legalArea] || [legalArea];
  
  let forms: CourtForm[] = [];
  
  // Get forms from matching categories
  Object.entries(stateData.forms).forEach(([category, categoryForms]) => {
    if (relevantCategories.some(rc => 
      category.toLowerCase().includes(rc.toLowerCase()) || 
      rc.toLowerCase().includes(category.toLowerCase())
    )) {
      forms = [...forms, ...categoryForms];
    }
  });

  // If no forms found, try to get from the direct key match
  if (forms.length === 0 && stateData.forms[legalArea]) {
    forms = stateData.forms[legalArea];
  }

  // Fallback to first available category if still empty
  if (forms.length === 0) {
    const firstCategory = Object.keys(stateData.forms)[0];
    if (firstCategory) {
      forms = stateData.forms[firstCategory].slice(0, 5);
    }
  }

  // Limit to 8 most relevant forms
  return forms.slice(0, 8);
}

function generateSingleFormPdf(
  form: CourtForm,
  context: CaseContext,
  stateData: { courtWebsite: string; selfHelpUrl: string }
): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 25;

  // Header with form identification
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('STATE COURT FORM', margin, yPos);
  doc.text(format(new Date(), 'MMMM d, yyyy'), pageWidth - margin - 35, yPos);
  
  yPos += 12;
  
  // Form Number Badge
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text(`Form ${form.formNumber}`, margin, yPos);
  
  yPos += 10;
  
  // Form Title
  doc.setFontSize(14);
  doc.setTextColor(0);
  const titleLines = doc.splitTextToSize(form.name, contentWidth);
  doc.text(titleLines, margin, yPos);
  yPos += titleLines.length * 7 + 15;

  // Jurisdiction Box
  doc.setDrawColor(200);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, 'FD');
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  
  const stateName = US_STATE_NAMES[context.state] || context.state;
  doc.text(`State: ${stateName}${context.county ? `, ${context.county} County` : ''}`, margin + 8, yPos);
  yPos += 7;
  doc.text(`Legal Area: ${LEGAL_AREA_NAMES[context.legalArea] || context.legalArea}`, margin + 8, yPos);
  yPos += 7;
  doc.text(`Category: ${form.category}`, margin + 8, yPos);
  
  yPos += 20;

  // Form Purpose Section
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('PURPOSE OF THIS FORM', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  const descLines = doc.splitTextToSize(form.description, contentWidth);
  doc.text(descLines, margin, yPos);
  yPos += descLines.length * 5 + 15;

  // Fee Information
  if (form.feeAmount) {
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('FILING FEES', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    doc.text(`Filing Fee: ${form.feeAmount}`, margin, yPos);
    yPos += 5;
    if (form.feeWaiverAvailable) {
      doc.text('Fee Waiver: Available for qualifying individuals', margin, yPos);
      yPos += 5;
    }
    yPos += 10;
  }

  // Official Form Link
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('WHERE TO OBTAIN OFFICIAL FORM', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(37, 99, 235);
  
  // Create clickable link
  const formUrl = form.url || stateData.courtWebsite || stateData.selfHelpUrl;
  if (formUrl) {
    const displayUrl = formUrl.length > 70 ? formUrl.substring(0, 67) + '...' : formUrl;
    doc.textWithLink(displayUrl, margin, yPos, { url: formUrl });
  } else {
    doc.setTextColor(60);
    doc.text('Contact your local court clerk for this form', margin, yPos);
  }
  yPos += 15;

  // Court Resources
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('COURT RESOURCES', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  
  if (stateData.courtWebsite) {
    doc.text(`Official Court Website: ${stateData.courtWebsite}`, margin, yPos);
    yPos += 5;
  }
  if (stateData.selfHelpUrl) {
    doc.text(`Self-Help Center: ${stateData.selfHelpUrl}`, margin, yPos);
    yPos += 5;
  }
  yPos += 15;

  // Case Context Section (if provided)
  if (context.caseTitle || context.caseDescription) {
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('YOUR CASE CONTEXT', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    
    if (context.caseTitle) {
      const caseLines = doc.splitTextToSize(`Matter: ${context.caseTitle}`, contentWidth);
      doc.text(caseLines, margin, yPos);
      yPos += caseLines.length * 5 + 5;
    }
    
    if (context.meritScore) {
      doc.text(`Case Merit Score: ${context.meritScore}%`, margin, yPos);
      yPos += 10;
    }
  }

  // Instructions Section
  yPos = Math.max(yPos, pageHeight - 80);
  
  doc.setDrawColor(245, 158, 11);
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'FD');
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT INSTRUCTIONS', margin + 8, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const instructions = [
    '1. Download the official court form from the link above',
    '2. Fill in all required fields carefully and legibly',
    '3. Make copies for yourself and all parties before filing',
    '4. File with the court clerk and pay any required fees'
  ];
  instructions.forEach(instruction => {
    doc.text(instruction, margin + 8, yPos);
    yPos += 5;
  });

  // Footer with disclaimer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    'Generated by A.I. ANAL | This is a reference document, not the official court form.',
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );
  doc.text(
    'Please obtain official forms from your court clerk or the links provided above.',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc.output('blob');
}

function generateFormsPackagePdf(
  forms: CourtForm[],
  context: CaseContext,
  stateData: { courtWebsite: string; selfHelpUrl: string }
): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 25;

  const stateName = US_STATE_NAMES[context.state] || context.state;
  const legalAreaName = LEGAL_AREA_NAMES[context.legalArea] || context.legalArea;

  // Cover Page
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 80, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255);
  doc.setFont('helvetica', 'bold');
  doc.text('COURT FORMS PACKAGE', pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${legalAreaName} | ${stateName}`, pageWidth / 2, 50, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(format(new Date(), 'MMMM d, yyyy'), pageWidth / 2, 65, { align: 'center' });

  yPos = 100;

  // Case Summary
  if (context.caseTitle) {
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Case Information', margin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    const titleLines = doc.splitTextToSize(context.caseTitle, contentWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 5 + 10;
    
    if (context.meritScore) {
      doc.text(`Merit Score: ${context.meritScore}%`, margin, yPos);
      yPos += 15;
    }
  }

  // Forms List
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Required Forms Checklist', margin, yPos);
  yPos += 12;

  forms.forEach((form, idx) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 25;
    }

    // Checkbox
    doc.setDrawColor(100);
    doc.rect(margin, yPos - 4, 6, 6);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}. ${form.formNumber} - ${form.name}`, margin + 12, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(form.description, contentWidth - 15);
    doc.text(descLines, margin + 12, yPos);
    yPos += descLines.length * 4 + 8;
  });

  // Court Resources Page
  doc.addPage();
  yPos = 25;

  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Court Resources & Filing Information', margin, yPos);
  yPos += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);

  if (stateData.courtWebsite) {
    doc.setFont('helvetica', 'bold');
    doc.text('Official Court Website:', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(37, 99, 235);
    doc.textWithLink(stateData.courtWebsite, margin, yPos, { url: stateData.courtWebsite });
    yPos += 12;
  }

  if (stateData.selfHelpUrl) {
    doc.setTextColor(60);
    doc.setFont('helvetica', 'bold');
    doc.text('Self-Help Resources:', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(37, 99, 235);
    doc.textWithLink(stateData.selfHelpUrl, margin, yPos, { url: stateData.selfHelpUrl });
    yPos += 15;
  }

  // Filing Tips
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Filing Tips', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);

  const tips = [
    'Make at least 3 copies of every form before filing',
    'Keep the original for yourself, file one with the court, serve one to opposing party',
    'Ask the clerk about fee waiver eligibility if filing fees are a hardship',
    'Bring valid ID when filing in person',
    'Request a "filed-stamped" copy for your records',
    'Note all deadlines and calendar them immediately'
  ];

  tips.forEach((tip, idx) => {
    doc.text(`${idx + 1}. ${tip}`, margin, yPos);
    yPos += 6;
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated by A.I. ANAL | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}

export function useFormsPdfGenerator() {
  const generateForms = (context: CaseContext): GeneratedFormPdf[] => {
    const forms = getFormsForCase(context.state, context.legalArea);
    const stateData = getExpandedStateFormsData(context.state);
    
    const generatedPdfs: GeneratedFormPdf[] = [];

    // Generate individual form PDFs
    forms.forEach((form, index) => {
      const blob = generateSingleFormPdf(form, context, {
        courtWebsite: stateData.courtWebsite,
        selfHelpUrl: stateData.selfHelpUrl,
      });
      const url = URL.createObjectURL(blob);

      generatedPdfs.push({
        id: `form-${index}-${form.formNumber}`,
        name: form.name,
        formNumber: form.formNumber,
        blob,
        url,
        category: form.category,
      });
    });

    return generatedPdfs;
  };

  const generateFormsPackage = (context: CaseContext): { blob: Blob; url: string } => {
    const forms = getFormsForCase(context.state, context.legalArea);
    const stateData = getExpandedStateFormsData(context.state);

    const blob = generateFormsPackagePdf(forms, context, {
      courtWebsite: stateData.courtWebsite,
      selfHelpUrl: stateData.selfHelpUrl,
    });
    const url = URL.createObjectURL(blob);

    return { blob, url };
  };

  const downloadPdf = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFormsList = (state: string, legalArea: string): CourtForm[] => {
    return getFormsForCase(state, legalArea);
  };

  return {
    generateForms,
    generateFormsPackage,
    downloadPdf,
    getFormsList,
  };
}
