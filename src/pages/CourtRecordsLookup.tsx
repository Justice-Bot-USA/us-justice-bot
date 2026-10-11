import React from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Gavel, AlertTriangle, Info, MapPin, Scale } from "lucide-react";

// Links to official court record sites only. We don't search, scrape, or store
// court records (the old in-app search was retired in Oct 2026). Every URL here
// was checked to load before it was added.
interface CourtPortal {
  name: string;
  url: string;
  description: string;
}

const CALIFORNIA_PORTALS: CourtPortal[] = [
  {
    name: "Find Your Court",
    url: "https://courts.ca.gov/find-my-court",
    description:
      "Enter a ZIP code or city to find your local superior court. Case lookup is run by each county's superior court on its own website.",
  },
  {
    name: "All California Superior Courts",
    url: "https://courts.ca.gov/courts/superior-courts",
    description:
      "California has 58 superior (trial) courts, one in each county. Use the list to reach your county court's website.",
  },
];

const NEW_YORK_PORTALS: CourtPortal[] = [
  {
    name: "WebCivil Supreme",
    url: "https://iapps.courts.state.ny.us/webcivil/FCASMain",
    description:
      "Case information for New York State Supreme Court civil cases. Search by index number, party name, attorney, or justice.",
  },
  {
    name: "WebCivil Local",
    url: "https://iapps.courts.state.ny.us/webcivilLocal/LCMain",
    description:
      "Case information for New York State local civil courts. Search by index number, party name, attorney, or judge. The site lists which courts it covers.",
  },
  {
    name: "eCourts",
    url: "https://iapps.courts.state.ny.us/webcivil/ecourtsMain",
    description:
      "The New York courts' eCourts home page, with links to WebCivil, WebCriminal, WebFamily, and eTrack case tracking.",
  },
];

function PortalList({ portals }: { portals: CourtPortal[] }) {
  return (
    <div className="space-y-3">
      {portals.map((portal) => (
        <div key={portal.url} className="p-4 rounded-lg border">
          <h3 className="font-semibold mb-1">{portal.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{portal.description}</p>
          <Button variant="outline" size="sm" asChild>
            <a href={portal.url} target="_blank" rel="noopener noreferrer">
              Open official site <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function CourtRecordsLookup() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Court Records Lookup - Official California & New York Court Sites | Justice Bot USA"
        description="Links to official court record websites for California and New York. Justice Bot USA does not search or store court records."
        keywords="court records, case lookup, California superior court, New York WebCivil, eCourts"
        url="https://justicebot-usa.com/court-records"
      />

      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Gavel className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Court Records Lookup</h1>
              <p className="text-primary-foreground/80">
                Official court websites for looking up a case in California and New York
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* What this page is */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">We don't search or store court records</p>
                <p>
                  The links below go straight to official court websites, which the courts run. Justice Bot USA
                  isn't connected to any court, doesn't see what you search for there, and doesn't keep copies of
                  court records. Each court site has its own terms of use.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="mb-8 border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-destructive mb-1">Not every record is online</p>
                <p className="text-muted-foreground">
                  Many records, especially <strong>family, juvenile, child welfare, and sealed cases</strong>, are not
                  publicly available online. If you are a party to a case, contact the court clerk with your case or
                  index number. Some courts charge their own fees for copies of documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                California
              </CardTitle>
              <CardDescription>Judicial Branch of California</CardDescription>
            </CardHeader>
            <CardContent>
              <PortalList portals={CALIFORNIA_PORTALS} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                New York
              </CardTitle>
              <CardDescription>New York State Unified Court System</CardDescription>
            </CardHeader>
            <CardContent>
              <PortalList portals={NEW_YORK_PORTALS} />
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Other states are coming soon.
        </p>

        {/* Help Links */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/ca/legal-center">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Scale className="h-6 w-6" />
                  <span className="font-medium">California Legal Center</span>
                  <span className="text-xs text-muted-foreground">Guides and court forms</span>
                </Button>
              </Link>
              <Link to="/ny/legal-center">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Scale className="h-6 w-6" />
                  <span className="font-medium">New York Legal Center</span>
                  <span className="text-xs text-muted-foreground">Guides and court forms</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Legal information, not legal advice. Justice Bot USA is not a law firm and is not part of any court.
        </p>
      </main>
    </div>
  );
}
