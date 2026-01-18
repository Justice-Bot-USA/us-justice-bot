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
import { DocumentConsentModal } from '@/components/DocumentConsentModal';
import { analytics } from '@/hooks/useAnalytics';
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
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [pendingExportType, setPendingExportType] = useState<'summary' | 'forms' | 'court-ready' | null>(null);

  const sanitizeFilename = (title: string) => {
    return title
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50);
  };

  const getDocumentTypeLabel = (type: 'summary' | 'forms' | 'court-ready') => {
    switch (type) {
      case 'summary':
        return 'Case Summary';
      case 'forms':
        return 'Forms Checklist';
      case 'court-ready':
        return 'Court-Ready Document';
      default:
        return 'Document';
    }
  };

  const handleExportRequest = (type: 'summary' | 'forms' | 'court-ready') => {
    setPendingExportType(type);
    setConsentModalOpen(true);
  };

  const handleConfirmedExport = async () => {
    if (!pendingExportType) return;
    
    setConsentModalOpen(false);
    setExporting(true);
    
    try {
      const filename = sanitizeFilename(caseData.case_title);
      const documentTypeLabel = getDocumentTypeLabel(pendingExportType);
      
      switch (pendingExportType) {
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

      // 🔥 Track generate_document event ONLY after successful generation
      analytics.generateDocument(
        documentTypeLabel,
        caseData.legal_area || 'unknown',
        caseData.state || 'unknown'
      );

    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to generate document');
    } finally {
      setExporting(false);
      setPendingExportType(null);
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
    <>
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
        <DropdownMenuContent align="end" className="w-56 bg-popover">
          <DropdownMenuItem onClick={() => handleExportRequest('summary')}>
            <FileText className="h-4 w-4 mr-2" />
            Case Summary PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportRequest('forms')}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Forms Checklist PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportRequest('court-ready')}>
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

      <DocumentConsentModal
        open={consentModalOpen}
        onOpenChange={setConsentModalOpen}
        onConfirm={handleConfirmedExport}
        documentType={pendingExportType ? getDocumentTypeLabel(pendingExportType) : 'Document'}
        jurisdiction={caseData.state || 'your jurisdiction'}
      />
    </>
  );
}
