import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Per Form",
    price: "$4.99",
    period: "per form",
    description: "Pay only for what you need",
    features: [
      { text: "Single form access", included: true },
      { text: "State-specific guidance", included: true },
      { text: "Download & print", included: true },
      { text: "AI case analysis", included: false },
      { text: "Unlimited forms", included: false },
    ],
  },
  {
    name: "Monthly",
    price: "$9.99",
    period: "/month",
    description: "Best for active cases",
    popular: true,
    features: [
      { text: "Unlimited forms", included: true },
      { text: "AI case analysis", included: true },
      { text: "Legal journey wizard", included: true },
      { text: "Priority support", included: true },
      { text: "All 50 states", included: true },
    ],
  },
  {
    name: "Annual",
    price: "$79",
    period: "/year",
    description: "Save over 30%",
    savings: "Save $40.88",
    features: [
      { text: "Everything in Monthly", included: true },
      { text: "12 months access", included: true },
      { text: "Locked-in price", included: true },
      { text: "Best value", included: true },
      { text: "Cancel anytime", included: true },
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            90% cheaper than hiring a lawyer. Choose the plan that works for you.
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
                  <span className="text-muted-foreground">{plan.period}</span>
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
                  Get Started
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
