import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Mail, BookOpen, Calendar } from 'lucide-react';

type Params = { id: string };

export default async function UserProfile({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const userId = id;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const userRes = await fetch(`${baseUrl}/api/auth/user?userId=${userId}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!userRes.ok) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
          <div className="max-w-2xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="pt-6">
                <p className="text-red-400">User not found or unable to load profile.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    const userJson = await userRes.json();
    if (!userJson?.success || !userJson.user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
          <div className="max-w-2xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="pt-6">
                <p className="text-red-400">User profile not available.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    const user = userJson.user;

    const podsRes = await fetch(`${baseUrl}/api/pods?userId=${userId}`, { cache: 'no-store' });
    const podsJson = await podsRes.json();
    const pods = podsJson?.pods ?? [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Profile Card */}
          <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
            <CardHeader>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24 border-2 border-cyan-500/30">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-2xl font-bold">
                      {user.name?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-3xl text-slate-100 mb-2">{user.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Badge variant="secondary" className="bg-blue-600/30 text-blue-300 border-blue-500/30">
                        {user.role || 'Student'}
                      </Badge>
                    </div>
                    {user.major && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <BookOpen className="w-4 h-4" />
                        <span>{user.major}</span>
                        {user.year && <span>• Year {user.year}</span>}
                      </div>
                    )}
                    {user.email && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.createdAt && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Pods Section */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Pods</CardTitle>
            </CardHeader>
            <CardContent>
              {pods.length === 0 ? (
                <p className="text-slate-400">This user is not a member of any pods yet.</p>
              ) : (
                <div className="space-y-3">
                  {pods.map((p: any) => (
                    <div key={p.id} className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-100">{p.name}</h3>
                          <p className="text-sm text-slate-400 mt-1">{p.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <span>👥 {p.memberships?.length || 0} members</span>
                          </div>
                        </div>
                        <Link href={`/pods/${p.id}`}>
                          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading user profile:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <p className="text-red-400">Error loading user profile. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
