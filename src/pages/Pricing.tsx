import { useState, useEffect } from 'react';
import { signInPath } from '@/lib/signIn';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, CreditCard, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { PLAN, THIRD_PARTY_FEES_NOTE } from '@/lib/pricing';
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
            trackPurchase(PLAN.name, '', country, PLAN.price, 'justice_bot_usa_access_25');
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
      navigate(signInPath());
      return;
    }

    const key = planType || action;
    setLoading(key);
    
    const country = getDetectedCountry();
    const valueMap: Record<string, number> = { monthly: PLAN.price, bundle: 49.99, form: 9.99 };
    const nameMap: Record<string, string> = { monthly: PLAN.name, bundle: 'Case Preparation Bundle', form: 'Prepared Legal Form' };
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
            Official court forms, plain-language guidance, and step-by-step filing instructions. Live in California and New York; the other 48 states are coming soon.
          </p>
          {isAdmin && (
            <Badge className="mt-4" variant="secondary">
              <Shield className="w-4 h-4 mr-2" />
              Admin - Full Access
            </Badge>
          )}
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative border-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle>{PLAN.name}</CardTitle>
              </div>
              <CardDescription>One plan. Unlimited use. Cancel anytime.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${PLAN.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {[
                  'Official California and New York court forms, filled from your answers',
                  'Unlimited form guides and filing checklists',
                  'Unlimited public records (FOIA) request letters',
                  'Saved cases, document uploads, and re-downloads',
                  'State-verified guidance for California and New York',
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleCheckout('create_subscription', 'monthly')}
                disabled={loading === 'monthly' || isAdmin || hasActiveSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : hasActiveSubscription ? 'Current Plan' : loading === 'monthly' ? 'Processing...' : PLAN.cta}
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
          <p className="text-sm text-muted-foreground">Cancel anytime.</p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{THIRD_PARTY_FEES_NOTE}</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
