import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, hasActiveSubscription } = usePaywallAccess();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

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
    
    try {
      const { data, error } = await supabase.functions.invoke('paypal-payments', {
        body: {
          action: 'create_subscription',
          planType,
          userId: user.id,
          email: user.email,
        },
      });

      if (error) throw error;

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received');
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
    
    try {
      const { data, error } = await supabase.functions.invoke('paypal-payments', {
        body: {
          action: 'create_one_time_payment',
          userId: user.id,
          formType: 'general',
        },
      });

      if (error) throw error;

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received');
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
                <span className="text-4xl font-bold">$5.99</span>
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
                <span className="text-4xl font-bold">$19.99</span>
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
              <CardDescription>Save $140.88 per year</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Just $8.25/month
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
                  <span>59% discount vs monthly</span>
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
                {isAdmin ? 'Free Access' : hasActiveSubscription ? 'Current Plan' : loading === 'annual' ? 'Processing...' : 'Subscribe Annually'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All payments are securely processed through PayPal</p>
          <p className="mt-2">Cancel anytime • No hidden fees • 100% satisfaction guaranteed</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
