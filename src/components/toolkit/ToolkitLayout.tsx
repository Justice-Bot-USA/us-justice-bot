import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess, type UseToolkitAccessResult } from "@/hooks/useToolkitAccess";
import { formatPlanDate } from "@/lib/toolkit/access";
import { signInPath } from "@/lib/signIn";

type Language = "en" | "es";

export interface ToolkitLayoutProps {
  /** Page heading (h1) and the first part of the browser tab title. */
  title: string;
  /** Meta description. Keep it general: never put case titles, file names or other personal details here. */
  description?: string;
  /** Short text under the heading. */
  intro?: ReactNode;
  children: ReactNode;
  /** Show the plan line (active, cancelled or ended) with "Cancel or manage plan". Default true. */
  showPlanBanner?: boolean;
  /** Show a sign-in card instead of the page body to signed-out visitors. Default true. */
  requireSignIn?: boolean;
  /** Link above the heading. Default: back to My Toolkit. Pass null for none. */
  backLink?: { to: string; label: string } | null;
  /** Ask search engines not to index the page (private tools). Default true. */
  noIndex?: boolean;
  /** Header language toggle; managed here when not passed. */
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

const DEFAULT_BACK = { to: "/toolkit", label: "My Toolkit" };

const linkClass =
  "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/** The plan line shown under the page heading. Exported for pages that place it themselves. */
export function PlanBanner({ access }: { access: UseToolkitAccessResult }) {
  if (!access.signedIn || access.status === "loading" || access.status === "none") {
    if (access.signedIn && access.checkFailed) {
      return (
        <section aria-label="Your plan" className="mt-4 rounded-lg border bg-muted/40 p-4 text-base">
          <p>We couldn't check your plan just now. Anything you already saved is still here.</p>
          <Button type="button" variant="outline" className="mt-2 min-h-11" onClick={() => void access.refresh()}>
            Try again
          </Button>
        </section>
      );
    }
    return null;
  }

  const manageLink = access.hasSubscriptionRow ? (
    <Link to="/account/billing" className={linkClass}>
      Cancel or manage plan
    </Link>
  ) : null;

  if (access.status === "active") {
    const until = formatPlanDate(access.activeUntil);
    return (
      <section aria-label="Your plan" className="mt-4 rounded-lg border bg-muted/40 p-4 text-base">
        {access.cancelAtPeriodEnd && until ? (
          <p>
            Your Toolkit plan is cancelled. It stays active until <strong>{until}</strong>. You won't be charged again.
          </p>
        ) : access.hasSubscriptionRow ? (
          <p>Your Toolkit plan is active.</p>
        ) : (
          <p>You have Toolkit access.</p>
        )}
        {manageLink}
      </section>
    );
  }

  // Lapsed: the person keeps everything they saved.
  const ended = formatPlanDate(access.endedOn);
  return (
    <section aria-label="Your plan" className="mt-4 rounded-lg border bg-muted/40 p-4 text-base">
      <p>
        {ended ? (
          <>
            Your Toolkit plan ended on <strong>{ended}</strong>.
          </>
        ) : (
          "Your Toolkit plan has ended."
        )}{" "}
        You can still open, change, download and delete everything you saved. Adding new dates or class records and
        making a binder PDF need an active plan.
      </p>
      {manageLink}
    </section>
  );
}

function SignInCard() {
  const location = useLocation();
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <h2 className="text-lg font-semibold">Sign in to use your Toolkit</h2>
        <p className="text-base">
          Your files, dates and class records are private to your account. Sign in, or create a free account, to see
          them.
        </p>
        <Button asChild className="min-h-11 w-full sm:w-auto">
          <Link to={signInPath(`${location.pathname}${location.search}`)}>Sign in</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Page frame for every Toolkit page: Header, back link, heading, plan line, body, the
 * "Legal information, not legal advice" line and the Footer.
 */
export default function ToolkitLayout({
  title,
  description,
  intro,
  children,
  showPlanBanner = true,
  requireSignIn = true,
  backLink = DEFAULT_BACK,
  noIndex = true,
  language,
  onLanguageChange,
}: ToolkitLayoutProps) {
  const [ownLanguage, setOwnLanguage] = useState<Language>("en");
  const lang = language ?? ownLanguage;
  const setLang = onLanguageChange ?? setOwnLanguage;
  const { user, loading: authLoading } = useAuth();
  const access = useToolkitAccess();

  let body: ReactNode = children;
  if (requireSignIn && authLoading) {
    body = (
      <div className="flex items-center gap-2 py-8 text-base text-muted-foreground" role="status">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading…
      </div>
    );
  } else if (requireSignIn && !user) {
    body = <SignInCard />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <title>{`${title} | Justice Bot USA`}</title>
        {description && <meta name="description" content={description} />}
        {noIndex && <meta name="robots" content="noindex" />}
      </Helmet>
      <Header language={lang} onLanguageChange={setLang} />

      <main id="main-content" className="container mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:py-10">
        {backLink && (
          <Link
            to={backLink.to}
            className="mb-2 inline-flex min-h-11 items-center gap-1 text-base text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLink.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
        {intro && <div className="mt-2 text-base text-muted-foreground">{intro}</div>}
        {showPlanBanner && user && <PlanBanner access={access} />}

        <div className="mt-6">{body}</div>

        <p className="mt-10 border-t pt-4 text-sm text-muted-foreground">
          Legal information, not legal advice. Justice Bot USA is not a law firm, and the Toolkit is for adults 18 and
          older. Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc.
        </p>
      </main>

      <Footer />
    </div>
  );
}
