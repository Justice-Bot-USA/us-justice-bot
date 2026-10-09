import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, AlertTriangle, Scale, CheckCircle, XCircle, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TermsOfService = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const lastUpdated = "October 9, 2026";
  const effectiveDate = "January 4, 2026";

  const stateJurisdictions = [
    { state: "Alabama", court: "Courts of Alabama, Jefferson County" },
    { state: "Alaska", court: "Courts of Alaska, Anchorage" },
    { state: "Arizona", court: "Courts of Arizona, Maricopa County" },
    { state: "Arkansas", court: "Courts of Arkansas, Pulaski County" },
    { state: "California", court: "Courts of California, Los Angeles County" },
    { state: "Colorado", court: "Courts of Colorado, Denver County" },
    { state: "Connecticut", court: "Courts of Connecticut, Hartford" },
    { state: "Delaware", court: "Courts of Delaware, New Castle County" },
    { state: "Florida", court: "Courts of Florida, Miami-Dade County" },
    { state: "Georgia", court: "Courts of Georgia, Fulton County" },
    { state: "Hawaii", court: "Courts of Hawaii, Honolulu" },
    { state: "Idaho", court: "Courts of Idaho, Ada County" },
    { state: "Illinois", court: "Courts of Illinois, Cook County" },
    { state: "Indiana", court: "Courts of Indiana, Marion County" },
    { state: "Iowa", court: "Courts of Iowa, Polk County" },
    { state: "Kansas", court: "Courts of Kansas, Shawnee County" },
    { state: "Kentucky", court: "Courts of Kentucky, Jefferson County" },
    { state: "Louisiana", court: "Courts of Louisiana, Orleans Parish" },
    { state: "Maine", court: "Courts of Maine, Cumberland County" },
    { state: "Maryland", court: "Courts of Maryland, Baltimore City" },
    { state: "Massachusetts", court: "Courts of Massachusetts, Suffolk County" },
    { state: "Michigan", court: "Courts of Michigan, Wayne County" },
    { state: "Minnesota", court: "Courts of Minnesota, Hennepin County" },
    { state: "Mississippi", court: "Courts of Mississippi, Hinds County" },
    { state: "Missouri", court: "Courts of Missouri, St. Louis County" },
    { state: "Montana", court: "Courts of Montana, Lewis and Clark County" },
    { state: "Nebraska", court: "Courts of Nebraska, Lancaster County" },
    { state: "Nevada", court: "Courts of Nevada, Clark County" },
    { state: "New Hampshire", court: "Courts of New Hampshire, Hillsborough County" },
    { state: "New Jersey", court: "Courts of New Jersey, Essex County" },
    { state: "New Mexico", court: "Courts of New Mexico, Bernalillo County" },
    { state: "New York", court: "Courts of New York, New York County" },
    { state: "North Carolina", court: "Courts of North Carolina, Wake County" },
    { state: "North Dakota", court: "Courts of North Dakota, Burleigh County" },
    { state: "Ohio", court: "Courts of Ohio, Franklin County" },
    { state: "Oklahoma", court: "Courts of Oklahoma, Oklahoma County" },
    { state: "Oregon", court: "Courts of Oregon, Multnomah County" },
    { state: "Pennsylvania", court: "Courts of Pennsylvania, Philadelphia County" },
    { state: "Rhode Island", court: "Courts of Rhode Island, Providence County" },
    { state: "South Carolina", court: "Courts of South Carolina, Richland County" },
    { state: "South Dakota", court: "Courts of South Dakota, Minnehaha County" },
    { state: "Tennessee", court: "Courts of Tennessee, Davidson County" },
    { state: "Texas", court: "Courts of Texas, Harris County" },
    { state: "Utah", court: "Courts of Utah, Salt Lake County" },
    { state: "Vermont", court: "Courts of Vermont, Chittenden County" },
    { state: "Virginia", court: "Courts of Virginia, Fairfax County" },
    { state: "Washington", court: "Courts of Washington, King County" },
    { state: "West Virginia", court: "Courts of West Virginia, Kanawha County" },
    { state: "Wisconsin", court: "Courts of Wisconsin, Dane County" },
    { state: "Wyoming", court: "Courts of Wyoming, Laramie County" },
    { state: "District of Columbia", court: "Superior Court of the District of Columbia" }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service | Justice Bot USA - Legal AI Assistant</title>
        <meta name="description" content="Terms of Service for Justice Bot USA. Understand your rights and responsibilities when using our AI-powered legal assistance platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://justicebot-usa.com/terms" />
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <FileText className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
              Please read these terms carefully before using Justice Bot USA services.
            </p>
            <p className="text-center text-sm opacity-70 mt-4">
              Last Updated: {lastUpdated} | Effective Date: {effectiveDate}
            </p>
          </div>
        </section>

        {/* Critical Notice */}
        <section className="py-8 container mx-auto px-4 max-w-4xl">
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">IMPORTANT LEGAL DISCLAIMER</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                <strong>JUSTICE BOT USA IS NOT A LAW FIRM.</strong> We provide legal information and tools for filling official forms with your own answers, NOT legal advice. We do not choose forms or strategy for you, prepare documents on your behalf, or file or serve anything. Our content has not yet been reviewed by a licensed attorney.
              </p>
              <p>
                Our AI-powered services cannot and do not create an attorney-client relationship. Information provided through our platform should not be relied upon as a substitute for consultation with a licensed attorney in your jurisdiction.
              </p>
              <p>
                <strong>In emergencies, call 911. For immediate legal assistance, contact your state bar association's lawyer referral service.</strong>
              </p>
            </AlertDescription>
          </Alert>
        </section>

        {/* Quick Summary Cards */}
        <section className="py-8 container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Key Points</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="text-base">What We Provide</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Legal information</li>
                  <li>• Form-filling tools</li>
                  <li>• General guidance</li>
                  <li>• Court information</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <XCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-base">What We Don't Provide</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Legal advice</li>
                  <li>• Court representation</li>
                  <li>• Attorney-client privilege</li>
                  <li>• Guaranteed outcomes</li>
                  <li>• Filing or serving papers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Scale className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">Your Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide accurate information</li>
                  <li>• Verify all documents</li>
                  <li>• Meet court deadlines</li>
                  <li>• Seek attorney when needed</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Gavel className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• California (live)</li>
                  <li>• New York (live)</li>
                  <li>• Other 48 states: coming soon</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Terms Content */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              Justice Bot USA (the "Service" or "Platform") is operated by Justice Bot Technologies Inc. ("Justice Bot," "we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms constitute a legally binding agreement between you and Justice Bot Technologies Inc.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Justice Bot USA is an AI-powered legal information platform that provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>General legal information and educational resources</li>
              <li>Official court and agency forms you fill in with your own answers, with plain-language filling instructions</li>
              <li>Court and filing information for California and New York; other states coming soon</li>
              <li>AI-generated plain-language summaries and general guidance (informational only)</li>
              <li>Links and references to official court resources</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">3. No Attorney-Client Relationship</h2>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p className="text-muted-foreground font-medium">
                YOUR USE OF THIS SERVICE DOES NOT CREATE AN ATTORNEY-CLIENT RELATIONSHIP. We are not a law firm, we do not practice law, and we do not provide legal advice. Our AI systems provide general legal information based on publicly available laws and court procedures.
              </p>
            </div>
            <p className="text-muted-foreground">
              Any information provided through our Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Is for informational purposes only</li>
              <li>Does not constitute legal advice</li>
              <li>Should not be relied upon without verification by a licensed attorney</li>
              <li>May not reflect the most current legal developments</li>
              <li>May not account for specific facts of your situation</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">4. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 18 years old to use our Service. By using our Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">5. User Accounts</h2>
            <p className="text-muted-foreground">
              To access certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Promptly updating any changes to your information</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">6. Prohibited Uses</h2>
            <p className="text-muted-foreground">You agree NOT to use our Service to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide legal advice to others or represent yourself as an attorney</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to scrape or collect data</li>
              <li>Harass, threaten, or harm other users</li>
              <li>Use the Service for any illegal purpose</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">7. Payments and Refunds</h2>
            <p className="text-muted-foreground">
              Certain features of our Service require payment. By purchasing a subscription or service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You authorize us to charge your payment method</li>
              <li>Prices are subject to change with notice</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Refunds are available within 30 days of purchase if you are not satisfied</li>
              <li>Refund requests should be submitted to billing@justicebot-usa.com</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on our Platform, including text, graphics, logos, software, and AI-generated content, is the property of Justice Bot Technologies Inc. or its licensors. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p className="text-muted-foreground mt-4">
              "Justice Bot", "Justice Bot USA", "Quorex", and "Quorex Solutions", and the related names and logos, are trademarks of Justice Bot Technologies Inc. You may not use them without our prior written permission.
            </p>
            <p className="text-muted-foreground mt-4">
              Filled forms you download from our Service are yours to use. The official forms themselves are published by courts and government agencies; our software and our original content remain our intellectual property.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">9. Disclaimer of Warranties</h2>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p className="text-muted-foreground uppercase font-medium">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY INFORMATION PROVIDED.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, JUSTICE BOT TECHNOLOGIES INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR LEGAL OUTCOMES, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-muted-foreground mt-4">
              Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">11. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless Justice Bot Technologies Inc. and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">12. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">13. Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will immediately cease. Sections that by their nature should survive termination will survive.
            </p>
          </div>
        </section>

        {/* State Jurisdiction Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">14. Governing Law & Jurisdiction</h2>
            <p className="text-muted-foreground mb-6">
              These Terms shall be governed by and construed in accordance with the laws of your state of residence. Any disputes shall be resolved in the appropriate courts of your state. Below is the designated court for each state:
            </p>

            <Accordion type="single" collapsible className="w-full">
              {["A-F", "G-M", "N-S", "T-Z"].map((range) => {
                const startLetter = range.split("-")[0];
                const endLetter = range.split("-")[1];
                const filteredStates = stateJurisdictions.filter(
                  (s) => s.state[0] >= startLetter && s.state[0] <= endLetter
                );
                
                return (
                  <AccordionItem key={range} value={range}>
                    <AccordionTrigger className="text-lg font-semibold">
                      States {range}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {filteredStates.map((s) => (
                          <div key={s.state} className="p-3 bg-background rounded border">
                            <p className="font-medium">{s.state}</p>
                            <p className="text-sm text-muted-foreground">{s.court}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">15. Dispute Resolution</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              <strong>Informal Resolution:</strong> Before filing any legal claim, you agree to attempt to resolve any dispute informally by contacting us at legal@justicebot-usa.com. We will attempt to resolve the dispute within 60 days.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Arbitration:</strong> If informal resolution fails, you agree that any dispute shall be resolved through binding arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules. Arbitration shall take place in your state of residence.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive the right to participate in class actions or class arbitrations.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Small Claims Exception:</strong> Either party may bring claims in small claims court if the dispute qualifies.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-background rounded-lg p-6 border">
              <p className="font-medium">Justice Bot Technologies Inc. (Justice Bot USA) — Legal</p>
              <p className="text-muted-foreground">Email: legal@justicebot-usa.com</p>
              <p className="text-muted-foreground">Website: justicebot-usa.com</p>
            </div>

            <div className="mt-8 p-4 border border-primary/30 rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground">
                <strong>Need Legal Help?</strong> If you need legal advice or representation, please contact the bar association in your state for a lawyer referral. You can find your state bar association at{" "}
                <a href="https://www.americanbar.org/groups/bar_services/resources/state_local_bar_associations/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-primary hover:underline">
                  americanbar.org
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TermsOfService;
