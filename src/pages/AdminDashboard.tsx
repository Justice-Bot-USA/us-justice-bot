import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Users, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Shield,
  Activity,
  TrendingUp,
  UserPlus,
  DollarSign,
  Lock
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  created_at: string;
  state: string;
  legal_section: string;
  language: string;
}

interface Payment {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  form_type?: string;
}

interface PermissionSetting {
  id: string;
  name: string;
  description: string;
  adminOnly: boolean;
  moderatorAllowed: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { isAdmin, isModerator, userRole, loading: roleLoading } = useAdminAccess();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalPayments: 0,
    totalRevenue: 0,
  });

  // Permission settings for different roles
  const [permissions] = useState<PermissionSetting[]>([
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'View and manage user accounts',
      adminOnly: false,
      moderatorAllowed: true
    },
    {
      id: 'manage_payments',
      name: 'Manage Payments & Pricing',
      description: 'Modify subscription prices and payment settings',
      adminOnly: true,
      moderatorAllowed: false
    },
    {
      id: 'view_analytics',
      name: 'View Analytics',
      description: 'Access system analytics and reports',
      adminOnly: false,
      moderatorAllowed: true
    },
    {
      id: 'manage_content',
      name: 'Manage Content',
      description: 'Moderate chat sessions and content',
      adminOnly: false,
      moderatorAllowed: true
    },
    {
      id: 'system_settings',
      name: 'System Settings',
      description: 'Modify core system configurations',
      adminOnly: true,
      moderatorAllowed: false
    }
  ]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && !isModerator) {
      navigate('/');
      return;
    }

    if (isAdmin || isModerator) {
      fetchData();
    }
  }, [isAdmin, isModerator, roleLoading, navigate]);

  const fetchData = async () => {
    try {
      // Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*');

      // Fetch chat sessions
      const { data: sessionsData } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('form_payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      setProfiles(profilesData || []);
      setUserRoles(rolesData || []);
      setChatSessions(sessionsData || []);
      setPayments(paymentsData || []);

      // Calculate stats
      const totalRevenue = (paymentsData || []).reduce((sum, payment) => sum + Number(payment.amount), 0);
      setStats({
        totalUsers: profilesData?.length || 0,
        totalSessions: sessionsData?.length || 0,
        totalPayments: paymentsData?.length || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    // Only admins can change roles
    if (!isAdmin) {
      toast.error('Only administrators can modify user roles');
      return;
    }

    try {
      // First delete any existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.warn('No existing role to delete:', deleteError);
      }

      // Insert the new role with proper enum typing
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole as 'admin' | 'moderator' | 'user'
        });

      if (insertError) throw insertError;

      toast.success('User role updated successfully');
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const getUserRole = (userId: string): string => {
    const userRole = userRoles.find(role => role.user_id === userId);
    return userRole?.role || 'user';
  };

  const hasPermission = (permissionId: string): boolean => {
    const permission = permissions.find(p => p.id === permissionId);
    if (!permission) return false;
    
    if (permission.adminOnly) return isAdmin;
    if (permission.moderatorAllowed) return isAdmin || isModerator;
    return isAdmin;
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isModerator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
              <br /><br />
              <strong>To become an admin:</strong><br />
              1. Sign up for an account at /auth<br />
              2. Contact the system administrator to grant admin privileges<br />
              3. Your user ID will need to be added to the user_roles table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin ? 'Admin' : 'Moderator'} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser?.email} 
              <Badge variant={isAdmin ? 'destructive' : 'default'} className="ml-2">
                {userRole}
              </Badge>
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Site
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Total sessions
              </p>
            </CardContent>
          </Card>

          {hasPermission('manage_payments') && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    Total transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total revenue
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            {hasPermission('manage_users') && <TabsTrigger value="users">Users</TabsTrigger>}
            {hasPermission('manage_content') && <TabsTrigger value="sessions">Chat Sessions</TabsTrigger>}
            {hasPermission('manage_payments') && <TabsTrigger value="payments">Payments</TabsTrigger>}
            {hasPermission('view_analytics') && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
            <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
          </TabsList>

          {hasPermission('manage_users') && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                    {!isAdmin && (
                      <span className="text-orange-600 block mt-1">
                        Note: Only administrators can modify user roles
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        {isAdmin && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => {
                        const role = getUserRole(profile.user_id);
                        return (
                          <TableRow key={profile.id}>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>
                              {profile.first_name && profile.last_name
                                ? `${profile.first_name} ${profile.last_name}`
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                role === 'admin' ? 'destructive' : 
                                role === 'moderator' ? 'default' : 'secondary'
                              }>
                                {role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(profile.created_at).toLocaleDateString()}
                            </TableCell>
                            {isAdmin && (
                              <TableCell>
                                <Select
                                  value={role}
                                  onValueChange={(value) => updateUserRole(profile.user_id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasPermission('manage_content') && (
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Sessions</CardTitle>
                  <CardDescription>
                    Monitor user chat interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Session ID</TableHead>
                        <TableHead>Legal Section</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatSessions.slice(0, 20).map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-mono text-sm">
                            {session.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{session.legal_section}</TableCell>
                          <TableCell>{session.language}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {session.state}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(session.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasPermission('manage_payments') && (
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View all payment transactions and manage pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Current Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Monthly Plan</p>
                        <p className="text-muted-foreground">$79.99/month</p>
                      </div>
                      <div>
                        <p className="font-medium">Yearly Plan</p>
                        <p className="text-muted-foreground">$499.99/year</p>
                      </div>
                      <div>
                        <p className="font-medium">Pay Per Form</p>
                        <p className="text-muted-foreground">$5.99/form</p>
                      </div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.slice(0, 20).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">
                            {payment.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                          <TableCell>{payment.form_type || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={payment.status === 'completed' ? 'default' : 'secondary'}
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasPermission('view_analytics') && (
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>
                    System performance and usage metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Usage Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Average sessions per user:</span>
                          <span className="font-medium">
                            {stats.totalUsers > 0 ? (stats.totalSessions / stats.totalUsers).toFixed(1) : '0'}
                          </span>
                        </div>
                        {hasPermission('manage_payments') && (
                          <div className="flex justify-between">
                            <span>Average revenue per payment:</span>
                            <span className="font-medium">
                              ${stats.totalPayments > 0 ? (stats.totalRevenue / stats.totalPayments).toFixed(2) : '0.00'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                      <div className="space-y-2 text-sm">
                        {chatSessions.slice(0, 5).map((session) => (
                          <div key={session.id} className="flex justify-between">
                            <span>New chat session</span>
                            <span className="text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>
                  Overview of what each role can do in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Administrator
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Full system access including payment management and user role changes
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Moderator
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Can manage users and content, but cannot modify payments or system settings
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Permission Matrix</h4>
                    <div className="space-y-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label className="font-medium">{permission.name}</Label>
                              {permission.adminOnly && (
                                <Badge variant="destructive" className="text-xs">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Admin Only
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Admin</p>
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Moderator</p>
                              <div className={`w-4 h-4 rounded-full ${
                                permission.moderatorAllowed ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">User</p>
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;