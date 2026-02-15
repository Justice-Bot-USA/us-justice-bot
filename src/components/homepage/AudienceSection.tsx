import { UserCheck, XCircle } from "lucide-react";

const designedFor = [
  "Self-represented individuals",
  "Families seeking clarity on legal matters",
  "Journalists and advocates",
  "People navigating public systems for the first time",
];

const notFor = [
  "Surveillance or background monitoring",
  "Law-enforcement purposes",
  "Evasion of legal processes",
];

const AudienceSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Who This Platform Is For
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Built for people who need clarity — not shortcuts.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
              <UserCheck className="h-5 w-5 text-primary" />
              Designed for
            </h3>
            <ul className="space-y-3">
              {designedFor.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
              <XCircle className="h-5 w-5 text-destructive" />
              Not designed for
            </h3>
            <ul className="space-y-3">
              {notFor.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
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

export default AudienceSection;
