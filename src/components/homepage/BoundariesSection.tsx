import { CheckCircle2, XCircle } from "lucide-react";

const does = [
  "Provide general legal information about court and agency processes",
  "Link to official court forms, with plain-language filling instructions, so you can complete them yourself",
  "Explain court procedures and general timelines in plain language",
  "Cover California and New York today; the other 48 states are coming soon",
];

const doesNot = [
  "Provide legal advice or legal representation",
  "Choose forms or a legal strategy for you",
  "Prepare, file, or serve documents for you",
  "Check warrants or access law-enforcement databases or sealed records",
  "Monitor or surveil individuals",
  "Replace a lawyer or a court",
];

const BoundariesSection = () => {
  return (
    <section id="boundaries-section" className="py-20 px-4 bg-background scroll-mt-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Clear Boundaries & Expectations
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Transparency is foundational to this platform. Here's exactly what we do — and don't do.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* DOES */}
          <div className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5">
            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              This platform DOES
            </h3>
            <ul className="space-y-3">
              {does.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* DOES NOT */}
          <div className="p-6 rounded-xl border-2 border-destructive/30 bg-destructive/5">
            <h3 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
              <XCircle className="h-6 w-6" />
              This platform DOES NOT
            </h3>
            <ul className="space-y-3">
              {doesNot.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoundariesSection;
