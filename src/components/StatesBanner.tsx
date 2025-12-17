import { Badge } from "@/components/ui/badge";

const featuredStates = [
  "California",
  "Texas", 
  "New York",
  "Florida",
  "Illinois",
  "Pennsylvania",
  "Ohio",
  "Georgia",
];

export const StatesBanner = () => {
  return (
    <section className="py-8 bg-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground font-medium">
            Serving all 50 US States • State-specific forms & procedures
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {featuredStates.map((state) => (
            <Badge
              key={state}
              variant="secondary"
              className="px-3 py-1 text-sm font-medium"
            >
              {state}
            </Badge>
          ))}
          <Badge variant="outline" className="px-3 py-1 text-sm">
            + 42 more states
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default StatesBanner;
