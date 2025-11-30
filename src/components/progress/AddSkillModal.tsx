"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSkillAdded?: () => void;
}

export default function AddSkillModal({
  isOpen,
  onClose,
  userId,
  onSkillAdded
}: AddSkillModalProps) {
  const [skillName, setSkillName] = useState('');
  const [initialLevel, setInitialLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(5);
  const [suggestedSkills, setSuggestedSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch suggested skills
      const fetchSkills = async () => {
        try {
          const res = await fetch('/api/skills');
          const data = await res.json();
          setSuggestedSkills(data.skills || []);
        } catch (error) {
          console.error('Error fetching skills:', error);
        }
      };
      fetchSkills();
    }
  }, [isOpen]);

  const handleAddSkill = async () => {
    if (!skillName.trim()) {
      alert('Please enter a skill name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          userId,
          skillName,
          initialLevel,
          targetLevel
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Skill added! Start tracking your progress.`);
        setSkillName('');
        setInitialLevel(1);
        setTargetLevel(5);
        onClose();
        onSkillAdded?.();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('❌ Error adding skill');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border border-slate-700/50">
        <div className="sticky top-0 bg-slate-900/50 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">➕ Add New Skill</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
            <Input
              placeholder="e.g., React, Python, Leadership..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
              list="skill-suggestions"
            />
            <datalist id="skill-suggestions">
              {suggestedSkills.slice(0, 10).map((skill: any) => (
                <option key={skill.id} value={skill.name} />
              ))}
            </datalist>
            <p className="text-xs text-slate-400 mt-2">
              Suggested: React, Python, JavaScript, TypeScript, Node.js, Leadership, Communication, Problem Solving
            </p>
          </div>

          {/* Initial Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Initial Level (1-5)</label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setInitialLevel(level)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    initialLevel === level
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-800/30 border border-slate-700/50 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">1 = Beginner, 5 = Expert</p>
          </div>

          {/* Target Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Level (1-5)</label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setTargetLevel(level)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    targetLevel === level
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                      : 'bg-slate-800/30 border border-slate-700/50 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">1 = Beginner, 5 = Expert</p>
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
              onClick={handleAddSkill}
              disabled={isLoading || !skillName.trim()}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
