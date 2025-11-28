"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Calendar, 
  Target, 
  Award, 
  Bell,
  LogOut,
  Video,
  Plus,
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  UserCheck,
  Settings,
  ChevronRight,
  UserPlus,
  MessageSquare,
  Briefcase,
  Zap,
  Shield,
  Database,
  Activity,
  Trash2,
  Edit,
  Menu,
  X,
  Inbox,
  Rocket,
  Lightbulb,
  Target as TargetIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  major: string;
  year: number;
  avatar?: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
  studentId?: string;
  careerClarityScore?: number; // Tambahkan ini
  careerInterests?: string[];
}

interface Pod {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  memberCount: number;
  maxMembers: number;
  nextMeeting?: {
    title: string;
    date: string;
    time: string;
    type: string;
  };
  progress: {
    completed: number;
    total: number;
  };
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  createdAt: string;
}

interface Meeting {
  id: string;
  title: string;
  podName: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  attendees: number;
  maxAttendees: number;
  mentor?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'pending';
  createdAt: string;
}

interface Skill {
  name: string;
  level: number;
  maxLevel: number;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'skill' | 'meeting' | 'pod' | 'achievement';
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  availability: string;
  expertise: string[];
}

interface AdminStats {
  totalUsers: number;
  totalPods: number;
  totalMeetings: number;
  activePods: number;
}

// Personalization functions
const getPersonalizedWelcome = (user: User | null, goals: Goal[], pods: Pod[]) => {
  const timeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const pendingGoals = goals.filter(g => g.status !== 'completed').length;
  const activePods = pods.length;

  let message = `${timeBasedGreeting()}, ${user?.name || 'there'}! `;

  if (pendingGoals > 0 && activePods > 0) {
    message += `You have ${pendingGoals} goals to complete and ${activePods} active pod${activePods > 1 ? 's' : ''}. Keep going! 💪`;
  } else if (pendingGoals > 0) {
    message += `You have ${pendingGoals} goal${pendingGoals > 1 ? 's' : ''} waiting for you. Let's make progress! 🎯`;
  } else if (activePods > 0) {
    message += `Great work with ${activePods} active pod${activePods > 1 ? 's' : ''}! Your career journey is underway! 🚀`;
  } else {
    message += "Ready to start your career exploration journey? Join your first pod!";
  }

  return message;
};

const getCareerClarityInsight = (score: number, interests?: string[]) => {
  if (score >= 80) {
    const primaryInterest = interests?.[0] || 'your field';
    return `Amazing! Your career path in ${primaryInterest} is clear! 🌟`;
  }
  if (score >= 60) {
    return `You're making great progress in defining your career goals! 💪`;
  }
  if (score >= 40) {
    return `You're exploring your options. Let's continue discovering your interests! 🗺️`;
  }
  return `Let's start exploring different career paths to find what excites you! 🔍`;
};

const getRecommendedActions = (pods: Pod[] = [], goals: Goal[] = [], user?: any) => {
  const actions: string[] = [];
  
  // Safe access untuk semua properti user
  const clarityScore = user?.careerClarityScore || 0;
  const careerInterests = user?.careerInterests || [];
  
  // Career clarity based
  if (clarityScore < 40) {
    actions.push('Take career assessment quiz');
  } else if (clarityScore < 70) {
    actions.push('Refine your career goals');
  }
  
  // Pods based
  if (!pods || pods.length === 0) {
    actions.push('Join your first career pod');
  } else if (pods.length < 2) {
    actions.push('Explore more career pods');
  }
  
  // Goals based
  if (!goals || goals.length === 0) {
    actions.push('Set your first career goal');
  } else {
    const incompleteGoals = goals.filter(g => g?.status !== 'completed').length;
    if (incompleteGoals > 0) {
      actions.push(`Work on ${incompleteGoals} goal${incompleteGoals > 1 ? 's' : ''}`);
    }
  }
  
  // Meetings based
  if (pods && pods.length > 0) {
    const upcomingMeetings = pods.filter(p => p?.nextMeeting).length;
    if (upcomingMeetings > 0) {
      actions.push(`Attend ${upcomingMeetings} meeting${upcomingMeetings > 1 ? 's' : ''}`);
    }
  }
  
  // Career interests based - dengan fallback yang aman
  if (careerInterests.length > 0) {
    const primaryInterest = careerInterests[0];
    actions.push(`Build ${primaryInterest} skills`);
  } else {
    actions.push('Discover your career interests');
  }
  
  // Return max 3 most relevant actions
  return actions.slice(0, 3);
};

// Custom hook for dashboard data
const useStudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState<{
    user: User;
    pods: Pod[];
    meetings: Meeting[];
    goals: Goal[];
    skills: Skill[];
    achievements: Achievement[];
    progress: {
      careerClarityScore: number;
      goalsCompleted: number;
      meetingsAttended: number;
      skillsProgress: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await fetch(`/api/student/dashboard?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load dashboard: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refetch = () => {
    window.location.reload();
  };

  return { dashboardData, loading, error, refetch };
};

export default function ProgressBasedDashboard() {
  const { dashboardData, loading, error, refetch } = useStudentDashboard();
  
  const [user, setUser] = useState<User | null>(null);
  const [dashboardMode, setDashboardMode] = useState<'student' | 'admin'>('student');
  const [pods, setPods] = useState<Pod[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminPods, setAdminPods] = useState<Pod[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPods: 0,
    totalMeetings: 0,
    activePods: 0
  });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState(0);

  // Update states when dashboard data loads
  useEffect(() => {
    if (dashboardData) {
      setUser(dashboardData.user);
      setPods(dashboardData.pods);
      setMeetings(dashboardData.meetings);
      setGoals(dashboardData.goals);
      setSkills(dashboardData.skills);
      setAchievements(dashboardData.achievements);
    }
  }, [dashboardData]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadStudentData = async (userId: string) => {
    try {
      console.log('🔄 Loading student data for user:', userId);

      const [podsResponse, meetingsResponse] = await Promise.all([
        fetch(`/api/pods?userId=${userId}`).catch(() => null),
        fetch(`/api/meetings?userId=${userId}`).catch(() => null)
      ]);

      // Handle pods response
      if (podsResponse && podsResponse.ok) {
        try {
          const podsData = await podsResponse.json();
          if (podsData.success) {
            setPods(podsData.pods || []);
            console.log('✅ Pods loaded:', podsData.pods?.length || 0);
          } else {
            console.warn('⚠️ Pods API returned unsuccessful response');
            setPods([]);
          }
        } catch (jsonError) {
          console.error('❌ Error parsing pods JSON:', jsonError);
          setPods([]);
        }
      } else {
        console.warn('⚠️ Pods API not available or network error');
        setPods([]);
      }

      // Handle meetings response
      if (meetingsResponse && meetingsResponse.ok) {
        try {
          const meetingsData = await meetingsResponse.json();
          if (meetingsData.success) {
            setMeetings(meetingsData.meetings || []);
            console.log('✅ Meetings loaded:', meetingsData.meetings?.length || 0);
          } else {
            console.warn('⚠️ Meetings API returned unsuccessful response');
            setMeetings([]);
          }
        } catch (jsonError) {
          console.error('❌ Error parsing meetings JSON:', jsonError);
          setMeetings([]);
        }
      } else {
        console.warn('⚠️ Meetings API not available or network error');
        setMeetings([]);
      }

      // Reset other data
      setGoals([]);
      setSkills([]);
      setAchievements([]);
      setActivities([]);
      setMentors([]);

    } catch (error) {
      console.error('❌ Error loading student data:', error);
      setPods([]);
      setMeetings([]);
      setGoals([]);
      setSkills([]);
      setAchievements([]);
      setActivities([]);
      setMentors([]);
    }
  };

  const loadAdminData = async () => {
    try {
      const [usersResponse, podsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/pods')
      ]);

      const usersData = await usersResponse.json();
      const podsData = await podsResponse.json();

      if (usersData.success) {
        setAdminUsers(usersData.users || []);
      }

      if (podsData.success) {
        setAdminPods(podsData.pods || []);
      }

      const totalUsers = usersData.users?.length || 0;
      const totalPods = podsData.pods?.length || 0;
      const activePods = podsData.pods?.filter((p: Pod) => p.status === 'ACTIVE').length || 0;

      setAdminStats({
        totalUsers,
        totalPods,
        totalMeetings: 0,
        activePods
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userRole = localStorage.getItem('userRole') || 'STUDENT';
      
      if (userId && userName) {
        const userData: User = {
          id: userId,
          name: userName,
          email: 'student@presuniv.ac.id',
          major: 'Computer Science',
          year: 2,
          role: userRole as 'STUDENT' | 'MENTOR' | 'ADMIN',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
          studentId: `STD${userId.slice(0, 8).toUpperCase()}`
        };
        
        setUser(userData);
        setDashboardMode(userData.role === 'ADMIN' ? 'admin' : 'student');
        
        if (userData.role === 'ADMIN') {
          await loadAdminData();
        } else {
          await loadStudentData(userId);
        }
      } else {
        window.location.href = '/login';
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeUpdates(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const handleModeSwitch = async (mode: 'student' | 'admin') => {
    setDashboardMode(mode);
    
    if (mode === 'admin') {
      await loadAdminData();
    } else if (user) {
      await loadStudentData(user.id);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId, 
          role: newRole 
        })
      });
      
      if (response.ok) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Delete ${userName}?`)) {
      try {
        const response = await fetch(`/api/admin/users?userId=${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          loadAdminData();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Award className="w-4 h-4 text-green-600" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'pod': return <Users className="w-4 h-4 text-purple-600" />;
      case 'achievement': return <Star className="w-4 h-4 text-yellow-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-600">⚠️</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Personalized content
  const welcomeMessage = getPersonalizedWelcome(user, goals, pods);
  const careerInsight = getCareerClarityInsight(user.careerClarityScore || 0, user.careerInterests);
  const recommendedActions = getRecommendedActions(pods, goals);
  const goalsCompleted = goals.filter(g => g.status === 'completed').length;
  const skillsProgress = skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + (skill.level / skill.maxLevel) * 100, 0) / skills.length) : 0;

  if (dashboardMode === 'student') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center py-2 sm:py-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h1 className="text-sm sm:text-xl font-bold text-gray-900 hidden xs:block">
                    {isMobile ? 'Pods' : 'Career Explorer Pods'}
                  </h1>
                </div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs hidden sm:block">
                  🎓 President University
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {user.role === 'ADMIN' && (
                  <Select value={dashboardMode} onValueChange={(value: 'student' | 'admin') => handleModeSwitch(value)}>
                    <SelectTrigger className="w-24 sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 hidden sm:inline">Live</span>
                </div>

                {isMobile && (
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                )}

                {!isMobile && (
                  <>
                    <Button variant="outline" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {activities.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </Button>

                    <div className="flex items-center space-x-2">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.major} • Year {user.year}</p>
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isMobile && mobileMenuOpen && (
              <div className="border-t py-2">
                <div className="flex justify-between items-center mb-2">
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    {activities.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.major} • Year {user.year}</p>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Personalized Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              {welcomeMessage}
            </h2>
            <p className="text-gray-600 mb-4">{careerInsight}</p>
            
            {/* Recommended Actions */}
            {recommendedActions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recommendedActions.map((action, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50">
                    {action}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Personalized Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-2 sm:mb-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Pods</p>
                  <p className="text-lg sm:text-2xl font-bold">{pods.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-2 sm:mb-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming Meetings</p>
                  <p className="text-lg sm:text-2xl font-bold">{meetings.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-2 sm:mb-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Goals Completed</p>
                  <p className="text-lg sm:text-2xl font-bold">{goalsCompleted}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mb-2 sm:mb-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Career Clarity</p>
                  <p className="text-lg sm:text-2xl font-bold">{user.careerClarityScore || 0}% ⭐</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Rest of your existing component */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {/* Left Column - My Pods & Upcoming Meetings */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* My Active Pods */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>My Active Pods</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {pods.length > 0 
                          ? `Your ${pods.length} career exploration group${pods.length > 1 ? 's' : ''}`
                          : 'Your career exploration groups'
                        }
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Find Pods</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
                  {pods.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        No Pods Yet
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                        Start your career exploration journey by joining or creating a pod. Connect with peers who share your interests and goals.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                        <Button className="w-full sm:w-auto">
                          <Search className="w-4 h-4 mr-2" />
                          Find Pods
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Pod
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {pods.map((pod) => (
                        <div key={pod.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base sm:text-lg">{pod.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{pod.description}</p>
                            </div>
                            <Badge className={`${getMatchScoreColor(pod.matchScore)} text-xs sm:text-sm`}>
                              {pod.matchScore}% 💫
                            </Badge>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                              <div className="flex -space-x-2">
                                {pod.members.slice(0, 3).map((member) => (
                                  <Avatar key={member.id} className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {pod.memberCount > 3 && (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs font-medium">+{pod.memberCount - 3}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600">
                                {pod.memberCount}/{pod.maxMembers}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-700">Progress</p>
                              <div className="flex items-center space-x-2">
                                <Progress 
                                  value={(pod.progress.completed / pod.progress.total) * 100} 
                                  className="flex-1 h-2"
                                />
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {pod.progress.completed}/{pod.progress.total}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-700">Next Meeting</p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {pod.nextMeeting ? `${pod.nextMeeting.date}, ${pod.nextMeeting.time}` : 'Not scheduled'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button size="sm" className="flex-1 text-xs sm:text-sm">
                              <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Join Meeting
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              View Pod
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Meetings */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Upcoming Meetings</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Your schedule for the next 7 days
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Schedule Meeting</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
                  {meetings.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        No Meetings Scheduled
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                        Your calendar is empty. Schedule meetings with your pod members to start collaborating on your career goals.
                      </p>
                      <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Your First Meeting
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {meetings.map((meeting) => (
                        <div key={meeting.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">{meeting.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{meeting.podName}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {meeting.type === 'video' ? (
                                <><Video className="w-3 h-3 mr-1" />Video Call</>
                              ) : (
                                <><UserCheck className="w-3 h-3 mr-1" />1-on-1</>
                              )}
                            </Badge>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{meeting.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{meeting.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{meeting.attendees}/{meeting.maxAttendees}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button size="sm" className="text-xs sm:text-sm">
                                {meeting.type === 'video' ? (
                                  <><Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />Join</>
                                ) : (
                                  <><UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />Join</>
                                )}
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Progress, Goals, Achievements */}
            <div className="space-y-4 sm:space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Your Progress</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Track your career development journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
                  {goals.length === 0 && skills.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TargetIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Start Your Journey
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Set your first career goals and start tracking your progress. Your achievements will appear here as you grow.
                      </p>
                      <Button className="w-full">
                        <TargetIcon className="w-4 h-4 mr-2" />
                        Set Your First Goal
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Current Goals */}
                      {goals.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm sm:text-base">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Current Goals</span>
                          </h4>
                          <div className="space-y-2">
                            {goals.map((goal) => (
                              <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border rounded">
                                <div className="flex-1 mb-2 sm:mb-0">
                                  <p className="text-xs sm:text-sm font-medium">{goal.title}</p>
                                  <p className="text-xs text-gray-500">Due: {goal.dueDate}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-12 sm:w-16">
                                    <Progress value={goal.progress} className="h-2" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium">{goal.progress}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills Development */}
                      {skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm sm:text-base">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Skills Development</span>
                          </h4>
                          <div className="space-y-2">
                            {skills.map((skill) => (
                              <div key={skill.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-xs sm:text-sm font-medium">{skill.name}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 sm:w-20">
                                    <Progress 
                                      value={(skill.level / skill.maxLevel) * 100} 
                                      className="h-2"
                                    />
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    {skill.level}/{skill.maxLevel}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your latest accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
                  {achievements.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        No Achievements Yet
                      </h3>
                      <p className="text-sm text-gray-600">
                        Complete goals and participate in pods to earn your first achievements!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-center space-x-3 p-2 border rounded">
                          <span className="text-lg sm:text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium">{achievement.title}</p>
                            <p className="text-xs text-gray-500">{achievement.earnedAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Quick Actions Toolbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 overflow-x-auto">
              <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Set New Goal</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Find Pods</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Schedule Meeting</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Book Mentor</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">View Progress</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard (tetap sama seperti sebelumnya)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin content tetap sama */}
      {/* ... */}
    </div>
  );
}