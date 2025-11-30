"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Target, Zap, Clock, CheckCircle2, Star, Plus, Trash2, Edit2 } from 'lucide-react';
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
  const [localCareerInterests, setLocalCareerInterests] = useState(careerInterests);
  const [stats, setStats] = useState({
    completedSkills: 0,
    averageLevel: 0,
    overallProgress: 0,
    streak: 0
  });
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showCareerGoalModal, setShowCareerGoalModal] = useState(false);

  // Handle delete career goal
  const handleDeleteCareerGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this career goal?')) {
      return;
    }

    try {
      const response = await fetch(`/api/career-goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId }
      });

      const data = await response.json();
      if (data.success) {
        setLocalCareerInterests(localCareerInterests.filter((g: any) => g.id !== goalId));
        alert('✅ Career goal deleted');
        onRefresh?.();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('❌ Error deleting career goal');
    }
  };

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
        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{stats.overallProgress}%</div>
            <p className="text-xs text-slate-400 mt-1">
              {stats.completedSkills} of {localSkills.length} skills
            </p>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Avg Level</CardTitle>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{stats.averageLevel}</div>
            <p className="text-xs text-slate-400 mt-1">Out of 5</p>
          </CardContent>
        </Card>

        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{stats.completedSkills}</div>
            <p className="text-xs text-slate-400 mt-1">Skills mastered</p>
          </CardContent>
        </Card>

        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Streak</CardTitle>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{stats.streak}</div>
            <p className="text-xs text-slate-400 mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Award className="w-5 h-5 text-purple-400" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-slate-100">{achievement.name}</div>
                  <p className="text-sm text-slate-400">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills List */}
      <div className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Skills Development
            </h3>
            <p className="text-sm text-slate-400 mt-1">Track your skill growth</p>
          </div>
          {localSkills.filter((s: any) => {
            const skill = progress.find((p: any) => p.skillId === s.skillId);
            return skill && skill.level >= skill.targetLevel;
          }).length > 0 && (
            <span className="text-2xl font-bold text-green-400">{localSkills.filter((s: any) => {
              const skill = progress.find((p: any) => p.skillId === s.skillId);
              return skill && skill.level >= skill.targetLevel;
            }).length}</span>
          )}
        </div>

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
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-3">No skills tracked yet</p>
            <p className="text-sm text-slate-500 mb-4">
              Add your first skill to start tracking your progress
            </p>
            <Button 
              onClick={() => setShowAddSkillModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Star className="w-4 h-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        )}

        {localSkills.length > 0 && (
          <Button 
            onClick={() => setShowAddSkillModal(true)}
            variant="outline"
            className="mt-4 w-full border-slate-700/50 text-slate-300 hover:bg-slate-800/30"
          >
            <Plus className="w-4 h-4 mr-2" />
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
      <div className="glass-alt card-border border-slate-700/50 bg-slate-900/40 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Career Goals
            </h3>
            <p className="text-sm text-slate-400 mt-1">Explore your career path</p>
          </div>
          {localCareerInterests.length > 0 && (
            <span className="text-2xl font-bold text-cyan-400">{localCareerInterests.length}</span>
          )}
        </div>

        {localCareerInterests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localCareerInterests.map((interest: any) => (
              <div key={interest.id} className="flex flex-col items-start p-4 rounded-lg glass-alt border border-slate-700/50 bg-slate-800/30 hover:shadow-md transition-all">
                <div className="w-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-100">{interest.role}</h4>
                      <p className="text-sm text-slate-400 mt-0.5">{interest.industry}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge className={interest.priority === 'HIGH' ? 'bg-red-600/30 text-red-400' : interest.priority === 'MEDIUM' ? 'bg-yellow-600/30 text-yellow-400' : 'bg-green-600/30 text-green-400'}>
                        {interest.priority}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCareerGoal(interest.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-600/20 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {interest.description && (
                    <p className="text-sm text-slate-300 mt-2">{interest.description}</p>
                  )}
                  <div className="pt-3 mt-3 border-t border-slate-700/50 text-xs text-slate-500">
                    Created {new Date(interest.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No career goals set yet</p>
            <p className="text-sm text-slate-500 mt-2 mb-4">
              Define your career goals and track progress towards them
            </p>
            <Button 
              onClick={() => setShowCareerGoalModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Your First Career Goal
            </Button>
          </div>
        )}

        {careerInterests.length > 0 && (
          <Button 
            onClick={() => setShowCareerGoalModal(true)}
            variant="outline"
            className="mt-4 w-full border-slate-700/50 text-slate-300 hover:bg-slate-800/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Goal
          </Button>
        )}
      </div>

      {/* Career Goal Modal */}
      <CareerGoalModal
        isOpen={showCareerGoalModal}
        onClose={() => setShowCareerGoalModal(false)}
        userId={userId}
        onGoalAdded={() => {
          // Refresh data from parent
          onRefresh?.();
          // Also refresh local career interests
          const fetchUpdated = async () => {
            try {
              const res = await fetch(`/api/progress?userId=${userId}`);
              const data = await res.json();
              if (data.success) {
                setLocalCareerInterests(data.careerInterests || []);
              }
            } catch (error) {
              console.error('Error refreshing career interests:', error);
            }
          };
          fetchUpdated();
        }}
      />
    </div>
  );
}
