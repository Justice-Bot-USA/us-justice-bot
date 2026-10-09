import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signInPath } from '@/lib/signIn';

/** Shown where a feature needs an account: says why and links to sign-in, returning here after. */
export function SignInPrompt({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-6 text-center space-y-4">
        <p className="text-muted-foreground">{message}</p>
        <Button asChild>
          <Link to={signInPath()}>
            <LogIn className="h-4 w-4 mr-2" /> Create an account or sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
