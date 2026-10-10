import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, ExternalLink, FileText, Loader2, Lock, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { PLAN, THIRD_PARTY_FEES_NOTE, startSubscriptionCheckout } from '@/lib/pricing';
import {
  PARTY_QUESTIONS, fillableForState, getFillableForm, isFreeForm,
  type Answers, type FillableForm, type Question,
} from '@/lib/formfill';

const STATE_NAMES: Record<string, string> = { CA: 'California', NY: 'New York' };
const storageKey = (f: FillableForm) => `fill:${f.state}:${f.id}`;

function loadAnswers(f: FillableForm): Answers {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey(f)) ?? '{}');
  } catch {
    return {};
  }
}

function QuestionField({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  const id = `q-${q.key}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {q.label}
        {q.required && <span className="text-destructive"> *</span>}
      </Label>
      {q.type === 'textarea' ? (
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : q.type === 'yesno' || q.type === 'select' ? (
        <select
          id={id}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Choose…</option>
          {(q.type === 'yesno' ? [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] : q.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <Input
          id={id}
          value={value}
          placeholder={q.type === 'date' ? 'MM/DD/YYYY' : q.type === 'money' ? '0.00' : undefined}
          inputMode={q.type === 'money' ? 'decimal' : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {q.help && <p className="text-xs text-muted-foreground">{q.help}</p>}
    </div>
  );
}

function FormList({ state }: { state: string }) {
  const forms = fillableForState(state);
  const name = STATE_NAMES[state] ?? state;
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Fill {name} court forms</h1>
      <p className="text-muted-foreground mb-6">
        Answer a few questions and download the official court form with your information already in it. You review
        it, finish the choices only you can make, and sign.
      </p>
      {forms.length === 0 ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Form filling for {name} is coming soon.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {forms.map((f) => (
            <Link key={f.id} to={`/fill/${f.state.toLowerCase()}/${f.id}`}>
              <Card className="h-full hover:border-primary/40 transition-colors">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold">{f.formNumber}</span>
                    <Badge variant="outline">{isFreeForm(f) ? 'Free' : 'Included in plan'}</Badge>
                  </div>
                  <div className="font-medium text-sm">{f.title}</div>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FormFiller({ form }: { form: FillableForm }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess } = usePaywallAccess();
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers(form));
  const unlocked = isFreeForm(form) || hasAccess;
  const [busy, setBusy] = useState(false);

  const questions = useMemo(
    () => [...form.partyKeys.map((k) => PARTY_QUESTIONS[k]), ...form.questions].filter(Boolean),
    [form],
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(form), JSON.stringify(answers));
    } catch {
      // Storage unavailable (private mode): answers just aren't kept across the checkout redirect.
    }
  }, [answers, form]);

  const missingRequired = questions.filter((q) => q.required && !answers[q.key]?.trim());
  const set = (k: string) => (v: string) => setAnswers((a) => ({ ...a, [k]: v }));
  const returnPath = `/fill/${form.state.toLowerCase()}/${form.id}`;

  const download = async () => {
    setBusy(true);
    try {
      // Loaded on demand: pdf-lib is large and only needed at download time.
      const { fillPdf } = await import('@/lib/formfill/fill');
      const { bytes, missing } = await fillPdf(form, answers);
      if (missing.length) console.warn('Fields not found in PDF:', missing);
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.formNumber}-filled.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`${form.formNumber} downloaded. Review it, finish the remaining items, and sign.`);
    } catch (e) {
      console.error(e);
      toast.error('Could not fill the form. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const checkout = async () => {
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }
    setBusy(true);
    try {
      sessionStorage.setItem('pending_fill_return', returnPath);
      await startSubscriptionCheckout();
    } catch (e) {
      console.error(e);
      toast.error('Could not start checkout. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link to={`/fill/${form.state.toLowerCase()}`} className="text-sm text-primary">← All {STATE_NAMES[form.state]} forms</Link>
      <div className="mt-3 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-semibold">{form.formNumber}</span>
          <Badge variant="outline">{isFreeForm(form) ? 'Free' : 'Included in plan'}</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{form.title}</h1>
        <p className="text-muted-foreground mt-1">{form.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Your answers</CardTitle>
            <CardDescription>
              We place your answers in the matching boxes of the official form. Nothing is filed for you.
              {form.otherPartyLabel && <> "Other party" means: {form.otherPartyLabel}.</>}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {questions.map((q) => (
              <div key={q.key} className={q.type === 'textarea' ? 'sm:col-span-2' : undefined}>
                <QuestionField q={q} value={answers[q.key] ?? ''} onChange={set(q.key)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {missingRequired.length > 0 && (
                <p className="text-xs text-muted-foreground">Fill in the starred questions to continue.</p>
              )}
              {unlocked ? (
                <Button className="w-full" onClick={download} disabled={busy || missingRequired.length > 0}>
                  {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  Download filled {form.formNumber}
                </Button>
              ) : (
                <Button className="w-full" onClick={checkout} disabled={busy || missingRequired.length > 0}>
                  {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                  {user ? PLAN.cta : 'Sign in to continue'}
                </Button>
              )}
              {!unlocked && (
                <p className="text-xs text-muted-foreground">
                  All forms and filling instructions included. Cancel any time by contacting support. {THIRD_PARTY_FEES_NOTE}
                </p>
              )}
              <a href={form.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary inline-flex items-center gap-1">
                Blank official form <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><ListChecks className="h-4 w-4" /> You still need to</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                {form.stillToDo.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Alert>
            <AlertDescription className="text-xs">
              Legal information and a tool for filling official forms with your own answers, not legal advice. We do not
              choose forms for you or file anything. You decide what goes on the form and you are responsible for
              checking it before you sign and file. Our content has not yet been reviewed by a licensed attorney.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

export default function FormFillPage() {
  const { state = '', formId } = useParams();
  const st = state.toUpperCase();
  const form = formId ? getFillableForm(st, formId) : undefined;
  const title = form
    ? `Fill ${form.formNumber} — ${form.title} | Justice Bot USA`
    : `Fill ${STATE_NAMES[st] ?? st} Court Forms | Justice Bot USA`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />
      <main className="flex-1">
        {formId && !form ? (
          <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
            That form isn't available to fill yet. <Link className="text-primary" to={`/fill/${state}`}>See available forms</Link>.
          </div>
        ) : form ? (
          <FormFiller form={form} />
        ) : (
          <FormList state={st} />
        )}
      </main>
      <Footer />
    </div>
  );
}
