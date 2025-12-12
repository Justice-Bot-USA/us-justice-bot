import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateCaseSummaryPDF, downloadPDF } from '@/lib/pdfGenerator';
import type { Case } from '@/hooks/useCases';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface ExportAllCasesButtonProps {
  cases: Case[];
}

export function ExportAllCasesButton({ cases }: ExportAllCasesButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    if (cases.length === 0) {
      toast.error('No cases to export');
      return;
    }

    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPos = 20;

      // Cover page
      doc.setFontSize(24);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text('MY LEGAL CASES', pageWidth / 2, 60, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Exported on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 75, { align: 'center' });
      doc.text(`Total Cases: ${cases.length}`, pageWidth / 2, 85, { align: 'center' });

      // Table of contents
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text('Table of Contents', margin, 110);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      let tocY = 120;
      cases.forEach((c, idx) => {
        if (tocY > 270) {
          doc.addPage();
          tocY = 30;
        }
        doc.text(`${idx + 1}. ${c.case_title.slice(0, 60)}${c.case_title.length > 60 ? '...' : ''}`, margin, tocY);
        doc.text(`${c.merit_score}%`, pageWidth - margin - 20, tocY);
        tocY += 8;
      });

      // Add each case as a new section
      cases.forEach((caseData, idx) => {
        doc.addPage();
        yPos = 20;

        // Case header
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`CASE ${idx + 1} OF ${cases.length}`, margin, yPos);
        yPos += 15;

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(caseData.case_title, pageWidth - margin * 2);
        doc.text(titleLines, margin, yPos);
        yPos += titleLines.length * 7 + 10;

        // Case info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60);
        doc.text(`State: ${caseData.state}${caseData.county ? `, ${caseData.county}` : ''}`, margin, yPos);
        yPos += 6;
        doc.text(`Legal Area: ${caseData.legal_area}`, margin, yPos);
        yPos += 6;
        doc.text(`Status: ${caseData.status?.replace('_', ' ').toUpperCase() || 'PENDING'}`, margin, yPos);
        yPos += 6;
        doc.text(`Merit Score: ${caseData.merit_score}%`, margin, yPos);
        yPos += 6;
        doc.text(`Created: ${format(new Date(caseData.created_at), 'MMM d, yyyy')}`, margin, yPos);
        yPos += 15;

        // Description
        if (caseData.case_description) {
          doc.setFont('helvetica', 'bold');
          doc.text('Description:', margin, yPos);
          yPos += 6;
          doc.setFont('helvetica', 'normal');
          const descLines = doc.splitTextToSize(caseData.case_description, pageWidth - margin * 2);
          doc.text(descLines, margin, yPos);
          yPos += descLines.length * 5 + 10;
        }

        // Notes
        if (caseData.notes) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          doc.setFont('helvetica', 'bold');
          doc.text('Notes:', margin, yPos);
          yPos += 6;
          doc.setFont('helvetica', 'normal');
          const noteLines = doc.splitTextToSize(caseData.notes, pageWidth - margin * 2);
          doc.text(noteLines, margin, yPos);
        }
      });

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `US Justice Bot | justicebot-usa.com | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      downloadPDF(doc, `all-cases-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success(`Exported ${cases.length} cases`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export cases');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExportAll} 
      disabled={exporting || cases.length === 0}
    >
      {exporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Export All ({cases.length})
    </Button>
  );
}
