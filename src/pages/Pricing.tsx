import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Check, Shield, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { PLAN, THIRD_PARTY_FEES_NOTE } from '@/lib/pricing';
import { invokeAuthed } from '@/lib/supabaseInvoke';
import { trackPurchase, getDetectedCountry } from '@/hooks/useAnalytics';

const FREE_ITEMS = [
  'Fill in the California and New York court forms we support online with your own answers, and download them',
  'Form guides with step-by-step filling instructions for California and New York forms',
  'Public-records request letters you can download as a PDF',
  'Fee waiver forms (the court decides whether you qualify)',
  'Plain-language guidance with links to official court and agency sources',
];

// Planned Toolkit features. None of them exist yet; list only what is actually being built. The
// binder and course tracker build on free tools that exist today (Book of Documents, Course Hub).
const TOOLKIT_ITEMS = [
  'A case binder for each case, building on the free Book of Documents',
  'A hearing calendar with reminders',
  'A fuller course tracker, building on the free Course Hub',
];

interface BillingStatus {
  subscribed: boolean;
  subscriptionEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** A renewal payment failed: no access, but Stripe may retry the charge until it is cancelled. */
  cancellable: boolean;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isAdmin, hasActiveSubscription, subscriptionEnd, refreshAccess } = usePaywallAccess();
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [cancelling, setCancelling] = useState(false);

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
              description: 'Thank you for subscribing. Court forms and form guides are free for everyone.',
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

  // Live Stripe status for the signed-in user, including whether they have already cancelled.
  const loadBilling = useCallback(async () => {
    if (!user) {
      setBilling(null);
      return;
    }
    try {
      const { data, error } = await invokeAuthed('check-subscription');
      if (error) throw error;
      setBilling({
        subscribed: !!data?.subscribed,
        subscriptionEnd: data?.subscription_end ?? null,
        cancelAtPeriodEnd: !!data?.cancel_at_period_end,
        cancellable: !!data?.cancellable,
      });
    } catch (error) {
      console.error('Error loading subscription status:', error);
      setBilling(null);
    }
  }, [user]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const { data, error } = await invokeAuthed('cancel-subscription', { body: {} });
      if (error) throw error;

      const accessUntil = formatDate(data?.access_until ?? null);
      toast({
        title: 'Subscription cancelled',
        description: accessUntil
          ? `You won't be charged again. Your plan stays active until ${accessUntil}.`
          : "You won't be charged again.",
      });
      setBilling({
        subscribed: !!data?.access_until,
        subscriptionEnd: data?.access_until ?? null,
        cancelAtPeriodEnd: true,
        cancellable: false,
      });
      refreshAccess();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast({
        title: 'Could not cancel your subscription',
        description: 'Please try again, or email billing@justicebot-usa.com and we will cancel it for you.',
        variant: 'destructive',
      });
    } finally {
      setCancelling(false);
    }
  };

  // Fall back to the hook's database check if the live Stripe lookup failed.
  const showSubscription = !!user && (billing ? billing.subscribed || billing.cancellable : hasActiveSubscription && !isAdmin);
  const lapsed = !!billing && !billing.subscribed && billing.cancellable;
  const endLabel = formatDate(billing?.subscriptionEnd ?? subscriptionEnd);

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Court Forms Are Free in California and New York</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All court forms, form guides and the public-records letter tool are free in California and New York. Court and agency filing fees are separate, and fee waivers are free. The other 48 states are coming soon.
          </p>
          {isAdmin && (
            <Badge className="mt-4" variant="secondary">
              <Shield className="w-4 h-4 mr-2" />
              Admin - Full Access
            </Badge>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          <Card className="relative border-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>Free</CardTitle>
              </div>
              <CardDescription>For people representing themselves in California and New York. No subscription needed.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {FREE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => navigate('/fill/ca')}>
                  Fill in a California form
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/fill/ny')}>
                  Fill in a New York form
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Toolkit</CardTitle>
                <Badge variant="outline">Coming soon</Badge>
              </div>
              <CardDescription>A planned paid plan for keeping your case organized. It is in development and not available to buy yet. You don't need it to fill in or download any form.</CardDescription>
              <div className="mt-4">
                <span className="text-2xl font-bold">Coming soon — {PLAN.priceLabel}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {TOOLKIT_ITEMS.map((item) => (
                  <li key={item} className="flex items-start">
                    <Clock className="w-5 h-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      {item} <span className="text-muted-foreground">(in development)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {showSubscription && (
          <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Your subscription</CardTitle>
              <CardDescription>
                {lapsed
                  ? `Your last payment for the ${PLAN.priceLabel} plan didn't go through, so the plan is not active, but the payment may be tried again. Court forms, form guides and the public-records letter tool are free, so you don't need the plan. Cancel it here to stop any further charge attempts.`
                  : billing?.cancelAtPeriodEnd
                  ? `Cancelled. You won't be charged again${endLabel ? `, and your plan stays active until ${endLabel}` : ''}.`
                  : `Your ${PLAN.priceLabel} plan is active${endLabel ? ` and renews on ${endLabel}` : ''}. Court forms, form guides and the public-records letter tool are now free, so the plan no longer unlocks anything. You can cancel it here.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!billing?.cancelAtPeriodEnd && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={cancelling}>
                      {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {lapsed
                          ? "This cancels the plan now, and the failed payment won't be tried again. "
                          : `You won't be charged again. Your plan stays active until the end of the period you've already paid for${endLabel ? ` (${endLabel})` : ''}. `}
                        Court forms, form guides and the public-records letter tool stay free. The plan is paused for new purchases, so you can't subscribe again while it is paused.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelSubscription}>Yes, cancel subscription</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <p className="text-sm text-muted-foreground">
                Questions about billing? Email billing@justicebot-usa.com.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center space-y-3">
          <p className="text-sm text-muted-foreground italic">
            This is legal information, not legal advice. We are not a law firm, and our content has not yet been reviewed by a licensed attorney.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{THIRD_PARTY_FEES_NOTE}</p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Already have a subscription? Sign in to cancel it on this page at any time, or email billing@justicebot-usa.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
