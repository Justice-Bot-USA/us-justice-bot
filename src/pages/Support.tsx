import React from 'react';
import { signInPath } from '@/lib/signIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SupportTicket } from '@/components/SupportTicket';
import { useAuth } from '@/hooks/useAuth';

const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Support Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">
              Email us at{' '}
              <a href="mailto:support@justicebot-usa.com" className="text-primary underline">
                support@justicebot-usa.com
              </a>
              . For billing, write to{' '}
              <a href="mailto:billing@justicebot-usa.com" className="text-primary underline">
                billing@justicebot-usa.com
              </a>
              .
            </p>
            <p className="text-muted-foreground mb-4">Sign in to open a support ticket and track replies.</p>
            <Button onClick={() => navigate(signInPath())} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground">
            Get help with your legal questions and technical issues
          </p>
        </div>

        <SupportTicket />
      </div>
    </div>
  );
};

export default Support;