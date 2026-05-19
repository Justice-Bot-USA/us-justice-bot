import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Scale, Phone, BookOpen, Users, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LegalDisclaimer = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const stateBarAssociations = [
    { state: "Alabama", url: "https://www.alabar.org/", phone: "(334) 269-1515" },
    { state: "Alaska", url: "https://alaskabar.org/", phone: "(907) 272-7469" },
    { state: "Arizona", url: "https://www.azbar.org/", phone: "(602) 252-4804" },
    { state: "Arkansas", url: "https://www.arkbar.com/", phone: "(501) 375-4606" },
    { state: "California", url: "https://www.calbar.ca.gov/", phone: "(888) 875-2227" },
    { state: "Colorado", url: "https://www.cobar.org/", phone: "(303) 860-1115" },
    { state: "Connecticut", url: "https://www.ctbar.org/", phone: "(860) 223-4400" },
    { state: "Delaware", url: "https://www.dsba.org/", phone: "(302) 658-5279" },
    { state: "Florida", url: "https://www.floridabar.org/", phone: "(850) 561-5600" },
    { state: "Georgia", url: "https://www.gabar.org/", phone: "(404) 527-8700" },
    { state: "Hawaii", url: "https://hsba.org/", phone: "(808) 537-1868" },
    { state: "Idaho", url: "https://isb.idaho.gov/", phone: "(208) 334-4500" },
    { state: "Illinois", url: "https://www.isba.org/", phone: "(217) 525-1760" },
    { state: "Indiana", url: "https://www.inbar.org/", phone: "(317) 639-5465" },
    { state: "Iowa", url: "https://www.iowabar.org/", phone: "(515) 243-3179" },
    { state: "Kansas", url: "https://www.ksbar.org/", phone: "(785) 234-5696" },
    { state: "Kentucky", url: "https://www.kybar.org/", phone: "(502) 564-3795" },
    { state: "Louisiana", url: "https://www.lsba.org/", phone: "(504) 566-1600" },
    { state: "Maine", url: "https://www.mainebar.org/", phone: "(207) 622-7523" },
    { state: "Maryland", url: "https://www.msba.org/", phone: "(410) 685-7878" },
    { state: "Massachusetts", url: "https://www.massbar.org/", phone: "(617) 338-0500" },
    { state: "Michigan", url: "https://www.michbar.org/", phone: "(517) 346-6300" },
    { state: "Minnesota", url: "https://www.mnbar.org/", phone: "(612) 333-1183" },
    { state: "Mississippi", url: "https://www.msbar.org/", phone: "(601) 948-4471" },
    { state: "Missouri", url: "https://www.mobar.org/", phone: "(573) 635-4128" },
    { state: "Montana", url: "https://www.montanabar.org/", phone: "(406) 442-7660" },
    { state: "Nebraska", url: "https://www.nebar.com/", phone: "(402) 475-7091" },
    { state: "Nevada", url: "https://www.nvbar.org/", phone: "(702) 382-2200" },
    { state: "New Hampshire", url: "https://www.nhbar.org/", phone: "(603) 224-6942" },
    { state: "New Jersey", url: "https://www.njsba.com/", phone: "(732) 249-5000" },
    { state: "New Mexico", url: "https://www.nmbar.org/", phone: "(505) 797-6000" },
    { state: "New York", url: "https://www.nysba.org/", phone: "(518) 463-3200" },
    { state: "North Carolina", url: "https://www.ncbar.org/", phone: "(919) 677-0561" },
    { state: "North Dakota", url: "https://www.sband.org/", phone: "(701) 255-1404" },
    { state: "Ohio", url: "https://www.ohiobar.org/", phone: "(614) 487-2050" },
    { state: "Oklahoma", url: "https://www.okbar.org/", phone: "(405) 416-7000" },
    { state: "Oregon", url: "https://www.osbar.org/", phone: "(503) 620-0222" },
    { state: "Pennsylvania", url: "https://www.pabar.org/", phone: "(717) 238-6715" },
    { state: "Rhode Island", url: "https://www.ribar.com/", phone: "(401) 421-5740" },
    { state: "South Carolina", url: "https://www.scbar.org/", phone: "(803) 799-6653" },
    { state: "South Dakota", url: "https://www.sdbar.org/", phone: "(605) 224-7554" },
    { state: "Tennessee", url: "https://www.tba.org/", phone: "(615) 383-7421" },
    { state: "Texas", url: "https://www.texasbar.com/", phone: "(512) 427-1463" },
    { state: "Utah", url: "https://www.utahbar.org/", phone: "(801) 531-9077" },
    { state: "Vermont", url: "https://www.vtbar.org/", phone: "(802) 223-2020" },
    { state: "Virginia", url: "https://www.vsb.org/", phone: "(804) 775-0500" },
    { state: "Washington", url: "https://www.wsba.org/", phone: "(206) 443-9722" },
    { state: "West Virginia", url: "https://www.wvbar.org/", phone: "(304) 558-2456" },
    { state: "Wisconsin", url: "https://www.wisbar.org/", phone: "(608) 257-3838" },
    { state: "Wyoming", url: "https://www.wyomingbar.org/", phone: "(307) 632-9061" }
  ];

  return (
    <>
      <Helmet>
        <title>Legal Disclaimer | A.I. ANAL - Important Legal Notices</title>
        <meta name="description" content="Important legal disclaimers for A.I. ANAL. Understand the limitations of AI-powered legal information services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://justicebot-usa.com/disclaimer" />
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-destructive text-destructive-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <AlertTriangle className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Legal Disclaimer</h1>
            </div>
            <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
              Important information about the limitations of our service and your rights.
            </p>
          </div>
        </section>

        {/* Primary Disclaimer */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <Alert variant="destructive" className="border-2 mb-8">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold">NOT A LAW FIRM - NO LEGAL ADVICE PROVIDED</AlertTitle>
            <AlertDescription className="mt-4 space-y-4 text-base">
              <p>
                <strong>A.I. ANAL is NOT a law firm and does NOT provide legal advice.</strong>
              </p>
              <p>
                Our platform provides general legal information and document preparation assistance only. The information provided is for educational and informational purposes and should not be construed as legal advice.
              </p>
              <p>
                <strong>Using this service does NOT create an attorney-client relationship.</strong> Communications with our AI system are NOT protected by attorney-client privilege.
              </p>
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  What We Provide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ General legal information</li>
                  <li>✓ Document templates and form assistance</li>
                  <li>✓ Educational resources about legal processes</li>
                  <li>✓ Court and filing procedure information</li>
                  <li>✓ Links to official government resources</li>
                  <li>✓ AI-powered case guidance (informational only)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  What We Do NOT Provide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✗ Legal advice or legal opinions</li>
                  <li>✗ Court representation</li>
                  <li>✗ Attorney-client privilege</li>
                  <li>✗ Guaranteed legal outcomes</li>
                  <li>✗ Specific legal strategy recommendations</li>
                  <li>✗ Confirmation that documents are complete or correct</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Disclaimers */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              Important Legal Notices
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Accuracy of Information</h3>
                <p className="text-muted-foreground">
                  While we strive to provide accurate and up-to-date information, laws change frequently and vary by jurisdiction. We cannot guarantee that all information is current, complete, or accurate for your specific situation. Always verify information with official sources and consult with a licensed attorney before taking legal action.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">AI Limitations</h3>
                <p className="text-muted-foreground">
                  Our AI systems are designed to provide helpful information, but they have limitations. AI cannot fully understand the nuances of your specific legal situation, local court practices, or judge preferences. AI-generated content may contain errors or omissions. Always review all information and documents carefully before use.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Document Preparation</h3>
                <p className="text-muted-foreground">
                  Documents prepared using our platform are based on standard templates and the information you provide. We cannot guarantee that documents are complete, accurate, or suitable for your specific needs. You are responsible for reviewing all documents before filing and ensuring they meet your local court's requirements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">No Guarantee of Outcomes</h3>
                <p className="text-muted-foreground">
                  We do not and cannot guarantee any particular outcome in your legal matter. Legal outcomes depend on many factors including the specific facts of your case, applicable laws, court procedures, and judicial discretion. Any estimates or assessments provided are for informational purposes only.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Emergency Situations</h3>
                <p className="text-muted-foreground">
                  <strong>In emergencies, call 911.</strong> If you are in immediate danger, contact local law enforcement. Our service is not designed for emergency situations and cannot provide immediate assistance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Jurisdiction</h3>
                <p className="text-muted-foreground">
                  Our service provides information for all 50 US states, the District of Columbia, and federal courts. However, laws and procedures vary significantly by jurisdiction. Information that is accurate for one state may not apply to another. Always verify that information is applicable to your specific jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* When to Seek an Attorney */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            When You Should Consult an Attorney
          </h2>
          <p className="text-muted-foreground mb-6">
            While our service can help with many legal matters, there are situations where professional legal representation is strongly recommended:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Criminal charges or investigations",
              "Complex business transactions",
              "Cases involving significant assets",
              "Child custody disputes",
              "Personal injury claims",
              "Immigration matters",
              "Tax disputes with the IRS",
              "Bankruptcy filings",
              "Real estate transactions",
              "Employment discrimination claims",
              "Medical malpractice cases",
              "When the opposing party has an attorney"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* State Bar Associations */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Phone className="h-6 w-6 text-primary" />
              Find a Lawyer - State Bar Associations
            </h2>
            <p className="text-muted-foreground mb-8">
              Your state bar association can help you find a licensed attorney in your area. Most offer lawyer referral services:
            </p>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stateBarAssociations.map((bar) => (
                <a
                  key={bar.state}
                  href={bar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors group"
                >
                  <p className="font-medium group-hover:text-primary transition-colors">{bar.state}</p>
                  <p className="text-xs text-muted-foreground">{bar.phone}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Final Notice */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4 text-center">Acknowledgment</h2>
            <p className="text-muted-foreground text-center">
              By using A.I. ANAL, you acknowledge that you have read and understood this disclaimer, and you agree that our service provides legal information only and does not constitute legal advice. You understand that you should consult with a licensed attorney for advice specific to your situation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LegalDisclaimer;
