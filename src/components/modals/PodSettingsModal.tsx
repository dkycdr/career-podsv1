'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';

interface PodSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pod: any;
  userId: string;
  onSave: () => void;
}

export default function PodSettingsModal({
  isOpen,
  onClose,
  pod,
  userId,
  onSave,
}: PodSettingsModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when pod data changes
  useEffect(() => {
    if (pod) {
      setFormData({
        name: pod.name || '',
        description: pod.description || '',
        maxMembers: pod.maxMembers || 5,
      });
      setError(null);
    }
  }, [pod]);

  if (!isOpen || !pod) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/pods/${pod.id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update pod settings');
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-alt rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 bg-slate-900/40 border border-slate-700/50">
        <div className="sticky top-0 bg-slate-900/40 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">Pod Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Pod Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pod name"
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter pod description"
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500 min-h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Members
            </label>
            <Input
              type="number"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleChange}
              min="2"
              max="20"
              className="border-slate-700/50 bg-slate-800/30 text-slate-100"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700/50 text-slate-300 hover:bg-slate-800"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
