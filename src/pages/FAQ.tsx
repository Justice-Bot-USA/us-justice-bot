import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle, Scale, CreditCard, Shield, FileText, Bot, Gavel, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const FAQ = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      faqs: [
        {
          question: "What is A.I. ANAL?",
          answer: "A.I. ANAL is an AI-powered legal information platform that helps everyday Americans understand their legal rights and navigate the court system. We provide legal information, form preparation assistance, and guidance for all 50 US states. We are NOT a law firm and do not provide legal advice."
        },
        {
          question: "Is A.I. ANAL a law firm?",
          answer: "No, A.I. ANAL is NOT a law firm. We provide legal information and document preparation services, not legal advice. Our AI-powered tools help you understand legal processes and prepare documents, but we cannot represent you in court or give legal opinions specific to your case. For legal advice, you should consult with a licensed attorney."
        },
        {
          question: "What states do you cover?",
          answer: "We provide information and services for all 50 US states, the District of Columbia, and federal courts. Our database includes state-specific forms, court procedures, and filing requirements for each jurisdiction."
        },
        {
          question: "Is the information on A.I. ANAL accurate?",
          answer: "We strive to provide accurate and up-to-date information. However, laws change frequently and vary by jurisdiction. We recommend always verifying information with official court websites and consulting with an attorney for complex matters. Our information is for educational purposes only."
        },
        {
          question: "Who should use A.I. ANAL?",
          answer: "A.I. ANAL is designed for self-represented litigants (pro se), individuals seeking to understand their legal rights, people who need help preparing legal documents, and anyone looking for general legal information. If your case involves significant assets, criminal charges, or complex legal issues, we recommend consulting with an attorney."
        }
      ]
    },
    {
      title: "Legal Services",
      icon: Scale,
      faqs: [
        {
          question: "What legal areas do you cover?",
          answer: "We cover a wide range of legal areas including: Family Law (divorce, custody, child support), Small Claims Court, Landlord-Tenant disputes, Employment Law, Consumer Rights, Personal Injury guidance, Traffic violations, Bankruptcy basics, Immigration resources, and Civil Rights matters."
        },
        {
          question: "Can A.I. ANAL help me file for divorce?",
          answer: "Yes, we can help you understand the divorce process in your state, identify the forms you need, and assist with document preparation. However, for contested divorces, cases involving significant assets, or situations with domestic violence, we strongly recommend working with a family law attorney."
        },
        {
          question: "Do you help with criminal cases?",
          answer: "We provide general information about criminal procedures and defendants' rights, but we strongly recommend hiring a criminal defense attorney for any criminal charges. Criminal cases can result in jail time and permanent records, so professional legal representation is crucial."
        },
        {
          question: "Can you help me sue someone in small claims court?",
          answer: "Yes! Small claims court is designed for self-represented parties, and our tools can help you understand the process, determine if your claim qualifies, identify the correct forms, calculate filing fees, and prepare your case presentation."
        },
        {
          question: "What types of legal forms do you provide?",
          answer: "We provide access to thousands of legal forms including court filings, demand letters, contracts, affidavits, motions, and various civil and family law documents. All forms are state-specific and regularly updated to reflect current requirements."
        }
      ]
    },
    {
      title: "AI Tools & Features",
      icon: Bot,
      faqs: [
        {
          question: "How does the AI legal assistant work?",
          answer: "Our AI legal assistant uses advanced language models trained on legal information to answer your questions, help you understand legal concepts, and guide you through processes. It analyzes your situation based on the information you provide and gives relevant guidance. Remember, AI responses are for informational purposes only."
        },
        {
          question: "What is the Case Merit Analyzer?",
          answer: "The Case Merit Analyzer is an AI tool that evaluates the strength of your potential legal case based on the facts you provide. It considers relevant laws, similar cases, and key factors to give you an estimated merit score. This helps you understand whether pursuing legal action might be worthwhile."
        },
        {
          question: "How accurate is the AI?",
          answer: "Our AI is designed to provide helpful and accurate information, but it has limitations. It cannot fully understand all nuances of your specific situation, local court practices, or recent legal changes. Always verify important information and consider consulting with an attorney for significant legal matters."
        },
        {
          question: "Can the AI write legal documents for me?",
          answer: "Our AI can help you draft certain legal documents and fill out forms based on information you provide. However, you should always review documents carefully before filing, as you are responsible for their accuracy and completeness."
        },
        {
          question: "Is my conversation with the AI confidential?",
          answer: "Your conversations are stored securely and are not shared with third parties for marketing. However, communications with our AI are NOT protected by attorney-client privilege since we are not a law firm. For truly confidential legal discussions, consult with a licensed attorney."
        }
      ]
    },
    {
      title: "Pricing & Payments",
      icon: CreditCard,
      faqs: [
        {
          question: "How much does A.I. ANAL cost?",
          answer: "We offer various pricing tiers including free basic access, premium subscriptions, and pay-per-use options for certain features. Visit our Pricing page for current rates. We believe legal information should be accessible, so many basic features are available at no cost."
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes, we offer a 30-day money-back guarantee on all subscription purchases. If you're not satisfied with our service, contact our support team within 30 days of purchase for a full refund."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept major credit cards and PayPal. All payments are processed securely through encrypted connections. We never store your full credit card information on our servers."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period. There are no cancellation fees."
        },
        {
          question: "Are there discounts for low-income users?",
          answer: "We are committed to access to justice. We offer reduced rates for users who qualify based on income guidelines. Contact our support team to learn about assistance programs. We also provide links to free legal aid resources in every state."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      faqs: [
        {
          question: "How do you protect my personal information?",
          answer: "We use industry-standard encryption (SSL/TLS) for all data transmission, secure cloud storage with access controls, regular security audits, and strict data access policies. Your personal information is never sold to third parties."
        },
        {
          question: "What data do you collect?",
          answer: "We collect information you provide (name, email, case details), usage data (pages visited, features used), and technical data (browser type, IP address). See our Privacy Policy for complete details on data collection and use."
        },
        {
          question: "Can I delete my data?",
          answer: "Yes, you have the right to request deletion of your personal data. You can do this through your account settings or by contacting our privacy team. We will delete your data in accordance with applicable state privacy laws."
        },
        {
          question: "Do you comply with state privacy laws?",
          answer: "Yes, we comply with all applicable state privacy laws including CCPA (California), VCDPA (Virginia), CPA (Colorado), and other state privacy regulations. We extend privacy rights to all users regardless of state."
        },
        {
          question: "Is my case information confidential?",
          answer: "Your case information is stored securely and is not shared with other users or third parties. However, unlike communications with an attorney, information shared with A.I. ANAL is NOT protected by attorney-client privilege."
        }
      ]
    },
    {
      title: "Court Procedures",
      icon: Gavel,
      faqs: [
        {
          question: "How do I find my local courthouse?",
          answer: "Use our Court Locator tool to find courthouses in your area. Enter your state and county, and we'll show you relevant courts with addresses, phone numbers, hours of operation, and links to their websites."
        },
        {
          question: "What are filing fees?",
          answer: "Filing fees vary by court type, case type, and state. Our tools can help you estimate fees for your specific situation. Many courts offer fee waivers for low-income individuals—we can help you determine if you qualify and find the waiver forms."
        },
        {
          question: "How do I serve legal papers?",
          answer: "Service of process requirements vary by state and document type. Generally, you cannot serve papers yourself—you must use a process server, sheriff, or another adult who is not party to the case. Our guides explain the specific requirements for your jurisdiction."
        },
        {
          question: "What is a statute of limitations?",
          answer: "A statute of limitations is the deadline for filing a lawsuit. These deadlines vary by state and type of case. Missing the deadline can permanently bar your claim. Our tools can help you identify relevant deadlines, but you should verify with an attorney for important matters."
        },
        {
          question: "Can I represent myself in court?",
          answer: "Yes, you have the constitutional right to represent yourself (pro se). Many people successfully handle cases in small claims court, family court, and other venues. However, for complex cases or those with significant consequences, attorney representation is recommended."
        }
      ]
    },
    {
      title: "Documents & Forms",
      icon: FileText,
      faqs: [
        {
          question: "How do I download forms?",
          answer: "Visit our Forms Library, select your state and legal area, and browse available forms. You can download forms as PDFs or use our interactive form builder to fill them out online. Some forms are free; others require a subscription."
        },
        {
          question: "Are your forms accepted by courts?",
          answer: "Our forms are based on official court forms and templates. However, some courts have specific local requirements or prefer their own forms. Always check with your local court clerk to confirm form requirements before filing."
        },
        {
          question: "Can I save my forms and come back later?",
          answer: "Yes, if you create an account, you can save your progress on forms and return to complete them later. Your saved documents are stored securely in your account dashboard."
        },
        {
          question: "How do I know which forms I need?",
          answer: "Our Smart Triage Wizard asks questions about your situation and recommends the appropriate forms. You can also use our AI assistant to get guidance on which forms are typically required for your type of case."
        },
        {
          question: "Can I edit forms after downloading?",
          answer: "PDF forms can be filled out digitally using PDF software. Our interactive forms can be edited anytime before final download. Once filed with a court, you would need to file amended documents to make changes."
        }
      ]
    },
    {
      title: "Support & Help",
      icon: Users,
      faqs: [
        {
          question: "How do I contact support?",
          answer: "You can reach our support team via email at support@justicebot-usa.com, through our Support page ticket system, or via the live chat widget on our website. We typically respond within 24 hours."
        },
        {
          question: "Do you offer phone support?",
          answer: "Currently, we provide support primarily through email and chat. This allows us to keep costs low and provide documented responses. For urgent matters, our chat support offers the fastest response times."
        },
        {
          question: "What if I need help using the website?",
          answer: "We offer interactive tutorials, help guides, and video walkthroughs for all major features. Our AI assistant can also answer questions about how to use specific tools. If you're still stuck, contact our support team."
        },
        {
          question: "Can I get a refund if the service doesn't help me?",
          answer: "We offer a 30-day money-back guarantee. If our service doesn't meet your needs, contact support within 30 days of purchase for a full refund. No questions asked."
        },
        {
          question: "Do you have resources in Spanish?",
          answer: "Yes, we offer bilingual support in English and Spanish. Use the language toggle in the header to switch languages. Many of our guides, forms guidance, and AI responses are available in Spanish."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.faqs.length, 0);

  return (
    <>
      <Helmet>
        <title>FAQ - Frequently Asked Questions | A.I. ANAL</title>
        <meta name="description" content="Find answers to common questions about A.I. ANAL, our AI legal tools, pricing, privacy, and how to use our services for all 50 US states." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://justicebot-usa.com/faq" />
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
            </div>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Find answers to common questions about A.I. ANAL and our legal information services.
            </p>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {totalQuestions} Questions Answered
            </Badge>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 container mx-auto px-4 max-w-3xl">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 text-lg pl-12"
            />
            <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} results for "{searchQuery}"
            </p>
          )}
        </section>

        {/* FAQ Categories */}
        <section className="py-8 container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-primary/10">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <category.icon className="h-6 w-6 text-primary" />
                    {category.title}
                    <Badge variant="outline" className="ml-auto">
                      {category.faqs.length} {category.faqs.length === 1 ? 'question' : 'questions'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try a different search term or browse the categories above.
              </p>
            </div>
          )}
        </section>

        {/* Still Have Questions */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/support"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Users className="h-5 w-5" />
                Contact Support
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
              >
                <Bot className="h-5 w-5" />
                Ask AI Assistant
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FAQ;
