import { MapPin } from "lucide-react";

export const StatesBanner = () => {
  return (
    <section className="py-16 bg-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <MapPin className="h-10 w-10 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Proudly Serving The USA
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-lg">
            Legal assistance for all 50 states with state-specific forms & procedures
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatesBanner;
