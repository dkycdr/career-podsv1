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
  Zap
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  major: string;
  year: number;
  avatar?: string;
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

export default function CareerExplorerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [pods, setPods] = useState<Pod[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (userId && userName) {
      setUser({
        id: userId,
        name: userName,
        email: 'student@presuniv.ac.id',
        major: 'Computer Science',
        year: 2,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
      });
      
      // Load mock data
      loadMockData();
    } else {
      // Redirect to login if no user data
      window.location.href = '/login';
    }
  }, []);

  const loadMockData = () => {
    // Mock pods data
    const mockPods: Pod[] = [
      {
        id: '1',
        name: 'AI Innovators Pod',
        description: 'Exploring AI career paths and technologies',
        matchScore: 92,
        memberCount: 4,
        maxMembers: 5,
        nextMeeting: {
          title: 'AI Career Paths Discussion',
          date: 'Tomorrow',
          time: '3:00 PM',
          type: 'video'
        },
        progress: {
          completed: 4,
          total: 6
        },
        members: [
          { id: '1', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you' },
          { id: '2', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
          { id: '3', name: 'Mike Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
          { id: '4', name: 'Lisa Wang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' }
        ]
      },
      {
        id: '2',
        name: 'Data Science Explorers',
        description: 'Diving into data analysis and machine learning',
        matchScore: 85,
        memberCount: 5,
        maxMembers: 5,
        nextMeeting: {
          title: 'Data Analysis Workshop',
          date: 'Friday',
          time: '2:00 PM',
          type: 'video'
        },
        progress: {
          completed: 3,
          total: 6
        },
        members: [
          { id: '1', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you' },
          { id: '5', name: 'John Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
          { id: '6', name: 'Emma Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
          { id: '7', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
          { id: '8', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' }
        ]
      }
    ];

    // Mock meetings data
    const mockMeetings: Meeting[] = [
      {
        id: '1',
        title: 'AI Career Paths Discussion',
        podName: 'AI Innovators Pod',
        date: 'Today',
        time: '3:00 PM',
        duration: '1 hour',
        type: 'video',
        attendees: 3,
        maxAttendees: 4
      },
      {
        id: '2',
        title: 'Data Analysis Workshop',
        podName: 'Data Science Explorers',
        date: 'Tomorrow',
        time: '2:00 PM',
        duration: '1.5 hours',
        type: 'video',
        attendees: 5,
        maxAttendees: 5
      },
      {
        id: '3',
        title: 'Mentor Session: Tech Industry Insights',
        podName: '1-on-1 Mentorship',
        date: 'Friday',
        time: '4:00 PM',
        duration: '45 min',
        type: 'mentor',
        attendees: 1,
        maxAttendees: 1,
        mentor: 'Sarah Chen'
      }
    ];

    // Mock goals data
    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'Complete portfolio project',
        dueDate: '2 weeks',
        progress: 60,
        status: 'in-progress'
      },
      {
        id: '2',
        title: 'Learn Python basics',
        dueDate: '1 month',
        progress: 80,
        status: 'in-progress'
      },
      {
        id: '3',
        title: 'Land internship',
        dueDate: '2 months',
        progress: 30,
        status: 'in-progress'
      }
    ];

    // Mock skills data
    const mockSkills: Skill[] = [
      { name: 'Python', level: 4, maxLevel: 5, category: 'Technical' },
      { name: 'Data Analysis', level: 3, maxLevel: 5, category: 'Technical' },
      { name: 'Communication', level: 3, maxLevel: 5, category: 'Soft Skills' },
      { name: 'Leadership', level: 2, maxLevel: 5, category: 'Soft Skills' }
    ];

    // Mock achievements data
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Pod Meeting',
        description: 'Attended your first pod meeting',
        icon: '🎉',
        earnedAt: '1 week ago'
      },
      {
        id: '2',
        title: 'Skill Milestone: Python Basics',
        description: 'Completed Python basics module',
        icon: '⭐',
        earnedAt: '3 days ago'
      },
      {
        id: '3',
        title: 'Active Participant',
        description: 'Consistently active in pod discussions',
        icon: '🏅',
        earnedAt: '2 days ago'
      }
    ];

    // Mock activities data
    const mockActivities: Activity[] = [
      {
        id: '1',
        user: 'Sarah Chen',
        action: 'completed',
        target: '"Data Visualization" skill',
        timestamp: '2 hours ago',
        type: 'skill'
      },
      {
        id: '2',
        user: 'Mike Rodriguez',
        action: 'scheduled new meeting',
        target: '"Tech Interview Prep"',
        timestamp: '5 hours ago',
        type: 'meeting'
      },
      {
        id: '3',
        user: 'Pod "AI Innovators"',
        action: 'reached',
        target: '80% progress',
        timestamp: 'Yesterday',
        type: 'pod'
      },
      {
        id: '4',
        user: 'You',
        action: 'earned',
        target: '"Consistent Learner" badge',
        timestamp: '2 days ago',
        type: 'achievement'
      }
    ];

    // Mock mentors data
    const mockMentors: Mentor[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        title: 'AI Engineer',
        company: 'Google',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-mentor',
        availability: 'This week',
        expertise: ['AI/ML', 'Career Development', 'Technical Interview Prep']
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        title: 'Data Scientist',
        company: 'Microsoft',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike-mentor',
        availability: 'Next week',
        expertise: ['Data Science', 'Python', 'Statistics']
      },
      {
        id: '3',
        name: 'Lisa Wang',
        title: 'Product Manager',
        company: 'StartupHub',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-mentor',
        availability: 'Flexible',
        expertise: ['Product Management', 'Startups', 'Leadership']
      }
    ];

    setPods(mockPods);
    setMeetings(mockMeetings);
    setGoals(mockGoals);
    setSkills(mockSkills);
    setAchievements(mockAchievements);
    setActivities(mockActivities);
    setMentors(mockMentors);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Career Explorer Pods</h1>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                🎓 President University
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.major} • Year {user.year}</p>
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Logout */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Quick Stats */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pods Joined</p>
                    <p className="text-2xl font-bold">{pods.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Meetings This Week</p>
                    <p className="text-2xl font-bold">{meetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Skills Improved</p>
                    <p className="text-2xl font-bold">{skills.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Career Clarity Score</p>
                    <p className="text-2xl font-bold">75% ⭐</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - My Pods & Upcoming Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Active Pods */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>My Active Pods</span>
                    </CardTitle>
                    <CardDescription>
                      Your career exploration groups
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Find More Pods
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pods.map((pod) => (
                    <div key={pod.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{pod.name}</h3>
                          <p className="text-sm text-gray-600">{pod.description}</p>
                        </div>
                        <Badge className={getMatchScoreColor(pod.matchScore)}>
                          {pod.matchScore}% 💫
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex -space-x-2">
                          {pod.members.slice(0, 4).map((member) => (
                            <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {pod.memberCount > 4 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium">+{pod.memberCount - 4}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          {pod.memberCount}/{pod.maxMembers} members
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Progress</p>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={(pod.progress.completed / pod.progress.total) * 100} 
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-600">
                              {pod.progress.completed}/{pod.progress.total}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Next Meeting</p>
                          <p className="text-sm text-gray-600">
                            {pod.nextMeeting ? `${pod.nextMeeting.date}, ${pod.nextMeeting.time}` : 'Not scheduled'}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Video className="w-4 h-4 mr-2" />
                          Join Meeting
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Users className="w-4 h-4 mr-2" />
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
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Upcoming Meetings</span>
                    </CardTitle>
                    <CardDescription>
                      Your schedule for the next 7 days
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule New Meeting
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{meeting.title}</h4>
                          <p className="text-sm text-gray-600">{meeting.podName}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {meeting.type === 'video' ? (
                            <><Video className="w-3 h-3 mr-1" />Video Call</>
                          ) : (
                            <><UserCheck className="w-3 h-3 mr-1" />1-on-1</>
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{meeting.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{meeting.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{meeting.attendees}/{meeting.maxAttendees}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm">
                            {meeting.type === 'video' ? (
                              <><Video className="w-4 h-4 mr-2" />Join</>
                            ) : (
                              <><UserCheck className="w-4 h-4 mr-2" />Join</>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Progress, Activity, Mentors */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Progress Overview</span>
                </CardTitle>
                <CardDescription>
                  Your career development journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Goals */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Current Goals</span>
                    </h4>
                    <div className="space-y-2">
                      {goals.map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{goal.title}</p>
                            <p className="text-xs text-gray-500">Due: {goal.dueDate}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16">
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{goal.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Skills Development */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Skills Development</span>
                    </h4>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20">
                              <Progress 
                                value={(skill.level / skill.maxLevel) * 100} 
                                className="h-2"
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {skill.level}/{skill.maxLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Recent Achievements */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Recent Achievements</span>
                    </h4>
                    <div className="space-y-2">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-center space-x-3 p-2 border rounded">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{achievement.title}</p>
                            <p className="text-xs text-gray-500">{achievement.earnedAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  What's happening in your pods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 border rounded">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mentor Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>Mentor Connections</span>
                </CardTitle>
                <CardDescription>
                  Available mentors for guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Available Mentors */}
                  <div>
                    <h4 className="font-medium mb-3">Available Mentors</h4>
                    <div className="space-y-3">
                      {mentors.slice(0, 2).map((mentor) => (
                        <div key={mentor.id} className="flex items-center space-x-3 p-2 border rounded">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={mentor.avatar} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mentor.name}</p>
                            <p className="text-xs text-gray-600">
                              {mentor.title} @ {mentor.company}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              Available {mentor.availability}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline">
                            <BookOpen className="w-4 h-4 mr-1" />
                            Book
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Upcoming Mentor Sessions */}
                  <div>
                    <h4 className="font-medium mb-3">Upcoming Sessions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">Career guidance with Sarah Chen</p>
                          <p className="text-xs text-gray-500">Tomorrow, 4:00 PM</p>
                        </div>
                        <Button size="sm">
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Quick Actions Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-2 py-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Set New Goal</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Find Pods</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Meeting</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Book Mentor</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">View Progress</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}