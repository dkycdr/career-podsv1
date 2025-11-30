"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search as SearchIcon, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  major: string;
  avatar?: string;
}

export default function FindPeoplePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const handleSearch = async (cursor?: string | null) => {
    if (!query.trim()) {
      setUsers([]);
      setNextCursor(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('q', query);
      if (role) params.set('role', role);
      params.set('limit', '20');
      if (cursor) params.set('cursor', cursor);
      if (userId) params.set('viewerId', userId);

      const res = await fetch(`/api/users/search?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        if (cursor) {
          setUsers((prev) => [...prev, ...data.users]);
        } else {
          setUsers(data.users || []);
        }
        setNextCursor(data.nextCursor || null);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'MENTOR': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'STUDENT': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'ADMIN': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Find People</h1>
          </div>
          <p className="text-slate-400">Search for mentors, peers, and students in the community</p>
        </div>

        {/* Search Card */}
        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40 mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Search by Name or Major</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 'John', 'Computer Science'..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
                  />
                  <Button
                    onClick={() => handleSearch(null)}
                    disabled={loading || !query.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <SearchIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Filter by Role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (query.trim()) {
                      // Auto-search when role changes
                      setTimeout(() => handleSearch(null), 100);
                    }
                  }}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-4 py-2 text-slate-100"
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="MENTOR">Mentors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-slate-400">
              <div className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
              Searching...
            </div>
          </div>
        )}

        {!loading && users.length === 0 && query.trim() && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg">No people found matching your search</p>
            <p className="text-slate-500 text-sm mt-2">Try different keywords or filters</p>
          </div>
        )}

        {!loading && users.length === 0 && !query.trim() && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg">Start searching to find people</p>
          </div>
        )}

        {/* Results Grid */}
        {users.length > 0 && (
          <div className="space-y-4 mb-8">
            {users.map((user) => (
              <Card
                key={user.id}
                className="glass-alt card-border border-slate-700/50 bg-slate-900/40 hover:border-cyan-500/30 transition-all cursor-pointer overflow-hidden group"
                onClick={() => router.push(`/user/${user.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12 border border-cyan-500/20">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-sm text-slate-400">{user.major || 'No major specified'}</p>
                        <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                        {user.role}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        View Profile →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {nextCursor && users.length > 0 && (
          <div className="text-center mb-8">
            <Button
              onClick={() => handleSearch(nextCursor)}
              disabled={loading}
              variant="outline"
              className="border-slate-700/50 hover:border-cyan-500/30 hover:bg-cyan-500/10"
            >
              Load more results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
