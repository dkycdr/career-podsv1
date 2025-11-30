"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Trash2, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProgressCardProps {
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  notes?: string;
  achievedAt?: string;
  onUpdate: (skillId: string, newLevel: number, targetLevel: number, notes: string) => Promise<void>;
  onDelete: (skillId: string) => Promise<void>;
  userId: string;
}

export default function ProgressCard({
  skillId,
  skillName,
  currentLevel,
  targetLevel,
  notes = '',
  achievedAt,
  onUpdate,
  onDelete,
  userId
}: ProgressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLevel, setEditLevel] = useState(currentLevel);
  const [editTarget, setEditTarget] = useState(targetLevel);
  const [editNotes, setEditNotes] = useState(notes);
  const [isLoading, setIsLoading] = useState(false);

  const progressPercentage = (editLevel / editTarget) * 100;
  const isCompleted = editLevel >= editTarget;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(skillId, editLevel, editTarget, editNotes);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this skill progress?')) {
      setIsLoading(true);
      try {
        await onDelete(skillId);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const incrementLevel = () => {
    if (editLevel < editTarget) {
      setEditLevel(editLevel + 1);
    }
  };

  const decrementLevel = () => {
    if (editLevel > 1) {
      setEditLevel(editLevel - 1);
    }
  };

  const getLevelLabel = (level: number): string => {
    const levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return levels[Math.min(level - 1, 5)] || 'Unknown';
  };

  const getLevelColor = (level: number): string => {
    if (level <= 1) return 'from-red-400 to-red-500';
    if (level <= 2) return 'from-orange-400 to-orange-500';
    if (level <= 3) return 'from-yellow-400 to-yellow-500';
    if (level <= 4) return 'from-blue-400 to-blue-500';
    return 'from-green-400 to-green-600';
  };

  return (
    <Card className={`border transition-all ${isCompleted ? 'border-green-500/50 bg-green-600/10' : 'border-slate-700/50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-slate-100">{skillName}</CardTitle>
              {isCompleted && (
                <div title="Skill mastered!">
                  <Award className="w-5 h-5 text-green-400" />
                </div>
              )}
            </div>
            <CardDescription className="text-slate-400">
              Level {editLevel}/{editTarget} - {getLevelLabel(editLevel)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
          >
            {isEditing ? '✕' : '✎'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="font-semibold text-slate-200">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-800/30 rounded-full h-3 overflow-hidden border border-slate-700/50">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(editLevel)} transition-all duration-300`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {!isEditing ? (
          <>
            {notes && (
              <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <p className="text-sm text-slate-300">{notes}</p>
              </div>
            )}
            {achievedAt && (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-600/20 p-2 rounded border border-green-500/50">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed on {new Date(achievedAt).toLocaleDateString()}</span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Level Control */}
            <div className="space-y-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Level: {editLevel}
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={decrementLevel}
                    disabled={editLevel <= 1}
                    className="flex-1 border-slate-700/50 text-slate-400 hover:bg-slate-700/30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center py-2 bg-slate-800/30 border border-slate-700/50 rounded font-semibold text-slate-200">
                    {editLevel}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={incrementLevel}
                    disabled={editLevel >= editTarget}
                    className="flex-1 border-slate-700/50 text-slate-400 hover:bg-slate-700/30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Level
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={editTarget}
                  onChange={(e) => setEditTarget(parseInt(e.target.value) || 5)}
                  className="border-slate-700/50 bg-slate-800/30 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notes
                </label>
                <Textarea
                  placeholder="Add notes about your progress..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 min-h-[60px] text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
