import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const legalAreas = [
  "Family Law / Divorce",
  "Small Claims",
  "Housing / Tenant Rights",
  "Employment",
  "Human Rights",
  "Criminal Defense",
  "CPS / Child Welfare",
];

const MeritScoreCalculator = () => {
  const navigate = useNavigate();
  const [legalArea, setLegalArea] = useState("");
  const [description, setDescription] = useState("");
  const [hasEvidence, setHasEvidence] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);

  const calculateScore = () => {
    setCalculating(true);
    // Simulate calculation
    setTimeout(() => {
      const baseScore = 50;
      const evidenceBonus = hasEvidence === "yes" ? 20 : 0;
      const descriptionBonus = description.length > 100 ? 15 : description.length > 50 ? 10 : 5;
      const randomFactor = Math.floor(Math.random() * 15);
      setScore(Math.min(95, baseScore + evidenceBonus + descriptionBonus + randomFactor));
      setCalculating(false);
    }, 1500);
  };

  const canCalculate = legalArea && description.length > 20 && hasEvidence;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Quick Merit Score Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {score === null ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Legal Area</label>
              <Select value={legalArea} onValueChange={setLegalArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your legal area" />
                </SelectTrigger>
                <SelectContent>
                  {legalAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Briefly describe your case</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What happened? Include key facts and dates..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Do you have evidence?</label>
              <Select value={hasEvidence} onValueChange={setHasEvidence}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, I have documents/photos/witnesses</SelectItem>
                  <SelectItem value="some">Some evidence, but not complete</SelectItem>
                  <SelectItem value="no">No evidence yet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={calculateScore}
              disabled={!canCalculate || calculating}
              className="w-full"
            >
              {calculating ? "Calculating..." : "Get My Merit Score"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(score / 100) * 352} 352`}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{score}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {score >= 70 ? "Strong Case!" : score >= 50 ? "Moderate Potential" : "Needs Work"}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Get a detailed analysis with specific recommendations
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/case-analysis")}>
                Get Full Analysis
              </Button>
              <Button variant="outline" onClick={() => setScore(null)}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeritScoreCalculator;
