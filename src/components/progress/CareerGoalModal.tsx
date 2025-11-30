"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Target, Calendar, Briefcase, TrendingUp } from 'lucide-react';

interface CareerGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onGoalAdded?: () => void;
}

export default function CareerGoalModal({
  isOpen,
  onClose,
  userId,
  onGoalAdded
}: CareerGoalModalProps) {
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'Tech Lead',
    'DevOps Engineer',
    'UI/UX Designer',
    'QA Engineer',
    'Solutions Architect',
    'Cloud Architect',
    'AI/ML Engineer',
    'Mobile Developer',
    'Security Engineer',
    'Database Administrator'
  ];

  const suggestedIndustries = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Education',
    'Entertainment',
    'Manufacturing',
    'Logistics',
    'Marketing',
    'Consulting',
    'Energy',
    'Real Estate',
    'Telecommunications',
    'Automotive',
    'Government'
  ];

  const handleAddGoal = async () => {
    if (!role.trim() || !industry.trim()) {
      alert('Please fill in Role and Industry');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          userId,
          goal: role,
          category: industry,
          deadline: null,
          priority,
          description
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Career goal "${role}" set! Keep working towards it.`);
        setRole('');
        setIndustry('');
        setDescription('');
        setPriority('MEDIUM');
        onClose();
        onGoalAdded?.();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('❌ Error adding career goal');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border border-slate-700/50">
        <div className="sticky top-0 bg-slate-900/50 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Set Career Goal
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Goal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <Briefcase className="w-4 h-4 inline mr-2" />
              What role are you targeting?
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {suggestedRoles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                      role === r
                        ? 'border-cyan-500/50 bg-cyan-600/20 text-cyan-300'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <Input
                placeholder="Or enter your own role..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              What industry?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {suggestedIndustries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    industry === ind
                      ? 'border-green-500/50 bg-green-600/20 text-green-300'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 text-slate-300'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <Input
                placeholder="Or enter your own industry..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
              />
            </div>
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
                  onClick={() => setPriority(value)}
                  className={`flex-1 p-3 rounded-lg border-2 font-medium transition-all ${
                    priority === value
                      ? `${color} border-solid`
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (Optional)
            </label>
            <Textarea
              placeholder="What does success look like for this goal? What skills do you need? Any timeline?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 min-h-[100px] text-sm"
            />
          </div>

          {/* Tips Card */}
          <div className="bg-cyan-600/10 border border-cyan-500/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-cyan-300">
              <strong>💡 Tip:</strong> Break down your goal into smaller skills to track in the Skills section.
            </p>
            <p className="text-xs text-cyan-400/80">
              For example, if your goal is "Full Stack Developer", you might track React, Node.js, PostgreSQL, and Docker.
            </p>
            <p className="text-xs text-cyan-400/80">
              Once you set a goal, you can track progress on specific skills needed to achieve it!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-700/50 text-slate-300 hover:bg-slate-800/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGoal}
              disabled={isLoading || !role.trim() || !industry.trim()}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? 'Setting Goal...' : '🎯 Set Career Goal'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
