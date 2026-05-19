import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const lastUpdated = "January 4, 2026";

  const stateSpecificNotices = [
    {
      state: "California",
      law: "California Consumer Privacy Act (CCPA) & California Privacy Rights Act (CPRA)",
      rights: [
        "Right to know what personal information is collected",
        "Right to delete personal information",
        "Right to opt-out of sale/sharing of personal information",
        "Right to non-discrimination for exercising privacy rights",
        "Right to correct inaccurate personal information",
        "Right to limit use of sensitive personal information"
      ]
    },
    {
      state: "Virginia",
      law: "Virginia Consumer Data Protection Act (VCDPA)",
      rights: [
        "Right to access personal data",
        "Right to correct inaccuracies",
        "Right to delete personal data",
        "Right to data portability",
        "Right to opt out of targeted advertising"
      ]
    },
    {
      state: "Colorado",
      law: "Colorado Privacy Act (CPA)",
      rights: [
        "Right to access, correct, and delete personal data",
        "Right to data portability",
        "Right to opt out of targeted advertising and sale of data"
      ]
    },
    {
      state: "Connecticut",
      law: "Connecticut Data Privacy Act (CTDPA)",
      rights: [
        "Right to access and delete personal data",
        "Right to correct inaccuracies",
        "Right to data portability",
        "Right to opt out of sale and targeted advertising"
      ]
    },
    {
      state: "Utah",
      law: "Utah Consumer Privacy Act (UCPA)",
      rights: [
        "Right to access and delete personal data",
        "Right to data portability",
        "Right to opt out of sale of personal data"
      ]
    },
    {
      state: "Texas",
      law: "Texas Data Privacy and Security Act (TDPSA)",
      rights: [
        "Right to access, correct, and delete personal data",
        "Right to data portability",
        "Right to opt out of sale and targeted advertising"
      ]
    },
    {
      state: "Oregon",
      law: "Oregon Consumer Privacy Act (OCPA)",
      rights: [
        "Right to access, correct, and delete personal data",
        "Right to data portability",
        "Right to opt out of targeted advertising"
      ]
    },
    {
      state: "Montana",
      law: "Montana Consumer Data Privacy Act (MTCDPA)",
      rights: [
        "Right to access, correct, and delete personal data",
        "Right to data portability",
        "Right to opt out of targeted advertising and sale"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | A.I. ANAL - Legal AI Assistant</title>
        <meta name="description" content="Privacy Policy for A.I. ANAL. Learn how we collect, use, and protect your personal information across all 50 US states." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://justicebot-usa.com/privacy" />
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Shield className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how A.I. ANAL collects, uses, and protects your information.
            </p>
            <p className="text-center text-sm opacity-70 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Quick Overview Cards */}
        <section className="py-12 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center gap-3">
                <Lock className="h-8 w-8 text-primary" />
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We use industry-standard encryption and security measures to protect your personal information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center gap-3">
                <Eye className="h-8 w-8 text-primary" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We are transparent about what data we collect and how we use it. No hidden practices.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center gap-3">
                <UserCheck className="h-8 w-8 text-primary" />
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You have the right to access, correct, and delete your personal data at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Policy Content */}
        <section className="py-8 container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Name and contact information (email address)</li>
              <li>Account credentials (encrypted passwords)</li>
              <li>Payment information (processed securely through PayPal)</li>
              <li>Legal case information you voluntarily provide</li>
              <li>State of residence for jurisdiction-specific guidance</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>IP address (anonymized for analytics)</li>
              <li>Browser type and device information</li>
              <li>Pages visited and features used</li>
              <li>Date and time of access</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide AI-powered legal information and guidance</li>
              <li>To generate legal forms based on your input</li>
              <li>To improve our services and user experience</li>
              <li>To communicate important updates about our service</li>
              <li>To comply with legal obligations</li>
              <li>To detect and prevent fraud or security issues</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Information Sharing</h2>
            <p className="text-muted-foreground">
              We do NOT sell your personal information. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., hosting, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Safety:</strong> To protect the rights, safety, and property of our users</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information only for as long as necessary to provide our services and fulfill the purposes described in this policy. Case data is retained for the duration of your account plus 7 years to comply with legal requirements. You may request deletion of your data at any time.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use essential cookies to maintain your session and preferences. We also use analytics cookies to understand how users interact with our service. You can manage cookie preferences through your browser settings.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not directed to children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </div>
        </section>

        {/* State-Specific Rights */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              State-Specific Privacy Rights
            </h2>
            <p className="text-muted-foreground mb-6">
              Depending on your state of residence, you may have additional privacy rights under state law. Below are the specific rights afforded to residents of states with comprehensive privacy legislation:
            </p>

            <Accordion type="single" collapsible className="w-full">
              {stateSpecificNotices.map((state, index) => (
                <AccordionItem key={state.state} value={`state-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">
                    {state.state} Residents
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium text-primary mb-2">{state.law}</p>
                    <p className="text-muted-foreground mb-3">As a {state.state} resident, you have the following rights:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      {state.rights.map((right, i) => (
                        <li key={i}>{right}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      To exercise these rights, contact us at privacy@justicebot-usa.com or use the "My Data" section in your account settings.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}

              <AccordionItem value="other-states">
                <AccordionTrigger className="text-lg font-semibold">
                  All Other States
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-3">
                    Even if your state does not have comprehensive privacy legislation, we extend the following rights to all users:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Right to access your personal information</li>
                    <li>Right to request correction of inaccurate data</li>
                    <li>Right to request deletion of your data</li>
                    <li>Right to receive a copy of your data (data portability)</li>
                    <li>Right to opt out of marketing communications</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
          </p>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="font-medium">A.I. ANAL Privacy Team</p>
            <p className="text-muted-foreground">Email: privacy@justicebot-usa.com</p>
            <p className="text-muted-foreground">Response Time: Within 45 days as required by applicable state laws</p>
          </div>

          <div className="mt-8 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> A.I. ANAL provides legal information, not legal advice. We are not a law firm and do not provide attorney-client privilege. All information shared with our service should be considered non-privileged. For sensitive legal matters, consult with a licensed attorney in your jurisdiction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
