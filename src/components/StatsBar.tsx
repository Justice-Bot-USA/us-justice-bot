import { FileText, ListChecks, MapPin } from "lucide-react";

const StatsBar = () => {
  return (
    <div className="bg-muted/50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">Official court forms</span>
          </div>

          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">Plain-language filing steps</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">Live in California and New York</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
