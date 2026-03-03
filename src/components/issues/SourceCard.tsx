import { ExternalLink, FileText, Info, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SourceCardProps {
  formNumber: string;
  title: string;
  description?: string;
  url?: string;
  officialFormPageUrl?: string | null;
  officialPdfUrl?: string | null;
  officialDirectoryUrl?: string | null;
  category?: string;
  isRequired?: boolean;
}

const categoryColors: Record<string, string> = {
  start: 'bg-primary/10 text-primary border-primary/20',
  respond: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  order: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  emergency: 'bg-destructive/10 text-destructive border-destructive/20',
  official: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  attachment: 'bg-muted text-muted-foreground border-border',
  general: 'bg-muted text-muted-foreground border-border',
};

export function SourceCard({
  formNumber,
  title,
  description,
  url,
  officialFormPageUrl,
  officialPdfUrl,
  officialDirectoryUrl,
  category = 'general',
  isRequired,
}: SourceCardProps) {
  const pdfUrl = officialPdfUrl || url;
  const directoryUrl = officialDirectoryUrl || 'https://www.courts.ca.gov/rules-forms/court-forms';

  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="outline" className={categoryColors[category] || categoryColors.general}>
                {formNumber}
              </Badge>
              {isRequired && (
                <Badge variant="secondary" className="text-xs">Required</Badge>
              )}
              {category === 'emergency' && (
                <Badge variant="destructive" className="text-xs">Emergency</Badge>
              )}
            </div>
            <h4 className="font-medium text-sm text-foreground leading-tight">{title}</h4>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            {officialFormPageUrl && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" asChild>
                <a href={officialFormPageUrl} target="_blank" rel="noopener noreferrer">
                  <Info className="h-3 w-3" />
                  Info
                </a>
              </Button>
            )}
            {pdfUrl && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3 w-3" />
                  PDF
                </a>
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground" asChild>
              <a href={directoryUrl} target="_blank" rel="noopener noreferrer">
                <FolderOpen className="h-3 w-3" />
                Directory
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
