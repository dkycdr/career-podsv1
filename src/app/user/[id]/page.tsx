import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type Params = { id: string };

export default async function UserProfile({ params }: { params: Params }) {
  const userId = params.id;

  const userRes = await fetch(`/api/auth/user?userId=${userId}`, { cache: 'no-store' });
  if (!userRes.ok) return <div className="p-6">User not found.</div>;
  const userJson = await userRes.json();
  if (!userJson?.success || !userJson.user) return <div className="p-6">User not found.</div>;
  const user = userJson.user;

  const podsRes = await fetch(`/api/pods?userId=${userId}`, { cache: 'no-store' });
  const podsJson = await podsRes.json();
  const pods = podsJson?.pods ?? [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : <AvatarFallback className="bg-slate-300 text-white text-xl">{user.name?.charAt(0)}</AvatarFallback>}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-slate-600">{user.major || ''} • Year {user.year || '-'}</p>
          <p className="text-sm text-slate-500 mt-2">{user.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Pods</h2>
        {pods.length === 0 ? (
          <p className="text-sm text-slate-600">No pods to show.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {pods.map((p: any) => (
              <div key={p.id} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.description}</div>
                </div>
                <Button asChild>
                  <a href={`/pod/${p.id}`}>View</a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
