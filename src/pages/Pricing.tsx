import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Check, FileText, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { signInPath } from '@/lib/signIn';
import { formatPlanDate } from '@/lib/toolkit/access';
import {
  BILLING_TERMS_LANGUAGE_NOTE,
  CONSENT_AUTO_RENEW,
  CONSENT_TERMS,
  DISCLOSURE_BULLETS,
  DISCLOSURE_HEADING,
  TOOLKIT_FEATURES,
} from '@/lib/billingDisclosure';
import { useCheckoutStatus } from '@/hooks/useCheckoutStatus';
import {
  BILLING_EMAIL,
  BillingError,
  CHECKOUT_STATUS_KEY,
  fetchLiveBillingStatus,
  PLAN,
  startSubscriptionCheckout,
  THIRD_PARTY_FEES_NOTE,
} from '@/lib/pricing';

const FREE_ITEMS = [
  'Fill in the California and New York court forms we support online with your own answers, and download them',
  'Form guides with step-by-step filling instructions for California and New York forms',
  'Public-records request letters you can download as a PDF',
  'Fee waiver forms (the court decides whether you qualify)',
  'Plain-language guidance with links to official court and agency sources',
  'Upload, view, rename, organize, download and delete your own case files (with a free account)',
];

const linkClass = 'font-medium text-primary underline underline-offset-4 hover:no-underline';

/** CONSENT_TERMS with "Terms of Service" and "Privacy Policy" as links; the words stay exactly the same. */
function consentTermsWithLinks(): ReactNode {
  return CONSENT_TERMS.split(/(Terms of Service|Privacy Policy)/).map((part, i) => {
    if (part === 'Terms of Service' || part === 'Privacy Policy') {
      return (
        <a
          key={i}
          href={part === 'Terms of Service' ? '/terms' : '/privacy'}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

interface ConsentBoxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

/** A required, unticked-by-default checkbox with a large tap area and a real label. */
function ConsentBox({ id, checked, onChange, disabled, children }: ConsentBoxProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-background px-3 py-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        disabled={disabled}
        aria-required="true"
        className="relative mt-2.5 h-6 w-6 shrink-0 after:absolute after:-inset-2.5 after:content-['']"
      />
      <label htmlFor={id} className="flex-1 cursor-pointer py-2 text-base leading-snug text-foreground">
        {children}
      </label>
    </div>
  );
}

/** The plan terms (counsel's wording, word for word), directly above the checkboxes and button. */
function DisclosureBox() {
  return (
    <section
      aria-labelledby="toolkit-terms-heading"
      className="rounded-lg border-2 border-foreground/70 bg-background p-4 text-base text-foreground"
    >
      <h3 id="toolkit-terms-heading" className="font-bold leading-snug">
        {DISCLOSURE_HEADING}
      </h3>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {DISCLOSURE_BULLETS.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}

type FormMessage = { text: string; action?: ReactNode } | null;

function ToolkitPurchase({ language, onPaused }: { language: 'en' | 'es'; onPaused: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [autoRenew, setAutoRenew] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) messageRef.current?.focus();
  }, [message]);

  // Coming back from Stripe Checkout with the Back button can restore this page from the browser's
  // cache with the button still busy; make it usable again.
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) setBusy(false);
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const subscribe = async () => {
    if (!autoRenew || !terms) {
      setMessage({ text: 'Tick both boxes to continue.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await startSubscriptionCheckout({ autoRenewConsent: autoRenew, tosConsent: terms });
      // The browser is leaving for Stripe Checkout.
    } catch (error) {
      const code = error instanceof BillingError ? error.code : 'UNKNOWN';
      if (code === 'PLAN_PAUSED') {
        // The card switches to its closed state and says so.
        onPaused();
        queryClient.setQueryData(CHECKOUT_STATUS_KEY, false);
        return;
      } else if (code === 'ALREADY_SUBSCRIBED') {
        void queryClient.invalidateQueries({ queryKey: ['toolkit'] });
        setMessage({
          text: "You already have the Toolkit plan, so you haven't been charged again.",
          action: (
            <Link to="/account/billing" className={linkClass}>
              See your plan
            </Link>
          ),
        });
      } else if (code === 'CONSENT_REQUIRED') {
        setMessage({ text: 'Tick both boxes to continue.' });
      } else if (code === 'DISCLOSURE_OUTDATED') {
        setMessage({
          text: 'This page is out of date. Reload it to see the current terms, then try again.',
          action: (
            <Button type="button" variant="outline" className="min-h-11" onClick={() => window.location.reload()}>
              Reload the page
            </Button>
          ),
        });
      } else if (code === 'UNAUTHORIZED') {
        setMessage({
          text: 'Please sign in again, then try again.',
          action: (
            <Link to={signInPath('/pricing')} className={linkClass}>
              Sign in
            </Link>
          ),
        });
      } else if (code === 'EMAIL_REQUIRED' && error instanceof BillingError && error.message) {
        setMessage({ text: error.message });
      } else {
        setMessage({ text: `Something went wrong, and you haven't been charged. Please try again, or email ${BILLING_EMAIL}.` });
      }
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {language === 'es' && (
        <p lang="es" className="rounded-md border bg-muted/40 p-3 text-base text-foreground">
          {BILLING_TERMS_LANGUAGE_NOTE}
        </p>
      )}
      <DisclosureBox />

      {user ? (
        <>
          <div className="space-y-3">
            <ConsentBox id="consent-auto-renew" checked={autoRenew} onChange={setAutoRenew} disabled={busy}>
              {CONSENT_AUTO_RENEW}
            </ConsentBox>
            <ConsentBox id="consent-terms" checked={terms} onChange={setTerms} disabled={busy}>
              {consentTermsWithLinks()}
            </ConsentBox>
          </div>
          {user.email && <p className="text-base text-foreground">We'll send billing notices to {user.email}.</p>}
          <div ref={messageRef} tabIndex={-1} role="alert" className="outline-none">
            {message && (
              <div className="space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-base">
                <p>{message.text}</p>
                {message.action}
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={() => void subscribe()}
            disabled={busy}
            className="h-auto min-h-11 w-full whitespace-normal py-2 text-base"
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Opening secure checkout…
              </>
            ) : (
              PLAN.cta
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            You'll pay on Stripe's secure checkout page. We never see your full card number.
          </p>
        </>
      ) : (
        <div className="space-y-2">
          <Button asChild className="h-auto min-h-11 w-full whitespace-normal py-2 text-base">
            <Link to={signInPath('/pricing')}>Sign in to subscribe</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            After you sign in, you'll tick two boxes to agree to these terms before you pay.
          </p>
        </div>
      )}
    </div>
  );
}

function ToolkitCard({ language }: { language: 'en' | 'es' }) {
  const { user } = useAuth();
  const paywall = usePaywallAccess();
  const status = useCheckoutStatus();
  const available = status.data === true;
  const hasPlan = Boolean(user) && paywall.hasActiveSubscription;
  const [pausedAfterTry, setPausedAfterTry] = useState(false);

  return (
    <Card className={available ? 'relative' : 'relative border-dashed'}>
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
          <CardTitle>Toolkit</CardTitle>
          {status.isSuccess && !available && <Badge variant="outline">Coming soon</Badge>}
        </div>
        <CardDescription className="text-base">
          An optional paid plan for keeping your case organized. You don't need it to fill in or download any form.
        </CardDescription>
        <div className="mt-4">
          <span className="text-2xl font-bold">{PLAN.priceLabel}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {TOOLKIT_FEATURES.map((item) => (
            <li key={item} className="flex items-start">
              <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {status.isPending ? (
          <p role="status" className="mt-6 flex items-center gap-2 text-base text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Checking whether the Toolkit is available…
          </p>
        ) : !available ? (
          <p className="mt-6 text-base" role={pausedAfterTry ? 'alert' : undefined}>
            {pausedAfterTry
              ? "The Toolkit isn't available to buy right now. You haven't been charged."
              : "The Toolkit isn't available to buy yet."}{' '}
            Court forms and guides stay free, and so do uploading and organizing your files.
          </p>
        ) : hasPlan ? (
          <div className="mt-6 space-y-3 text-base">
            <p>You have the Toolkit plan.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-11">
                <Link to="/toolkit">Go to My Toolkit</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <Link to="/account/billing">Your plan</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ToolkitPurchase language={language} onPaused={() => setPausedAfterTry(true)} />
        )}
      </CardContent>
    </Card>
  );
}

/** For people with a plan: its status and the way to cancel (the Your plan page). */
function YourSubscription() {
  const { user } = useAuth();
  const paywall = usePaywallAccess();
  const live = useQuery({
    queryKey: ['toolkit', 'billing-status', user?.id ?? 'signed-out'],
    queryFn: fetchLiveBillingStatus,
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: false,
  });

  if (!user) return null;
  const liveData = live.data;
  const show = paywall.hasSubscriptionRow || liveData?.subscribed || liveData?.cancellable || live.isError;
  if (!show) return null;

  const lapsed = Boolean(liveData && !liveData.subscribed && liveData.cancellable);
  const active = liveData?.subscribed || paywall.hasActiveSubscription;
  const cancelled = Boolean(liveData?.cancelAtPeriodEnd || paywall.cancelAtPeriodEnd);
  const endLabel = formatPlanDate(liveData?.subscriptionEnd ?? paywall.subscriptionEnd);

  let text: string;
  if (lapsed) {
    text =
      "Your last payment for the Toolkit plan didn't go through, so the plan isn't active, but the payment may be tried again. Cancel it to stop any more tries.";
  } else if (active && cancelled) {
    text = `Cancelled. You won't be charged again${endLabel ? `, and your plan stays active until ${endLabel}` : ''}.`;
  } else if (active) {
    text = `Your Toolkit plan is active${endLabel ? ` and renews on ${endLabel}` : ''}.`;
  } else if (paywall.hasSubscriptionRow) {
    text = "Your Toolkit plan isn't active.";
  } else {
    text = "We couldn't check your plan just now. If you have a Toolkit plan, you can cancel it on the Your plan page.";
  }
  const offerCancel = lapsed || (active && !cancelled) || (live.isError && !cancelled);

  return (
    <Card id="cancel" className="mx-auto mt-8 max-w-4xl">
      <CardHeader>
        <CardTitle>Your subscription</CardTitle>
        <CardDescription className="text-base text-foreground">{text}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          {offerCancel ? (
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/account/billing">Cancel subscription</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/account/billing">See your plan</Link>
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Questions about billing? Email {BILLING_EMAIL}.</p>
      </CardContent>
    </Card>
  );
}

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = usePaywallAccess();
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Return from Stripe Checkout without paying, and old success links.
  useEffect(() => {
    const checkout = searchParams.get('checkout') ?? searchParams.get('subscription') ?? searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    if (checkout === 'success' && sessionId) {
      navigate(`/payment-success?session_id=${encodeURIComponent(sessionId)}`, { replace: true });
    } else if (checkout === 'cancelled') {
      toast({ title: 'Checkout cancelled', description: "You haven't been charged." });
      navigate('/pricing', { replace: true });
    }
  }, [searchParams, toast, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Pricing | Justice Bot USA</title>
        <meta
          name="description"
          content="Court forms and guides are free in California and New York. The optional Toolkit plan is $25.00 a month."
        />
        <link rel="canonical" href="https://justicebot-usa.com/pricing" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />

      <main id="main-content" className="container mx-auto px-4 py-10 sm:py-16">
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Our California and New York Court Forms Are Free</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Every court form we offer, our form guides and the public-records letter tool are free in California and New
            York. Court and agency filing fees are separate, and fee waivers are free. The other 48 states are coming soon.
          </p>
          {isAdmin && (
            <Badge className="mt-4" variant="secondary">
              <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
              Admin - Full Access
            </Badge>
          )}
        </div>

        <div className="mx-auto grid max-w-4xl items-start gap-6 md:grid-cols-2">
          <Card className="relative border-primary shadow-lg">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>Free</CardTitle>
              </div>
              <CardDescription className="text-base">
                For people representing themselves in California and New York. No subscription needed.
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-3">
                {FREE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Button className="min-h-11 w-full" onClick={() => navigate('/fill/ca')}>
                  Fill in a California form
                </Button>
                <Button className="min-h-11 w-full" variant="outline" onClick={() => navigate('/fill/ny')}>
                  Fill in a New York form
                </Button>
              </div>
            </CardContent>
          </Card>

          <ToolkitCard language={language} />
        </div>

        <YourSubscription />

        <div className="mt-12 space-y-3 text-center">
          <p className="text-sm italic text-muted-foreground">
            This is legal information, not legal advice. We are not a law firm, and our content has not yet been reviewed
            by a licensed attorney. Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot
            Technologies Inc.
          </p>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">{THIRD_PARTY_FEES_NOTE}</p>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            Already have a plan? Sign in, open your account menu and choose Cancel subscription, or email {BILLING_EMAIL}.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
