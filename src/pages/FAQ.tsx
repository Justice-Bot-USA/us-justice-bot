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
          question: "What is Justice Bot USA?",
          answer: "Justice Bot USA is an AI-powered legal information platform that helps everyday Americans understand their legal rights and navigate the court system. We are live in California and New York, where you can read plain-language guides and fill in official court forms with your own answers. The other 48 states are coming soon. We are NOT a law firm and do not provide legal advice."
        },
        {
          question: "Is Justice Bot USA a law firm?",
          answer: "No, Justice Bot USA is NOT a law firm. We provide legal information and tools for filling official forms with your own answers, not legal advice. We do not choose forms or a strategy for you, prepare documents on your behalf, or file or serve anything. We cannot represent you in court or give legal opinions specific to your case. Our content has not yet been reviewed by a licensed attorney. For legal advice, you should consult with a licensed attorney."
        },
        {
          question: "What states do you cover?",
          answer: "We are live in California and New York, with state-specific guides, official court forms, and filling instructions for each. We also link to official federal court forms. The other 48 states are coming soon."
        },
        {
          question: "Is the information on Justice Bot USA accurate?",
          answer: "We try to keep our information accurate and up to date, but our content has not yet been reviewed by a licensed attorney, and laws change and vary by jurisdiction. We recommend always verifying information with official court websites and consulting with an attorney for complex matters. Our information is for educational purposes only."
        },
        {
          question: "Who should use Justice Bot USA?",
          answer: "Justice Bot USA is designed for self-represented litigants (pro se), individuals seeking to understand their legal rights, people filling in their own court forms, and anyone looking for general legal information. If your case involves significant assets, criminal charges, or complex legal issues, we recommend consulting with an attorney."
        }
      ]
    },
    {
      title: "Legal Services",
      icon: Scale,
      faqs: [
        {
          question: "What legal areas do you cover?",
          answer: "Our California and New York legal centers cover criminal record relief, family law (custody, support, protective orders), divorce, child protective (dependency) cases, workplace issues, civil matters such as small claims and evictions, and discrimination complaints. The New York center also covers immigration. We also have general guides on other topics. Other states are coming soon."
        },
        {
          question: "Can Justice Bot USA help me file for divorce?",
          answer: "In California and New York, we explain the divorce process in plain language, link to the official forms, and let you fill them in with your own answers. You review, sign, and file them yourself; we do not file anything for you. However, for contested divorces, cases involving significant assets, or situations with domestic violence, we strongly recommend working with a family law attorney."
        },
        {
          question: "Do you help with criminal cases?",
          answer: "We provide general information about criminal procedures and defendants' rights, but we strongly recommend hiring a criminal defense attorney for any criminal charges. Criminal cases can result in jail time and permanent records, so professional legal representation is crucial."
        },
        {
          question: "Can you help me sue someone in small claims court?",
          answer: "Yes! Small claims court is designed for self-represented parties, and in California and New York our tools can help you understand the process and find the official forms. You can fill in the California claim (SC-100) and the New York City claim (CIV-SC-50) with your own answers; small claims courts outside New York City use their own forms. You file and serve the papers yourself."
        },
        {
          question: "What types of legal forms do you provide?",
          answer: "We link to official California and New York court and agency forms, plus federal court forms, and for some California and New York forms you can fill them in online with your own answers. All forms and their filling instructions are included in the $25/month plan, and fee waiver forms are free. Always confirm with the court that you have the current version before you file."
        }
      ]
    },
    {
      title: "AI Tools & Features",
      icon: Bot,
      faqs: [
        {
          question: "How do the AI tools work?",
          answer: "Our AI tools use a general-purpose AI model to explain legal processes in plain language based on what you tell them. AI answers can be wrong and are not legal advice, and our content has not yet been reviewed by a licensed attorney. Check important information against official court sources."
        },
        {
          question: "Does Justice Bot rate my case or predict the outcome?",
          answer: "No. We give you a plain-language summary of what you told us, general information about how this kind of matter usually works in your state, and links to official resources. We do not score cases, estimate success rates or settlements, choose forms for you, or suggest a strategy. Talk to a lawyer or a free legal aid organization about your situation."
        },
        {
          question: "How accurate is the AI?",
          answer: "AI can make mistakes, and it has limitations. It cannot fully understand all nuances of your specific situation, local court practices, or recent legal changes. Always verify important information and consider consulting with an attorney for significant legal matters."
        },
        {
          question: "Can the AI write legal documents for me?",
          answer: "No. You fill in official forms with your own answers, and we give plain-language filling instructions. Our AI can explain what a form or a document says, but it does not write legal documents for you or decide what you should say. Review everything carefully before you sign and file; you are responsible for what you file."
        },
        {
          question: "Is my conversation with the AI confidential?",
          answer: "We do not sell your conversations or share them for marketing. To answer you, what you type is sent to the AI service provider that powers our tools. However, communications with our AI are NOT protected by attorney-client privilege since we are not a law firm. For truly confidential legal discussions, consult with a licensed attorney."
        }
      ]
    },
    {
      title: "Pricing & Payments",
      icon: CreditCard,
      faqs: [
        {
          question: "How much does Justice Bot USA cost?",
          answer: "Justice Bot USA has one plan: $25/month. All forms and filling instructions are included, and fee waiver forms are free. Our general guides are free to read. Courts and government agencies may charge their own fees, such as filing fees; those are separate from our plan."
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes. Refunds are available within 30 days of purchase if you are not satisfied. Email billing@justicebot-usa.com to request one."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept card payments through Stripe, our payment processor. Your card details go directly to Stripe; we never see or store your full card number."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes. To cancel, email billing@justicebot-usa.com or open a ticket on our Support page, and we will cancel your subscription. There are no cancellation fees."
        },
        {
          question: "Are there discounts for low-income users?",
          answer: "We have one plan, $25/month, with every form and filling instruction included; we do not currently offer reduced rates. If you can't afford court fees, you may qualify for a court fee waiver, and our fee waiver forms are free. Our Legal Disclaimer page links to state bar associations, which can refer you to a lawyer."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      faqs: [
        {
          question: "How do you protect my personal information?",
          answer: "We use encrypted connections (HTTPS/TLS) for data in transit and store data with a cloud provider that uses access controls. We do not sell your personal information."
        },
        {
          question: "What data do you collect?",
          answer: "We collect information you provide (name, email, case details), usage data (pages visited, features used), and technical data (browser type, IP address). See our Privacy Policy for complete details on data collection and use."
        },
        {
          question: "Can I delete my data?",
          answer: "Yes. Email privacy@justicebot-usa.com to ask us to delete your personal data. We offer this to every user, wherever you live."
        },
        {
          question: "Do you comply with state privacy laws?",
          answer: "Our Privacy Policy explains the privacy rights we offer to all users, wherever they live, and how to use them. Email privacy@justicebot-usa.com with any privacy request."
        },
        {
          question: "Is my case information confidential?",
          answer: "Your case information is not shown to other users. To run the service, we share it with service providers, such as our hosting provider and the AI service that processes your questions. We never sell it. However, unlike communications with an attorney, information shared with Justice Bot USA is NOT protected by attorney-client privilege."
        }
      ]
    },
    {
      title: "Court Procedures",
      icon: Gavel,
      faqs: [
        {
          question: "How do I find my local courthouse?",
          answer: "Your state court system's website lists its courthouses: courts.ca.gov for California and nycourts.gov for New York. Our California and New York legal centers also link to official court pages."
        },
        {
          question: "What are filing fees?",
          answer: "Filing fees are set by courts and vary by court, case type, and state. They are separate from our plan. Courts can waive fees for people who can't afford them. Our California and New York fee waiver forms are free, and the court decides whether you qualify."
        },
        {
          question: "How do I serve legal papers?",
          answer: "Service of process requirements vary by state and document type. Generally, you cannot serve papers yourself—you must use a process server, sheriff, or another adult who is not party to the case. Our California and New York guides describe the general rules; check your court's instructions for your case."
        },
        {
          question: "What is a statute of limitations?",
          answer: "A statute of limitations is the deadline for filing a lawsuit. These deadlines vary by state and type of case. Missing the deadline can permanently bar your claim. Our guides describe some common deadlines in general terms, but we cannot tell you which deadline applies to your case; check with the court or a lawyer."
        },
        {
          question: "Can I represent myself in court?",
          answer: "Generally, yes. Individuals can usually represent themselves in court (called appearing pro se, or in pro per in California); businesses usually need a lawyer, with exceptions such as small claims. Many people handle their own cases in small claims court, family court, and other courts. However, for complex cases or those with significant consequences, attorney representation is recommended."
        }
      ]
    },
    {
      title: "Documents & Forms",
      icon: FileText,
      faqs: [
        {
          question: "How do I download forms?",
          answer: "Visit our Forms Library, select your state and legal area, and browse available forms. You can download blank official forms, and for some California and New York forms you can fill them in online with your own answers. Fee waiver forms are free; all other forms and their filling instructions are included in the $25/month plan."
        },
        {
          question: "Are your forms accepted by courts?",
          answer: "We use the official forms published by courts and government agencies; we do not make our own versions. However, some courts have local requirements or local forms. Always check with your local court clerk to confirm form requirements before filing."
        },
        {
          question: "Can I save my forms and come back later?",
          answer: "Your answers on a form are kept in your browser while you work, so you can leave and return in the same session. Download your filled form when you finish; we recommend keeping your own copy."
        },
        {
          question: "How do I know which forms I need?",
          answer: "Which forms apply depends on your situation. We show the forms commonly used for your type of matter in your state and what each one is for. Your court's self-help center, a legal aid office or a lawyer can tell you which ones apply to you."
        },
        {
          question: "Can I edit forms after downloading?",
          answer: "PDF forms can be filled out digitally using PDF software. On our form-filling pages you can change your answers and download the form again. Once filed with a court, you would need to file amended documents to make changes."
        }
      ]
    },
    {
      title: "Support & Help",
      icon: Users,
      faqs: [
        {
          question: "How do I contact support?",
          answer: "Email support@justicebot-usa.com, or sign in and open a ticket on our Support page."
        },
        {
          question: "Do you offer phone support?",
          answer: "No. We provide support by email and through support tickets on our Support page. For anything urgent about your case, contact the court or a lawyer."
        },
        {
          question: "What if I need help using the website?",
          answer: "Our free legal help guides explain each step. If you get stuck, email support@justicebot-usa.com or open a ticket on our Support page."
        },
        {
          question: "Can I get a refund if the service doesn't help me?",
          answer: "Refunds are available within 30 days of purchase if you are not satisfied. Email billing@justicebot-usa.com to request one."
        },
        {
          question: "Do you have resources in Spanish?",
          answer: "Partly. Some pages have a Spanish option in the language menu in the header, but most of our guides and filling instructions are in English only for now. Your court's self-help center may have materials in Spanish."
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
        <title>FAQ - Frequently Asked Questions | Justice Bot USA</title>
        <meta name="description" content="Find answers to common questions about Justice Bot USA, our AI legal tools, pricing, privacy, and how to use our services in California and New York." />
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
              Find answers to common questions about Justice Bot USA and our legal information services.
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
