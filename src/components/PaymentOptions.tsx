import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Crown } from 'lucide-react';
import { trackAddToCart, trackBeginCheckout, getDetectedCountry } from '@/hooks/useAnalytics';

interface PaymentOptionsProps {
  onPaymentSuccess?: () => void;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({ onPaymentSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscription = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    const country = getDetectedCountry();
    const value = planType === 'monthly' ? 9.99 : 79;
    const itemName = planType === 'monthly' ? 'Monthly Subscription' : 'Annual Subscription';

    // 🔥 GA4 add_to_cart conversion event
    trackAddToCart(itemName, '', country, value);

    setLoading(planType);
    try {
      // 🔥 GA4 begin_checkout event
      trackBeginCheckout(value, country);

      const { data, error } = await supabase.functions.invoke('paypal-payments', {
        body: {
          action: 'create_subscription',
          planType,
          userId: user.id,
          email: user.email,
        },
      });

      if (error) throw error;

      // Redirect to PayPal for approval
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto p-6">
      {/* Monthly Subscription */}
      <Card className="relative">
        <CardHeader className="text-center">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            Monthly Plan
          </CardTitle>
          <CardDescription>Perfect for ongoing legal needs</CardDescription>
          <div className="text-4xl font-bold text-primary">
            $9.99
            <span className="text-lg font-normal text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Unlimited legal consultations</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Document generation & analysis</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Evidence upload & case building</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Priority support & responses</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>California & New York (more states coming soon)</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Multi-language support</span>
            </li>
          </ul>
          <Button 
            className="w-full h-12 text-lg"
            onClick={() => handleSubscription('monthly')}
            disabled={loading === 'monthly'}
          >
            {loading === 'monthly' ? 'Processing...' : 'Start Monthly Plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Yearly Subscription - Best Value */}
      <Card className="relative border-2 border-primary shadow-lg">
        {/* Popular Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 text-sm font-semibold">
            <Crown className="h-4 w-4 mr-1" />
            BEST VALUE - SAVE 34%
          </Badge>
        </div>
        
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-gold-500" />
            Annual Plan
          </CardTitle>
          <CardDescription>Maximum savings for serious users</CardDescription>
          <div className="text-4xl font-bold text-primary">
            $79
            <span className="text-lg font-normal text-muted-foreground">/year</span>
          </div>
          <div className="text-lg text-green-600 font-semibold">
            Save $40.88 compared to monthly!
          </div>
          <div className="text-sm text-muted-foreground">
            That's just $6.58/month
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span><strong>Everything in Monthly Plan</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Advanced legal research tools</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Case precedent analysis</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Legal document templates library</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Premium customer support</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Quarterly legal strategy sessions</span>
            </li>
          </ul>
          <Button 
            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            onClick={() => handleSubscription('yearly')}
            disabled={loading === 'yearly'}
          >
            {loading === 'yearly' ? 'Processing...' : 'Start Annual Plan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};