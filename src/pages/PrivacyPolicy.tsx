import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const lastUpdated = "October 9, 2026";


  return (
    <>
      <Helmet>
        <title>Privacy Policy | Justice Bot USA - Legal AI Assistant</title>
        <meta name="description" content="Privacy Policy for Justice Bot USA. Learn how we collect, use, and protect your personal information." />
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
              Your privacy is important to us. This policy explains how Justice Bot Technologies Inc., which operates Justice Bot USA ("we," "us"), collects, uses, and protects your information.
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
                  We use encrypted connections (HTTPS/TLS) and a cloud provider with access controls to help protect your personal information.
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
                  This policy explains what data we collect, how we use it, and who we share it with.
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
                  You can ask us to access, correct, or delete your personal data at any time.
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
              <li>Account credentials (passwords are stored in hashed form by our authentication provider)</li>
              <li>Payment information (processed by Stripe, our payment processor; we do not see or store your full card number)</li>
              <li>Legal case information you voluntarily provide</li>
              <li>State of residence for jurisdiction-specific guidance</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>IP address (received by our hosting and analytics providers; we use Google Analytics)</li>
              <li>Browser type and device information</li>
              <li>Pages visited and features used</li>
              <li>Date and time of access</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide AI-powered legal information and guidance</li>
              <li>To fill official forms with the answers you give</li>
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
              <li><strong>Service Providers:</strong> Third-party services that help us operate, such as hosting, payment processing (Stripe), analytics (Google Analytics), and the AI service that processes your questions and case details</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Safety:</strong> To protect the rights, safety, and property of our users</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              We keep your personal information, including case data, while your account is open and as long as needed for the purposes described in this policy. You may ask us to delete your data at any time by emailing privacy@justicebot-usa.com; we may keep limited records where the law requires it.
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

        {/* Privacy Rights */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Your Privacy Rights
            </h2>
            <p className="text-muted-foreground mb-4">
              We offer the following to every user, wherever you live:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-6">
              <li>Access: ask what personal information we hold about you</li>
              <li>Correction: ask us to correct inaccurate information</li>
              <li>Deletion: ask us to delete your personal information</li>
              <li>A copy: ask for a copy of your information</li>
              <li>Marketing: opt out of marketing emails</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To make any of these requests, email privacy@justicebot-usa.com from the address on your account.
            </p>
            <p className="text-sm text-muted-foreground">
              Some state laws, such as the California Consumer Privacy Act, give residents additional privacy rights when the law applies to a business. Whether or not a particular law applies to us, you can use the rights above.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
          </p>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="font-medium">Justice Bot Technologies Inc. (Justice Bot USA) — Privacy</p>
            <p className="text-muted-foreground">Email: privacy@justicebot-usa.com</p>
            <p className="text-muted-foreground">Response time: we aim to respond within 45 days</p>
          </div>

          <div className="mt-8 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Justice Bot USA provides legal information, not legal advice. We are not a law firm and do not provide attorney-client privilege. All information shared with our service should be considered non-privileged. For sensitive legal matters, consult with a licensed attorney in your jurisdiction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
