"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, MessageSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PodChat from '@/components/PodChat';

interface Pod {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  memberships?: any[];
}

export default function PodDetailPage() {
  const router = useRouter();
  const params = useParams();
  const podId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [pod, setPod] = useState<Pod | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Unknown');
  const [userRole, setUserRole] = useState<string>('MEMBER');

  useEffect(() => {
    // Get userId from localStorage or query
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName') || 'Unknown';
    if (!id) {
      router.push('/login');
      return;
    }
    setUserId(id);
    setUserName(name);
    fetchPodDetails(id);
  }, [podId, router]);

  const fetchPodDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/pods?userId=${userId}`);
      const data = await response.json();

      if (data.success && data.pods) {
        const foundPod = data.pods.find((p: Pod) => p.id === podId);
        if (foundPod) {
          setPod(foundPod);
          // Check if user is mentor/lead
          if (foundPod.memberships) {
            const userMembership = foundPod.memberships.find(
              (m: any) => m.userId === userId
            );
            if (userMembership) {
              setUserRole(userMembership.role);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching pod details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading pod details...</p>
        </div>
      </div>
    );
  }

  if (!pod || !userId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">Pod not found</p>
          <Button onClick={() => router.back()} className="bg-cyan-600 hover:bg-cyan-700">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const memberCount = pod.memberships?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="border-slate-700 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">{pod.name}</h1>
                <p className="text-sm text-slate-400 mt-1">
                  {memberCount} member{memberCount !== 1 ? 's' : ''} joined
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pod Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 sticky top-24 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  About
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pod.description}
                </p>
              </div>

              {/* Members Info */}
              <div className="border-t border-slate-700/50 pt-6">
                <h3 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Members
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">
                    <span className="text-cyan-400 font-bold">{memberCount}</span>
                    {' '}of{' '}
                    <span className="text-cyan-400 font-bold">{pod.maxMembers}</span>
                    {' '}slots filled
                  </p>
                  {pod.memberships && pod.memberships.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {pod.memberships.slice(0, 5).map((member: any) => (
                        <div
                          key={member.userId}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30"
                        >
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-sm text-slate-300">{member.user?.name || 'Member'}</span>
                          {member.role === 'LEAD' && (
                            <span className="ml-auto text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded">
                              Lead
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-slate-700/50 pt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">Your Role</p>
                  <p className="font-bold text-cyan-400 text-sm capitalize">
                    {userRole.toLowerCase()}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">Pod Status</p>
                  <p className="font-bold text-green-400 text-sm">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2">
            <div className="h-[600px] rounded-xl overflow-hidden shadow-xl">
              {userId && (
                <PodChat
                  podId={podId}
                  userId={userId}
                  userName={userName}
                  userRole={userRole}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
