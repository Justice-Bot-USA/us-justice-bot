import { ExternalLink, Shield, Building2, Scale, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  label: string;
  url: string;
  description?: string;
  category: string;
}

const categoryIcons: Record<string, typeof ExternalLink> = {
  official: Building2,
  'legal-aid': Scale,
  'self-help': ExternalLink,
  emergency: Shield,
  form: ExternalLink,
  general: ExternalLink,
};

const categoryLabels: Record<string, string> = {
  official: 'Official Source',
  'legal-aid': 'Legal Aid',
  'self-help': 'Self-Help',
  emergency: 'Emergency',
  form: 'Forms',
  general: 'Resource',
};

export function ResourceCard({ label, url, description, category }: ResourceCardProps) {
  const Icon = categoryIcons[category] || ExternalLink;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
      <Card className="border hover:border-primary/40 hover:shadow-sm transition-all">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                {label}
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
            )}
            <Badge variant="outline" className="mt-1 text-[10px]">
              {categoryLabels[category] || category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
