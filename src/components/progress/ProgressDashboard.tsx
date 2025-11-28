"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Target, Zap, Clock, CheckCircle2, Star, Plus } from 'lucide-react';
import ProgressCard from './ProgressCard';
import AddSkillModal from './AddSkillModal';
import CareerGoalModal from './CareerGoalModal';

interface ProgressDashboardProps {
  userId: string;
  skills: any[];
  careerInterests: any[];
  progress: any[];
  onRefresh?: () => void;
}

export default function ProgressDashboard({
  userId,
  skills,
  careerInterests,
  progress,
  onRefresh
}: ProgressDashboardProps) {
  const [localSkills, setLocalSkills] = useState(skills);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completedSkills: 0,
    averageLevel: 0,
    overallProgress: 0,
    streak: 0
  });
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showCareerGoalModal, setShowCareerGoalModal] = useState(false);

  // Calculate stats
  useEffect(() => {
    const completed = localSkills.filter((s: any) => {
      const skill = progress.find((p: any) => p.skillId === s.skillId);
      return skill && skill.level >= skill.targetLevel;
    }).length;

    const avgLevel = localSkills.length > 0
      ? Math.round(
          localSkills.reduce((sum: number, s: any) => {
            const skill = progress.find((p: any) => p.skillId === s.skillId);
            return sum + (skill?.level || 1);
          }, 0) / localSkills.length
        )
      : 0;

    const overall = localSkills.length > 0
      ? Math.round((completed / localSkills.length) * 100)
      : 0;

    setStats({
      completedSkills: completed,
      averageLevel: avgLevel,
      overallProgress: overall,
      streak: completed > 0 ? completed : 0
    });

    // Generate achievements
    const newAchievements: any[] = [];
    if (overall >= 50) {
      newAchievements.push({
        id: 'halfway',
        name: '🎯 Halfway There',
        description: '50% of skills completed',
        unlocked: true
      });
    }
    if (overall >= 100) {
      newAchievements.push({
        id: 'master',
        name: '🏆 Master',
        description: 'All skills mastered!',
        unlocked: true
      });
    }
    if (avgLevel >= 4) {
      newAchievements.push({
        id: 'advanced',
        name: '⭐ Advanced Practitioner',
        description: 'Average level 4 or higher',
        unlocked: true
      });
    }
    if (completed >= 3) {
      newAchievements.push({
        id: 'achiever',
        name: '🚀 Quick Achiever',
        description: '3+ skills completed',
        unlocked: true
      });
    }

    setAchievements(newAchievements);
  }, [localSkills, progress]);

  const handleUpdateProgress = async (skillId: string, newLevel: number, targetLevel: number, notes: string) => {
    try {
      const response = await fetch('/api/progress/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          userId,
          skillId,
          newLevel,
          targetLevel,
          notes
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setLocalSkills(localSkills.map((s: any) => 
          s.skillId === skillId
            ? { ...s, level: newLevel, targetLevel, notes, achievedAt: data.progress.achievedAt }
            : s
        ));
        
        // Show badge notification if unlocked
        if (data.badge) {
          alert(`🎉 ${data.badge.emoji} ${data.badge.name}! ${data.badge.description}`);
        }
        
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('❌ Error updating progress');
    }
  };

  const handleDeleteProgress = async (skillId: string) => {
    try {
      const response = await fetch('/api/progress/update', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ userId, skillId })
      });

      const data = await response.json();
      if (data.success) {
        setLocalSkills(localSkills.filter((s: any) => s.skillId !== skillId));
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error deleting progress:', error);
      alert('❌ Error deleting progress');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.overallProgress}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.completedSkills} of {localSkills.length} skills
            </p>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Level</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.averageLevel}</div>
            <p className="text-xs text-slate-500 mt-1">Out of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.completedSkills}</div>
            <p className="text-xs text-slate-500 mt-1">Skills mastered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Streak</CardTitle>
              <Zap className="w-4 h-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.streak}</div>
            <p className="text-xs text-slate-500 mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="p-3 bg-white rounded-lg border border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-slate-900">{achievement.name}</div>
                  <p className="text-sm text-slate-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills List */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Skills Development
        </h3>

        {localSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localSkills.map((skill: any) => {
              const progressRecord = progress.find((p: any) => p.skillId === skill.skillId);
              return (
                <ProgressCard
                  key={skill.skillId}
                  skillId={skill.skillId}
                  skillName={skill.skill?.name || 'Unknown Skill'}
                  currentLevel={progressRecord?.level || skill.level || 1}
                  targetLevel={progressRecord?.targetLevel || skill.targetLevel || 5}
                  notes={progressRecord?.notes}
                  achievedAt={progressRecord?.achievedAt}
                  onUpdate={handleUpdateProgress}
                  onDelete={handleDeleteProgress}
                  userId={userId}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No skills tracked yet</p>
              <p className="text-sm text-slate-500 mb-4">
                Add your first skill to start tracking your progress
              </p>
              <Button 
                onClick={() => setShowAddSkillModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Add Your First Skill
              </Button>
            </CardContent>
          </Card>
        )}

        {localSkills.length > 0 && (
          <Button 
            onClick={() => setShowAddSkillModal(true)}
            variant="outline"
            className="mt-4 w-full border-slate-200"
          >
            <Star className="w-4 h-4 mr-2" />
            Add Another Skill
          </Button>
        )}
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        userId={userId}
        onSkillAdded={() => {
          onRefresh?.();
        }}
      />

      {/* Career Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Career Goals
          </h3>
          <Button 
            onClick={() => setShowCareerGoalModal(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </div>

        {careerInterests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerInterests.map((interest: any) => (
              <Card key={interest.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{interest.role}</CardTitle>
                      <CardDescription>{interest.industry}</CardDescription>
                    </div>
                    <Badge variant={
                      interest.priority === 'HIGH' ? 'default' :
                      interest.priority === 'MEDIUM' ? 'secondary' :
                      'outline'
                    }>
                      {interest.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {interest.description && (
                    <p className="text-sm text-slate-600">{interest.description}</p>
                  )}
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                    Created on {new Date(interest.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-3">No career goals set yet</p>
              <p className="text-sm text-slate-500 mb-4">
                Define your career goals and track progress towards them
              </p>
              <Button 
                onClick={() => setShowCareerGoalModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Set Your First Career Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Career Goal Modal */}
      <CareerGoalModal
        isOpen={showCareerGoalModal}
        onClose={() => setShowCareerGoalModal(false)}
        userId={userId}
        onGoalAdded={() => {
          onRefresh?.();
        }}
      />
    </div>
  );
}
