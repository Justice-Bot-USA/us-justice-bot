import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Home, 
  Briefcase, 
  Users, 
  Scale, 
  Shield, 
  FileText,
  AlertTriangle,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trackFunnelEvent, generateSessionId } from "@/lib/funnels/analytics";
import { setDetectedCountry as setAnalyticsCountry } from "@/hooks/useAnalytics";

// ============ GEO DETECTION ============

const useGeoDetection = () => {
  const [detectedCountry, setDetectedCountry] = useState<"US" | "CA" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'CA') {
          setDetectedCountry('CA');
          setAnalyticsCountry('CA');
        } else if (data.country_code === 'US') {
          setDetectedCountry('US');
          setAnalyticsCountry('US');
        }
      } catch (error) {
        console.log('Geo detection failed, user will select manually');
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { detectedCountry, isLoading };
};

// ============ CONFIGURATION ============

const CANADIAN_PROVINCES = [
  { label: "Ontario", value: "ON" },
  { label: "British Columbia", value: "BC" },
  { label: "Alberta", value: "AB" },
  { label: "Quebec", value: "QC" },
  { label: "Other", value: "OTHER_CA" },
];

const US_STATES = [
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "New York", value: "NY" },
  { label: "Florida", value: "FL" },
  { label: "Other", value: "OTHER_US" },
];

const LEGAL_AREAS = [
  { id: "housing", label: "Housing / Eviction", icon: Home },
  { id: "family", label: "Family / Custody", icon: Users },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "discrimination", label: "Discrimination / Human Rights", icon: Shield },
  { id: "other", label: "Other civil issue", icon: Scale },
];

// ============ TYPES ============

interface EntryFlowState {
  country: "CA" | "US" | null;
  jurisdiction: string;
  legalArea: string;
}

interface UnifiedEntryFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============ ANALYTICS HELPERS ============

const trackEntryEvent = async (
  eventName: string, 
  data: Record<string, unknown>
) => {
  const sessionId = generateSessionId();
  
  // Log to console
  console.log(`[Entry Flow] ${eventName}`, data);
  
  // Track in GA if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: 'entry_flow',
      ...data,
    });
  }
  
  // Track in funnel analytics
  await trackFunnelEvent('entry_flow', 'triage', 'complete', {
    event: eventName,
    session_id: sessionId,
    ...data,
  });
};

// ============ COMPONENT ============

const UnifiedEntryFlow = ({ isOpen, onClose }: UnifiedEntryFlowProps) => {
  const navigate = useNavigate();
  const { detectedCountry, isLoading: geoLoading } = useGeoDetection();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<EntryFlowState>({
    country: null,
    jurisdiction: "",
    legalArea: "",
  });

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  // Track funnel_start when modal opens
  useEffect(() => {
    if (isOpen && step === 0) {
      trackEntryEvent('funnel_start', { 
        timestamp: Date.now(),
        detected_country: detectedCountry 
      });
    }
  }, [isOpen, detectedCountry]);

  // ============ HANDLERS ============

  const handleCountrySelect = (country: "CA" | "US") => {
    setState(prev => ({ ...prev, country }));
    // Store selected country for GA4 funnel tracking
    setAnalyticsCountry(country);
    trackEntryEvent('country_selected', { country });
    setStep(1);
  };

  const handleJurisdictionSelect = (jurisdiction: string) => {
    setState(prev => ({ ...prev, jurisdiction }));
    trackEntryEvent('jurisdiction_selected', { 
      country: state.country, 
      jurisdiction 
    });
    setStep(2);
  };

  const handleLegalAreaSelect = (legalArea: string) => {
    setState(prev => ({ ...prev, legalArea }));
    trackEntryEvent('legal_area_selected', { 
      country: state.country, 
      jurisdiction: state.jurisdiction,
      legalArea 
    });
    setStep(3);
  };

  const handleContinue = () => {
    trackEntryEvent('funnel_confidence_view', { 
      country: state.country,
      jurisdiction: state.jurisdiction,
      legalArea: state.legalArea,
    });
    
    // Navigate to the appropriate funnel
    const params = new URLSearchParams({
      country: state.country || '',
      jurisdiction: state.jurisdiction,
      area: state.legalArea,
    });
    
    onClose();
    navigate(`/case-analysis?${params.toString()}`);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // ============ RENDER HELPERS ============

  const getJurisdictionLabel = () => {
    if (state.country === "CA") {
      return CANADIAN_PROVINCES.find(p => p.value === state.jurisdiction)?.label || state.jurisdiction;
    }
    return US_STATES.find(s => s.value === state.jurisdiction)?.label || state.jurisdiction;
  };

  const getLegalAreaLabel = () => {
    return LEGAL_AREAS.find(a => a.id === state.legalArea)?.label || state.legalArea;
  };

  const getConfidenceContent = () => {
    const isCanada = state.country === "CA";
    const jurisdiction = getJurisdictionLabel();
    const legalArea = getLegalAreaLabel().toLowerCase();

    return {
      title: `You're in the right place for ${jurisdiction} ${legalArea} issues.`,
      bullets: isCanada ? [
        "Identify the correct tribunal forms",
        "Organize evidence properly",
        "Understand what happens next",
      ] : [
        "Find the correct court forms",
        "Prepare your case properly",
        "Know what to file and when",
      ],
    };
  };

  // ============ RENDER ============

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header with Progress */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {totalSteps}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* STEP 0: Country Selection */}
            {step === 0 && (
              <motion.div
                key="country"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Where is your legal issue?</h2>
                </div>

                {geoLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Detecting your location...</span>
                  </div>
                ) : detectedCountry ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      We detected you're in {detectedCountry === 'CA' ? 'Canada' : 'the United States'}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={detectedCountry === "CA" ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleCountrySelect("CA")}
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all text-lg ${
                          detectedCountry === "CA" 
                            ? "ring-2 ring-primary ring-offset-2" 
                            : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        }`}
                      >
                        <span className="text-3xl">🇨🇦</span>
                        <span>Canada</span>
                        {detectedCountry === "CA" && <span className="text-xs opacity-80">(Detected)</span>}
                      </Button>
                      <Button
                        variant={detectedCountry === "US" ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleCountrySelect("US")}
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all text-lg ${
                          detectedCountry === "US" 
                            ? "ring-2 ring-primary ring-offset-2" 
                            : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        }`}
                      >
                        <span className="text-3xl">🇺🇸</span>
                        <span>United States</span>
                        {detectedCountry === "US" && <span className="text-xs opacity-80">(Detected)</span>}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleCountrySelect("CA")}
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-lg"
                    >
                      <span className="text-3xl">🇨🇦</span>
                      <span>Canada</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleCountrySelect("US")}
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-lg"
                    >
                      <span className="text-3xl">🇺🇸</span>
                      <span>United States</span>
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 1: Jurisdiction Selection */}
            {step === 1 && (
              <motion.div
                key="jurisdiction"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {state.country === "CA" ? "Which province or territory?" : "Which state?"}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {(state.country === "CA" ? CANADIAN_PROVINCES : US_STATES).map((item) => (
                    <Button
                      key={item.value}
                      variant="outline"
                      size="lg"
                      onClick={() => handleJurisdictionSelect(item.value)}
                      className="h-14 text-base font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="mt-4 text-muted-foreground"
                >
                  ← Back
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Legal Area Selection */}
            {step === 2 && (
              <motion.div
                key="legal-area"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Scale className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">What's this about?</h2>
                </div>
                
                <div className="space-y-3">
                  {LEGAL_AREAS.map((area) => {
                    const Icon = area.icon;
                    return (
                      <Button
                        key={area.id}
                        variant="outline"
                        size="lg"
                        onClick={() => handleLegalAreaSelect(area.id)}
                        className="w-full h-14 justify-start text-base font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {area.label}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="mt-4 text-muted-foreground"
                >
                  ← Back
                </Button>
              </motion.div>
            )}

            {/* STEP 3: Confidence Lock */}
            {step === 3 && (
              <motion.div
                key="confidence"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {getConfidenceContent().title}
                  </h2>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="font-medium mb-3">We'll help you:</p>
                  <ul className="space-y-2">
                    {getConfidenceContent().bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  size="lg"
                  onClick={handleContinue}
                  className="w-full h-14 text-lg"
                >
                  Continue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="mt-4 text-muted-foreground w-full"
                >
                  ← Back
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedEntryFlow;
