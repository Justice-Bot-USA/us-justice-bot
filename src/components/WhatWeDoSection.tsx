import { CheckCircle, XCircle, Lock, Flag, Scale } from "lucide-react";

const WhatWeDoSection = () => {
  const weHelp = [
    "Understanding which court handles your issue",
    "Finding and completing the right forms",
    "Organizing your evidence and documents",
    "Tracking deadlines and procedural steps",
    "Explaining legal processes in plain language"
  ];

  const weDont = [
    "Provide legal advice or opinions on your case",
    "Represent you in court or at hearings",
    "Create attorney-client relationships",
    "Guarantee any legal outcomes",
    "Replace consultation with a qualified lawyer"
  ];

  const trustItems = [
    {
      icon: Lock,
      title: "Your Data is Encrypted",
      description: "Enterprise-grade encryption protects everything you share. We never sell your data."
    },
    {
      icon: Flag,
      title: "US Data Storage",
      description: "All data stored on US servers. Privacy-compliant with strict access controls."
    },
    {
      icon: Scale,
      title: "Not Legal Advice",
      description: "Information tool only. Always consult a lawyer for legal advice on your specific situation."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Clear About What We Do</h2>
          <p className="text-xl text-muted-foreground">
            US Justice Bot is a legal information tool — not a law firm
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* What We Help With */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-4">
              <CheckCircle className="h-5 w-5" />
              What We Help With
            </h3>
            <ul className="space-y-3">
              {weHelp.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What We Don't Do */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-destructive mb-4">
              <XCircle className="h-5 w-5" />
              What We Don't Do
            </h3>
            <ul className="space-y-3">
              {weDont.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i}
                className="bg-white rounded-xl border p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
