import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  amount: number;
  start_date: string;
  end_date: string;
}

interface FormPayment {
  id: string;
  amount: number;
  status: string;
  form_type: string;
  created_at: string;
}

export const PaymentStatus: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [formPayments, setFormPayments] = useState<FormPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaymentData();
    }
  }, [user]);

  const fetchPaymentData = async () => {
    try {
      // Fetch subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;
      setSubscriptions(subsData || []);

      // Fetch form payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('form_payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (paymentsError) throw paymentsError;
      setFormPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'default';
      case 'cancelled':
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Please sign in to view your payment status.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Loading payment information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscriptions</CardTitle>
          <CardDescription>Your active subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-muted-foreground">No active subscriptions found.</p>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <h3 className="font-medium capitalize">
                        {subscription.plan_type} Plan
                      </h3>
                      <Badge variant={getStatusBadgeVariant(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${subscription.amount} - Valid until {new Date(subscription.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(subscription.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Form Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Form Payments</CardTitle>
          <CardDescription>Your last 10 form processing payments</CardDescription>
        </CardHeader>
        <CardContent>
          {formPayments.length === 0 ? (
            <p className="text-muted-foreground">No form payments found.</p>
          ) : (
            <div className="space-y-3">
              {formPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium">${payment.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.form_type || 'Legal Form'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={fetchPaymentData} variant="outline">
          Refresh Payment Status
        </Button>
      </div>
    </div>
  );
};