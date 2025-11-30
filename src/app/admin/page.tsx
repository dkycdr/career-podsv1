"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Settings, 
  Database, 
  Activity,
  ArrowLeft,
  Plus,
  Eye,
  Trash2,
  Edit
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  major: string;
  year: number;
  studentId: string;
  createdAt: string;
}

interface Pod {
  id: string;
  name: string;
  description: string;
  status: string;
  maxMembers: number;
  currentMembers: number;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalPods: number;
  totalMeetings: number;
  activePods: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [pods, setPods] = useState<Pod[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPods: 0,
    totalMeetings: 0,
    activePods: 0
  });

  // Simple admin authentication
  const ADMIN_ACCESS_KEY = "presuniv-admin-2024";

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (adminKey === ADMIN_ACCESS_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      setError("Invalid admin access key!");
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();
      
      if (usersData.success) {
        setUsers(usersData.users);
      }

      // Fetch pods
      const podsResponse = await fetch('/api/admin/pods');
      const podsData = await podsResponse.json();
      
      if (podsData.success) {
        setPods(podsData.pods);
      }

      // Calculate stats
      const totalUsers = usersData.users?.length || 0;
      const totalPods = podsData.pods?.length || 0;
      const activePods = podsData.pods?.filter((p: Pod) => p.status === 'ACTIVE').length || 0;
      
      setStats({
        totalUsers,
        totalPods,
        totalMeetings: 0, // TODO: Implement meetings API
        activePods
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deletePod = async (podId: string) => {
    if (!confirm('Are you sure you want to delete this pod?')) return;

    try {
      const response = await fetch(`/api/admin/pods?podId=${podId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting pod:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        
        <Card className="w-full max-w-md glass-alt card-border border-slate-700/50 bg-slate-900/40 relative z-10">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-600/80 rounded-lg flex items-center justify-center mx-auto mb-4 glow-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-100">
              Admin Access
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter admin access key to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminKey" className="text-slate-300">Admin Access Key</Label>
                <Input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                  required
                  className="w-full bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              {error && (
                <Alert className="border-red-500/30 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600/80 hover:bg-red-700 font-semibold"
                disabled={loading || !adminKey}
              >
                {loading ? "Verifying..." : "Admin Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </div>

            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-xs text-purple-300">
                <strong>Hint:</strong> Admin access key is "presuniv-admin-2024"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-red-500/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600/80 rounded-lg flex items-center justify-center glow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-100 text-red-800">
                Admin Mode
              </Badge>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Pods</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalPods}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Active Pods</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.activePods}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Meetings</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalMeetings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-900/40 border border-slate-700/50">
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-slate-800/50">Users Management</TabsTrigger>
            <TabsTrigger value="pods" className="text-slate-300 data-[state=active]:text-purple-400 data-[state=active]:bg-slate-800/50">Pods Management</TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-300 data-[state=active]:text-red-400 data-[state=active]:bg-slate-800/50">Settings</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-100">
                  <span>Users Management</span>
                  <Badge variant="outline" className="border-slate-600 text-cyan-300 bg-slate-800/50">{users.length} users</Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage user roles and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left p-2 text-slate-300">Name</th>
                        <th className="text-left p-2 text-slate-300">Email</th>
                        <th className="text-left p-2 text-slate-300">Role</th>
                        <th className="text-left p-2 text-slate-300">Major</th>
                        <th className="text-left p-2 text-slate-300">Year</th>
                        <th className="text-left p-2 text-slate-300">Student ID</th>
                        <th className="text-left p-2 text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                          <td className="p-2 font-medium text-slate-100">{user.name}</td>
                          <td className="p-2 text-sm text-slate-400">{user.email}</td>
                          <td className="p-2">
                            <Badge 
                              variant={user.role === 'ADMIN' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-slate-400">{user.major}</td>
                          <td className="p-2 text-sm text-slate-400">{user.year}</td>
                          <td className="p-2 text-sm text-slate-400">{user.studentId}</td>
                          <td className="p-2">
                            <div className="flex space-x-1">
                              {user.role !== 'ADMIN' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateUserRole(user.id, 'MENTOR')}
                                  className="text-xs border-slate-600 text-cyan-300 hover:bg-slate-800"
                                >
                                  Make Mentor
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUser(user.id)}
                                className="text-xs"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pods Management */}
          <TabsContent value="pods">
            <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-100">
                  <span>Pods Management</span>
                  <Badge variant="outline" className="border-slate-600 text-purple-300 bg-slate-800/50">{pods.length} pods</Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage pods and members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left p-2 text-slate-300">Name</th>
                        <th className="text-left p-2 text-slate-300">Description</th>
                        <th className="text-left p-2 text-slate-300">Status</th>
                        <th className="text-left p-2 text-slate-300">Members</th>
                        <th className="text-left p-2 text-slate-300">Created</th>
                        <th className="text-left p-2 text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pods.map((pod) => (
                        <tr key={pod.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                          <td className="p-2 font-medium text-slate-100">{pod.name}</td>
                          <td className="p-2 text-sm text-slate-400">{pod.description}</td>
                          <td className="p-2">
                            <Badge 
                              variant={pod.status === 'ACTIVE' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {pod.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-slate-400">{pod.currentMembers}/{pod.maxMembers}</td>
                          <td className="p-2 text-sm text-slate-400">
                            {new Date(pod.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePod(pod.id)}
                              className="text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-slate-100">Admin Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Admin system configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-slate-800/50 border border-red-600/30 rounded-lg">
                  <h4 className="font-semibold text-red-400 mb-2">System Information</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>• Admin Access Key: presuniv-admin-2024</p>
                    <p>• Database: SQLite (local)</p>
                    <p>• Environment: Development</p>
                    <p>• Version: 1.0.0</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 border border-yellow-600/30 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={fetchAdminData}
                      className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open('/api/health', '_blank')}
                      className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Check API Health
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}