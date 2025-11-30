"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProgressDashboard from "@/components/progress/ProgressDashboard";
import NotificationPanel from "@/components/NotificationPanel";
import PodSettingsModal from "@/components/modals/PodSettingsModal";
import { 
  Users, Calendar, Target, Award, Bell, LogOut, Video, 
  Plus, Search, TrendingUp, Clock, CheckCircle, Star, 
  UserCheck, Settings, Menu, X, MessageSquare, Building2,
  ChevronRight, Sparkles, Zap, AlertCircle
} from "lucide-react";

// Add global styles for animations
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse-subtle {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

// Modal Dialog Component
const Modal = ({ isOpen, onClose, children, title }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-alt rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 bg-slate-900/40 border border-slate-700/50">
        <div className="sticky top-0 bg-slate-900/40 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const useUserData = (userId: string) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/user?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  return { user, loading };
};

const usePodsData = (userId: string) => {
  const [pods, setPods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // No mock template pods - only show user's actual pods (100% personalized)
  // Users must create their own pods to see them
  const mockTemplatePods = []; // Empty - no templates

  const fetchPodsData = async () => {
    try {
      const response = await fetch(`/api/pods?userId=${userId}`);
      const data = await response.json();
      
      // Only show actual user pods from API (100% personalized)
      if (data.success && data.pods && data.pods.length > 0) {
        setPods(data.pods);
      } else {
        // If no pods, show empty state (not mock templates)
        console.log('No pods found - user has not created any pods yet');
        setPods([]);
      }
    } catch (error) {
      console.error('Error fetching pods data:', error);
      // On error, show empty state
      setPods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchPodsData();
  }, [userId]);

  return { pods, loading, refetch: fetchPodsData };
};

export default function InteractiveDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pods' | 'meetings' | 'progress'>('overview');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [meetingsError, setMeetingsError] = useState<string | null>(null);
  
  // Progress/Goals/Skills state
  const [careerInterests, setCareerInterests] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  
  // Modal states
  const [createPodModal, setCreatePodModal] = useState(false);
  const [meetingModal, setMeetingModal] = useState(false);
  const [selectedPodForMeeting, setSelectedPodForMeeting] = useState<string | null>(null);
  const [goalModal, setGoalModal] = useState(false);
  const [mentorModal, setMentorModal] = useState(false);
  const [materialsModal, setMaterialsModal] = useState(false);
  const [selectedPodForMaterials, setSelectedPodForMaterials] = useState<string | null>(null);
  const [discoverModal, setDiscoverModal] = useState(false);
  const [podSettingsModal, setPodSettingsModal] = useState(false);
  const [selectedPodForSettings, setSelectedPodForSettings] = useState<any>(null);
  const [memberModal, setMemberModal] = useState(false);
  const [selectedPodMembers, setSelectedPodMembers] = useState<any[]>([]);
  const [videoCallModal, setVideoCallModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  
  // Materials state
  const [materials, setMaterials] = useState<any[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  
  // Discover Pods state
  const [discoverSearchQuery, setDiscoverSearchQuery] = useState('');
  const [discoveredPods, setDiscoveredPods] = useState<any[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  
  // Form states
  const [podForm, setPodForm] = useState({ name: '', description: '' });
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', time: '', maxAttendees: 5 });
  const [goalForm, setGoalForm] = useState({ goal: '', deadline: '', category: '', priority: 'MEDIUM' });
  const [mentorForm, setMentorForm] = useState({ field: '', experience: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', type: 'note', content: '', url: '' });
  
  // Custom hooks untuk data
  const { user, loading: userLoading } = useUserData(userId || '');
  const { pods, loading: podsLoading, refetch: refetchPods } = usePodsData(userId || '');

  useEffect(() => {
    // Get user data from localStorage on component mount
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Redirect to login if no user data
      window.location.href = '/login';
    }
  }, []);

  // Fetch meetings when meetings tab is active
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!userId) return;
      setMeetingsLoading(true);
      setMeetingsError(null);
      try {
        const res = await fetch('/api/meetings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId
          }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setMeetings(data.meetings || []);
        } else {
          setMeetings([]);
          setMeetingsError(data.error || 'Failed to load meetings');
        }
      } catch (err: any) {
        console.error('Error fetching meetings:', err);
        setMeetings([]);
        setMeetingsError(err?.message || 'Network error');
      } finally {
        setMeetingsLoading(false);
      }
    };

    if (activeTab === 'meetings') fetchMeetings();
  }, [activeTab, userId]);

  // Fetch progress/goals/skills
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;
      setProgressLoading(true);
      try {
        const res = await fetch(`/api/progress?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setCareerInterests(data.careerInterests || []);
          setSkills(data.skills || []);
          setProgress(data.progress || []);
          console.log('✅ Fetched career interests:', data.careerInterests?.length);
          console.log('✅ Fetched progress items:', data.progress?.length);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setProgressLoading(false);
      }
    };

    if (userId) fetchProgress();
  }, [userId]);

  // 🎯 INTERACTIVE FUNCTIONS - Form handlers untuk modal
  const handleCreatePodSubmit = async (e: any) => {
    e?.preventDefault();
    if (!podForm.name.trim()) {
      alert('Please enter a pod name');
      return;
    }

    if (!userId) {
      alert('❌ Error: User ID not found. Please reload the page.');
      return;
    }

    try {
      console.log('Creating pod with userId:', userId);
      const response = await fetch('/api/pods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: podForm.name,
          description: podForm.description,
          userId: userId,
          maxMembers: 8
        })
      });
      
      const data = await response.json();
      console.log('Pod creation response:', data);
      if (data.success) {
        setPodForm({ name: '', description: '' });
        setCreatePodModal(false);
        // Refresh pods from custom hook
        refetchPods();
        alert('✅ Pod created successfully!');
      } else {
        alert('❌ Failed to create pod: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Pod creation error:', error);
      alert('❌ Error creating pod: ' + error);
    }
  };

  const handleScheduleMeetingSubmit = async (e: any) => {
    e?.preventDefault();
    if (!meetingForm.title.trim()) {
      alert('Please enter a meeting title');
      return;
    }

    if (!meetingForm.date || !meetingForm.time) {
      alert('Please select both date and time');
      return;
    }

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          title: meetingForm.title,
          podId: selectedPodForMeeting,
          date: meetingForm.date,
          time: meetingForm.time,
          duration: 60,
          type: 'video'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('✅ Meeting scheduled successfully!');
        setMeetingForm({ title: '', date: '', time: '', maxAttendees: 5 });
        setMeetingModal(false);
        setSelectedPodForMeeting(null);
        // Refresh meetings
        const res = await fetch('/api/meetings', {
          headers: { 'x-user-id': userId || '' }
        });
        const meetsData = await res.json();
        if (meetsData.success) setMeetings(meetsData.meetings || []);
      } else {
        alert(`❌ Error: ${data.error || 'Failed to schedule meeting'}`);
      }
    } catch (error) {
      alert('❌ Error scheduling meeting: ' + error);
    }
  };

  const handleSetGoalSubmit = async (e: any) => {
    e?.preventDefault();
    if (!goalForm.goal.trim()) {
      alert('Please enter a goal');
      return;
    }
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalForm.goal,
          category: goalForm.category,
          deadline: goalForm.deadline,
          priority: goalForm.priority,
          userId: userId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setGoalForm({ goal: '', deadline: '', category: '', priority: 'MEDIUM' });
        setGoalModal(false);
        // Refresh goals
        const res = await fetch(`/api/progress?userId=${userId}`);
        const progData = await res.json();
        if (progData.success) {
          setCareerInterests(progData.careerInterests || []);
          setProgress(progData.progress || []);
        }
        const goalName = data.goal?.role || goalForm.goal;
        alert(`✅ Goal "${goalName}" saved successfully!`);
      } else {
        alert('❌ Failed to save goal: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ Error saving goal: ' + error);
    }
  };

  const handleFindMentorSubmit = async (e: any) => {
    e?.preventDefault();
    if (!mentorForm.field.trim()) {
      alert('Please specify the field');
      return;
    }
    alert(`✅ Mentor request sent! Looking for someone with ${mentorForm.experience} experience in ${mentorForm.field}`);
    setMentorForm({ field: '', experience: '' });
    setMentorModal(false);
  };

  const handleJoinMeeting = (meeting: any) => {
    console.log('🎯 handleJoinMeeting called with:', meeting);
    if (!meeting.joinUrl) {
      alert('❌ Meeting room link not yet available. Meeting may not have started.');
      return;
    }
    console.log('📱 Setting selectedMeeting with joinUrl:', meeting.joinUrl);
    setSelectedMeeting(meeting);
    setVideoCallModal(true);
  };

  const handleScheduleMeeting = (podId: string) => {
    setSelectedPodForMeeting(podId);
    setMeetingModal(true);
  };

  const handleCreatePod = () => {
    setCreatePodModal(true);
  };

  const handleSetGoal = () => {
    setGoalModal(true);
  };

  const handleFindMentor = () => {
    setMentorModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const fetchPodMaterials = async (podId: string) => {
    setMaterialsLoading(true);
    try {
      const res = await fetch(`/api/pod-materials?podId=${podId}`);
      const data = await res.json();
      if (data.success) {
        setMaterials(data.materials || []);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleOpenMaterials = (podId: string) => {
    setSelectedPodForMaterials(podId);
    setMaterialsModal(true);
    fetchPodMaterials(podId);
  };

  const handleOpenMembers = (pod: any) => {
    setSelectedPodMembers(pod?.memberships || []);
    setMemberModal(true);
  };

  const handleAddMaterialSubmit = async (e: any) => {
    e?.preventDefault();
    if (!materialForm.title.trim()) {
      alert('Please enter a material title');
      return;
    }

    if (!selectedPodForMaterials || !userId) {
      alert('Error: Pod or user ID missing');
      return;
    }

    try {
      const response = await fetch('/api/pod-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podId: selectedPodForMaterials,
          title: materialForm.title,
          description: materialForm.description,
          type: materialForm.type,
          content: materialForm.content,
          url: materialForm.url,
          uploadedBy: userId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Material added successfully!');
        setMaterialForm({ title: '', description: '', type: 'note', content: '', url: '' });
        // Refresh materials list
        if (selectedPodForMaterials) {
          await fetchPodMaterials(selectedPodForMaterials);
        }
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Error adding material: ' + error);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Delete this material?')) return;

    try {
      const response = await fetch(`/api/pod-materials?id=${materialId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Material deleted!');
        // Refresh materials list
        if (selectedPodForMaterials) {
          await fetchPodMaterials(selectedPodForMaterials);
        }
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Error deleting material: ' + error);
    }
  };

  const handleDiscoverPods = () => {
    setDiscoverModal(true);
    setDiscoverSearchQuery('');
    setDiscoveredPods([]);
  };

  const handleSearchPods = async (query: string = discoverSearchQuery) => {
    if (!query.trim()) {
      setDiscoveredPods([]);
      return;
    }

    setDiscoverLoading(true);
    try {
      const response = await fetch(`/api/pods/discover?search=${encodeURIComponent(query)}&userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setDiscoveredPods(data.pods || []);
      } else {
        setDiscoveredPods([]);
      }
    } catch (error) {
      console.error('Error searching pods:', error);
      setDiscoveredPods([]);
    } finally {
      setDiscoverLoading(false);
    }
  };

  const handleJoinPod = async (podId: string) => {
    if (!userId) {
      alert('Error: User ID missing');
      return;
    }

    try {
      const response = await fetch('/api/pods/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podId: podId,
          userId: userId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Successfully joined the pod!');
        // Refresh pods list
        refetchPods();
        // Search again to update the list
        await handleSearchPods();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Error joining pod: ' + error);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            {/* Left: Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center glow-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold gradient-text">Career Explorer</h1>
                <p className="text-xs text-slate-400">Grow together in pods</p>
              </div>
            </div>

            {/* Right: User & Actions */}
            <div className="flex items-center space-x-5">
              <NotificationPanel userId={userId} />
              <Button variant="ghost" size="icon" onClick={() => window.location.href = '/find-people'} className="hover:bg-slate-800/50">
                <Search className="w-5 h-5 text-slate-400" />
              </Button>
              
              <div className="flex items-center space-x-3 pl-5 border-l border-slate-700/50">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-100">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">{user?.major || 'Computer Science'}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-0">
                      <Avatar className="w-9 h-9 ring-2 ring-blue-100">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?edit=true">Edit Profile</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="border-slate-700/50 text-slate-300 hover:bg-slate-800">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Improved */}
      <div className="glass-alt border-b border-slate-700/50 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: Target },
              { id: 'pods', name: 'My Pods', icon: Users },
              { id: 'meetings', name: 'Meetings', icon: Calendar },
              { id: 'progress', name: 'Progress', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium transition-all ${
                    isActive
                      ? 'border-cyan-400 text-cyan-400 bg-slate-800/50'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-slate-400">Here's your career exploration progress at a glance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div 
                className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Active Pods</span>
                  <Users className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-3xl font-bold text-slate-100">{pods.length}</p>
                <p className="text-xs text-slate-400 mt-1">You're in {pods.length} {pods.length === 1 ? 'pod' : 'pods'}</p>
              </div>

              <div 
                className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.1s forwards' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Upcoming Meetings</span>
                  <Calendar className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-3xl font-bold text-slate-100">{meetings.length}</p>
                <p className="text-xs text-slate-400 mt-1">Scheduled this week</p>
              </div>

              <div 
                className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.2s forwards' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Career Goals</span>
                  <Target className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-3xl font-bold text-slate-100">{careerInterests.length}</p>
                <p className="text-xs text-slate-400 mt-1">Active {careerInterests.length === 1 ? 'goal' : 'goals'}</p>
              </div>

              <div 
                className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.3s forwards' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Achievements</span>
                  <Star className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-3xl font-bold text-slate-100">{progress.filter((p: any) => p.achievedAt).length}</p>
                <p className="text-xs text-slate-400 mt-1">Milestones unlocked</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-8">
              <h2 className="text-xl font-semibold text-slate-100 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={handleCreatePod}
                  className="flex flex-col items-center justify-center p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="font-medium text-slate-300 text-sm">Create Pod</span>
                </button>

                <button 
                  onClick={handleDiscoverPods}
                  className="flex flex-col items-center justify-center p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                    <Search className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="font-medium text-slate-300 text-sm">Find Pods</span>
                </button>

                <button 
                  onClick={handleSetGoal}
                  className="flex flex-col items-center justify-center p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="font-medium text-slate-300 text-sm">Set Goals</span>
                </button>

                <button 
                  onClick={handleFindMentor}
                  className="flex flex-col items-center justify-center p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="font-medium text-slate-300 text-sm">Find Mentor</span>
                </button>
              </div>
            </div>

            {/* Achievement Badges Section */}
            <div className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Your Achievements</h2>
                  <p className="text-sm text-slate-400 mt-1">Milestones you've unlocked</p>
                </div>
                {progress.filter((p: any) => p.achievedAt).length > 0 && (
                  <span className="text-2xl font-bold text-yellow-400">{progress.filter((p: any) => p.achievedAt).length}</span>
                )}
              </div>

              {progress.filter((p: any) => p.achievedAt).length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No achievements yet. Start working on your goals!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {progress.filter((p: any) => p.achievedAt).map((achievement: any, idx: number) => (
                    <div
                      key={achievement.id}
                      className="flex flex-col items-center p-4 rounded-lg glass-alt border border-slate-700/50 bg-slate-800/30 hover:shadow-md transition-all"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${idx * 0.05}s forwards`,
                        opacity: 0
                      }}
                    >
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-100 text-center line-clamp-2">
                        Skill Level {achievement.level}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {achievement.achievedAt ? new Date(achievement.achievedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pods Tab */}
        {activeTab === 'pods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-100">My Pods</h2>
                <p className="text-slate-400 mt-1">Join or create pods to collaborate with peers</p>
              </div>
              <Button onClick={handleCreatePod} className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Pod
              </Button>
            </div>

            {podsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="mt-4 text-slate-400">Loading pods...</p>
              </div>
            ) : pods.length === 0 ? (
              <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-12 text-center bg-slate-900/20">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">No Pods Yet</h3>
                <p className="text-slate-400 mb-6 max-w-sm mx-auto">Create your first pod to start your career journey. Your pods will be 100% personalized to your interests and goals.</p>
                <Button onClick={handleCreatePod} className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Pod
                </Button>
              </div>
            ) : (
              <div className="grid gap-5">
                {pods.map((pod: any, idx: number) => (
                  <div 
                    key={pod.id}
                    className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-6 hover:shadow-xl hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 group"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s forwards`,
                      opacity: 0
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {pod.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100 text-lg">{pod.name}</h3>
                            {pod.isTemplate && (
                              <span className="text-xs px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-full font-medium">Template</span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm ml-13">{pod.description}</p>
                      </div>
                      <Badge 
                        variant={pod.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={pod.status === 'ACTIVE' ? 'bg-green-900/50 text-green-300 border-green-700/50' : ''}
                      >
                        {pod.status || 'Active'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2.5">
                            {pod.memberships?.slice(0, 3).map((membership: any) => (
                              <Avatar key={membership.id} className="w-8 h-8 border-2 border-white ring-1 ring-slate-200">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700 font-medium">
                                  {membership.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {pod.memberships && pod.memberships.length > 3 && (
                              <div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center ring-1 ring-slate-200">
                                <span className="text-xs font-semibold text-slate-700">+{pod.memberships.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-slate-400">
                            {pod.memberships?.length || 0} {pod.memberships?.length === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => window.location.href = `/pods/${pod.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <MessageSquare className="w-4 h-4 mr-1.5" />
                          Chat
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleScheduleMeeting(pod.id)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Calendar className="w-4 h-4 mr-1.5" />
                          Meet
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleOpenMaterials(pod.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Sparkles className="w-4 h-4 mr-1.5" />
                          Materials
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenMembers(pod)}
                          variant="outline"
                          className="border-slate-700/50 text-slate-300 hover:bg-slate-800"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Members
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedPodForSettings(pod);
                            setPodSettingsModal(true);
                          }}
                          className="border-slate-700/50 text-slate-300 hover:bg-slate-800"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Career Progress</h2>
              <p className="text-slate-400 mt-1">Track your skill development and career milestones</p>
            </div>

            {progressLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="mt-4 text-slate-400">Loading progress data...</p>
              </div>
            ) : (
              <div>
                <ProgressDashboard
                  userId={userId || ''}
                  skills={skills}
                  careerInterests={careerInterests}
                  progress={progress}
                  onRefresh={() => {
                    // Trigger refresh
                    const fetchProgress = async () => {
                      setProgressLoading(true);
                      try {
                        const res = await fetch(`/api/progress?userId=${userId}`);
                        const data = await res.json();
                        if (data.success) {
                          setProgress(data.progress || []);
                          setSkills(data.skills || []);
                          setCareerInterests(data.careerInterests || []);
                        }
                      } catch (err) {
                        console.error('Error fetching progress:', err);
                      } finally {
                        setProgressLoading(false);
                      }
                    };
                    fetchProgress();
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Upcoming Meetings</h2>
              <p className="text-slate-400 mt-1">Connect with your pod members and mentors</p>
            </div>

            {meetingsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="mt-4 text-slate-400">Loading meetings...</p>
              </div>
            ) : meetingsError ? (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <p className="text-sm text-red-300">{meetingsError}</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-12 text-center bg-slate-900/20">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">No Meetings Scheduled</h3>
                <p className="text-slate-400 max-w-sm mx-auto">Your calendar is empty. Schedule meetings with your pod members to start collaborating on your career goals.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.map((m: any) => (
                  <div 
                    key={m.id} 
                    className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-5 hover:shadow-lg hover:border-cyan-500/30 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-100 text-lg">{m.title}</h3>
                          <Badge className="bg-slate-800 text-cyan-300 border-slate-700 capitalize">
                            {m.type || 'video'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{m.podName || 'Pod'}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{m.date} {m.time}</span>
                          </div>
                        </div>
                        {m.mentor && (
                          <div className="text-sm text-slate-400">
                            <span className="font-medium">Mentor:</span> {m.mentor}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button 
                          size="sm"
                          onClick={() => handleJoinMeeting(m)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Video className="w-4 h-4 mr-1.5" />
                          Join Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-700/50 text-slate-300 hover:bg-slate-800"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-alt border-t border-slate-700/50 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'overview' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="text-xs">Overview</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('pods')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'pods' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">Pods</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('meetings')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'meetings' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Meetings</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('progress')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'progress' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Progress</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      
      {/* Create Pod Modal */}
      <Modal isOpen={createPodModal} onClose={() => setCreatePodModal(false)} title="✨ Create New Pod">
        <form onSubmit={handleCreatePodSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Pod Name</label>
            <Input
              placeholder="e.g., Product Design Collective"
              value={podForm.name}
              onChange={(e) => setPodForm({ ...podForm, name: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <Textarea
              placeholder="What's this pod about? Who should join? What will you learn?"
              value={podForm.description}
              onChange={(e) => setPodForm({ ...podForm, description: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 min-h-24"
            />
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Pod
          </Button>
        </form>
      </Modal>

      {/* Schedule Meeting Modal */}
      <Modal isOpen={meetingModal} onClose={() => setMeetingModal(false)} title="📅 Schedule Meeting">
        <form onSubmit={handleScheduleMeetingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Meeting Title</label>
            <Input
              placeholder="e.g., Weekly Sync"
              value={meetingForm.title}
              onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <Input
                type="date"
                value={meetingForm.date}
                onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                className="border-slate-700/50 bg-slate-800/30 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
              <Input
                type="time"
                value={meetingForm.time}
                onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                className="border-slate-700/50 bg-slate-800/30 text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Max Attendees</label>
            <Input
              type="number"
              min="2"
              max="50"
              value={meetingForm.maxAttendees}
              onChange={(e) => setMeetingForm({ ...meetingForm, maxAttendees: parseInt(e.target.value) })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100"
            />
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </form>
      </Modal>

      {/* Pod Materials Modal */}
      <Modal isOpen={materialsModal} onClose={() => setMaterialsModal(false)} title="📚 Pod Materials">
        <div className="space-y-6">
          {/* Add Material Form */}
          <div className="border-b border-slate-700/50 pb-6">
            <h3 className="font-semibold text-slate-300 mb-4">➕ Add New Material</h3>
            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                <Input
                  placeholder="e.g., React Hooks Guide"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <Input
                  placeholder="Brief description"
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <select 
                  value={materialForm.type}
                  onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-700/50 rounded-lg text-slate-100 bg-slate-800/30"
                >
                  <option value="note">📝 Note</option>
                  <option value="document">📄 Document</option>
                  <option value="resource">🔗 Resource Link</option>
                  <option value="link">🌐 Web Link</option>
                </select>
              </div>

              {materialForm.type === 'note' || materialForm.type === 'document' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                  <Textarea
                    placeholder="Enter your note or document content..."
                    value={materialForm.content}
                    onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                    className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 min-h-[100px]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={materialForm.url}
                    onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                    className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </form>
          </div>

          {/* Materials List */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">📚 Materials ({materials.length})</h3>
            {materialsLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-400">Loading materials...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No materials yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {materials.map((material: any) => (
                  <div key={material.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {material.type === 'note' && '📝'}
                            {material.type === 'document' && '📄'}
                            {material.type === 'resource' && '🔗'}
                            {material.type === 'link' && '🌐'}
                          </span>
                          <h4 className="font-semibold text-slate-100">{material.title}</h4>
                        </div>
                        {material.description && (
                          <p className="text-sm text-slate-400 mb-2">{material.description}</p>
                        )}
                        {material.content && (
                          <p className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded border border-slate-700/50 mb-2 line-clamp-2">
                            {material.content}
                          </p>
                        )}
                        {material.url && (
                          <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline block mb-2">
                            {material.url}
                          </a>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>By {material.user?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Delete material"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Pod Members Modal */}
      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="👥 Pod Members">
        <div className="space-y-4">
          {selectedPodMembers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400">No members found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedPodMembers.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between p-3 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      {m.user?.avatar ? <AvatarImage src={m.user.avatar} alt={m.user?.name} /> : <AvatarFallback className="bg-cyan-600/50 text-slate-100">{m.user?.name?.charAt(0)}</AvatarFallback>}
                    </Avatar>
                    <div>
                      <a href={`/user/${m.user?.id}`} className="font-medium text-slate-100 hover:text-cyan-400 transition-colors">{m.user?.name || 'Unknown'}</a>
                      <div className="text-xs text-slate-400">{m.role || 'member'}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Set Goal Modal */}
      <Modal isOpen={goalModal} onClose={() => setGoalModal(false)} title="🎯 Set Career Goal">
        <form onSubmit={handleSetGoalSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              🎯 What role are you targeting?
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-3">
              {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager', 'Tech Lead', 'DevOps Engineer', 'UI/UX Designer', 'QA Engineer', 'Solutions Architect', 'Cloud Architect', 'AI/ML Engineer'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setGoalForm({ ...goalForm, goal: role })}
                  className={`p-2 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                    goalForm.goal === role
                      ? 'border-cyan-500/50 bg-cyan-600/20 text-cyan-300'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <Input
              placeholder="Or enter your own role..."
              value={goalForm.goal}
              onChange={(e) => setGoalForm({ ...goalForm, goal: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              📈 What industry?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Entertainment', 'Manufacturing', 'Logistics', 'Marketing', 'Consulting', 'Energy', 'Real Estate'].map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => setGoalForm({ ...goalForm, category: industry })}
                  className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    goalForm.category === industry
                      ? 'border-green-500/50 bg-green-600/20 text-green-300'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 text-slate-300'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
            <Input
              placeholder="Or enter your own industry..."
              value={goalForm.category}
              onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 mt-3"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">⏰ Target Deadline</label>
            <Input
              type="date"
              value={goalForm.deadline}
              onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Priority</label>
            <div className="flex gap-3">
              {[
                { value: 'LOW', label: '🟢 Low', color: 'border-green-500/50 bg-green-600/20 text-green-300' },
                { value: 'MEDIUM', label: '🟡 Medium', color: 'border-yellow-500/50 bg-yellow-600/20 text-yellow-300' },
                { value: 'HIGH', label: '🔴 High', color: 'border-red-500/50 bg-red-600/20 text-red-300' }
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGoalForm({ ...goalForm, priority: value })}
                  className={`flex-1 p-3 rounded-lg border-2 font-medium transition-all ${
                    goalForm.priority === value
                      ? `${color} border-solid`
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2">
            <Target className="w-4 h-4 mr-2" />
            Set Goal
          </Button>
        </form>
      </Modal>

      {/* Find Mentor Modal */}
      <Modal isOpen={mentorModal} onClose={() => setMentorModal(false)} title="👥 Find a Mentor">
        <form onSubmit={handleFindMentorSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Field of Interest</label>
            <Input
              placeholder="e.g., Product Management, Full Stack Development"
              value={mentorForm.field}
              onChange={(e) => setMentorForm({ ...mentorForm, field: e.target.value })}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Experience Level</label>
            <select 
              value={mentorForm.experience}
              onChange={(e) => setMentorForm({ ...mentorForm, experience: e.target.value })}
              className="w-full px-3 py-2 border border-slate-700/50 rounded-lg text-slate-100 bg-slate-800/30"
            >
              <option value="">Select level</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          <div className="bg-cyan-600/20 border border-cyan-500/50 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-cyan-300">We'll match you with available mentors in your field</p>
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2">
            <UserCheck className="w-4 h-4 mr-2" />
            Find Mentor
          </Button>
        </form>
      </Modal>

      {/* Discover Pods Modal */}
      <Modal isOpen={discoverModal} onClose={() => setDiscoverModal(false)} title="🔍 Discover Pods">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Search Pods</label>
            <div className="flex gap-2">
              <Input
                placeholder="Search by pod name or topic..."
                value={discoverSearchQuery}
                onChange={(e) => setDiscoverSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPods()}
                className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 flex-1"
              />
              <Button 
                onClick={() => handleSearchPods()}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Available Pods</h3>
            
            {discoverLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                <p className="text-sm text-slate-400">Searching pods...</p>
              </div>
            ) : discoveredPods.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <Search className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400">
                  {discoverSearchQuery ? 'No pods found. Try different keywords!' : 'Enter a search term to discover pods'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {discoveredPods.map((pod: any) => (
                  <div key={pod.id} className="border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all bg-slate-800/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-100">{pod.name}</h4>
                        <p className="text-sm text-slate-400 mt-1">{pod.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{pod.memberships?.length || 0} members</span>
                      </div>
                      <Button 
                        onClick={() => handleJoinPod(pod.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Join Pod
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Video Call Modal with Daily.co Iframe */}
      <Modal isOpen={videoCallModal} onClose={() => { setVideoCallModal(false); setSelectedMeeting(null); }} title={`📞 ${selectedMeeting?.title || 'Video Call'}`}>
        <div className="space-y-4">
          {selectedMeeting?.joinUrl ? (
            <div>
              <p className="text-sm text-slate-400 mb-4">Connecting to the video call...</p>
              <div className="bg-slate-800/30 rounded-lg overflow-hidden aspect-video flex items-center justify-center border border-slate-700/50">
                <iframe
                  src={selectedMeeting.joinUrl}
                  title="Daily.co Video Call"
                  allow="camera; microphone; display-capture"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
              <div className="mt-4 p-3 bg-cyan-600/20 border border-cyan-500/50 rounded-lg">
                <p className="text-sm text-cyan-300">
                  💡 <strong>Tip:</strong> Allow camera and microphone permissions to participate in the call.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Meeting room is not yet available.</p>
              <p className="text-xs text-slate-500 mt-1">The room will be ready when the meeting host joins.</p>
              <Button 
                onClick={() => window.open(selectedMeeting?.joinUrl, '_blank')} 
                disabled={!selectedMeeting?.joinUrl}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Pod Settings Modal */}
      <PodSettingsModal
        isOpen={podSettingsModal}
        onClose={() => {
          setPodSettingsModal(false);
          setSelectedPodForSettings(null);
        }}
        pod={selectedPodForSettings}
        userId={userId}
        onSave={() => {
          setPodSettingsModal(false);
          setSelectedPodForSettings(null);
          refetchPods();
        }}
      />
    </div>
  );
}