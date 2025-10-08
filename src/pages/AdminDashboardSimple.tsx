import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, MessageSquare, CreditCard, BarChart3, Settings, Shield, Scale, Search, LifeBuoy } from 'lucide-react';
import { SupportTicket } from '@/components/SupportTicket';
import { CaseMeritAnalyzer } from '@/components/CaseMeritAnalyzer';
import { LegalSweepManager } from '@/components/LegalSweepManager';

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

const AdminDashboardSimple = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isModerator, userRole, loading } = useAdminAccess();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [supportTicketCount, setSupportTicketCount] = useState(0);
  const [caseMeritCount, setCaseMeritCount] = useState(0);

  // Fetch data when component loads
  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchData();
    }
  }, [isAdmin, isModerator]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch profiles using audited function (logs admin access automatically)
      const { data: profilesData, error: profilesError } = await supabase
        .rpc('admin_view_profiles', {
          p_user_id: null, // null = view all profiles
          p_limit: 1000,
          p_offset: 0
        });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;
      setUserRoles(rolesData || []);

      // Fetch support ticket count
      const { count: ticketCount, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });

      if (!ticketError) {
        setSupportTicketCount(ticketCount || 0);
      }

      // Fetch case merit count
      const { count: meritCount, error: meritError } = await supabase
        .from('case_merit_scores')
        .select('*', { count: 'exact', head: true });

      if (!meritError) {
        setCaseMeritCount(meritCount || 0);
      }

      console.log('Fetched data with audit logging:', { profiles: profilesData, roles: rolesData });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setDataLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!isAdmin) {
      toast.error('Only admins can change user roles');
      return;
    }

    try {
      // Delete existing role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insert new role
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
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
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return Home
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
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {userRole?.toUpperCase()}
            </Badge>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userRoles.filter(r => r.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Admin users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Total conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <LifeBuoy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supportTicketCount}</div>
              <p className="text-xs text-muted-foreground">
                Active support tickets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cases Analyzed</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caseMeritCount}</div>
              <p className="text-xs text-muted-foreground">
                Merit analyses completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">
                Total earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="support">Support Tickets</TabsTrigger>
            <TabsTrigger value="merit">Case Analysis</TabsTrigger>
            <TabsTrigger value="sweeps">Legal Sweeps</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage user accounts and assign roles
                </p>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <p>Loading users...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell>{profile.email}</TableCell>
                          <TableCell>
                            {profile.first_name || profile.last_name 
                              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              getUserRole(profile.user_id) === 'admin' ? 'default' :
                              getUserRole(profile.user_id) === 'moderator' ? 'secondary' : 'outline'
                            }>
                              {getUserRole(profile.user_id)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(profile.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {isAdmin && profile.user_id !== user?.id && (
                              <Select
                                value={getUserRole(profile.user_id)}
                                onValueChange={(newRole) => updateUserRole(profile.user_id, newRole)}
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
                            )}
                            {profile.user_id === user?.id && (
                              <span className="text-sm text-muted-foreground">You</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <SupportTicket />
          </TabsContent>

          <TabsContent value="merit" className="space-y-4">
            <CaseMeritAnalyzer />
          </TabsContent>

          <TabsContent value="sweeps" className="space-y-4">
            <LegalSweepManager />
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Admin dashboard with core features:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>User management and role assignment ✅</li>
                    <li>Support ticket system ✅</li>
                    <li>Case merit analysis ✅</li>
                    <li>Legal sweeps & research ✅</li>
                    <li>Chat session monitoring (Coming Soon)</li>
                    <li>Payment tracking and analytics (Coming Soon)</li>
                    <li>File upload management ✅</li>
                    <li>System settings and configuration (Coming Soon)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardSimple;