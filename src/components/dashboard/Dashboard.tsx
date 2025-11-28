"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  Target, 
  Award, 
  Plus,
  Search,
  UserPlus,
  Clock,
  Star,
  Video
} from "lucide-react";

// TEMPLATE DATA - PASTI ADA MEETINGS
const templatePods = [
  {
    id: 1,
    name: "Tech Career Explorers",
    description: "For students interested in technology careers",
    status: "active",
    currentMembers: 4,
    maxMembers: 6,
    members: [
      { id: 1, name: "You", major: "Information Technology", year: 1, role: "Lead" },
      { id: 2, name: "Sarah", major: "Computer Science", year: 2, role: "Member" },
      { id: 3, name: "Mike", major: "Software Engineering", year: 1, role: "Member" },
      { id: 4, name: "Lisa", major: "Data Science", year: 3, role: "Member" }
    ]
  },
  {
    id: 2,
    name: "Business Development Pod", 
    description: "Focus on business and entrepreneurship skills",
    status: "active",
    currentMembers: 3,
    maxMembers: 5,
    members: [
      { id: 1, name: "You", major: "Information Technology", year: 1, role: "Member" },
      { id: 2, name: "John", major: "Business Administration", year: 2, role: "Lead" },
      { id: 3, name: "Emma", major: "Marketing", year: 1, role: "Member" }
    ]
  }
];

// TEMPLATE MEETINGS - PASTI ADA DATA
const templateMeetings = [
  {
    id: 1,
    title: "Career Goal Setting Session",
    description: "Weekly goal review and planning",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    duration: 60,
    status: "scheduled",
    podName: "Tech Career Explorers"
  },
  {
    id: 2,
    title: "Resume Workshop", 
    description: "Group resume review and feedback",
    scheduledAt: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    duration: 90,
    status: "scheduled",
    podName: "Business Development Pod"
  },
  {
    id: 3,
    title: "Mock Interview Practice",
    description: "Technical interview preparation",
    scheduledAt: new Date(Date.now() + 259200000).toISOString(), // 3 days
    duration: 45,
    status: "scheduled",
    podName: "Tech Career Explorers"
  }
];

const templateMatches = [
  {
    user: {
      id: "1",
      name: "Sarah Chen",
      major: "Computer Science",
      year: 2,
      careerInterests: [
        { industry: "Technology", role: "Frontend Developer", priority: "HIGH" },
        { industry: "Gaming", role: "UI/UX Designer", priority: "MEDIUM" }
      ],
      skills: [
        { skillId: "JavaScript", level: 4, targetLevel: 5 },
        { skillId: "React", level: 3, targetLevel: 5 },
        { skillId: "UI/UX Design", level: 3, targetLevel: 4 }
      ]
    },
    score: 85,
    breakdown: {
      basicCompatibility: 90,
      interestAlignment: 85,
      diversityBalance: 80
    }
  },
  {
    user: {
      id: "2", 
      name: "Mike Johnson",
      major: "Software Engineering",
      year: 1,
      careerInterests: [
        { industry: "Technology", role: "Backend Developer", priority: "HIGH" },
        { industry: "AI", role: "Machine Learning Engineer", priority: "MEDIUM" }
      ],
      skills: [
        { skillId: "Python", level: 4, targetLevel: 5 },
        { skillId: "Java", level: 3, targetLevel: 4 },
        { skillId: "SQL", level: 3, targetLevel: 5 }
      ]
    },
    score: 78,
    breakdown: {
      basicCompatibility: 85,
      interestAlignment: 75,
      diversityBalance: 74
    }
  }
];

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [pods, setPods] = useState<any[]>(templatePods);
  const [matches, setMatches] = useState<any[]>(templateMatches);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pods' | 'matching'>('pods');

  // Format date untuk meetings
  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Career Explorer Pods</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <Button onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Pods</p>
                  <p className="text-2xl font-bold">{pods.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Potential Matches</p>
                  <p className="text-2xl font-bold">{matches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                  <p className="text-2xl font-bold">{templateMeetings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
                  <p className="text-2xl font-bold">
                    {matches.length > 0 
                      ? Math.round(matches.reduce((acc: number, m: any) => acc + m.score, 0) / matches.length)
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'pods' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pods')}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>My Pods ({pods.length})</span>
          </Button>
          <Button
            variant={activeTab === 'matching' ? 'default' : 'outline'}
            onClick={() => setActiveTab('matching')}
            className="flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Find Matches ({matches.length})</span>
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'pods' && (
          <div className="space-y-6">
            {pods.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Active Pods Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by finding compatible matches and creating your first pod!
                  </p>
                  <Button onClick={() => setActiveTab('matching')}>
                    <Search className="w-4 h-4 mr-2" />
                    Find Matches
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pods.map((pod) => (
                  <Card key={pod.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{pod.name}</span>
                            <Badge variant="outline">{pod.status}</Badge>
                          </CardTitle>
                          <CardDescription>{pod.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {pod.currentMembers}/{pod.maxMembers} members
                          </p>
                          <Progress 
                            value={(pod.currentMembers / pod.maxMembers) * 100} 
                            className="w-20 mt-1"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Members */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Members</span>
                          </h4>
                          <div className="space-y-2">
                            {pod.members.map((member: any) => (
                              <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-600">
                                      {member.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {member.major} • Year {member.year}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {member.role}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* UPCOMING MEETINGS - TEMPLATE DATA */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Upcoming Meetings</span>
                            <Button variant="outline" size="sm" className="ml-auto">
                              <Plus className="w-3 h-3 mr-1" />
                              Schedule
                            </Button>
                          </h4>
                          
                          {templateMeetings
                            .filter(meeting => meeting.podName === pod.name)
                            .map((meeting) => (
                              <div key={meeting.id} className="border rounded-lg p-3 mb-2 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="font-medium text-sm">{meeting.title}</p>
                                      <Badge variant="outline" className="text-xs">
                                        {meeting.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{meeting.description}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {new Date(meeting.scheduledAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                          {new Date(meeting.scheduledAt).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })} • {meeting.duration}m
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1 ml-2">
                                    <Button size="sm" variant="outline">
                                      <Video className="w-3 h-3 mr-1" />
                                      Join
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                          
                          {templateMeetings.filter(meeting => meeting.podName === pod.name).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No upcoming meetings for this pod
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matching' && (
          <div className="space-y-6">
            {matches.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Matches Found
                  </h3>
                  <p className="text-gray-600">
                    Complete your profile to get better match recommendations!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {matches.map((match) => (
                  <Card key={match.user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg font-medium text-blue-600">
                                {match.user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{match.user.name}</h3>
                              <p className="text-sm text-gray-600">
                                {match.user.major} • Year {match.user.year}
                              </p>
                            </div>
                          </div>

                          {/* Match Score */}
                          <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">Match Score: {match.score}/100</span>
                              <Badge className={getScoreBadge(match.score)}>
                                {match.score >= 80 ? 'Excellent' : match.score >= 60 ? 'Good' : 'Fair'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <p className="text-gray-500">Basic Compatibility</p>
                                <Progress value={match.breakdown.basicCompatibility} className="h-2" />
                                <p className="text-right">{match.breakdown.basicCompatibility}%</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Interest Alignment</p>
                                <Progress value={match.breakdown.interestAlignment} className="h-2" />
                                <p className="text-right">{match.breakdown.interestAlignment}%</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Diversity Balance</p>
                                <Progress value={match.breakdown.diversityBalance} className="h-2" />
                                <p className="text-right">{match.breakdown.diversityBalance}%</p>
                              </div>
                            </div>
                          </div>

                          {/* Career Interests */}
                          {match.user.careerInterests.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm mb-2">Career Interests:</h4>
                              <div className="flex flex-wrap gap-1">
                                {match.user.careerInterests.map((interest: any, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {interest.role} @ {interest.industry}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {match.user.skills.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm mb-2">Skills:</h4>
                              <div className="flex flex-wrap gap-1">
                                {match.user.skills.slice(0, 5).map((skill: any, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill.skillId} (Lvl {skill.level})
                                  </Badge>
                                ))}
                                {match.user.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{match.user.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button 
                            size="sm"
                            className="whitespace-nowrap"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Pod
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;