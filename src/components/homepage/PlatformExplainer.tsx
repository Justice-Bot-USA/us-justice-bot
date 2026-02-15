import { BookOpen, FileSearch, Building2, FileText, Compass, Users } from "lucide-react";

const PlatformExplainer = () => {
  const items = [
    { icon: BookOpen, text: "Understand legal and administrative processes in the U.S." },
    { icon: FileSearch, text: "Learn what records, documents, or filings may exist" },
    { icon: Building2, text: "Identify which agency or court handles a matter" },
    { icon: FileText, text: "Generate lawful, user-initiated documents and requests" },
    { icon: Compass, text: "Prepare for next steps without guesswork" },
    { icon: Users, text: "Navigate systems as a self-represented individual" },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Veritas Path Helps You Do
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Clear guidance through complex systems — in plain language, at your own pace.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-xl bg-card border shadow-sm"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm md:text-base text-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformExplainer;
