import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PaywallGuardProps {
  children: ReactNode;
  feature?: string;
  requireSubscription?: boolean;
}

export function PaywallGuard({ 
  children, 
  feature = 'this feature',
  requireSubscription = false 
}: PaywallGuardProps) {
  const { hasAccess, isAdmin, loading } = usePaywallAccess();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          {isAdmin ? (
            <Shield className="w-8 h-8 text-primary" />
          ) : (
            <Lock className="w-8 h-8 text-primary" />
          )}
        </div>
        <CardTitle>
          {requireSubscription ? 'Subscription Required' : 'Payment Required'}
        </CardTitle>
        <CardDescription>
          {requireSubscription 
            ? `You need an active subscription to access ${feature}`
            : `You need to purchase access to use ${feature}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Choose from our flexible pricing options: pay per form ($4.99), 
          monthly subscription ($9.99/month), or annual plan ($79/year - best value!).
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/pricing')}>
            View Pricing Plans
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
