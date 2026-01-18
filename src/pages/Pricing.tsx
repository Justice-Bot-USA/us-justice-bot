import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
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
        const { data, error } = await supabase.functions.invoke('stripe-checkout', {
          body: { action: 'verify_session', sessionId },
        });
        
        if (error) throw error;
        
        if (data.success) {
          if (data.type === 'subscription') {
            trackPurchase(
              data.planType === 'annual' ? 'Annual Subscription' : 'Monthly Subscription',
              '',
              getDetectedCountry(),
              data.planType === 'annual' ? 79.99 : 9.99
            );
            toast({
              title: 'Subscription Activated!',
              description: 'Thank you for subscribing. You now have full access.',
            });
          } else {
            trackPurchase('Case Assessment', '', getDetectedCountry(), 4.99);
            toast({
              title: 'Payment Successful!',
              description: 'Thank you for your purchase. Access unlocked!',
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

  const handleSubscription = async (planType: 'monthly' | 'annual') => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setLoading(planType);
    
    const country = getDetectedCountry();
    const value = planType === 'annual' ? 79.99 : 9.99;
    const itemName = planType === 'annual' ? 'Annual Subscription' : 'Monthly Subscription';
    
    trackAddToCart(itemName, '', country, value);
    
    try {
      trackBeginCheckout(value, country);
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { action: 'create_subscription', planType },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: error instanceof Error ? error.message : 'Failed to create subscription',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFormPayment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setLoading('form');
    
    const country = getDetectedCountry();
    trackAddToCart('Case Assessment', '', country, 4.99);
    
    try {
      trackBeginCheckout(4.99, country);
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { action: 'create_one_time_payment', formType: 'general' },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to create payment',
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
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Affordable legal assistance for everyone
          </p>
          {isAdmin && (
            <Badge className="mt-4" variant="secondary">
              <Shield className="w-4 h-4 mr-2" />
              Admin - Full Access
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Pay Per Form */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Pay Per Form</CardTitle>
              <CardDescription>One-time payment for single form</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-muted-foreground">/form</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Access to one legal form analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>AI-powered case evaluation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>State-specific guidance</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Document generation</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                onClick={handleFormPayment}
                disabled={loading === 'form' || isAdmin}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : loading === 'form' ? 'Processing...' : 'Purchase Form'}
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Subscription */}
          <Card className="relative border-primary">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Popular
            </Badge>
            <CardHeader>
              <CardTitle>Monthly Plan</CardTitle>
              <CardDescription>Unlimited access, billed monthly</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Unlimited form access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>All 50 states coverage</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Advanced case analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Document storage</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handleSubscription('monthly')}
                disabled={loading === 'monthly' || isAdmin || hasActiveSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : hasActiveSubscription ? 'Current Plan' : loading === 'monthly' ? 'Processing...' : 'Subscribe Monthly'}
              </Button>
            </CardContent>
          </Card>

          {/* Annual Subscription */}
          <Card className="relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="secondary">
              Best Value
            </Badge>
            <CardHeader>
              <CardTitle>Annual Plan</CardTitle>
              <CardDescription>Save $40.88 per year</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Just $6.58/month
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Everything in Monthly</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>34% discount vs monthly</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Priority case reviews</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Extended document storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => handleSubscription('annual')}
                disabled={loading === 'annual' || isAdmin || hasActiveSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Free Access' : hasActiveSubscription ? 'Current Plan' : loading === 'annual' ? 'Processing...' : 'Subscribe Annually'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-4 h-4" />
            <span>Secure payments powered by Stripe</span>
          </div>
          <p>Cancel anytime • No hidden fees • 100% satisfaction guaranteed</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
