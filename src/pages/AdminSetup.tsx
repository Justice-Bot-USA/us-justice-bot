import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, User, UserPlus, Copy } from 'lucide-react';

const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      toast.error('You must be signed in to become an admin');
      return;
    }

    try {
      // Delete any existing role first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      // Insert admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (error) throw error;

      toast.success('Successfully granted admin privileges!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error granting admin privileges:', error);
      toast.error('Failed to grant admin privileges. You may need to manually add the role in the database.');
    }
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      toast.success('User ID copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Setup
            </CardTitle>
            <CardDescription>
              You must be signed in to set up admin access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground mt-2">
            Set up administrator access for your Justice Bot USA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-mono">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{user.id.slice(0, 8)}...</p>
                  <Button variant="ghost" size="sm" onClick={copyUserId}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Grant Admin Access
            </CardTitle>
            <CardDescription>
              Make the current user an administrator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
              <p className="text-sm text-yellow-700">
                This will grant full administrator privileges including:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• User management and role assignment</li>
                <li>• Payment and pricing management</li>
                <li>• System settings access</li>
                <li>• All analytics and data access</li>
              </ul>
            </div>

            <Button onClick={makeCurrentUserAdmin} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Grant Admin Privileges
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Database Setup</CardTitle>
            <CardDescription>
              If the automatic setup doesn't work, you can manually add admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">SQL Query to run in Supabase:</p>
              <code className="text-xs font-mono p-2 bg-black text-green-400 rounded block">
                {`INSERT INTO user_roles (user_id, role) 
VALUES ('${user.id}', 'admin');`}
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Steps:</p>
              <ol className="text-sm space-y-1 ml-4">
                <li>1. Go to your Supabase dashboard</li>
                <li>2. Navigate to SQL Editor</li>
                <li>3. Run the SQL query above</li>
                <li>4. Refresh this page and go to /admin</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;