"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search as SearchIcon } from "lucide-react";

export default function SearchUsers({ viewerId, onVisit }: { viewerId?: string | null; onVisit?: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async (cursor?: string | null) => {
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
      params.set('limit', '10');
      if (cursor) params.set('cursor', cursor);

      const res = await fetch(`/api/users/search?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <Input placeholder="Search people by name or major..." value={query} onChange={(e: any) => setQuery(e.target.value)} />
        <select className="border rounded px-2 py-1" value={role || ''} onChange={(e) => setRole(e.target.value || undefined)}>
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="MENTOR">Mentor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <Button onClick={() => doSearch(null)} disabled={loading}><SearchIcon className="w-4 h-4 mr-2" />Search</Button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <div className="text-sm text-slate-500">Searching...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {users.map(u => (
          <div key={u.id} className="p-2 border rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                {u.avatar ? <AvatarImage src={u.avatar} alt={u.name} /> : <AvatarFallback className="bg-slate-300 text-white">{u.name?.charAt(0)}</AvatarFallback>}
              </Avatar>
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-slate-500">{u.role} • {u.major || ''}</div>
              </div>
            </div>
            <div>
              <Button variant="ghost" onClick={() => onVisit ? onVisit(u.id) : window.location.href = `/user/${u.id}`}>
                Visit
              </Button>
            </div>
          </div>
        ))}

        {nextCursor && (
          <div className="text-center mt-2">
            <Button variant="outline" onClick={() => doSearch(nextCursor)} disabled={loading}>Load more</Button>
          </div>
        )}
      </div>
    </div>
  );
}
