import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Gavel, Shield, Scale, AlertTriangle, DollarSign, Clock, 
  FileText, ArrowLeft, MapPin, BookOpen, Users, CheckCircle,
  XCircle, AlertCircle, Info
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia"
];

// Comprehensive state criminal law data
const stateData: Record<string, {
  felonyClasses: { class: string; range: string; examples: string[] }[];
  misdemeanorClasses: { class: string; range: string; examples: string[] }[];
  bailInfo: { offense: string; typicalBail: string; notes: string }[];
  threeStrikes: boolean;
  deathPenalty: boolean;
  expungement: { eligible: string; waiting: string; process: string };
  publicDefender: string;
  statutes: { name: string; code: string }[];
}> = {
  "California": {
    felonyClasses: [
      { class: "Low-level Felony", range: "16 months, 2, or 3 years", examples: ["Grand theft", "Forgery", "Possession for sale"] },
      { class: "Mid-level Felony", range: "2, 3, or 4 years", examples: ["Burglary 2nd degree", "Assault with deadly weapon"] },
      { class: "Serious Felony", range: "3, 6, or 8 years", examples: ["Robbery", "Carjacking", "Assault with firearm"] },
      { class: "Violent Felony", range: "5, 8, or 11 years", examples: ["Voluntary manslaughter", "Kidnapping"] },
      { class: "Murder 2nd Degree", range: "15 years to life", examples: ["Second degree murder"] },
      { class: "Murder 1st Degree", range: "25 years to life", examples: ["Premeditated murder", "Felony murder"] },
    ],
    misdemeanorClasses: [
      { class: "Infraction", range: "Fine only", examples: ["Traffic violations", "Minor trespass"] },
      { class: "Misdemeanor", range: "Up to 6 months county jail", examples: ["Petty theft", "Simple assault", "DUI 1st offense"] },
      { class: "Gross Misdemeanor", range: "Up to 1 year county jail", examples: ["DUI with injury", "Domestic battery"] },
    ],
    bailInfo: [
      { offense: "Misdemeanor", typicalBail: "$500 - $10,000", notes: "Many released on OR (own recognizance)" },
      { offense: "Non-violent Felony", typicalBail: "$20,000 - $50,000", notes: "Bail schedule varies by county" },
      { offense: "Violent Felony", typicalBail: "$50,000 - $250,000", notes: "Judge may deny bail" },
      { offense: "Murder", typicalBail: "$1,000,000+", notes: "Often held without bail" },
    ],
    threeStrikes: true,
    deathPenalty: true,
    expungement: {
      eligible: "Most misdemeanors and many felonies after probation",
      waiting: "After completion of probation or 1-2 years after",
      process: "File Petition under PC 1203.4 or 1203.4a"
    },
    publicDefender: "Available if income below 125% of federal poverty guidelines",
    statutes: [
      { name: "Penal Code", code: "Cal. Penal Code" },
      { name: "Vehicle Code", code: "Cal. Veh. Code" },
      { name: "Health & Safety Code", code: "Cal. Health & Saf. Code" },
    ]
  },
  "Texas": {
    felonyClasses: [
      { class: "State Jail Felony", range: "180 days - 2 years state jail", examples: ["Theft $2,500-$30,000", "Credit card abuse", "DWI 3rd"] },
      { class: "3rd Degree Felony", range: "2-10 years prison", examples: ["DWI with child", "Assault family member", "Theft $30,000-$150,000"] },
      { class: "2nd Degree Felony", range: "2-20 years prison", examples: ["Aggravated assault", "Robbery", "Sexual assault"] },
      { class: "1st Degree Felony", range: "5-99 years or life", examples: ["Murder", "Aggravated robbery", "Aggravated sexual assault"] },
      { class: "Capital Felony", range: "Life without parole or death", examples: ["Capital murder", "Murder of peace officer"] },
    ],
    misdemeanorClasses: [
      { class: "Class C Misdemeanor", range: "Fine up to $500", examples: ["Minor traffic", "Public intoxication", "Theft under $100"] },
      { class: "Class B Misdemeanor", range: "Up to 180 days jail, $2,000 fine", examples: ["DWI 1st", "Theft $100-$750", "Marijuana possession < 2oz"] },
      { class: "Class A Misdemeanor", range: "Up to 1 year jail, $4,000 fine", examples: ["DWI 2nd", "Assault causing injury", "Theft $750-$2,500"] },
    ],
    bailInfo: [
      { offense: "Class C Misdemeanor", typicalBail: "Citation/Release", notes: "Usually no bail required" },
      { offense: "Class B Misdemeanor", typicalBail: "$500 - $3,000", notes: "Bond schedule varies by county" },
      { offense: "Class A Misdemeanor", typicalBail: "$2,000 - $10,000", notes: "May be released on PR bond" },
      { offense: "State Jail Felony", typicalBail: "$5,000 - $20,000", notes: "Magistrate sets within 48 hours" },
      { offense: "1st-3rd Degree Felony", typicalBail: "$10,000 - $500,000", notes: "Depends on criminal history" },
    ],
    threeStrikes: false,
    deathPenalty: true,
    expungement: {
      eligible: "Limited - mainly for acquittals, dismissals, or certain deferred adjudications",
      waiting: "Immediately for acquittals; varies for other cases",
      process: "Order of Nondisclosure or Expunction under Gov. Code Chapter 411"
    },
    publicDefender: "Appointed counsel if indigent; many counties use assigned counsel system",
    statutes: [
      { name: "Penal Code", code: "Tex. Penal Code" },
      { name: "Code of Criminal Procedure", code: "Tex. Code Crim. Proc." },
      { name: "Transportation Code", code: "Tex. Transp. Code" },
    ]
  },
  "New York": {
    felonyClasses: [
      { class: "Class E Felony", range: "1-4 years prison", examples: ["Grand larceny 4th", "Criminal mischief 2nd"] },
      { class: "Class D Felony", range: "2-7 years prison", examples: ["Grand larceny 3rd", "Robbery 3rd"] },
      { class: "Class C Felony", range: "3.5-15 years prison", examples: ["Robbery 2nd", "Burglary 2nd"] },
      { class: "Class B Felony", range: "5-25 years prison", examples: ["Robbery 1st", "Burglary 1st", "Rape 1st"] },
      { class: "Class A-II Felony", range: "10 years - life", examples: ["Major drug offenses"] },
      { class: "Class A-I Felony", range: "20 years - life", examples: ["Murder 1st", "Terrorism"] },
    ],
    misdemeanorClasses: [
      { class: "Violation", range: "Up to 15 days", examples: ["Harassment 2nd", "Disorderly conduct"] },
      { class: "Class B Misdemeanor", range: "Up to 90 days", examples: ["Petit larceny", "Criminal mischief 4th"] },
      { class: "Class A Misdemeanor", range: "Up to 1 year", examples: ["Assault 3rd", "DWI", "Criminal possession marijuana"] },
    ],
    bailInfo: [
      { offense: "Misdemeanor", typicalBail: "$500 - $5,000", notes: "Bail reform limits cash bail for many offenses" },
      { offense: "Non-violent Felony", typicalBail: "$5,000 - $50,000", notes: "Many released with conditions" },
      { offense: "Violent Felony", typicalBail: "$25,000 - $500,000", notes: "Judge has discretion" },
      { offense: "Murder", typicalBail: "Remanded", notes: "Usually held without bail" },
    ],
    threeStrikes: false,
    deathPenalty: false,
    expungement: {
      eligible: "Limited sealing under CPL 160.59; conditional sealing for some drug offenses",
      waiting: "10 years after sentence completion for most",
      process: "Motion under CPL 160.59 or automatic sealing for marijuana"
    },
    publicDefender: "Legal Aid Society and assigned counsel for those who qualify",
    statutes: [
      { name: "Penal Law", code: "N.Y. Penal Law" },
      { name: "Criminal Procedure Law", code: "N.Y. C.P.L." },
      { name: "Vehicle & Traffic Law", code: "N.Y. Veh. & Traf. Law" },
    ]
  },
  "Florida": {
    felonyClasses: [
      { class: "3rd Degree Felony", range: "Up to 5 years prison", examples: ["Grand theft $750-$20,000", "Aggravated assault"] },
      { class: "2nd Degree Felony", range: "Up to 15 years prison", examples: ["Robbery", "Burglary of dwelling"] },
      { class: "1st Degree Felony", range: "Up to 30 years prison", examples: ["Aggravated battery", "Sexual battery"] },
      { class: "Life Felony", range: "Life in prison", examples: ["Kidnapping", "Armed robbery"] },
      { class: "Capital Felony", range: "Death or life without parole", examples: ["First degree murder"] },
    ],
    misdemeanorClasses: [
      { class: "2nd Degree Misdemeanor", range: "Up to 60 days jail, $500 fine", examples: ["Petit theft 2nd", "Simple assault"] },
      { class: "1st Degree Misdemeanor", range: "Up to 1 year jail, $1,000 fine", examples: ["DUI", "Battery", "Petit theft 1st"] },
    ],
    bailInfo: [
      { offense: "2nd Degree Misdemeanor", typicalBail: "$250 - $1,500", notes: "Often released on own recognizance" },
      { offense: "1st Degree Misdemeanor", typicalBail: "$500 - $5,000", notes: "Standard bond schedule" },
      { offense: "3rd Degree Felony", typicalBail: "$2,500 - $15,000", notes: "Based on county schedule" },
      { offense: "Violent Felony", typicalBail: "$50,000 - $500,000", notes: "May require Arthur hearing" },
    ],
    threeStrikes: true,
    deathPenalty: true,
    expungement: {
      eligible: "Limited to dismissed cases or withholds of adjudication (one-time only)",
      waiting: "Immediately for dismissals; varies for withholds",
      process: "Application through FDLE under F.S. 943.0585"
    },
    publicDefender: "Public Defender's Office for those who qualify financially",
    statutes: [
      { name: "Florida Statutes", code: "Fla. Stat." },
      { name: "Florida Rules of Criminal Procedure", code: "Fla. R. Crim. P." },
    ]
  }
};

// Common defense strategies
const defenseStrategies = [
  {
    name: "Lack of Evidence / Reasonable Doubt",
    description: "The prosecution must prove every element beyond a reasonable doubt. Challenging the sufficiency of evidence is the most common defense.",
    applicableTo: ["All criminal charges"],
    effectiveness: "High - Fundamental constitutional protection",
    icon: Scale
  },
  {
    name: "Fourth Amendment Violations",
    description: "Evidence obtained through illegal searches or seizures can be suppressed. Motion to suppress can result in case dismissal.",
    applicableTo: ["Drug cases", "Weapons charges", "DUI", "Any case with searches"],
    effectiveness: "Very High when applicable",
    icon: Shield
  },
  {
    name: "Self-Defense / Defense of Others",
    description: "The defendant used reasonable force to protect themselves or others from imminent harm. Stand Your Ground laws vary by state.",
    applicableTo: ["Assault", "Battery", "Homicide", "Weapons charges"],
    effectiveness: "High when facts support it",
    icon: Users
  },
  {
    name: "Alibi Defense",
    description: "The defendant was somewhere else when the crime occurred and could not have committed it.",
    applicableTo: ["All charges requiring presence at scene"],
    effectiveness: "Very High with credible witnesses/evidence",
    icon: MapPin
  },
  {
    name: "Miranda Violations",
    description: "Statements made without proper Miranda warnings during custodial interrogation may be inadmissible.",
    applicableTo: ["Any case involving confessions or statements"],
    effectiveness: "High - Can suppress key evidence",
    icon: AlertCircle
  },
  {
    name: "Entrapment",
    description: "Government agents induced the defendant to commit a crime they would not have otherwise committed.",
    applicableTo: ["Drug sales", "Sting operations", "Solicitation"],
    effectiveness: "Moderate - Hard to prove",
    icon: AlertTriangle
  },
  {
    name: "Mistaken Identity",
    description: "The defendant was wrongly identified as the perpetrator. Cross-racial identification is particularly unreliable.",
    applicableTo: ["Robbery", "Assault", "Any witness identification case"],
    effectiveness: "High when applicable",
    icon: Users
  },
  {
    name: "Intoxication Defense",
    description: "Voluntary intoxication may negate specific intent crimes. Involuntary intoxication can be a complete defense.",
    applicableTo: ["Specific intent crimes only"],
    effectiveness: "Limited for voluntary; High for involuntary",
    icon: AlertCircle
  },
  {
    name: "Insanity / Mental Incapacity",
    description: "The defendant lacked the mental capacity to understand the nature of their actions or that they were wrong.",
    applicableTo: ["All charges"],
    effectiveness: "Rarely successful but important option",
    icon: Info
  },
  {
    name: "Duress / Coercion",
    description: "The defendant committed the crime under threat of immediate harm to themselves or others.",
    applicableTo: ["Most crimes (not murder in most states)"],
    effectiveness: "Moderate when facts support it",
    icon: Shield
  }
];

// Rights of the accused
const constitutionalRights = [
  { amendment: "4th Amendment", right: "Protection against unreasonable searches and seizures", application: "Requires warrants based on probable cause; exclusionary rule for illegal evidence" },
  { amendment: "5th Amendment", right: "Right against self-incrimination", application: "Cannot be compelled to testify; Miranda warnings required for custodial interrogation" },
  { amendment: "5th Amendment", right: "Right to due process", application: "Fair procedures must be followed; notice of charges required" },
  { amendment: "5th Amendment", right: "Protection against double jeopardy", application: "Cannot be tried twice for the same offense after acquittal" },
  { amendment: "6th Amendment", right: "Right to speedy trial", application: "Varies by state; typically 60-180 days depending on charges" },
  { amendment: "6th Amendment", right: "Right to public trial", application: "Trials must be open to the public with limited exceptions" },
  { amendment: "6th Amendment", right: "Right to impartial jury", application: "Jury selection process; voir dire to ensure fairness" },
  { amendment: "6th Amendment", right: "Right to confront witnesses", application: "Cross-examination of prosecution witnesses guaranteed" },
  { amendment: "6th Amendment", right: "Right to counsel", application: "Free attorney if you cannot afford one; Gideon v. Wainwright" },
  { amendment: "8th Amendment", right: "Protection against excessive bail", application: "Bail must be reasonable based on flight risk and danger" },
  { amendment: "8th Amendment", right: "Protection against cruel and unusual punishment", application: "Proportionality in sentencing; limits on execution methods" },
];

const CriminalDefenseGuide = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedState, setSelectedState] = useState("California");

  const currentStateData = stateData[selectedState] || stateData["California"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Gavel className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Criminal Defense Guide</h1>
                <p className="text-muted-foreground">State-by-state sentencing, bail, and defense strategies for all 50 states</p>
              </div>
            </div>

            {/* State Selector */}
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <label className="text-sm font-medium mb-2 block">Select Your State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {state}
                          {stateData[state] && <Badge variant="secondary" className="ml-2 text-xs">Detailed</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="sentencing" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="sentencing" className="flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  <span className="hidden sm:inline">Sentencing</span>
                </TabsTrigger>
                <TabsTrigger value="bail" className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Bail</span>
                </TabsTrigger>
                <TabsTrigger value="defenses" className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Defenses</span>
                </TabsTrigger>
                <TabsTrigger value="rights" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Your Rights</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Resources</span>
                </TabsTrigger>
              </TabsList>

              {/* Sentencing Tab */}
              <TabsContent value="sentencing" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* State Info Cards */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {selectedState} Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Three Strikes Law</p>
                          <div className="flex items-center gap-2 mt-1">
                            {currentStateData.threeStrikes ? (
                              <><CheckCircle className="h-4 w-4 text-destructive" /> <span className="font-semibold">Yes</span></>
                            ) : (
                              <><XCircle className="h-4 w-4 text-green-600" /> <span className="font-semibold">No</span></>
                            )}
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Death Penalty</p>
                          <div className="flex items-center gap-2 mt-1">
                            {currentStateData.deathPenalty ? (
                              <><AlertTriangle className="h-4 w-4 text-destructive" /> <span className="font-semibold">Yes</span></>
                            ) : (
                              <><XCircle className="h-4 w-4 text-green-600" /> <span className="font-semibold">No</span></>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Public Defender Eligibility</p>
                        <p className="text-sm text-blue-800 mt-1">{currentStateData.publicDefender}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Relevant Statutes</p>
                        <div className="flex flex-wrap gap-2">
                          {currentStateData.statutes.map((statute, idx) => (
                            <Badge key={idx} variant="outline">{statute.code}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expungement Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Expungement in {selectedState}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Who is Eligible</p>
                        <p className="text-sm text-muted-foreground">{currentStateData.expungement.eligible}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Waiting Period</p>
                        <p className="text-sm text-muted-foreground">{currentStateData.expungement.waiting}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Process</p>
                        <p className="text-sm text-muted-foreground">{currentStateData.expungement.process}</p>
                      </div>
                      <Button asChild className="w-full mt-4">
                        <Link to="/case-analysis">Check Your Eligibility</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Felony Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Felony Sentencing in {selectedState}
                    </CardTitle>
                    <CardDescription>
                      Felonies are serious crimes that can result in state prison time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Classification</th>
                            <th className="text-left py-3 px-2">Sentencing Range</th>
                            <th className="text-left py-3 px-2">Examples</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStateData.felonyClasses.map((felony, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-3 px-2 font-medium">{felony.class}</td>
                              <td className="py-3 px-2 text-destructive">{felony.range}</td>
                              <td className="py-3 px-2 text-muted-foreground">{felony.examples.join(", ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Misdemeanor Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Misdemeanor Sentencing in {selectedState}
                    </CardTitle>
                    <CardDescription>
                      Misdemeanors are less serious crimes typically punishable by county jail
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Classification</th>
                            <th className="text-left py-3 px-2">Sentencing Range</th>
                            <th className="text-left py-3 px-2">Examples</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStateData.misdemeanorClasses.map((misd, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-3 px-2 font-medium">{misd.class}</td>
                              <td className="py-3 px-2 text-yellow-600">{misd.range}</td>
                              <td className="py-3 px-2 text-muted-foreground">{misd.examples.join(", ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bail Tab */}
              <TabsContent value="bail" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Bail Schedule for {selectedState}
                    </CardTitle>
                    <CardDescription>
                      Typical bail amounts by offense type. Actual bail may vary based on criminal history, flight risk, and judge discretion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentStateData.bailInfo.map((bail, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{bail.offense}</span>
                            <Badge variant="outline" className="text-lg font-bold">{bail.typicalBail}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{bail.notes}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Understanding Bail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="what-is-bail">
                        <AccordionTrigger>What is bail and how does it work?</AccordionTrigger>
                        <AccordionContent>
                          Bail is money or property you give to the court to guarantee you will appear for your court dates. If you appear as required, the bail is returned (minus fees). If you fail to appear, you forfeit the bail and may face additional charges.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-bonds">
                        <AccordionTrigger>What is a bail bond?</AccordionTrigger>
                        <AccordionContent>
                          A bail bond is when a bail bondsman posts bail on your behalf. You pay a non-refundable fee (typically 10% of bail) to the bondsman. The bondsman is then responsible for the full bail if you fail to appear.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="own-recognizance">
                        <AccordionTrigger>What is release on own recognizance (OR)?</AccordionTrigger>
                        <AccordionContent>
                          OR release means you are released without paying bail based on your promise to appear in court. This is typically granted for minor offenses and defendants with no criminal history and strong community ties.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-reduction">
                        <AccordionTrigger>Can I get my bail reduced?</AccordionTrigger>
                        <AccordionContent>
                          Yes, your attorney can file a motion for bail reduction. Factors that help include: strong community ties, steady employment, no prior failures to appear, no flight risk, and no danger to the community.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Defenses Tab */}
              <TabsContent value="defenses" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {defenseStrategies.map((defense, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <defense.icon className="h-5 w-5 text-primary" />
                          {defense.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{defense.description}</p>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Applicable to:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {defense.applicableTo.map((crime, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{crime}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Effectiveness:</span>
                          <Badge variant={defense.effectiveness.includes("High") ? "default" : "outline"}>
                            {defense.effectiveness}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Rights Tab */}
              <TabsContent value="rights" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Your Constitutional Rights
                    </CardTitle>
                    <CardDescription>
                      These rights are guaranteed by the U.S. Constitution and apply in all 50 states
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {constitutionalRights.map((right, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{right.amendment}</Badge>
                            <span className="font-medium">{right.right}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{right.application}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-primary">What to Do If You Are Arrested</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 list-decimal list-inside">
                      <li className="text-sm"><strong>Stay calm and be polite</strong> - Do not resist arrest, even if you believe it is unlawful</li>
                      <li className="text-sm"><strong>Exercise your right to remain silent</strong> - Say clearly: "I am invoking my right to remain silent"</li>
                      <li className="text-sm"><strong>Request an attorney</strong> - Say clearly: "I want to speak to an attorney before answering questions"</li>
                      <li className="text-sm"><strong>Do not consent to searches</strong> - Say: "I do not consent to any searches"</li>
                      <li className="text-sm"><strong>Do not discuss your case</strong> - Do not talk about it on the phone, with cellmates, or anyone except your attorney</li>
                      <li className="text-sm"><strong>Remember details</strong> - Note badge numbers, witness names, and exactly what happened</li>
                      <li className="text-sm"><strong>Contact family</strong> - You have the right to make a phone call</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Get Your Case Analyzed</CardTitle>
                      <CardDescription>
                        Our AI analyzes your case using {selectedState} criminal law
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link to="/case-analysis">
                          <Scale className="mr-2 h-4 w-4" />
                          Start Case Analysis
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Find Court Forms</CardTitle>
                      <CardDescription>
                        Access official {selectedState} court forms for your case
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/forms-library">
                          <FileText className="mr-2 h-4 w-4" />
                          Browse Forms Library
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Need Legal Help?</CardTitle>
                      <CardDescription>
                        Get support from our team
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="secondary" className="w-full">
                        <Link to="/support">
                          Contact Support
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Legal Tools</CardTitle>
                      <CardDescription>
                        Use our AI-powered legal assistance tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="secondary" className="w-full">
                        <Link to="/ai-tools">
                          Explore AI Tools
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Important Disclaimer</p>
                        <p className="text-sm text-yellow-800 mt-1">
                          This information is for educational purposes only and does not constitute legal advice. 
                          Criminal law is complex and varies by jurisdiction. Always consult with a qualified 
                          criminal defense attorney for advice about your specific situation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CriminalDefenseGuide;
