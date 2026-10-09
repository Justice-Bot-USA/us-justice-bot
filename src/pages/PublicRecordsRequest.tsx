import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, Shield, Clock, CheckCircle2 } from "lucide-react";
import FOIARequestGenerator from "@/components/FOIARequestGenerator";

const PublicRecordsRequest = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [modalOpen, setModalOpen] = useState(false);

  const benefits = [
    { icon: FileSearch, title: "50-State Coverage", desc: "Statutory citations for all 50 states and DC" },
    { icon: Shield, title: "Legally Safe Language", desc: "We never claim to access government databases" },
    { icon: Clock, title: "Ready in Minutes", desc: "Generate a properly worded letter instantly" },
    { icon: CheckCircle2, title: "FOIA.gov Integration", desc: "Real agency contacts pulled from FOIA.gov API" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Public Records Request Generator | Justice Bot USA"
        description="Generate a properly worded FOIA or state public-records request letter with correct statutory citations. Free preview. All 50 states. Powered by Justice Bot USA."
        keywords="FOIA request generator, public records request, freedom of information, court records request, arrest records, police records"
        url="https://justicebot-usa.com/foia-request-generator"
      />

      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <FileSearch className="w-4 h-4" />
              Public Records Request Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Request Official Records — the Right Way
            </h1>
            <p className="text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-8">
              Generate a properly worded FOIA or state public-records request letter with correct statutory citations, 
              for any agency in all 50 states. Free preview. PDF export available.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-base"
              onClick={() => setModalOpen(true)}
            >
              <FileSearch className="w-5 h-5 mr-2" />
              Generate My Request Letter
            </Button>
            <p className="text-sm text-primary-foreground/60 mt-4">
              Free to generate · No login required for preview · PDF export included in the $25/month plan
            </p>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6 pb-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Record Types */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8">Supported Record Types</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Arrest Report", desc: "Request the official arrest report for yourself or an authorized subject" },
                { title: "Warrant Return", desc: "Obtain the warrant return document showing service execution" },
                { title: "Probable Cause Affidavit", desc: "Request a PC affidavit if the case has been unsealed" },
                { title: "Booking / Jail Intake Record", desc: "Request jail intake and booking records" },
                { title: "Court Administrative Record", desc: "Request court docket entries and administrative case records" },
                { title: "Incident Report", desc: "Request the incident report from law enforcement" },
              ].map((r, i) => (
                <div key={i} className="flex gap-3 p-4 bg-background rounded-lg border">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-8 container mx-auto px-4 max-w-3xl">
          <div className="border rounded-lg p-5 bg-muted/30 text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Important Legal Disclaimer</p>
            <p>This tool generates informational public records request letters only. Justice Bot USA does not provide legal advice, 
              does not access law enforcement databases, and does not determine whether active warrants exist.</p>
            <p>Users submit all requests themselves, directly to the agency. Statutory citations are provided for informational 
              purposes and may vary by jurisdiction. Consult an attorney for legal advice specific to your situation.</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Request Your Records?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Generate a professionally worded, properly cited public records request letter in minutes.
            </p>
            <Button size="lg" variant="secondary" onClick={() => setModalOpen(true)}>
              <FileSearch className="w-5 h-5 mr-2" />
              Start My Request — Free
            </Button>
          </div>
        </section>
      </main>

      <FOIARequestGenerator
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <Footer />
    </div>
  );
};

export default PublicRecordsRequest;
