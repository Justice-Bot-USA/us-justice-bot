import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

interface CourtResult {
  name: string;
  address: string;
  phone: string;
  hours: string;
  filingInfo: string;
  website: string;
}

const CourtLocator = () => {
  const [zipCode, setZipCode] = useState("");
  const [courtType, setCourtType] = useState("");
  const [result, setResult] = useState<CourtResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!zipCode) return;
    
    setIsSearching(true);
    
    // Simulate search - in production this would call an API
    setTimeout(() => {
      setResult({
        name: "Superior Court of California, County of Los Angeles",
        address: "111 N Hill St, Los Angeles, CA 90012",
        phone: "(213) 830-0800",
        hours: "Mon-Fri: 8:30 AM - 4:30 PM",
        filingInfo: "Self-help center available. Filing fees: $75-$435 depending on case type.",
        website: "https://www.lacourt.org",
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Location Services</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Court & Tribunal Locator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the right courthouse by ZIP code with filing details and contact information
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Find Your Local Court
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-1"
                maxLength={5}
              />
              <Button onClick={handleSearch} disabled={!zipCode || isSearching}>
                {isSearching ? "Searching..." : "Find Courts"}
              </Button>
            </div>

            {result && (
              <div className="p-4 bg-background rounded-lg border space-y-3">
                <h3 className="font-semibold text-lg">{result.name}</h3>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>{result.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{result.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{result.hours}</span>
                </div>
                
                <p className="text-sm text-muted-foreground">{result.filingInfo}</p>
                
                <Button variant="outline" size="sm" asChild>
                  <a href={result.website} target="_blank" rel="noopener noreferrer">
                    Visit Court Website <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CourtLocator;
