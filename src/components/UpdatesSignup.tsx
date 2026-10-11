import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Where the signup was shown. Coarse on purpose: never a form id or legal area, since which form
 *  someone was filling can reveal an eviction, divorce or criminal record. */
export type SignupSource = 'fill_form' | 'fill_list' | 'legal_center';

/** Stored with each signup as the record of what the person agreed to. Keep it to things we can
 *  actually do: emails are sent by hand, and removal is handled through the privacy inbox. */
export const UPDATES_CONSENT_TEXT =
  'Email me when Justice Bot USA adds court forms or tools for my state. ' +
  'Occasional emails only. To stop, email privacy@justicebot-usa.com and we will remove you.';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface UpdatesSignupProps {
  source: SignupSource;
  state?: 'CA' | 'NY';
  className?: string;
}

export function UpdatesSignup({ source, state, className }: UpdatesSignupProps) {
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
      state: state ?? null,
      source,
      consent_text: UPDATES_CONSENT_TEXT,
    });
    // 23505: already on the list. Same answer as a new signup, so the form doesn't reveal who signed up.
    setStatus(!error || error.code === '23505' ? 'done' : 'error');
    if (error && error.code !== '23505') console.error('Update signup failed:', error);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Mail className="h-4 w-4 text-primary" /> Get updates
        </div>
        {status === 'done' ? (
          <p className="text-sm text-muted-foreground">
            You're on the list. We'll email you when we add forms or tools for your state.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-2">
            <Label htmlFor={`updates-${source}`} className="text-xs text-muted-foreground font-normal">
              {UPDATES_CONSENT_TEXT}
            </Label>
            <div className="flex gap-2">
              <Input
                id={`updates-${source}`}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'invalid' || status === 'error') setStatus('idle');
                }}
              />
              <Button type="submit" disabled={status === 'saving' || !email.trim()}>
                {status === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign up'}
              </Button>
            </div>
            {status === 'invalid' && (
              <p className="text-xs text-destructive">Please enter a valid email address.</p>
            )}
            {status === 'error' && (
              <p className="text-xs text-destructive">We couldn't save your signup. Please try again later.</p>
            )}
            <p className="text-xs text-muted-foreground">
              We store your email and state, nothing about your case. We never sell it.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
