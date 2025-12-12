import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  FileText, 
  ClipboardList, 
  Scale, 
  Printer,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateCaseSummaryPDF, 
  generateFormsChecklistPDF, 
  generateCourtReadyPDF,
  downloadPDF 
} from '@/lib/pdfGenerator';
import type { Case } from '@/hooks/useCases';

interface DocumentExportButtonProps {
  caseData: Case;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function DocumentExportButton({ 
  caseData, 
  variant = 'outline',
  size = 'default' 
}: DocumentExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const sanitizeFilename = (title: string) => {
    return title
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50);
  };

  const handleExport = async (type: 'summary' | 'forms' | 'court-ready') => {
    setExporting(true);
    try {
      const filename = sanitizeFilename(caseData.case_title);
      
      switch (type) {
        case 'summary': {
          const doc = generateCaseSummaryPDF(caseData as any);
          downloadPDF(doc, `${filename}-summary.pdf`);
          toast.success('Case summary downloaded');
          break;
        }
        case 'forms': {
          const doc = generateFormsChecklistPDF(caseData as any);
          downloadPDF(doc, `${filename}-forms-checklist.pdf`);
          toast.success('Forms checklist downloaded');
          break;
        }
        case 'court-ready': {
          const doc = generateCourtReadyPDF(caseData as any);
          downloadPDF(doc, `${filename}-court-ready.pdf`);
          toast.success('Court-ready document downloaded');
          break;
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to generate document');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    const doc = generateCaseSummaryPDF(caseData as any);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={exporting}>
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleExport('summary')}>
          <FileText className="h-4 w-4 mr-2" />
          Case Summary PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('forms')}>
          <ClipboardList className="h-4 w-4 mr-2" />
          Forms Checklist PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('court-ready')}>
          <Scale className="h-4 w-4 mr-2" />
          Court-Ready Document
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Summary
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
