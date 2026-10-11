import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Where the signup was shown. Coarse on purpose: never a form id or legal area, since which form
 *  someone was filling can reveal an eviction, divorce or criminal record. */
export type SignupSource = 'header' | 'footer';

/** The state whose pages the visitor is on, if any. Only the state is kept, never the page. */
function stateFromPath(pathname: string): 'CA' | 'NY' | null {
  const p = pathname.toLowerCase();
  if (/^\/(ca|fill\/ca|states\/ca)(\/|$)|california/.test(p)) return 'CA';
  if (/^\/(ny|fill\/ny|states\/ny)(\/|$)|new-york/.test(p)) return 'NY';
  return null;
}

/** Stored with each signup as the record of what the person agreed to. Keep it to things we can
 *  actually do: emails are sent by hand, and removal is handled through the privacy inbox. */
export const UPDATES_CONSENT_TEXT =
  'Email me when Justice Bot USA adds court forms or tools for my state. ' +
  'Occasional emails only. To stop, email privacy@justicebot-usa.com and we will remove you.';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface UpdatesSignupProps {
  source: SignupSource;
  /** Footer: compact styling that inherits the footer's colors. */
  inFooter?: boolean;
}

export function UpdatesSignup({ source, inFooter = false }: UpdatesSignupProps) {
  const { pathname } = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'invalid' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value) || value.length > 254) {
      setStatus('invalid');
      return;
    }
    setStatus('saving');
    const { error } = await supabase.from('update_signups').insert({
      email: value,
      state: stateFromPath(pathname),
      source,
      consent_text: UPDATES_CONSENT_TEXT,
    });
    // 23505: already on the list. Same answer as a new signup, so the form doesn't reveal who signed up.
    setStatus(!error || error.code === '23505' ? 'done' : 'error');
    if (error && error.code !== '23505') console.error('Update signup failed:', error);
  };

  const muted = inFooter ? 'opacity-80' : 'text-muted-foreground';
  const errorText = inFooter ? 'font-semibold' : 'text-destructive';

  if (status === 'done') {
    return (
      <p className={`text-sm ${muted}`} role="status">
        You're on the list. We'll email you when we add forms or tools for your state.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <Label htmlFor={`updates-${source}`} className={`text-xs font-normal ${muted}`}>
        {UPDATES_CONSENT_TEXT}
      </Label>
      <div className="flex gap-2">
        <Input
          id={`updates-${source}`}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inFooter ? 'text-foreground' : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'invalid' || status === 'error') setStatus('idle');
          }}
        />
        <Button type="submit" variant={inFooter ? 'secondary' : 'default'} disabled={status === 'saving' || !email.trim()}>
          {status === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign up'}
        </Button>
      </div>
      {status === 'invalid' && <p className={`text-xs ${errorText}`}>Please enter a valid email address.</p>}
      {status === 'error' && (
        <p className={`text-xs ${errorText}`}>We couldn't save your signup. Please try again later.</p>
      )}
      <p className={`text-xs ${muted}`}>We store your email and state, nothing about your case. We never sell it.</p>
    </form>
  );
}

/** "Get updates" button for the site header: opens the signup in a dialog. */
export function UpdatesSignupButton({ className, fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size={fullWidth ? 'default' : 'sm'} className={className} aria-label="Get updates">
          <Mail className={fullWidth ? 'w-4 h-4 mr-2' : 'w-4 h-4 xl:mr-1'} aria-hidden="true" />
          {/* Icon only from 1024 to 1279px so the header row fits */}
          <span className={fullWidth ? undefined : 'hidden xl:inline'}>Get updates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get updates</DialogTitle>
          <DialogDescription>Free court forms are live in California and New York. Hear when we add more.</DialogDescription>
        </DialogHeader>
        <UpdatesSignup source="header" />
      </DialogContent>
    </Dialog>
  );
}
