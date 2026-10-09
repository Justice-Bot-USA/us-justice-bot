import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  AlertTriangle,
  Package,
  ExternalLink,
  Zap,
  Infinity,
  Save
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { trackPurchase, trackUSPurchaseSuccess, trackUSExportCompleted, trackUSSubscribeClicked, getDetectedCountry } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FunnelConfig, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { useFormsPdfGenerator } from '@/hooks/useFormsPdfGenerator';
import type { CourtForm } from '@/lib/forms';
import { invokeAuthed } from '@/lib/supabaseInvoke';
import { generateFoiaLetterPdf } from '@/lib/foiaPdf';
import { PLAN } from '@/lib/pricing';
import { format } from 'date-fns';

interface VerificationResult {
  success: boolean;
  type: 'payment' | 'subscription' | 'bundle';
  accessType?: string;
  caseId?: string;
  forms?: string[];
  planType?: string;
}

interface GeneratedForm {
  id: string;
  name: string;
  formNumber: string;
  blob: Blob;
  url: string;
  category: string;
}


// --- Component ---

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generateForms, generateFormsPackage, downloadPdf, getFormsList } = useFormsPdfGenerator();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [funnelConfig, setFunnelConfig] = useState<FunnelConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableForms, setAvailableForms] = useState<CourtForm[]>([]);
  const [generatedForms, setGeneratedForms] = useState<GeneratedForm[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // FOIA-specific state
  const [foiaLetter, setFoiaLetter] = useState<string | null>(null);
  const [foiaDownloaded, setFoiaDownloaded] = useState(false);

  const sessionId = searchParams.get('session_id');
  const paymentType = searchParams.get('payment') || searchParams.get('subscription');

  const isFoiaPurchase = verificationResult?.accessType === 'foia_single' || verificationResult?.accessType === 'foia_bundle'
    // Subscribed while exporting a records request letter: deliver the letter here too.
    || (verificationResult?.type === 'subscription' && !!foiaLetter);
  const isFoiaBundle = verificationResult?.accessType === 'foia_bundle';

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No payment session found');
        setIsVerifying(false);
        return;
      }

      try {
        // Retrieve stored funnel context
        const storedCaseId = sessionStorage.getItem('pending_case_id');
        const storedConfig = sessionStorage.getItem('pending_funnel_config');
        const storedFoiaLetter = sessionStorage.getItem('pending_foia_letter');
        
        if (storedConfig) {
          try {
            setFunnelConfig(JSON.parse(storedConfig));
          } catch (e) {
            console.error('Failed to parse funnel config:', e);
          }
        }

        if (storedFoiaLetter) {
          setFoiaLetter(storedFoiaLetter);
        }

        // Verify payment with Stripe
        const { data, error: verifyError } = await invokeAuthed('stripe-checkout', {
          body: { action: 'verify_session', sessionId },
        });

        if (verifyError) throw verifyError;

        if (data.success) {
          // Track GA4 purchase event
          const country = getDetectedCountry();
          const isSubscription = data.type === 'subscription';
          const accessType = data.accessType || 'single_form';
          
          if (isSubscription) {
            const amount = PLAN.price;
            trackPurchase(
              data.planType === 'annual' ? 'Annual Subscription' : 'Monthly Subscription',
              funnelConfig?.jurisdiction || '',
              country,
              amount
            );
          } else if (accessType === 'foia_single') {
            trackPurchase('FOIA Single Request', '', country, 9.99);
            trackUSPurchaseSuccess('foia_single', 9.99);
          } else if (accessType === 'foia_bundle') {
            trackPurchase('FOIA Bundle', '', country, 29.99);
            trackUSPurchaseSuccess('foia_bundle', 29.99);
          } else {
            trackPurchase('Case Assessment', funnelConfig?.jurisdiction || '', country, 9.99);
            trackUSPurchaseSuccess('filing_pack', 9.99);
          }

          setVerificationResult({
            success: true,
            type: isSubscription ? 'subscription' : data.type || 'payment',
            accessType,
            caseId: storedCaseId || data.caseId,
            forms: funnelConfig?.forms || [],
            planType: data.planType,
          });

          // Clear stored session data
          sessionStorage.removeItem('pending_case_id');
          sessionStorage.removeItem('pending_funnel_config');

          // Paid for a filled court form: send the user back to download it.
          const fillReturn = sessionStorage.getItem('pending_fill_return');
          if (fillReturn?.startsWith('/fill/')) {
            sessionStorage.removeItem('pending_fill_return');
            toast.success('Payment successful. Your form is ready to download.');
            navigate(fillReturn, { replace: true });
            return;
          }
          // Keep pending_foia_letter until download

          toast.success(isSubscription ? 'Subscription Activated!' : 'Payment Successful!');
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, user]);

  // Load available forms when funnel config is set (non-FOIA only)
  useEffect(() => {
    if (funnelConfig && !isFoiaPurchase) {
      const forms = getFormsList(funnelConfig.jurisdiction, funnelConfig.legalArea);
      setAvailableForms(forms);
    }
  }, [funnelConfig, getFormsList, isFoiaPurchase]);

  // --- FOIA Download Handler ---
  const handleDownloadFoia = useCallback(() => {
    if (!foiaLetter) {
      toast.error('No FOIA letter found. Please contact support.');
      return;
    }

    const blob = generateFoiaLetterPdf(foiaLetter, isFoiaBundle);
    const filename = isFoiaBundle
      ? `Public-Records-Request-Bundle-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      : `Public-Records-Request-${format(new Date(), 'yyyy-MM-dd')}.pdf`;

    downloadPdf(blob, filename);
    setFoiaDownloaded(true);
    sessionStorage.removeItem('pending_foia_letter');
    trackUSExportCompleted('pdf', isFoiaBundle ? 3 : 1);
    toast.success('PDF downloaded!');
  }, [foiaLetter, isFoiaBundle, downloadPdf]);

  // --- Court Forms Handlers (existing) ---
  const handleGenerateForms = useCallback(async () => {
    if (!funnelConfig) {
      toast.error('No case configuration found');
      return;
    }

    setIsGenerating(true);
    try {
      const forms = generateForms({
        state: funnelConfig.jurisdiction,
        legalArea: funnelConfig.legalArea,
        caseTitle: funnelConfig.forms?.[0] || `${LEGAL_AREA_NAMES[funnelConfig.legalArea]} Case`,
      });
      
      setGeneratedForms(forms);
      setHasGenerated(true);
      toast.success(`Generated ${forms.length} court forms`);
    } catch (err) {
      console.error('Form generation error:', err);
      toast.error('Failed to generate forms. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [funnelConfig, generateForms]);

  const handleDownloadSingleForm = (form: GeneratedForm) => {
    const filename = `${form.formNumber.replace(/[^a-zA-Z0-9]/g, '-')}-${form.name.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    downloadPdf(form.blob, filename);
    trackUSExportCompleted('pdf', 1);
    toast.success(`Downloaded ${form.formNumber}`);
  };

  const handleDownloadAllForms = () => {
    if (!funnelConfig) return;
    
    const { blob } = generateFormsPackage({
      state: funnelConfig.jurisdiction,
      legalArea: funnelConfig.legalArea,
      caseTitle: funnelConfig.forms?.[0] || `${LEGAL_AREA_NAMES[funnelConfig.legalArea]} Case`,
    });

    const filename = `Court-Forms-Package-${funnelConfig.jurisdiction}-${funnelConfig.legalArea}.pdf`;
    downloadPdf(blob, filename);
    trackUSExportCompleted('pdf', generatedForms.length);
    toast.success('Downloaded complete forms package');
  };

  const stateName = funnelConfig ? US_STATE_NAMES[funnelConfig.jurisdiction] : '';
  const legalAreaName = funnelConfig ? LEGAL_AREA_NAMES[funnelConfig.legalArea] : '';

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifying Your Payment</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your purchase...
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Payment Issue</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/support')}>
                  Contact Support
                </Button>
                <Button onClick={() => navigate('/my-cases')}>
                  Go to My Cases
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  return (
    <>
      <Helmet>
        <title>Payment Successful | Justice Bot USA</title>
        <meta name="description" content="Your payment was successful. Access your legal forms and filing instructions." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background">
        <Header language={language} onLanguageChange={setLanguage} />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {verificationResult?.type === 'subscription' 
                ? 'Your subscription is now active. You have unlimited access to all features.'
                : isFoiaPurchase
                  ? 'Your public records request is ready for download.'
                  : 'Your case package is now unlocked. Download your forms and start filing today.'}
            </p>
          </div>

          {/* FOIA Delivery Section */}
          {isFoiaPurchase && (
            <>
              {/* FOIA Package Summary */}
              <Card className="max-w-2xl mx-auto mb-8 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {isFoiaBundle ? 'Public Records Request Bundle' : 'Public Records Request Letter'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">
                        {isFoiaBundle ? 'Request + Follow-Up + Appeal' : 'Single Request Letter (PDF)'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {verificationResult?.type === 'subscription' ? `Included in ${PLAN.name}` : isFoiaBundle ? 'Bundle' : 'Single export'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                    </Badge>
                  </div>

                  {/* Contents list */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg">
                      <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded">
                        <FileText className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Public Records Request Letter</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                    {isFoiaBundle && (
                      <>
                        <div className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
                            <FileText className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Follow-Up Letter Template</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                        </div>
                        <div className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg">
                          <div className="p-1.5 bg-amber-100 dark:bg-amber-900 rounded">
                            <FileText className="h-3.5 w-3.5 text-amber-600" />
                          </div>
                          <span className="text-sm font-medium">Appeal Letter Template</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Download Button */}
                  {foiaLetter ? (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleDownloadFoia}
                      disabled={foiaDownloaded}
                    >
                      {foiaDownloaded ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Downloaded — Check your downloads folder
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download {isFoiaBundle ? 'Bundle' : 'Request Letter'} (PDF)
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 mx-auto text-yellow-500 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Your letter couldn't be retrieved from this browser session. 
                        Please <Button variant="link" className="h-auto p-0" onClick={() => navigate('/support')}>contact support</Button> with your payment confirmation for assistance.
                      </p>
                    </div>
                  )}

                  {foiaDownloaded && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        setFoiaDownloaded(false);
                        // Re-read from state (still available until navigated away)
                      }}
                    >
                      Download Again
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* FOIA What's Next */}
              <Card className="max-w-2xl mx-auto mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    What's Next
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${foiaDownloaded ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                        {foiaDownloaded ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                      </span>
                      <div>
                        <p className="font-medium">Download Your PDF</p>
                        <p className="text-sm text-muted-foreground">
                          {foiaDownloaded ? 'Done! Your PDF has been downloaded.' : 'Click the download button above.'}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Fill In Your Details</p>
                        <p className="text-sm text-muted-foreground">
                          Replace the placeholder fields ([Your Name], [Date], etc.) with your actual information.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Submit to the Agency</p>
                        <p className="text-sm text-muted-foreground">
                          Mail or email the completed request to the appropriate records custodian. Keep a copy for your records.
                        </p>
                      </div>
                    </li>
                    {isFoiaBundle && (
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          4
                        </span>
                        <div>
                          <p className="font-medium">Follow Up If Needed</p>
                          <p className="text-sm text-muted-foreground">
                            Use the follow-up and appeal templates if the agency doesn't respond within the required time frame.
                          </p>
                        </div>
                      </li>
                    )}
                  </ol>
                </CardContent>
              </Card>
            </>
          )}

          {/* ---- Non-FOIA: Court Forms Delivery (existing logic) ---- */}
          {!isFoiaPurchase && (
            <>
              {/* Case Summary */}
              {funnelConfig && (
                <Card className="max-w-2xl mx-auto mb-8 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Your Case Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{legalAreaName} Case</p>
                        <p className="text-sm text-muted-foreground">{stateName}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Unlocked
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Forms Ready to Download */}
              <Card className="max-w-2xl mx-auto mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {hasGenerated ? 'Your Generated Forms' : 'Forms Available for Your Case'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasGenerated ? (
                    <>
                      <div className="space-y-3 mb-6">
                        {availableForms.slice(0, 6).map((form, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium block">{form.formNumber}</span>
                                <span className="text-sm text-muted-foreground">{form.name}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              Available
                            </Badge>
                          </div>
                        ))}
                        {availableForms.length > 6 && (
                          <p className="text-sm text-muted-foreground text-center">
                            + {availableForms.length - 6} more forms available
                          </p>
                        )}
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={handleGenerateForms}
                        disabled={isGenerating || !funnelConfig}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Forms...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Court Forms Package
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {generatedForms.map((form) => (
                          <div key={form.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FileText className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <span className="font-medium block">{form.formNumber}</span>
                                <span className="text-sm text-muted-foreground line-clamp-1">{form.name}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadSingleForm(form)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          size="lg" 
                          className="flex-1"
                          onClick={handleDownloadAllForms}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Download All Forms (Package)
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate('/forms-library')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Browse Forms Library
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* What's Next */}
              <Card className="max-w-2xl mx-auto mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    What's Next
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${hasGenerated ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                        {hasGenerated ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                      </span>
                      <div>
                        <p className="font-medium">Generate Your Forms</p>
                        <p className="text-sm text-muted-foreground">
                          {hasGenerated 
                            ? 'Forms generated! Download them individually or as a package.'
                            : 'Click the button above to generate your court forms.'}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Download Official Forms</p>
                        <p className="text-sm text-muted-foreground">
                          Use the links in each PDF to get the official court forms from your state.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Fill, Sign & File</p>
                        <p className="text-sm text-muted-foreground">
                          Complete the forms, make copies, and file at your local courthouse.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </>
          )}

          {/* Subscription Upsell — shown after export (both FOIA and court forms) */}
          {(hasGenerated || foiaDownloaded) && verificationResult?.type !== 'subscription' && (
            <Card className="max-w-2xl mx-auto mb-8 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">Save time next time</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Unlimited exports, saved cases, and priority form updates — all for one monthly price.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-5">
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <Infinity className="h-4 w-4 text-primary" /> Unlimited exports
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <Save className="h-4 w-4 text-primary" /> Saved cases
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" /> Priority updates
                      </span>
                    </div>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={async () => {
                        trackUSSubscribeClicked('monthly', 'post_export_upsell');
                        try {
                          const { data, error } = await invokeAuthed('stripe-checkout', {
                            body: { action: 'create_subscription' },
                          });
                          if (error) throw error;
                          if (data?.url) window.location.href = data.url;
                        } catch (err) {
                          console.error('Subscription checkout error:', err);
                          toast.error('Failed to start checkout. Please try again.');
                        }
                      }}
                    >
                      {PLAN.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Cancel anytime. No commitment.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trust Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>30-day money-back guarantee if you're not satisfied</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PaymentSuccess;
