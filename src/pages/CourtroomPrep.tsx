import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gavel, AlertTriangle, CheckCircle, XCircle, Clock,
  Briefcase, Users, MessageSquare, FileText, Shield
} from "lucide-react";

const CourtroomPrep = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <>
      <Helmet>
        <title>Courtroom Preparation Guide | Justice Bot USA — What to Expect in Court</title>
        <meta name="description" content="Free courtroom preparation guide for self-represented litigants. Learn court etiquette, what to bring, how to address a judge, and how to present your case." />
        <link rel="canonical" href="https://justicebot-usa.com/courtroom-prep" />
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Gavel className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Courtroom Preparation Guide</h1>
            </div>
            <p className="opacity-90 max-w-2xl mx-auto">
              What to expect, what to bring, and how to conduct yourself in court as a self-represented litigant.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-6 max-w-4xl">
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-sm">
              This guide provides <strong>general courtroom etiquette and procedural information</strong> only.
              It is not legal advice. Court rules vary by jurisdiction. Always confirm procedures with your local court clerk.{" "}
              <Link to="/disclaimer" className="underline font-medium">Full disclaimer →</Link>
            </AlertDescription>
          </Alert>
        </section>

        <section className="container mx-auto px-4 pb-16 max-w-5xl">
          <Tabs defaultValue="before" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="before">Before Court</TabsTrigger>
              <TabsTrigger value="what-to-bring">What to Bring</TabsTrigger>
              <TabsTrigger value="in-court">In the Courtroom</TabsTrigger>
              <TabsTrigger value="speaking">Speaking to the Judge</TabsTrigger>
            </TabsList>

            {/* BEFORE COURT */}
            <TabsContent value="before">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Timeline: Days Before Your Hearing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">1 Week Before</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Organize all documents and evidence in chronological order</li>
                        <li>• Make at least 3 copies of everything (you, judge, opposing party)</li>
                        <li>• Visit the courthouse to find the courtroom, parking, and security entrance</li>
                        <li>• Confirm the date, time, and courtroom number on the court calendar</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-primary/70 pl-4">
                      <h4 className="font-semibold">2-3 Days Before</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Write a brief outline of what you want to tell the judge (key points only)</li>
                        <li>• Practice saying your main points out loud — stay calm and factual</li>
                        <li>• Prepare any witnesses: remind them of date, time, location</li>
                        <li>• Choose professional attire (business casual at minimum)</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-primary/50 pl-4">
                      <h4 className="font-semibold">Day Of</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Arrive at least 30 minutes early</li>
                        <li>• Go through security (no weapons, no phones ringing in court)</li>
                        <li>• Find your courtroom and sit quietly until your case is called</li>
                        <li>• Turn off your phone or set it to silent</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* WHAT TO BRING */}
            <TabsContent value="what-to-bring">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Bring These
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><Briefcase className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Government-issued photo ID</li>
                      <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" /> 3+ copies of all documents and evidence</li>
                      <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Your court notice / hearing notification</li>
                      <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Any previously filed court papers</li>
                      <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Written outline of key points</li>
                      <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Pen and notepad</li>
                      <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Relevant laws or statutes (printed)</li>
                      <li className="flex items-start gap-2"><Users className="h-4 w-4 mt-0.5 text-primary shrink-0" /> List of witness names and what they'll testify about</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <XCircle className="h-5 w-5 text-destructive" />
                      Do NOT Bring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✗ Weapons of any kind</li>
                      <li>✗ Food or beverages (water may be OK — check local rules)</li>
                      <li>✗ Children (unless required by the case — arrange childcare)</li>
                      <li>✗ Large groups of supporters (1-2 is usually fine)</li>
                      <li>✗ Recording devices (most courts prohibit recording)</li>
                      <li>✗ Irrelevant documents — only bring what matters</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* IN THE COURTROOM */}
            <TabsContent value="in-court">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Courtroom Etiquette
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">Do</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ Stand when the judge enters and leaves the courtroom</li>
                          <li>✓ Stand when speaking to the judge</li>
                          <li>✓ Wait for your case to be called before approaching</li>
                          <li>✓ Speak clearly and at a normal volume</li>
                          <li>✓ Address the judge as "Your Honor"</li>
                          <li>✓ Stay calm, even if provoked</li>
                          <li>✓ Listen carefully to questions and answer directly</li>
                          <li>✓ Say "I don't know" if you genuinely don't know</li>
                          <li>✓ Ask for clarification if you don't understand something</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-destructive">Don't</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✗ Interrupt the judge, witness, or opposing party</li>
                          <li>✗ Argue with the judge — object politely if needed</li>
                          <li>✗ Make faces, sigh loudly, or show frustration visibly</li>
                          <li>✗ Speak to the opposing party directly (speak to the judge)</li>
                          <li>✗ Chew gum, wear hats, or use your phone</li>
                          <li>✗ Bring up irrelevant personal grievances</li>
                          <li>✗ Lie or exaggerate — this can destroy your credibility</li>
                          <li>✗ Read your entire statement word-for-word (use an outline)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Dress Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      There is no official dress code for most courts, but your appearance affects how you are perceived. Dress as if you are going to a job interview.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-primary/5 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2">Appropriate</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Collared shirt, blouse, or clean sweater</li>
                          <li>• Slacks, khakis, or a modest skirt/dress</li>
                          <li>• Closed-toe shoes</li>
                          <li>• Minimal jewelry and accessories</li>
                        </ul>
                      </div>
                      <div className="bg-destructive/5 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2">Avoid</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• T-shirts with logos or slogans</li>
                          <li>• Shorts, flip-flops, or athletic wear</li>
                          <li>• Hats or sunglasses (remove inside)</li>
                          <li>• Revealing or overly casual clothing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SPEAKING TO THE JUDGE */}
            <TabsContent value="speaking">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      How to Present Your Case
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">1. Introduce Yourself</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        "Good morning, Your Honor. My name is [Your Name], and I am representing myself in this matter."
                      </p>
                    </div>
                    <div className="border-l-4 border-primary/80 pl-4">
                      <h4 className="font-semibold">2. State Your Position Clearly</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start with what you're asking the court to do. "I am requesting [specific relief] because [brief reason]."
                      </p>
                    </div>
                    <div className="border-l-4 border-primary/60 pl-4">
                      <h4 className="font-semibold">3. Present Facts Chronologically</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tell your story in order. Stick to facts. "On [date], [what happened]." Refer to specific evidence: "As shown in Exhibit A..."
                      </p>
                    </div>
                    <div className="border-l-4 border-primary/40 pl-4">
                      <h4 className="font-semibold">4. Reference the Law</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        If you know the relevant statute or rule, mention it. "Under [State] Code Section [X], [what it says]."
                      </p>
                    </div>
                    <div className="border-l-4 border-primary/30 pl-4">
                      <h4 className="font-semibold">5. Conclude with Your Request</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        "Based on the facts and the law, I respectfully ask this Court to [specific relief]. Thank you, Your Honor."
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Helpful Phrases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { situation: "Addressing the judge", phrase: "\"Your Honor\"" },
                        { situation: "You need time to think", phrase: "\"May I have a moment, Your Honor?\"" },
                        { situation: "You don't understand", phrase: "\"I'm sorry, Your Honor, could you explain what that means?\"" },
                        { situation: "You want to show evidence", phrase: "\"Your Honor, I'd like to present Exhibit [A] for the Court's consideration.\"" },
                        { situation: "You disagree with something", phrase: "\"Respectfully, Your Honor, I would like to address that point.\"" },
                        { situation: "You need a continuance", phrase: "\"Your Honor, I respectfully request a continuance because [reason].\"" },
                        { situation: "Opposing side says something false", phrase: "\"Your Honor, that statement is inaccurate. The evidence shows [fact].\"" },
                        { situation: "You're emotional", phrase: "\"Your Honor, may I take a brief moment to compose myself?\"" },
                      ].map((item, i) => (
                        <div key={i} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">{item.situation}</p>
                          <p className="text-sm font-medium">{item.phrase}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CourtroomPrep;
