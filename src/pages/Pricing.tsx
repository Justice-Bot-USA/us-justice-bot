import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, CreditCard, FileText, Layers, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { invokeAuthed } from '@/lib/supabaseInvoke';
import { 
  trackPurchase, 
  trackAddToCart, 
  trackBeginCheckout, 
  getDetectedCountry 
} from '@/hooks/useAnalytics';

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isAdmin, hasActiveSubscription, refreshAccess } = usePaywallAccess();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Handle payment return URLs
  useEffect(() => {
    const subscription = searchParams.get('subscription');
    const payment = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    const verifyAndComplete = async () => {
      if (!user || !sessionId) return;
      
      try {
        const { data, error } = await invokeAuthed('stripe-checkout', {
          body: { action: 'verify_session', sessionId },
        });
        
        if (error) throw error;
        
        if (data.success) {
          const country = getDetectedCountry();
          if (data.type === 'subscription') {
            trackPurchase('Justice Tools Access', '', country, 19.99, 'justice_tools_19.99');
            toast({
              title: 'Subscription Activated!',
              description: 'Thank you for subscribing. You now have full access.',
            });
          } else if (data.type === 'bundle') {
            trackPurchase('Case Preparation Bundle', '', country, 49.99, 'case_bundle_49.99');
            toast({
              title: 'Bundle Unlocked!',
              description: 'Your Case Preparation Bundle is ready.',
            });
          } else {
            trackPurchase('Prepared Legal Form', '', country, 9.99, 'filing_pack_9.99');
            toast({
              title: 'Payment Successful!',
              description: 'Your form pack is ready to download.',
            });
          }
          
          refreshAccess();
          
          const pendingCaseId = sessionStorage.getItem('pending_case_id');
          if (pendingCaseId) {
            sessionStorage.removeItem('pending_case_id');
            navigate(`/case-journey?caseId=${pendingCaseId}`, { replace: true });
          } else {
            navigate(data.type === 'subscription' ? '/case-analysis' : '/my-cases', { replace: true });
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    };

    if ((subscription === 'success' || payment === 'success') && sessionId) {
      verifyAndComplete();
    } else if (subscription === 'cancelled' || payment === 'cancelled') {
      toast({
        title: 'Payment Cancelled',
        description: 'Your payment was not completed.',
        variant: 'destructive',
      });
      navigate('/pricing', { replace: true });
    }
  }, [searchParams, user, toast, navigate, refreshAccess]);

  const handleCheckout = async (action: string, planType?: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to continue',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    const key = planType || action;
    setLoading(key);
    
    const country = getDetectedCountry();
    const valueMap: Record<string, number> = { monthly: 19.99, bundle: 49.99, form: 9.99 };
    const nameMap: Record<string, string> = { monthly: 'Justice Tools Access', bundle: 'Case Preparation Bundle', form: 'Prepared Legal Form' };
    const value = valueMap[key] || 9.99;
    const itemName = nameMap[key] || 'Prepared Legal Form';
    
    trackAddToCart(itemName, '', country, value);
    
    try {
      trackBeginCheckout(value, country);
      
      const { data, error } = await invokeAuthed('stripe-checkout', {
        body: { action, planType },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to create checkout session',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Prepare Your Official Filing — No Lawyer Required</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access official court forms, plain-language guidance, and step-by-step filing instructions for all 50 states.
          </p>
          {isAdmin && (
            <Badge className="mt-4" variant="secondary">
              <Shield className="w-4 h-4 mr-2" />
              Admin - Full Access
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Tier 1: Single Form */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>Prepared Filing Pack</CardTitle>
              </div>
              <CardDescription>One form or document pack — no subscription required</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Correct official form(s) for your state</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Plain-language guidance</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Autofill assistance</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Filing checklist &amp; instructions</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleCheckout('create_one_time_payment', 'form')}
                disabled={loading === 'form' || isAdmin}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : loading === 'form' ? 'Processing...' : 'Prepare My Forms — $9.99'}
              </Button>
            </CardContent>
          </Card>

          {/* Tier 2: Monthly Subscription */}
          <Card className="relative border-primary shadow-lg scale-105">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle>Justice Tools Access</CardTitle>
              </div>
              <CardDescription>Unlimited access — cancel anytime</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited form preparation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited record lookups</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Saved cases &amp; document uploads</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Progress tracking &amp; re-downloads</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>All 50 states coverage</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handleCheckout('create_subscription', 'monthly')}
                disabled={loading === 'monthly' || isAdmin || hasActiveSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : hasActiveSubscription ? 'Current Plan' : loading === 'monthly' ? 'Processing...' : 'Subscribe — $19.99/mo'}
              </Button>
            </CardContent>
          </Card>

          {/* Tier 3: Case Builder Bundle */}
          <Card className="relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="secondary">
              High Intent
            </Badge>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-primary" />
                <CardTitle>Case Preparation Bundle</CardTitle>
              </div>
              <CardDescription>Multiple forms + evidence organization</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$49.99</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Complete multi-form filing package</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Evidence organization tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Family court, small claims, protection orders</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Step-by-step filing guidance</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Immigration &amp; employment packets</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => handleCheckout('create_bundle_payment', 'bundle')}
                disabled={loading === 'bundle' || isAdmin}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : loading === 'bundle' ? 'Processing...' : 'Get Bundle — $49.99'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center space-y-3">
          <p className="text-sm text-muted-foreground italic">
            This is legal information, not legal advice. No lawyer fees. No legal advice.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span>Secure payments powered by Stripe</span>
          </div>
          <p className="text-sm text-muted-foreground">Cancel anytime • No hidden fees • 30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
