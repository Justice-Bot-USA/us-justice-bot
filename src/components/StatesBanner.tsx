import { MapPin } from "lucide-react";

export const StatesBanner = () => {
  return (
    <section className="py-10 bg-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Proudly Serving The USA
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            Legal assistance for all 50 states with state-specific forms & procedures
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatesBanner;
