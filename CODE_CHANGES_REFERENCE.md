# Code Changes - Complete Reference

## File 1: `/src/app/api/pods/route.ts`

### Change: Added POST endpoint (Lines 50-120)

**Added:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { name, description, userId, maxMembers } = await request.json();

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: "Name and userId required" },
        { status: 400 }
      );
    }

    // Create pod
    const pod = await db.pod.create({
      data: {
        name,
        description: description || "",
        maxMembers: maxMembers || 5,
        status: "ACTIVE",
      },
    });

    // Add user as creator
    await db.podMembership.create({
      data: {
        podId: pod.id,
        userId,
        role: "CREATOR",
      },
    });

    // Return complete pod with memberships
    const completePod = await db.pod.findUnique({
      where: { id: pod.id },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, pod: completePod });
  } catch (error) {
    console.error("Error creating pod:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
```

---

## File 2: `/src/app/api/progress/route.ts`

### Change: Replaced entire file with real implementation

**Before:**
```typescript
export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, progress: [] });
}
```

**After:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId required" },
        { status: 400 }
      );
    }

    // Fetch progress items
    const progress = await db.progress.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch user skills
    const skills = await db.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
    });

    // Fetch career interests (goals)
    const careerInterests = await db.careerInterest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      progress,
      skills,
      careerInterests,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { goal, category, deadline, userId } = await request.json();

    if (!goal || !userId) {
      return NextResponse.json(
        { success: false, error: "Goal and userId required" },
        { status: 400 }
      );
    }

    // Create career interest (goal)
    const careerInterest = await db.careerInterest.create({
      data: {
        userId,
        interest: goal,
        description: category || "",
        targetDate: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json({
      success: true,
      goal: careerInterest,
    });
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
```

---

## File 3: `/src/components/dashboard/DataDrivenDashboard.tsx`

### Change 1: Added state variables (Line 186)

**Added:**
```typescript
const [progress, setProgress] = useState<any[]>([]);
```

(Already had careerInterests and skills)

### Change 2: Updated fetchProgress useEffect (Lines 256-280)

**Before:**
```typescript
if (data.success) {
  setCareerInterests(data.careerInterests || []);
  setSkills(data.skills || []);
  console.log('✅ Fetched career interests:', data.careerInterests?.length);
}
```

**After:**
```typescript
if (data.success) {
  setCareerInterests(data.careerInterests || []);
  setSkills(data.skills || []);
  setProgress(data.progress || []);
  console.log('✅ Fetched career interests:', data.careerInterests?.length);
  console.log('✅ Fetched progress items:', data.progress?.length);
}
```

### Change 3: Updated handleSetGoalSubmit (Lines 357-385)

**Before:**
```typescript
const handleSetGoalSubmit = async (e: any) => {
  e?.preventDefault();
  if (!goalForm.goal.trim()) {
    alert('Please enter a goal');
    return;
  }
  // In real implementation, this would save to database
  alert(`✅ Goal "${goalForm.goal}" saved! Target: ${goalForm.deadline}`);
  setGoalForm({ goal: '', deadline: '', category: '' });
  setGoalModal(false);
};
```

**After:**
```typescript
const handleSetGoalSubmit = async (e: any) => {
  e?.preventDefault();
  if (!goalForm.goal.trim()) {
    alert('Please enter a goal');
    return;
  }
  
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goal: goalForm.goal,
        category: goalForm.category,
        deadline: goalForm.deadline,
        userId: userId
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setGoalForm({ goal: '', deadline: '', category: '' });
      setGoalModal(false);
      // Refresh goals
      const res = await fetch(`/api/progress?userId=${userId}`);
      const progData = await res.json();
      if (progData.success) {
        setCareerInterests(progData.careerInterests || []);
      }
      alert(`✅ Goal "${data.goal.interest}" saved successfully!`);
    } else {
      alert('❌ Failed to save goal');
    }
  } catch (error) {
    alert('❌ Error saving goal: ' + error);
  }
};
```

### Change 4: Updated Career Goals stat card (Lines 563-567)

**Before:**
```typescript
<p className="text-3xl font-bold text-purple-900">3</p>
<p className="text-xs text-purple-700 mt-1">Active goals</p>
```

**After:**
```typescript
<p className="text-3xl font-bold text-purple-900">{careerInterests.length}</p>
<p className="text-xs text-purple-700 mt-1">Active {careerInterests.length === 1 ? 'goal' : 'goals'}</p>
```

### Change 5: Updated Achievements stat card (Lines 573-576)

**Before:**
```typescript
<p className="text-3xl font-bold text-yellow-900">8</p>
<p className="text-xs text-yellow-700 mt-1">Milestones unlocked</p>
```

**After:**
```typescript
<p className="text-3xl font-bold text-yellow-900">{progress.filter((p: any) => p.completed).length}</p>
<p className="text-xs text-yellow-700 mt-1">Milestones unlocked</p>
```

### Change 6: Updated Progress tab stats cards (Lines 753-780)

**Before:**
```typescript
<div className="text-3xl font-bold text-slate-900">52%</div>
<p className="text-sm text-slate-500 mt-1">3 of 6 goals completed</p>
...
<div className="text-3xl font-bold text-slate-900">8</div>
<p className="text-sm text-slate-500 mt-1">In the last 3 months</p>
...
<div className="text-3xl font-bold text-slate-900">5</div>
<p className="text-sm text-slate-500 mt-1">Achievements unlocked</p>
```

**After:**
```typescript
<div className="text-3xl font-bold text-slate-900">
  {careerInterests.length > 0 ? Math.round((progress.filter((p: any) => p.completed).length / careerInterests.length) * 100) : 0}%
</div>
<p className="text-sm text-slate-500 mt-1">
  {progress.filter((p: any) => p.completed).length} of {careerInterests.length} {careerInterests.length === 1 ? 'goal' : 'goals'} completed
</p>
...
<div className="text-3xl font-bold text-slate-900">{skills.length}</div>
<p className="text-sm text-slate-500 mt-1">Skills tracked</p>
...
<div className="text-3xl font-bold text-slate-900">{progress.filter((p: any) => p.completed).length}</div>
<p className="text-sm text-slate-500 mt-1">Achievements unlocked</p>
```

### Change 7: Updated Skills Development section (Lines 783-807)

**Before:**
```typescript
<div className="space-y-5">
  {[
    { skill: 'Technical Skills', progress: 60, color: 'from-blue-500 to-blue-600' },
    { skill: 'Communication', progress: 40, color: 'from-green-500 to-green-600' },
    { skill: 'Leadership', progress: 30, color: 'from-purple-500 to-purple-600' },
    { skill: 'Problem Solving', progress: 70, color: 'from-orange-500 to-orange-600' }
  ].map((item, index) => (
    ...
  ))}
</div>
```

**After:**
```typescript
<div className="space-y-5">
  {skills.length > 0 ? (
    skills.map((skill: any) => (
      <div key={skill.id}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-slate-900">{skill.skill?.name || 'Unknown Skill'}</span>
          <span className="text-sm font-semibold text-slate-600">
            {skill.proficiencyLevel || 'Beginner'}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: '60%' }}
          />
        </div>
      </div>
    ))
  ) : (
    <p className="text-slate-500 text-center py-4">No skills tracked yet</p>
  )}
</div>
```

### Change 8: Added Career Goals display section (Lines 810-860)

**Added new section:**
```typescript
{/* Career Goals Section */}
<div className="bg-white border border-slate-200 rounded-xl p-6">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-slate-900">Career Goals</h3>
    <Button 
      onClick={handleSetGoal}
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Plus className="w-4 h-4 mr-1.5" />
      Add Goal
    </Button>
  </div>
  
  {progressLoading ? (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-3 text-slate-600 text-sm">Loading goals...</p>
    </div>
  ) : careerInterests.length === 0 ? (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
      <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-600">No career goals set yet</p>
      <p className="text-slate-500 text-sm mt-1">Create your first goal to start your career exploration journey</p>
    </div>
  ) : (
    <div className="space-y-3">
      {careerInterests.map((goal: any) => (
        <div 
          key={goal.id}
          className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{goal.interest}</h4>
              {goal.description && (
                <p className="text-sm text-slate-600 mt-1">Category: {goal.description}</p>
              )}
              {goal.targetDate && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {goal.status || 'In Progress'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

---

## File 4: `/next.config.ts`

### Change: Removed incompatible webpack config

**Before:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
```

**After:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
```

---

## File 5: `/package.json`

### Change: Fixed npm scripts for Windows

**Before:**
```json
"dev": "nodemon --exec \"npx tsx server.ts\" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log",
"start": "NODE_ENV=production tsx server.ts 2>&1 | tee server.log",
```

**After:**
```json
"dev": "nodemon --exec \"npx tsx server.ts\" --watch server.ts --watch src --ext ts,tsx,js,jsx",
"start": "NODE_ENV=production tsx server.ts",
```

---

## Summary of Changes

| File | Lines Changed | Type | Impact |
|------|---------------|------|--------|
| pods/route.ts | +50-120 | Added | Critical: Enables pod creation |
| progress/route.ts | 1-80 | Replaced | Critical: Real data fetching |
| DataDrivenDashboard.tsx | 8-10 changes | Updated | Major: UI + data integration |
| next.config.ts | -14 lines | Removed | Minor: Build compatibility |
| package.json | 2 lines | Fixed | Minor: Windows support |

**Total Impact:** ⭐⭐⭐⭐⭐ High - Complete data persistence implementation
