import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { trackPurchase } from '@/hooks/useAnalytics';
import { signInPath } from '@/lib/signIn';
import { formatPlanDate } from '@/lib/toolkit/access';
import { DISCLOSURE_BULLETS, DISCLOSURE_HEADING, GENERIC_PAYMENT_SUCCESS, TOOLKIT_FEATURES } from '@/lib/billingDisclosure';
import { BILLING_EMAIL, monthlyPriceLabel, verifyCheckoutSession, type VerifyResult } from '@/lib/pricing';

// Stripe Checkout returns here (/payment-success?session_id=...). For a verified Toolkit purchase the
// page is the acknowledgment a person can print or save (Cal. Bus. & Prof. Code 17602(a)(3), N.Y.
// Gen. Bus. Law 527-a(1)(c)); the same terms are emailed by stripe-webhook. It says "We've emailed
// this" only once the email is recorded as sent. Anyone else sees the generic thank-you.

const linkClass = 'font-medium text-primary underline underline-offset-4 hover:no-underline';
const SESSION_ID = /^cs_[A-Za-z0-9_]{8,250}$/;
const RECHECKS = 3;
const RECHECK_MS = 5000;

function GenericThanks({ signedIn, returnTo }: { signedIn: boolean; returnTo: string }) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="space-y-4 p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold md:text-3xl">Thank you</h1>
        <p className="text-base">{GENERIC_PAYMENT_SUCCESS}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {!signedIn && (
            <Button asChild className="min-h-11">
              <Link to={signInPath(returnTo)}>Sign in</Link>
            </Button>
          )}
          <Button asChild variant={signedIn ? 'default' : 'outline'} className="min-h-11">
            <Link to="/fill/ca">California forms</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/fill/ny">New York forms</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Questions about a charge? Email {BILLING_EMAIL}.
        </p>
      </CardContent>
    </Card>
  );
}

function Acknowledgment({ result }: { result: Extract<VerifyResult, { kind: 'verified' }> }) {
  const { plan, email, ackStatus, duplicate } = result;
  const started = formatPlanDate(plan.startedAt);
  const next = formatPlanDate(plan.currentPeriodEnd);
  const price = monthlyPriceLabel(plan.amountCents != null ? plan.amountCents / 100 : null);

  if (duplicate) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-4 p-6 text-base sm:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">You already have the Toolkit plan</h1>
          <p>
            This payment started a second Toolkit plan. We're cancelling the second plan and refunding its charge to your
            card. Your first plan carries on. Questions? Email {BILLING_EMAIL}.
          </p>
          <Button asChild className="min-h-11">
            <Link to="/account/billing">See your plan</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (plan.status !== 'active') {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-4 p-6 text-base sm:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">This Toolkit plan isn't active</h1>
          <p>
            Open Your plan to see its status. Questions about a charge? Email {BILLING_EMAIL}.
          </p>
          <Button asChild className="min-h-11">
            <Link to="/account/billing">Your plan</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="space-y-5 p-6 text-base sm:p-8">
        <div className="space-y-2 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold md:text-3xl">Thanks. Your Toolkit plan has started.</h1>
        </div>

        <section aria-labelledby="plan-details" className="rounded-lg border-2 border-foreground/70 p-4">
          <h2 id="plan-details" className="font-bold">Your plan</h2>
          <dl className="mt-2 space-y-1">
            {started && (
              <div>
                <dt className="inline font-medium">Started: </dt>
                <dd className="inline">{started}</dd>
              </div>
            )}
            <div>
              <dt className="inline font-medium">Price: </dt>
              <dd className="inline">{price}</dd>
            </div>
            {next && !plan.cancelAtPeriodEnd && (
              <div>
                <dt className="inline font-medium">Next charge: </dt>
                <dd className="inline">{next}, then the same day each month, until you cancel.</dd>
              </div>
            )}
          </dl>
          {next && !plan.cancelAtPeriodEnd && <p className="mt-2">To stop the next charge, cancel before {next}.</p>}
        </section>

        {email && (
          <p className="font-medium">
            {ackStatus === 'sent'
              ? `We've emailed this to ${email}.`
              : `We're emailing this to ${email}. Print or save this page too.`}
          </p>
        )}

        <section aria-labelledby="what-you-get" className="space-y-2">
          <h2 id="what-you-get" className="font-bold">What you get</h2>
          <ul className="list-disc space-y-1 pl-5">
            {TOOLKIT_FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="plan-terms" className="space-y-2">
          <h2 id="plan-terms" className="font-bold">{DISCLOSURE_HEADING}</h2>
          <ul className="list-disc space-y-2 pl-5">
            {DISCLOSURE_BULLETS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>
            To cancel online, open <Link to="/account/billing" className={linkClass}>Your plan</Link> and choose Cancel
            subscription. Full terms: <Link to="/terms" className={linkClass}>Terms of Service</Link>.
          </p>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row print:hidden">
          <Button type="button" variant="outline" className="min-h-11" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
            Print or save this page
          </Button>
          <Button asChild className="min-h-11">
            <Link to="/toolkit">Go to My Toolkit</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/account/billing">Cancel or manage plan</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc. Contact:{' '}
          {BILLING_EMAIL}. Legal information, not legal advice.
        </p>
      </CardContent>
    </Card>
  );
}

const PaymentSuccess: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const rawSessionId = searchParams.get('session_id') ?? '';
  const sessionId = SESSION_ID.test(rawSessionId) ? rawSessionId : null;
  const [result, setResult] = useState<VerifyResult | null>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (authLoading || !user || !sessionId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async (attempt: number) => {
      const outcome = await verifyCheckoutSession(sessionId);
      if (stopped) return;
      setResult(outcome);
      if (outcome.kind === 'verified') {
        void queryClient.invalidateQueries({ queryKey: ['toolkit'] });
        if (!tracked.current && !outcome.duplicate) {
          tracked.current = true;
          let seen = false;
          try {
            seen = sessionStorage.getItem(`jbusa.purchase.${sessionId}`) === '1';
            sessionStorage.setItem(`jbusa.purchase.${sessionId}`, '1');
          } catch {
            seen = false;
          }
          if (!seen) trackPurchase('Toolkit', '', 'US', 25, 'toolkit_monthly_25');
        }
      }
      // Check again while the payment or the email is still on its way.
      const waiting =
        outcome.kind === 'processing' ||
        (outcome.kind === 'verified' && !outcome.duplicate && outcome.plan.status === 'active' && outcome.ackStatus !== 'sent');
      if (waiting && attempt < RECHECKS) timer = setTimeout(() => void check(attempt + 1), RECHECK_MS);
    };
    void check(0);

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [authLoading, user, sessionId, queryClient]);

  const returnTo = sessionId ? `/payment-success?session_id=${encodeURIComponent(sessionId)}` : '/payment-success';
  let body: React.ReactNode;
  if (sessionId && (authLoading || (user && result === null))) {
    body = (
      <p role="status" className="flex items-center justify-center gap-2 text-base text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Checking your payment…
      </p>
    );
  } else if (result?.kind === 'verified') {
    body = <Acknowledgment result={result} />;
  } else if (result?.kind === 'processing') {
    body = (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-3 p-6 text-center text-base sm:p-8">
          <h1 className="text-2xl font-bold">Your payment is still processing</h1>
          <p>This usually takes a few seconds. Refresh this page in a minute to see your plan details.</p>
          <Button type="button" variant="outline" className="min-h-11" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  } else {
    body = <GenericThanks signedIn={Boolean(user)} returnTo={returnTo} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Thank You | Justice Bot USA</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="container mx-auto px-4 py-10 sm:py-16">
        {body}
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
