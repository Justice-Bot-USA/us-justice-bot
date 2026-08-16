import { useState } from "react";
import LegalHelpLayout from "@/components/legal-help/LegalHelpLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink } from "lucide-react";

const TRIBES = [
  "Cherokee Nation", "Navajo Nation", "Choctaw Nation of Oklahoma", "United Keetoowah Band of Cherokee Indians",
  "Muscogee (Creek) Nation", "Chickasaw Nation", "Lac Courte Oreilles Band of Lake Superior Chippewa",
  "Seminole Tribe of Florida", "Osage Nation", "Standing Rock Sioux Tribe", "Oglala Sioux Tribe",
  "Rosebud Sioux Tribe", "Blackfeet Tribe", "Crow Tribe", "Eastern Band of Cherokee Indians",
  "Poarch Band of Creek Indians", "Mohegan Tribe", "Mashpee Wampanoag Tribe", "Other",
];

const TribalStatusForm = () => {
  const [identity, setIdentity] = useState("");
  const [enrolled, setEnrolled] = useState("");
  const [tribe, setTribe] = useState("");
  const [reservationConnection, setReservationConnection] = useState("");
  const [showResources, setShowResources] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (enrolled === "yes" || identity === "yes") {
      setShowResources(true);
    }
  };

  return (
    <section className="mb-10">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-primary" />
            Native American / Tribal Status (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Some legal issues involving Native American tribal members may fall under tribal jurisdiction or involve tribal services. These questions are optional and help show relevant guidance and resources.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>Do you identify as Native American / American Indian / Alaska Native?</Label>
            <Select value={identity} onValueChange={setIdentity}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                <SelectItem value="not-sure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Are you an enrolled member of a federally recognized tribe?</Label>
            <Select value={enrolled} onValueChange={setEnrolled}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="not-sure">Not sure</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {enrolled === "yes" && (
            <div>
              <Label>Which tribe? (Optional)</Label>
              <Select value={tribe} onValueChange={setTribe}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select tribe..." /></SelectTrigger>
                <SelectContent>
                  {TRIBES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Is your legal issue connected to tribal land or a reservation?</Label>
            <Select value={reservationConnection} onValueChange={setReservationConnection}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="not-sure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Show Relevant Resources
          </Button>

          {submitted && showResources && (
            <div className="mt-4 space-y-3">
              <Badge variant="secondary" className="mb-2">Tribal Resources Available</Badge>
              <p className="text-sm text-muted-foreground">
                Based on your responses, the following resources may be relevant to your situation. Tribal membership may affect jurisdiction or access to certain programs depending on the circumstances.
              </p>
              <div className="grid gap-2">
                {[
                  { label: "Bureau of Indian Affairs (BIA)", url: "https://www.bia.gov/" },
                  { label: "Tribal Court Clearinghouse", url: "https://www.tribal-institute.org/" },
                  { label: "National Indian Law Library", url: "https://nill.softlinkliberty.net/" },
                  { label: "Indian Child Welfare Act (ICWA) Info", url: "https://www.nicwa.org/about-icwa/" },
                  { label: "Native American Rights Fund", url: "https://www.narf.org/" },
                ].map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg border hover:bg-accent/50 transition-colors text-sm">
                    <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {submitted && !showResources && (
            <p className="text-sm text-muted-foreground mt-3">
              Based on your responses, standard legal guidance will apply. You can still explore our tribal rights information pages for educational content.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

const NativeAmericanRights = () => (
  <LegalHelpLayout
    title="Native American Rights & Tribal Jurisdiction in the United States"
    metaTitle="Native American Rights & Tribal Jurisdiction Guide | Justice Bot USA"
    metaDescription="Understand Native American legal rights, tribal courts, tribal jurisdiction, and how tribal membership may affect your legal matter. Respectful, accurate information."
    keywords="native american rights, tribal jurisdiction, tribal court, federally recognized tribe, indian child welfare act, ICWA, tribal law, tribal sovereignty, native american legal rights"
    canonicalPath="/legal-help/native-american-rights"
    breadcrumbLabel="Native American Rights"
    quickAnswer="Tribal membership may affect which court system has jurisdiction over your legal matter. Federally recognized tribes operate their own court systems with authority over certain civil and criminal matters on tribal land. Understanding whether tribal, federal, or state jurisdiction applies is an important first step."
    steps={[
      { title: "Understand Tribal Sovereignty", description: "Federally recognized tribes are sovereign nations with the right to self-governance, including operating their own court systems, police forces, and social services. There are currently 574 federally recognized tribes in the United States." },
      { title: "Determine If Tribal Jurisdiction Applies", description: "Tribal jurisdiction typically applies when: the parties are tribal members, the incident occurred on tribal land or a reservation, or the matter involves tribal law. Some cases involve overlapping federal and tribal jurisdiction." },
      { title: "Know the Role of Tribal Courts", description: "Tribal courts handle many civil disputes, family law matters, and some criminal cases on tribal land. They follow tribal codes and traditions, which may differ significantly from state court procedures." },
      { title: "Understand Federal vs. State Jurisdiction", description: "Major crimes on tribal land may fall under federal jurisdiction (Major Crimes Act). State courts generally do not have jurisdiction on tribal land unless authorized by federal law (e.g., Public Law 280 states)." },
      { title: "Learn About ICWA (Indian Child Welfare Act)", description: "ICWA provides special protections in child custody cases involving Native American children. It requires notice to the tribe, placement preferences with Native families, and active efforts to prevent removal." },
      { title: "Access Tribal Services and Support", description: "Many tribes offer legal aid, housing assistance, health services, education programs, and other support. Contact your tribal government or the Bureau of Indian Affairs for available resources." },
    ]}
    evidenceItems={[
      "Tribal membership card or enrollment documentation",
      "Certificate of Degree of Indian Blood (CDIB)",
      "Documentation of the location of the legal issue (on/off reservation)",
      "Tribal court orders or documents (if applicable)",
      "Family records relevant to ICWA cases",
      "Bureau of Indian Affairs correspondence",
    ]}
    commonMistakes={[
      "Assuming state courts have jurisdiction over matters on tribal land",
      "Not checking if your tribe has its own court system",
      "Failing to assert ICWA protections in child welfare cases involving Native children",
      "Not contacting your tribal government for available legal resources",
      "Confusing state-recognized tribes with federally recognized tribes (jurisdictional differences apply)",
    ]}
    ctas={[
      { label: "Check Tribal Jurisdiction for Your Case", href: "/case-analysis" },
      { label: "Explore Legal Tools", href: "/ai-tools" },
      { label: "Find Court Resources", href: "/court-records" },
    ]}
    relatedPages={[
      { label: "Tribal Court Explained", href: "/legal-help/tribal-court" },
      { label: "Tribal Jurisdiction Guide", href: "/legal-help/tribal-jurisdiction" },
      { label: "Family Law Resources", href: "/legal-areas/family-law" },
      { label: "Civil Rights Resources", href: "/legal-areas/civil-rights" },
    ]}
    faqItems={[
      { question: "How do I know if I'm eligible for tribal membership?", answer: "Each tribe sets its own membership criteria, which often include ancestry, blood quantum, or descent from a historical roll. Contact the specific tribe's enrollment office for their requirements." },
      { question: "Does tribal jurisdiction apply if I live off-reservation?", answer: "Tribal jurisdiction is generally tied to the location of the incident (on tribal land) and the parties' tribal membership status. Some tribal services are available to members regardless of where they live." },
      { question: "What is the Indian Child Welfare Act (ICWA)?", answer: "ICWA is a federal law that establishes standards for child custody proceedings involving Native American children. It prioritizes keeping Native children with their families and tribes and requires tribal notification in relevant cases." },
    ]}
  >
    <TribalStatusForm />
  </LegalHelpLayout>
);

export default NativeAmericanRights;
