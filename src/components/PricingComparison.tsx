import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Prepared Filing Pack",
    price: "$9.99",
    period: "one-time",
    description: "Best for first-timers",
    buttonText: "Prepare a Form — $9.99",
    features: [
      { text: "One filing packet export (PDF)", included: true },
      { text: "Checklist + where to file", included: true },
      { text: "One re-download window (7 days)", included: true },
      { text: "Unlimited exports", included: false },
      { text: "Saved cases & history", included: false },
    ],
  },
  {
    name: "Justice Tools Access",
    price: "$19.99",
    period: "/month",
    description: "Best for repeat filers",
    popular: true,
    buttonText: "Start Monthly Access",
    features: [
      { text: "Unlimited exports", included: true },
      { text: "Save cases + history", included: true },
      { text: "Re-downloads anytime", included: true },
      { text: "Priority source updates", included: true },
      { text: "All 50 states", included: true },
    ],
  },
  {
    name: "Case Preparation Bundle",
    price: "$49.99",
    period: "one-time",
    description: "Best for complex cases",
    savings: "High intent",
    buttonText: "Build My Bundle",
    features: [
      { text: "Multiple forms + organized packet", included: true },
      { text: "Evidence checklist", included: true },
      { text: "Step-by-step timeline", included: true },
      { text: "Family court & small claims", included: true },
      { text: "Immigration & employment", included: true },
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
            Prepare Your Official Filing — No Lawyer Required
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free tools stay free. You pay only for exports + saved workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.savings && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.savings}
                  </span>
                </div>
              )}
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
                  onClick={() => navigate("/pricing")}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
