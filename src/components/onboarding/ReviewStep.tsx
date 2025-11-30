"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Target, 
  Award, 
  Calendar, 
  Check, 
  Edit,
  Mail,
  Phone,
  GraduationCap,
  Clock,
  TrendingUp
} from "lucide-react";

interface OnboardingData {
  personalInfo: {
    name: string;
    email: string;
    studentId: string;
    major: string;
    year: string;
    bio: string;
    password: string;
    confirmPassword: string;
  };
  careerInterests: {
    interests: Array<{
      industry: string;
      role: string;
      priority: "LOW" | "MEDIUM" | "HIGH";
      description: string;
    }>;
  };
  skills: {
    currentSkills: Array<{
      skillId: string;
      level: number;
    }>;
    targetSkills: Array<{
      skillId: string;
      targetLevel: number;
    }>;
  };
  availability: {
    schedule: Record<string, boolean>;
  };
}

interface ReviewStepProps {
  data: OnboardingData;
  onUpdate: (data: OnboardingData) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onUpdate }) => {
  const getYearText = (year: string) => {
    const yearMap: Record<string, string> = {
      "1": "Year 1 (Freshman)",
      "2": "Year 2 (Sophomore)", 
      "3": "Year 3 (Junior)",
      "4": "Year 4 (Senior)"
    };
    return yearMap[year] || year;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-600/30 text-red-400";
      case "MEDIUM":
        return "bg-yellow-600/30 text-yellow-400";
      case "LOW":
        return "bg-green-600/30 text-green-400";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  const getLevelColor = (level: number) => {
    if (level <= 2) return "bg-red-600/30 text-red-400";
    if (level <= 3) return "bg-yellow-600/30 text-yellow-400";
    return "bg-green-600/30 text-green-400";
  };

  const getLevelText = (level: number) => {
    if (level === 1) return "Beginner";
    if (level === 2) return "Elementary";
    if (level === 3) return "Intermediate";
    if (level === 4) return "Advanced";
    if (level === 5) return "Expert";
    return "Unknown";
  };

  const getSkillName = (skillId: string) => {
    const skills: Record<string, string> = {
      "programming": "Programming",
      "data-analysis": "Data Analysis",
      "web-development": "Web Development",
      "communication": "Communication",
      "leadership": "Leadership",
      "teamwork": "Teamwork",
      "problem-solving": "Problem Solving",
      "english": "English",
      "mandarin": "Mandarin",
      "project-management": "Project Management",
      "business-analysis": "Business Analysis",
      "financial-planning": "Financial Planning",
      "critical-thinking": "Critical Thinking",
      "time-management": "Time Management",
      "public-speaking": "Public Speaking",
      "creativity": "Creativity",
      "adaptability": "Adaptability",
      "emotional-intelligence": "Emotional Intelligence",
    };
    return skills[skillId] || skillId;
  };

  const getSelectedSlots = () => {
    return Object.entries(data.availability.schedule)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const [day, time] = key.split('-');
        const dayNames: Record<string, string> = {
          "monday": "Monday",
          "tuesday": "Tuesday", 
          "wednesday": "Wednesday",
          "thursday": "Thursday",
          "friday": "Friday",
          "saturday": "Saturday",
          "sunday": "Sunday"
        };
        const timeSlots: Record<string, string> = {
          "morning": "08:00-12:00",
          "afternoon": "12:00-16:00", 
          "evening": "16:00-18:00",
          "night": "18:00-21:00"
        };
        return `${dayNames[day]} ${timeSlots[time]}`;
      });
  };

  const getSelectedSlotsCount = () => {
    return Object.values(data.availability.schedule).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-cyan-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-cyan-400" />
        </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Review Your Information
            </h2>
            <p className="text-slate-400">
              Review your information before completing registration
            </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <User className="w-5 h-5" />
              <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-400">Full Name</Label>
              <p className="font-medium">{data.personalInfo.name}</p>
            </div>
            <div>
              <p className="font-medium flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-400">Student ID</Label>
              <p className="font-medium">{data.personalInfo.studentId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-400">Major</Label>
              <p className="font-medium">{data.personalInfo.major}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-400">Year of Study</Label>
              <p className="font-medium flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>{getYearText(data.personalInfo.year)}</span>
              </p>
            </div>
          </div>
          
          {data.personalInfo.bio && (
            <div>
              <Label className="text-sm font-medium text-slate-400">Bio</Label>
              <p className="text-sm text-gray-700 mt-1">{data.personalInfo.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Career Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5" />
              <span>Career Interests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.careerInterests.interests.length > 0 ? (
            <div className="space-y-3">
              {data.careerInterests.interests.map((interest, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{interest.role}</p>
                      <p className="text-sm text-slate-400">{interest.industry}</p>
                      {interest.description && (
                        <p className="text-sm text-gray-500 mt-1">{interest.description}</p>
                      )}
                    </div>
                    <Badge className={getPriorityColor(interest.priority)}>
                      {interest.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
                No career interests added yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="w-5 h-5" />
              <span>Skills & Targets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Skills */}
          <div>
            <Label className="text-sm font-medium text-slate-400">Current Skills</Label>
            {data.skills.currentSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.currentSkills.map((skill) => (
                  <Badge key={skill.skillId} className={getLevelColor(skill.level)}>
                    {getSkillName(skill.skillId)} ({getLevelText(skill.level)})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-1">No skills added yet</p>
            )}
          </div>

          <Separator />

          {/* Target Skills */}
          <div>
            <Label className="text-sm font-medium text-slate-400 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
                <span>Target Skills</span>
            </Label>
            {data.skills.targetSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.targetSkills.map((skill) => (
                  <Badge key={skill.skillId} variant="outline">
                    {getSkillName(skill.skillId)} (Target: {getLevelText(skill.targetLevel)})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-1">No target skills added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
              <span>Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-3">
            <div className="text-2xl font-bold text-blue-600">
              {getSelectedSlotsCount()}
            </div>
            <div>
              <p className="font-medium">available slots</p>
              <p className="text-sm text-slate-400">{getSelectedSlotsCount() * 4} hours per week</p>
            </div>
          </div>

          {getSelectedSlotsCount() > 0 ? (
            <div>
              <Label className="text-sm font-medium text-slate-400">Selected Slots:</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {getSelectedSlots().map((slot, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
                No availability slots added yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Matching Preview */}
      <div className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          🤖 AI Matching Preview
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-300">Complete profile for AI matching</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-300">
                {data.careerInterests.interests.length} career interests detected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-300">
                {data.skills.currentSkills.length + data.skills.targetSkills.length} skills registered
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-300">
                {getSelectedSlotsCount()} time slots for pod matching
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-sm font-medium text-slate-200 mb-1">Matching Prediction:</p>
          <p className="text-xs text-slate-400">
            Based on your profile, you're most likely to match with pods focused on{" "}
            {data.careerInterests.interests.length > 0 
              ? data.careerInterests.interests[0].industry
              : "general career exploration"}
          </p>
        </div>
      </div>

      {/* Final Actions */}
      <div className="text-center space-y-4">
        <div className="glass-alt card-border border-cyan-500/50 bg-cyan-600/10 rounded-lg p-4">
          <Check className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-100 mb-1">Ready to Join!</h3>
            <p className="text-sm text-slate-300">
              Your profile is complete. Click "Complete Registration" to join Career Explorer Pods.
            </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;