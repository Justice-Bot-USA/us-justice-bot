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
    { state: "Alabama", url: "https://www.alabar.org/" },
    { state: "Alaska", url: "https://alaskabar.org/" },
    { state: "Arizona", url: "https://www.azbar.org/" },
    { state: "Arkansas", url: "https://www.arkbar.com/" },
    { state: "California", url: "https://www.calbar.ca.gov/" },
    { state: "Colorado", url: "https://www.cobar.org/" },
    { state: "Connecticut", url: "https://www.ctbar.org/" },
    { state: "Delaware", url: "https://www.dsba.org/" },
    { state: "Florida", url: "https://www.floridabar.org/" },
    { state: "Georgia", url: "https://www.gabar.org/" },
    { state: "Hawaii", url: "https://hsba.org/" },
    { state: "Idaho", url: "https://isb.idaho.gov/" },
    { state: "Illinois", url: "https://www.isba.org/" },
    { state: "Indiana", url: "https://www.inbar.org/" },
    { state: "Iowa", url: "https://www.iowabar.org/" },
    { state: "Kansas", url: "https://www.ksbar.org/" },
    { state: "Kentucky", url: "https://www.kybar.org/" },
    { state: "Louisiana", url: "https://www.lsba.org/" },
    { state: "Maine", url: "https://www.mainebar.org/" },
    { state: "Maryland", url: "https://www.msba.org/" },
    { state: "Massachusetts", url: "https://www.massbar.org/" },
    { state: "Michigan", url: "https://www.michbar.org/" },
    { state: "Minnesota", url: "https://www.mnbar.org/" },
    { state: "Mississippi", url: "https://www.msbar.org/" },
    { state: "Missouri", url: "https://www.mobar.org/" },
    { state: "Montana", url: "https://www.montanabar.org/" },
    { state: "Nebraska", url: "https://www.nebar.com/" },
    { state: "Nevada", url: "https://www.nvbar.org/" },
    { state: "New Hampshire", url: "https://www.nhbar.org/" },
    { state: "New Jersey", url: "https://www.njsba.com/" },
    { state: "New Mexico", url: "https://www.nmbar.org/" },
    { state: "New York", url: "https://www.nysba.org/" },
    { state: "North Carolina", url: "https://www.ncbar.org/" },
    { state: "North Dakota", url: "https://www.sband.org/" },
    { state: "Ohio", url: "https://www.ohiobar.org/" },
    { state: "Oklahoma", url: "https://www.okbar.org/" },
    { state: "Oregon", url: "https://www.osbar.org/" },
    { state: "Pennsylvania", url: "https://www.pabar.org/" },
    { state: "Rhode Island", url: "https://www.ribar.com/" },
    { state: "South Carolina", url: "https://www.scbar.org/" },
    { state: "South Dakota", url: "https://www.sdbar.org/" },
    { state: "Tennessee", url: "https://www.tba.org/" },
    { state: "Texas", url: "https://www.texasbar.com/" },
    { state: "Utah", url: "https://www.utahbar.org/" },
    { state: "Vermont", url: "https://www.vtbar.org/" },
    { state: "Virginia", url: "https://www.vsb.org/" },
    { state: "Washington", url: "https://www.wsba.org/" },
    { state: "West Virginia", url: "https://www.wvbar.org/" },
    { state: "Wisconsin", url: "https://www.wisbar.org/" },
    { state: "Wyoming", url: "https://www.wyomingbar.org/" }
  ];

  return (
    <>
      <Helmet>
        <title>Legal Disclaimer | Justice Bot USA - Important Legal Notices</title>
        <meta name="description" content="Important legal disclaimers for Justice Bot USA. Understand the limitations of AI-powered legal information services." />
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
                <strong>Justice Bot USA is NOT a law firm and does NOT provide legal advice.</strong>
              </p>
              <p>
                Our platform provides general legal information and tools for filling official forms with your own answers only. The information provided is for educational and informational purposes and should not be construed as legal advice.
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
                  <li>✓ Official court forms you fill in with your own answers</li>
                  <li>✓ Educational resources about legal processes</li>
                  <li>✓ Court and filing procedure information</li>
                  <li>✓ Links to official government resources</li>
                  <li>✓ AI-generated plain-language summaries (informational only)</li>
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
                  <li>✗ Choosing forms or legal strategy for you</li>
                  <li>✗ Preparing documents on your behalf</li>
                  <li>✗ Filing or serving papers for you</li>
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
                  While we strive to provide accurate and up-to-date information, laws change frequently and vary by jurisdiction. We cannot guarantee that all information is current, complete, or accurate for your specific situation. Our content has not yet been reviewed by a licensed attorney. Always verify information with official sources and consult with a licensed attorney before taking legal action.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">AI Limitations</h3>
                <p className="text-muted-foreground">
                  Our AI systems are designed to provide helpful information, but they have limitations. AI cannot fully understand the nuances of your specific legal situation, local court practices, or judge preferences. AI-generated content may contain errors or omissions. Always review all information and documents carefully before use.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Filling Official Forms</h3>
                <p className="text-muted-foreground">
                  When you fill in an official form on our platform, we place your own answers in the boxes of the form published by the court or agency. We do not choose forms for you, decide what you should say, or check that a form is complete, accurate, or right for your situation. You are responsible for reviewing every form before you sign and file it and for making sure it meets your court's requirements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">No Guarantee of Outcomes</h3>
                <p className="text-muted-foreground">
                  We do not and cannot guarantee any particular outcome in your legal matter. Legal outcomes depend on many factors including the specific facts of your case, applicable laws, court procedures, and judicial discretion. Any general information we provide is for informational purposes only.
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
                  Our service currently provides information for California and New York, plus links to official federal court forms. Other states are coming soon. However, laws and procedures vary significantly by jurisdiction. Information that is accurate for one state may not apply to another. Always verify that information is applicable to your specific jurisdiction.
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
            There are situations where professional legal representation is strongly recommended:
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
              Your state bar association can help you find a licensed attorney in your area. Many offer or can point you to lawyer referral services:
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
              By using Justice Bot USA, you acknowledge that you have read and understood this disclaimer, and you agree that our service provides legal information only and does not constitute legal advice. You understand that you should consult with a licensed attorney for advice specific to your situation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LegalDisclaimer;
