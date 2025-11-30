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
  X
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
}

interface Goal {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'pending';
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

export default function UnifiedDashboard() {
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
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Get user data from localStorage
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
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
      };
      
      setUser(userData);
      setDashboardMode(userData.role === 'ADMIN' ? 'admin' : 'student');
      
      // Load appropriate data
      if (userData.role === 'ADMIN') {
        loadAdminData();
      } else {
        loadStudentData();
      }
    } else {
      // Redirect to login if no user data
      window.location.href = '/login';
    }
  }, []);

  const loadStudentData = () => {
    // No mock pods - start empty for users to create their own
    const mockPods: Pod[] = [];

    const mockMeetings: Meeting[] = [];

    const mockGoals: Goal[] = [];

    const mockSkills: Skill[] = [];

    const mockAchievements: Achievement[] = [];

    const mockActivities: Activity[] = [];

    const mockMentors: Mentor[] = [];

    setPods(mockPods);
    setMeetings(mockMeetings);
    setGoals(mockGoals);
    setSkills(mockSkills);
    setAchievements(mockAchievements);
    setActivities(mockActivities);
    setMentors(mockMentors);
    setLoading(false);
  };

  const loadAdminData = async () => {
    try {
      // Fetch admin data from APIs
      const [usersResponse, podsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/pods')
      ]);

      const usersData = await usersResponse.json();
      const podsData = await podsResponse.json();

      if (usersData.success) {
        setAdminUsers(usersData.users);
      }

      if (podsData.success) {
        setAdminPods(podsData.pods);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const handleModeSwitch = (mode: 'student' | 'admin') => {
    setDashboardMode(mode);
    if (mode === 'admin') {
      loadAdminData();
    } else {
      loadStudentData();
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

  // Small visual indicator to show which dashboard mode is active
  const ActiveIndicator = ({ mode }: { mode: 'student' | 'admin' }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border">
      <span className={`w-2 h-2 rounded-full mr-2 ${mode === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`} />
      {mode === 'admin' ? 'Admin' : 'Student'}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Student Dashboard
  if (dashboardMode === 'student') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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
                {/* Dashboard Mode Switcher */}
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

                {/* Mobile Menu Toggle */}
                {isMobile && (
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                )}

                {/* Desktop Actions */}
                {!isMobile && (
                  <>
                    <Button variant="outline" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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

            {/* Mobile Menu */}
            {isMobile && mobileMenuOpen && (
              <div className="border-t py-2">
                <div className="flex justify-between items-center mb-2">
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Welcome & Quick Stats */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Welcome back, {user.name}! 👋
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-2 sm:mb-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pods Joined</p>
                    <p className="text-lg sm:text-2xl font-bold">{pods.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-2 sm:mb-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Meetings This Week</p>
                    <p className="text-lg sm:text-2xl font-bold">{meetings.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-2 sm:mb-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Skills Improved</p>
                    <p className="text-lg sm:text-2xl font-bold">{skills.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mb-2 sm:mb-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Career Clarity Score</p>
                    <p className="text-lg sm:text-2xl font-bold">75% ⭐</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
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
                        Your career exploration groups
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Find More Pods</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
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
                      <span className="text-xs sm:text-sm">Schedule New Meeting</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Debug: show meetings in console for troubleshooting */}
                    <script dangerouslySetInnerHTML={{ __html: `console.log('UnifiedDashboard meetings:', ${JSON.stringify(meetings)})` }} />
                    {meetings.length === 0 ? (
                      <div className="border rounded-lg p-6 text-center bg-white dark:bg-card">
                        <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">No upcoming meetings</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">You don't have any meetings scheduled for the next 7 days.</p>
                        <div className="mt-4">
                          <Button size="sm" onClick={() => { /* TODO: open schedule modal */ }}>
                            <Plus className="w-3 h-3 mr-2" /> Schedule Meeting
                          </Button>
                        </div>
                      </div>
                    ) : (
                      meetings.map((meeting) => (
                        <div key={meeting.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-white dark:bg-card">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{meeting.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">{meeting.podName}</p>
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
                            <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
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
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Progress, Activity, Mentors */}
            <div className="space-y-4 sm:space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Progress Overview</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your career development journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6 space-y-4 sm:space-y-6">
                  {/* Current Goals */}
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

                  <Separator />

                  {/* Skills Development */}
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
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your latest accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
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

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 hidden xs:block">
                  {isMobile ? 'Admin' : 'Admin Dashboard'}
                </h1>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-800 text-xs hidden sm:block">
                Admin Mode
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              {/* Dashboard Mode Switcher */}
              <Select value={dashboardMode} onValueChange={(value: 'student' | 'admin') => handleModeSwitch(value)}>
                <SelectTrigger className="w-20 sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              )}

              {/* Desktop Actions */}
              {!isMobile && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
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

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <div className="border-t py-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-2 sm:mb-0" />
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold">{adminStats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-2 sm:mb-0" />
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Pods</p>
                <p className="text-lg sm:text-2xl font-bold">{adminStats.totalPods}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-2 sm:mb-0" />
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Pods</p>
                <p className="text-lg sm:text-2xl font-bold">{adminStats.activePods}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-2">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mb-2 sm:mb-0" />
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Meetings</p>
                <p className="text-lg sm:text-2xl font-bold">{adminStats.totalMeetings}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Users Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                  <span>Users Management</span>
                  <Badge variant="outline" className="text-xs sm:text-sm">{adminUsers.length} users</Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 sm:pt-6">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Mobile: Card Layout */}
                    {isMobile ? (
                      <div className="space-y-3">
                        {adminUsers.slice(0, 5).map((adminUser) => (
                          <div key={adminUser.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-sm">{adminUser.name}</p>
                                <p className="text-xs text-gray-600">{adminUser.email}</p>
                              </div>
                              <Badge 
                                variant={adminUser.role === 'ADMIN' ? 'destructive' : 'outline'}
                                className="text-xs"
                              >
                                {adminUser.role}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-600">
                              <span>{adminUser.major} • Year {adminUser.year}</span>
                              <span>ID: {adminUser.studentId}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Desktop: Table Layout */
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 text-xs sm:text-sm">Name</th>
                            <th className="text-left p-2 text-xs sm:text-sm">Email</th>
                            <th className="text-left p-2 text-xs sm:text-sm">Role</th>
                            <th className="text-left p-2 text-xs sm:text-sm">Major</th>
                            <th className="text-left p-2 text-xs sm:text-sm">Year</th>
                            <th className="text-left p-2 text-xs sm:text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers.map((adminUser) => (
                            <tr key={adminUser.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 text-xs sm:text-sm font-medium">{adminUser.name}</td>
                              <td className="p-2 text-xs sm:text-sm">{adminUser.email}</td>
                              <td className="p-2">
                                <Badge 
                                  variant={adminUser.role === 'ADMIN' ? 'destructive' : 'outline'}
                                  className="text-xs"
                                >
                                  {adminUser.role}
                                </Badge>
                              </td>
                              <td className="p-2 text-xs sm:text-sm">{adminUser.major}</td>
                              <td className="p-2 text-xs sm:text-sm">{adminUser.year}</td>
                              <td className="p-2">
                                <div className="flex space-x-1">
                                  {adminUser.role !== 'ADMIN' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {/* TODO: Implement update role */}}
                                      className="text-xs"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {/* TODO: Implement delete */}}
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
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pods Management */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                  <span>Pods Management</span>
                  <Badge variant="outline" className="text-xs sm:text-sm">{adminPods.length} pods</Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Monitor and manage all pods
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 sm:pt-6">
                <div className="space-y-3">
                  {adminPods.slice(0, 3).map((pod) => (
                    <div key={pod.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{pod.name}</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{pod.description}</p>
                        </div>
                        <Badge 
                          variant={pod.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {pod.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Members: {pod.memberCount}/{pod.maxMembers}</span>
                        <span>Created: {new Date(pod.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}