import { Users, Star, Clock } from "lucide-react";

const StatsBar = () => {
  return (
    <div className="bg-muted/50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-semibold">10,000+</span>
            <span className="text-muted-foreground">Americans helped</span>
          </div>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            ))}
            <span className="font-semibold ml-1">4.8/5</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">Avg prep:</span>
            <span className="font-semibold">15 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
