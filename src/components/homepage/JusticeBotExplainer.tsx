import { Shield, UserCheck, HelpCircle, AlertTriangle } from "lucide-react";

const points = [
  {
    icon: Shield,
    title: "No government database access",
    text: "Justice Bot USA does not connect to, query, or access any government or law-enforcement databases.",
  },
  {
    icon: UserCheck,
    title: "User-provided information only",
    text: "All analysis is based exclusively on the details and documents you provide.",
  },
  {
    icon: HelpCircle,
    title: "Guidance, not determinations",
    text: "Justice Bot USA provides informational guidance to help you understand processes — it does not make legal conclusions.",
  },
  {
    icon: AlertTriangle,
    title: "You remain in control",
    text: "You are responsible for all submissions, filings, and actions taken based on the guidance provided.",
  },
];

const JusticeBotExplainer = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          How Justice Bot USA Works
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Am Not A Lawyer. Transparent, informational guidance — built with trust and compliance at its core.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          {points.map((p, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-xl bg-card border shadow-sm">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JusticeBotExplainer;
