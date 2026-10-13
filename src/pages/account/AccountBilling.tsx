import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ToolkitLayout from "@/components/toolkit/ToolkitLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess } from "@/hooks/useToolkitAccess";
import { formatPlanDate } from "@/lib/toolkit/access";
import { signInPath } from "@/lib/signIn";
import {
  AFTER_CANCEL_FAQ,
  CANCEL_DIALOG,
  DISCLOSURE_BULLETS,
  DISCLOSURE_HEADING,
  TOOLKIT_FEATURES,
} from "@/lib/billingDisclosure";
import {
  BILLING_EMAIL,
  BillingError,
  CANCEL_BY_EMAIL_HREF,
  cancelToolkitPlan,
  fetchLiveBillingStatus,
  monthlyPriceLabel,
  type CancelResult,
} from "@/lib/pricing";

// The online cancellation page the automatic renewal laws require (Cal. Bus. & Prof. Code
// 17602(d), N.Y. Gen. Bus. Law 527-a(1)(d)): linked from the account menu ("Cancel subscription"),
// the Toolkit pages and Pricing. The email route works for anyone who can't sign in.

const linkClass =
  "font-medium text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/** What a person keeps after the plan ends (the cancel dialog's words, for when there is no end date). */
const AFTER_THAT =
  "After that you can still open, download and delete all your files, see your calendar dates and class records, and download your calendar file. You won't be able to add new calendar dates or class records, or make a new binder PDF, unless you subscribe again.";

const REFUND_TERMS = DISCLOSURE_BULLETS.find((b) => b.startsWith("Refunds:")) ?? "";

interface SubscriptionRow {
  amount: number | null;
  plan_type: string | null;
  status: string;
  end_date: string;
  cancel_at_period_end: boolean | null;
}

type PlanState = "active" | "cancelled_active" | "payment_failed" | "ended" | "admin" | "unknown" | "none";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="font-medium sm:w-40 sm:shrink-0">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function OfflineCancel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Can't sign in, or this page isn't working?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-base">
        <p>
          Email <a href={CANCEL_BY_EMAIL_HREF} className={linkClass}>{BILLING_EMAIL}</a> from the address on your account,
          and we'll cancel your plan for you.
        </p>
        <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
          <a href={CANCEL_BY_EMAIL_HREF}>Email us to cancel</a>
        </Button>
      </CardContent>
    </Card>
  );
}

function PlanTerms() {
  return (
    <details className="rounded-lg border p-4 text-base">
      <summary className="flex min-h-11 cursor-pointer items-center font-medium">See your plan terms</summary>
      <div className="mt-3 space-y-3">
        <p className="font-medium">What the Toolkit includes:</p>
        <ul className="list-disc space-y-1 pl-5">
          {TOOLKIT_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="font-bold">{DISCLOSURE_HEADING}</p>
        <ul className="list-disc space-y-2 pl-5">
          {DISCLOSURE_BULLETS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p>
          Full terms: <Link to="/terms" className={linkClass}>Terms of Service</Link>.
        </p>
      </div>
    </details>
  );
}

export default function AccountBilling() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const access = useToolkitAccess();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const rowQuery = useQuery({
    queryKey: ["toolkit", "billing-row", userId ?? "signed-out"],
    queryFn: async (): Promise<SubscriptionRow | null> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("amount,plan_type,status,end_date,cancel_at_period_end")
        .eq("user_id", userId as string)
        .order("end_date", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] as SubscriptionRow | undefined) ?? null;
    },
    enabled: Boolean(userId),
    retry: false,
  });

  const live = useQuery({
    queryKey: ["toolkit", "billing-status", userId ?? "signed-out"],
    queryFn: fetchLiveBillingStatus,
    enabled: Boolean(userId),
    staleTime: 60_000,
    retry: false,
  });

  const [cancelling, setCancelling] = useState(false);
  const [result, setResult] = useState<CancelResult | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result || cancelError) resultRef.current?.focus();
  }, [result, cancelError]);

  const doCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      const outcome = await cancelToolkitPlan();
      setResult(outcome);
      await queryClient.invalidateQueries({ queryKey: ["toolkit"] });
    } catch (error) {
      setCancelError(
        error instanceof BillingError && error.code === "NOT_FOUND"
          ? `We couldn't find a plan to cancel on this account. If you were charged, email ${BILLING_EMAIL}.`
          : `We couldn't cancel your plan just now. Please try again, or email ${BILLING_EMAIL} from the address on your account and we'll cancel it for you.`,
      );
    } finally {
      setCancelling(false);
    }
  };

  const layout = (body: ReactNode) => (
    <ToolkitLayout
      title="Your plan"
      description="Your Toolkit plan: its status, price and renewal date, and how to cancel."
      showPlanBanner={false}
      requireSignIn={false}
    >
      <div className="space-y-6">{body}</div>
    </ToolkitLayout>
  );

  if (authLoading) {
    return layout(
      <p role="status" className="flex items-center gap-2 text-base text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading…
      </p>,
    );
  }

  if (!user) {
    return layout(
      <>
        <Card>
          <CardContent className="space-y-3 pt-6 text-base">
            <h2 className="text-lg font-semibold">Sign in to see or cancel your plan</h2>
            <Button asChild className="min-h-11 w-full sm:w-auto">
              <Link to={signInPath(`${location.pathname}${location.search}`)}>Sign in</Link>
            </Button>
          </CardContent>
        </Card>
        <OfflineCancel />
      </>,
    );
  }

  const row = rowQuery.data ?? null;
  const liveData = live.data;
  // Paid and active: Stripe says so, or the person has an active subscriptions row (not just admin access).
  const paidActive = Boolean(liveData?.subscribed || (access.status === "active" && access.activeUntil));
  const cancelled = liveData?.subscribed ? liveData.cancelAtPeriodEnd : Boolean(access.cancelAtPeriodEnd);
  const untilLabel = formatPlanDate(liveData?.subscriptionEnd ?? access.activeUntil ?? (paidActive ? row?.end_date : null));
  const endedLabel = formatPlanDate(access.endedOn);

  let state: PlanState;
  if (liveData && !liveData.subscribed && liveData.cancellable) state = "payment_failed";
  else if (paidActive && cancelled) state = "cancelled_active";
  else if (paidActive) state = "active";
  else if (access.status === "active") state = "admin";
  else if (live.isError) state = "unknown";
  else if (access.hasSubscriptionRow || row) state = "ended";
  else state = "none";

  const checking = access.status === "loading" || rowQuery.isPending || (live.isPending && state !== "active");
  if (checking && !result) {
    return layout(
      <p role="status" className="flex items-center gap-2 text-base text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Checking your plan…
      </p>,
    );
  }

  if (result) {
    const until = formatPlanDate(result.accessUntil);
    return layout(
      <>
        <div ref={resultRef} tabIndex={-1} className="space-y-3 rounded-lg border p-4 text-base outline-none" role="status">
          <h2 className="text-lg font-semibold">Your Toolkit plan is cancelled</h2>
          <p>
            You won't be charged again.
            {until ? ` Your plan stays active until ${until}, the end of the period you already paid for.` : ""}
          </p>
          <p>{AFTER_CANCEL_FAQ}</p>
          {result.confirmationEmail === "sent" && <p>We've emailed you a confirmation.</p>}
          <p>{REFUND_TERMS}</p>
        </div>
        <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
          <Link to="/toolkit">Back to My Toolkit</Link>
        </Button>
      </>,
    );
  }

  const statusText: Record<PlanState, string> = {
    active: "Active",
    cancelled_active: untilLabel ? `Cancelled. Active until ${untilLabel}.` : "Cancelled. Active until the end of the period you paid for.",
    payment_failed: "Not active. Your last payment didn't go through, and it may be tried again.",
    ended: endedLabel ? `Ended on ${endedLabel}` : "Ended",
    admin: "Toolkit access through an admin account (no plan to pay for)",
    unknown: "We couldn't check your plan just now.",
    none: "You don't have a Toolkit plan.",
  };

  const offerCancel = state === "active" || state === "payment_failed" || state === "unknown";
  const dialogBody =
    state === "payment_failed"
      ? `Cancelling stops any more tries to charge your card, and you won't be charged again. You can still open, download and delete all your files, see your calendar dates and class records, and download your calendar file. You won't be able to add new calendar dates or class records, or make a new binder PDF, unless you subscribe again.`
      : untilLabel
        ? CANCEL_DIALOG.body(untilLabel)
        : `You won't be charged again. If you have paid time left, your plan stays active until the end of the period you already paid for. ${AFTER_THAT}`;

  return layout(
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Toolkit plan</CardTitle>
        </CardHeader>
        <CardContent className="text-base">
          <dl>
            <Detail label="Status">{statusText[state]}</Detail>
            {(state === "active" || state === "cancelled_active" || state === "payment_failed" || state === "ended") && (
              <Detail label="Price">{monthlyPriceLabel(row?.amount)}</Detail>
            )}
            {state === "active" && untilLabel && <Detail label="Next renewal">{untilLabel}</Detail>}
            {state === "cancelled_active" && <Detail label="Next charge">None. You won't be charged again.</Detail>}
          </dl>
          {state === "active" && (
            <p className="mt-3">To avoid the next charge, cancel before your next renewal date.</p>
          )}
          {state === "unknown" && (
            <p className="mt-3">If you have a Toolkit plan, you can still cancel it here.</p>
          )}
          {state === "none" && (
            <p className="mt-3">
              <Link to="/pricing" className={linkClass}>
                See the Toolkit plan
              </Link>
            </p>
          )}
          {(state === "ended" || state === "cancelled_active") && <p className="mt-3">{AFTER_CANCEL_FAQ}</p>}
        </CardContent>
      </Card>

      {offerCancel && (
        <section aria-labelledby="cancel-heading" className="space-y-3 rounded-lg border p-4 text-base">
          <h2 id="cancel-heading" className="text-lg font-semibold">
            Cancel subscription
          </h2>
          <p>You can cancel any time. Nothing you saved is deleted.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" className="min-h-11 w-full sm:w-auto" disabled={cancelling}>
                {cancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Cancelling…
                  </>
                ) : (
                  "Cancel subscription"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{CANCEL_DIALOG.title}</AlertDialogTitle>
                <AlertDialogDescription className="text-base text-foreground">{dialogBody}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="min-h-11">{CANCEL_DIALOG.keep}</AlertDialogCancel>
                <AlertDialogAction className="min-h-11" onClick={() => void doCancel()}>
                  {CANCEL_DIALOG.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div ref={resultRef} tabIndex={-1} role="alert" className="outline-none">
            {cancelError && <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3">{cancelError}</p>}
          </div>
        </section>
      )}

      {state !== "none" && state !== "admin" && REFUND_TERMS && <p className="text-base">{REFUND_TERMS}</p>}
      {(state === "active" || state === "cancelled_active" || state === "payment_failed") && <PlanTerms />}
      <OfflineCancel />
    </>,
  );
}
