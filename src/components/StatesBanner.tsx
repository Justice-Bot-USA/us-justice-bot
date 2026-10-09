import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight, Flag } from "lucide-react";
import { motion } from "framer-motion";

const featuredStates = [
  { code: "CA", name: "California" },
  { code: "TX", name: "Texas" },
  { code: "NY", name: "New York" },
  { code: "FL", name: "Florida" },
  { code: "PA", name: "Pennsylvania" },
  { code: "IL", name: "Illinois" },
  { code: "OH", name: "Ohio" },
  { code: "GA", name: "Georgia" },
];

export const StatesBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Main Banner */}
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Flag className="h-8 w-8 text-primary" />
            <Badge variant="default" className="text-lg px-4 py-2 bg-primary">
              🇺🇸 Now live in California & New York · Other 48 states coming soon
            </Badge>
            <Flag className="h-8 w-8 text-primary" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Your Legal Ally Across America
          </h2>
          
          <p className="text-lg text-muted-foreground text-center max-w-2xl">
            State-specific forms, courts, and legal procedures for every jurisdiction. 
            From California to New York, we've got you covered.
          </p>
        </div>

        {/* Featured States */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {featuredStates.map((state, i) => (
            <motion.div
              key={state.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/states/${state.code.toLowerCase()}`}>
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {state.name}
                </Badge>
              </Link>
            </motion.div>
          ))}
          <Link to="/states/ca">
            <Badge 
              variant="secondary" 
              className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              + 42 more states
              <ArrowRight className="h-3 w-3 ml-1" />
            </Badge>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">50</div>
            <div className="text-sm text-muted-foreground">States Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">459</div>
            <div className="text-sm text-muted-foreground">Legal Funnels</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">9</div>
            <div className="text-sm text-muted-foreground">Legal Areas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Court Forms</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/case-analysis">
              <Star className="h-4 w-4 mr-2" />
              Find Your State's Resources
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Request your state's specialized forms and procedures
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatesBanner;
