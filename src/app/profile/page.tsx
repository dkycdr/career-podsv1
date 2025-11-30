"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Award, Target, Zap } from 'lucide-react';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // User data
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    studentId: '',
    major: '',
    year: '',
    bio: '',
    avatar: ''
  });

  // Achievement/Skill data
  const [skills, setSkills] = useState<any[]>([]);
  const [careerInterests, setCareerInterests] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Edit mode form
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    studentId: '',
    major: '',
    year: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(id);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/auth/user?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        const u = data.user;
        setUser({
          id: u.id,
          name: u.name || '',
          email: u.email || '',
          studentId: u.studentId || '',
          major: u.major || '',
          year: u.year ? String(u.year) : '',
          bio: u.bio || '',
          avatar: u.avatar || ''
        });
        setForm({
          id: u.id,
          name: u.name || '',
          email: u.email || '',
          studentId: u.studentId || '',
          major: u.major || '',
          year: u.year ? String(u.year) : '',
          bio: u.bio || '',
          avatar: u.avatar || ''
        });
      } catch (err: any) {
        setError(err.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Fetch achievements/skills/career interests (view mode only)
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || isEditMode) return;
      setDataLoading(true);
      try {
        const res = await fetch(`/api/progress?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setSkills(data.skills || []);
          setCareerInterests(data.careerInterests || []);
          setProgress(data.progress || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [userId, isEditMode]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, avatar: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.id) {
      setError('No user selected. Please login or provide your userId.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: form.id,
          name: form.name,
          studentId: form.studentId,
          major: form.major,
          year: form.year,
          bio: form.bio,
          avatarData: form.avatar
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setMessage('Profile updated successfully');
      setUser(prev => ({ ...prev, ...data.user }));
      if (data.user?.avatar) setForm(prev => ({ ...prev, avatar: data.user.avatar }));
      // Redirect back to view mode after saving
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // EDIT MODE
  if (isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {message && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-3">{message}</div>}
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email} disabled />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input id="studentId" value={form.studentId} onChange={(e) => setForm(prev => ({ ...prev, studentId: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Input id="major" value={form.major} onChange={(e) => setForm(prev => ({ ...prev, major: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" value={form.year} onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))} placeholder="1,2,3,4" />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} rows={4} />
                </div>

                <div>
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                      {form.avatar ? (
                        <img src={form.avatar.startsWith('data:') ? form.avatar : form.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400">No photo</div>
                      )}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
                      <p className="text-xs text-gray-500 mt-1">PNG/JPG recommended. Max 2MB.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // VIEW MODE
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header Card - Personal Info */}
        <Card className="bg-white mb-6 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-4xl font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Link href="/profile?edit=true">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{user.name}</h1>
                <p className="text-slate-600 mb-4">{user.bio || 'No bio added yet'}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Student ID</Label>
                    <p className="font-medium">{user.studentId || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Major</Label>
                    <p className="font-medium">{user.major || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Year</Label>
                    <p className="font-medium">Year {user.year || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Interests */}
        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Career Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : careerInterests.length === 0 ? (
              <p className="text-slate-500">No career interests added yet.</p>
            ) : (
              <div className="space-y-3">
                {careerInterests.map((interest: any) => (
                  <div key={interest.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{interest.role}</h3>
                        <p className="text-sm text-slate-600">{interest.industry}</p>
                        {interest.description && (
                          <p className="text-sm text-slate-700 mt-2">{interest.description}</p>
                        )}
                      </div>
                      <Badge className={`whitespace-nowrap ml-2 ${
                        interest.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        interest.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {interest.priority || 'MEDIUM'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : skills.length === 0 ? (
              <p className="text-slate-500">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map((userSkill: any) => (
                  <Badge key={userSkill.id} className={`text-white font-semibold px-4 py-2 ${
                    userSkill.level >= 4 ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                    userSkill.level >= 3 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                    userSkill.level >= 2 ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                    'bg-gradient-to-r from-gray-600 to-slate-600'
                  }`}>
                    <span className="capitalize">{userSkill.skill?.name || 'Unknown'}</span>
                    {userSkill.level && <span className="ml-2 font-bold">Lv{userSkill.level}</span>}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements / Progress */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : progress.filter((p: any) => p.achievedAt).length === 0 ? (
              <p className="text-slate-500">No achievements unlocked yet. Start working on your goals!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {progress.filter((p: any) => p.achievedAt).map((achievement: any) => (
                  <div key={achievement.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 text-center">
                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-900">Skill Level {achievement.level}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {achievement.achievedAt ? new Date(achievement.achievedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-950"><div className="text-slate-400">Loading...</div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
