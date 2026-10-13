import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { trackUSPrepareClicked } from "@/hooks/useAnalytics";
import { PLAN, THIRD_PARTY_FEES_NOTE } from "@/lib/pricing";

// Home page pricing: every court form and form guide is free. The optional Toolkit plan is described
// (and, when sales are open, sold) only on /pricing, with its full terms next to the consent boxes.
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Every court form and form guide we offer in California and New York. No subscription needed.",
    popular: true,
    buttonText: "See the free forms",
    features: [
      { text: "Fill in the California and New York court forms we support online with your own answers", included: true },
      { text: "Download the filled form as a PDF", included: true },
      { text: "Plain-language filling instructions included", included: true },
    ],
  },
];

export const PricingComparison = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fill In Your Own Court Forms — Step-by-Step Instructions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Court forms and form guides are free in California and New York. Other states are coming soon.
          </p>
        </div>

        <div className="grid gap-6 max-w-md mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg"
                  : "border-border"
              }`}
            >
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          feature.included ? "" : "text-muted-foreground"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    trackUSPrepareClicked('pricing_comparison', '', plan.name);
                    navigate("/pricing");
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-base text-center max-w-2xl mx-auto mt-6">
          Want help keeping your case papers in order? The optional Toolkit plan ({PLAN.priceLabel}) adds a case binder
          PDF, a hearing calendar and a class tracker.{" "}
          <Link to="/pricing" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
            See the Toolkit on the Pricing page
          </Link>
          . You don't need it to fill in or download any form.
        </p>
        <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto mt-4">{THIRD_PARTY_FEES_NOTE}</p>
      </div>
    </section>
  );
};

export default PricingComparison;
