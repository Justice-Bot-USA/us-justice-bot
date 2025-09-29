import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, Star } from 'lucide-react';

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

  const handleOneTimePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setLoading('one-time');
    try {
      const { data, error } = await supabase.functions.invoke('paypal-payments', {
        body: {
          action: 'create_one_time_payment',
          userId: user.id,
          formType: 'legal-form',
        },
      });

      if (error) throw error;

      // Redirect to PayPal for approval
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto p-6">
      {/* Monthly Subscription */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Plan</CardTitle>
          <CardDescription>Perfect for regular users</CardDescription>
          <div className="text-3xl font-bold">
            $79.99
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Unlimited legal consultations</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">All legal sections access</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Priority support</span>
            </li>
          </ul>
          <Button 
            className="w-full" 
            onClick={() => handleSubscription('monthly')}
            disabled={loading === 'monthly'}
          >
            {loading === 'monthly' ? 'Processing...' : 'Subscribe Monthly'}
          </Button>
        </CardContent>
      </Card>

      {/* Yearly Subscription - Most Popular */}
      <Card className="relative border-primary">
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
          <Star className="h-3 w-3 mr-1" />
          Most Popular
        </Badge>
        <CardHeader>
          <CardTitle className="text-lg">Yearly Plan</CardTitle>
          <CardDescription>Best value for committed users</CardDescription>
          <div className="text-3xl font-bold">
            $499.99
            <span className="text-sm font-normal text-muted-foreground">/year</span>
          </div>
          <div className="text-sm text-green-600">Save $459.89 vs monthly!</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Unlimited legal consultations</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">All legal sections access</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Priority support</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Annual legal review session</span>
            </li>
          </ul>
          <Button 
            className="w-full" 
            onClick={() => handleSubscription('yearly')}
            disabled={loading === 'yearly'}
          >
            {loading === 'yearly' ? 'Processing...' : 'Subscribe Yearly'}
          </Button>
        </CardContent>
      </Card>

      {/* Pay Per Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pay Per Form</CardTitle>
          <CardDescription>For occasional use</CardDescription>
          <div className="text-3xl font-bold">
            $5.99
            <span className="text-sm font-normal text-muted-foreground">/form</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Single legal form processing</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Basic legal guidance</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">No commitment</span>
            </li>
          </ul>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleOneTimePayment}
            disabled={loading === 'one-time'}
          >
            {loading === 'one-time' ? 'Processing...' : 'Pay for One Form'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};