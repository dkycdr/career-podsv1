# 🏗️ Interactive Dashboard Code Structure

## Overview

The interactive dashboard is built with:
- **React 19** - Component framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and animations
- **Shadcn/UI** - Pre-built components
- **SQLite + Prisma** - Data persistence
- **Custom modals** - Form dialogs

---

## 📁 File Structure

```
src/components/dashboard/
└── DataDrivenDashboard.tsx (1000+ lines)
    ├── Imports & Setup (lines 1-60)
    ├── Animation Definitions (lines 40-60)
    ├── Modal Component (lines 70-90)
    ├── Custom Hooks (lines 100-180)
    │   ├── useUserData()
    │   └── usePodsData()
    ├── Main Component (lines 190+)
    │   ├── State Declarations
    │   ├── Handler Functions
    │   ├── Return JSX
    │   │   ├── Header
    │   │   ├── Navigation
    │   │   ├── Tab Content
    │   │   │   ├── Overview
    │   │   │   ├── My Pods
    │   │   │   ├── Meetings
    │   │   │   └── Progress
    │   │   ├── Bottom Nav (mobile)
    │   │   └── Modals
    │   └── Export
```

---

## 🔧 Component Breakdown

### 1. Modal Component (Reusable)
```tsx
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in">
        {/* Header with close button */}
        {/* Content area */}
      </div>
    </div>
  );
};
```

**Props**:
- `isOpen`: boolean - Show/hide modal
- `onClose`: function - Close handler
- `children`: ReactNode - Modal content
- `title`: string - Modal heading

**Features**:
- Backdrop blur effect
- Smooth scale-in animation
- Close button (X)
- Click outside to close (possible enhancement)

---

### 2. Custom Hooks

#### useUserData()
```tsx
const useUserData = (userId: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch from /api/auth/user
  }, [userId]);
  
  return { user, loading };
};
```

**Purpose**: Fetch logged-in user's info
**Returns**: { user, loading }

#### usePodsData()
```tsx
const usePodsData = (userId: string) => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const mockTemplatePods = [/* 3 template pods */];
  
  const fetchPodsData = async () => {
    // Try to fetch from API
    // Fall back to mock templates if empty
  };
  
  useEffect(() => {
    if (userId) fetchPodsData();
  }, [userId]);
  
  return { pods, loading, refetch: fetchPodsData };
};
```

**Purpose**: Fetch user's pods (or show templates)
**Returns**: { pods, loading, refetch }
**Smart Feature**: Falls back to mock templates if no real pods

---

### 3. Main Component State

#### Modal States
```tsx
const [createPodModal, setCreatePodModal] = useState(false);      // Show/hide
const [meetingModal, setMeetingModal] = useState(false);
const [goalModal, setGoalModal] = useState(false);
const [mentorModal, setMentorModal] = useState(false);
const [selectedPodForMeeting, setSelectedPodForMeeting] = useState(null); // Pre-select pod
```

#### Form States
```tsx
const [podForm, setPodForm] = useState({ 
  name: '', 
  description: '' 
});

const [meetingForm, setMeetingForm] = useState({ 
  title: '', 
  date: '', 
  time: '', 
  maxAttendees: 5 
});

const [goalForm, setGoalForm] = useState({ 
  goal: '', 
  deadline: '', 
  category: '' 
});

const [mentorForm, setMentorForm] = useState({ 
  field: '', 
  experience: '' 
});
```

#### Data States
```tsx
const [userId, setUserId] = useState(null);
const [activeTab, setActiveTab] = useState('overview');
const [meetings, setMeetings] = useState([]);
const [meetingsLoading, setMeetingsLoading] = useState(false);
const [meetingsError, setMeetingsError] = useState(null);
```

---

### 4. Handler Functions

#### Create Pod Handler
```tsx
const handleCreatePodSubmit = async (e) => {
  e?.preventDefault();
  
  // 1. Validate
  if (!podForm.name.trim()) {
    alert('Please enter a pod name');
    return;
  }
  
  try {
    // 2. POST to API
    const response = await fetch('/api/pods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: podForm.name,
        description: podForm.description,
        userId: userId,
        maxMembers: 8
      })
    });
    
    const data = await response.json();
    
    // 3. Handle response
    if (data.success) {
      // 4. Reset form
      setPodForm({ name: '', description: '' });
      // 5. Close modal
      setCreatePodModal(false);
      // 6. Refresh list
      refetchPods();
      // 7. Show success
      alert('✅ Pod created successfully!');
    } else {
      alert('❌ Failed: ' + data.error);
    }
  } catch (error) {
    alert('❌ Error: ' + error);
  }
};
```

**Pattern**:
1. Validate form data
2. Call API endpoint (POST/GET)
3. Handle response
4. Reset form state
5. Close modal
6. Refresh data list
7. Show feedback to user

#### Other Handlers Follow Same Pattern
- `handleScheduleMeetingSubmit` - Schedule meeting
- `handleSetGoalSubmit` - Save goal
- `handleFindMentorSubmit` - Request mentor
- `handleScheduleMeeting` - Open modal + set pod ID
- `handleCreatePod` - Open create pod modal
- `handleSetGoal` - Open goal modal
- `handleFindMentor` - Open mentor modal

---

### 5. JSX Structure

#### Header Section
```tsx
<header className="bg-white shadow-sm sticky top-0 z-50">
  {/* Logo with gradient */}
  {/* User info section */}
  {/* Logout button */}
</header>
```

#### Navigation Tabs
```tsx
<nav className="flex space-x-1">
  {tabs.map((tab) => (
    <button
      className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
        isActive 
          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
          : 'border-transparent text-slate-600 hover:bg-slate-50'
      }`}
    >
      {/* Tab icon + label */}
    </button>
  ))}
</nav>
```

#### Overview Tab Content
```tsx
{activeTab === 'overview' && (
  <div className="space-y-8">
    {/* Welcome heading */}
    {/* 4 animated stats cards */}
    {/* Quick action buttons */}
  </div>
)}
```

#### My Pods Tab Content
```tsx
{activeTab === 'pods' && (
  <div className="space-y-6">
    {/* Header + Create button */}
    {/* Loading state OR */}
    {/* Empty state OR */}
    {/* Grid of pod cards with: */}
    {/*   - Pod name + icon */}
    {/*   - Description */}
    {/*   - Member avatars */}
    {/*   - Meet + Settings buttons */}
  </div>
)}
```

#### Meetings Tab Content
```tsx
{activeTab === 'meetings' && (
  <div className="space-y-6">
    {/* Header */}
    {/* Loading state OR */}
    {/* Error state OR */}
    {/* Empty state OR */}
    {/* List of meeting cards with: */}
    {/*   - Meeting title + type badge */}
    {/*   - Pod name + date + time */}
    {/*   - Mentor info (if assigned) */}
    {/*   - Join + Settings buttons */}
  </div>
)}
```

#### Progress Tab Content
```tsx
{activeTab === 'progress' && (
  <div className="space-y-6">
    {/* 3 metric stat cards */}
    {/* Skills progress section with: */}
    {/*   - Gradient progress bars */}
    {/*   - Skill names */}
    {/*   - Percentage labels */}
    {/*   - Set new goal button */}
  </div>
)}
```

---

### 6. Modal Rendering

Each modal follows the same pattern:

```tsx
<Modal 
  isOpen={createPodModal} 
  onClose={() => setCreatePodModal(false)} 
  title="✨ Create New Pod"
>
  <form onSubmit={handleCreatePodSubmit} className="space-y-4">
    {/* Form field 1 */}
    <div>
      <label className="block text-sm font-medium mb-2">Pod Name</label>
      <Input
        placeholder="..."
        value={podForm.name}
        onChange={(e) => setPodForm({...podForm, name: e.target.value})}
      />
    </div>
    
    {/* Form field 2 */}
    <div>
      <label>...</label>
      <Input/Textarea/Select />
    </div>
    
    {/* Submit button */}
    <Button type="submit" className="w-full">
      <Icon /> Action Text
    </Button>
  </form>
</Modal>
```

---

## 🎨 Styling Classes Used

### Card Styling
```tsx
// Base card
className="bg-white border border-slate-200 rounded-xl p-6"

// Interactive card
className="...hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"

// Gradient card
className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
```

### Button Styling
```tsx
// Primary
className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"

// Outlined
className="border-slate-200 hover:bg-slate-50"

// Ghost
className="variant-ghost"
```

### Text Colors
```tsx
// Headings
className="text-4xl font-bold text-slate-900"

// Body
className="text-slate-600"

// Labels
className="text-sm font-medium text-slate-900"

// Secondary
className="text-xs text-slate-500"
```

### Spacing
```tsx
// Container
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"

// Grid gaps
className="gap-4 gap-5 gap-6 gap-8"

// Vertical space
className="space-y-4 space-y-6 space-y-8"
```

---

## ⚙️ API Integration

### Create Pod
```tsx
POST /api/pods
Headers: Content-Type: application/json
Body: {
  name: string,
  description: string,
  userId: string,
  maxMembers: number
}
Response: {
  success: boolean,
  pod: { id, name, description, ... },
  error?: string
}
```

### Schedule Meeting
```tsx
POST /api/meetings
Headers: Content-Type: application/json
Body: {
  title: string,
  podId: string,
  userId: string,
  scheduledAt: Date,
  maxAttendees: number,
  type: 'video'
}
Response: {
  success: boolean,
  meeting: { id, title, ... },
  error?: string
}
```

### Get Meetings
```tsx
GET /api/meetings
Headers: x-user-id: string
Response: {
  success: boolean,
  meetings: [{id, title, date, time, ...}],
  error?: string
}
```

### Get Pods
```tsx
GET /api/pods?userId=XXX
Response: {
  success: boolean,
  pods: [{id, name, description, memberships, ...}],
  error?: string
}
```

---

## 🎬 Animation System

### Global Animations (Defined at Top)
```tsx
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Applied to Cards
```tsx
<div 
  className="...transition-all duration-300"
  style={{
    animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s forwards`,
    opacity: 0
  }}
>
  {/* Card content */}
</div>
```

**Explanation**:
- `0.5s` - Duration
- `ease-out` - Easing function
- `${idx * 0.1}s` - Stagger delay (100ms per item)
- `forwards` - Keep end state

### Hover Animations (Tailwind)
```tsx
className="hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-300"
```

Smooth transitions on hover:
- Shadow: `lg` (larger shadow)
- Position: `-translate-y-1` (move up 4px)
- Border: `slate-300` (lighter gray)
- Duration: `300ms`

---

## 🔄 Data Flow Diagram

```
User Action
    ↓
Button Click Handler
    ↓
setModalState(true) ← Modal opens
    ↓
User Fills Form
    ↓
onChange handlers update formState
    ↓
User Clicks Submit
    ↓
Validation Check
    ├─ FAIL → Show alert
    └─ PASS ↓
    ↓
API Call (POST/GET)
    ↓
Parse Response
    ├─ ERROR → Show error alert
    └─ SUCCESS ↓
    ↓
Reset Form State
    ↓
setModalState(false) ← Modal closes
    ↓
refetch/refresh data
    ↓
Show Success Alert
    ↓
New Data Animates In
```

---

## 📚 Key Concepts

### State Lifting
- Modal open state lives in main component
- Can be controlled by multiple buttons
- Handlers passed to buttons

### Form State Management
- Separate state for each form
- Form state reset after submission
- Values bound to input elements

### Conditional Rendering
- `{activeTab === 'overview' && <div>...</div>}`
- `{isLoading ? <spinner /> : <content />}`
- `{data.length === 0 ? <empty /> : <list />}`

### Effect Dependencies
- `useEffect(() => {...}, [userId])` - Runs when userId changes
- `useEffect(() => {...}, [activeTab])` - Runs when tab changes
- Empty deps `[]` - Runs once on mount

---

## 🚀 How to Extend

### Add New Modal
1. Add state: `const [newModal, setNewModal] = useState(false);`
2. Add form state: `const [newForm, setNewForm] = useState({...});`
3. Add handler: `const handleNewSubmit = async (e) => {...};`
4. Add button: `<Button onClick={() => setNewModal(true)}>...</Button>`
5. Render modal: `<Modal isOpen={newModal}><form>...</form></Modal>`

### Add New Tab
1. Add state option: `'newtab'` to activeTab type
2. Add tab definition to tabs array
3. Add conditional render: `{activeTab === 'newtab' && <JSX>}`
4. Add tab button in navigation

### Add New API Endpoint
1. Create route in `/api/...`
2. Import/use in component
3. Call with fetch()
4. Handle response
5. Update UI

---

## ✅ Best Practices Used

✅ Component composition (Modal, hooks)
✅ State management (useState, useEffect)
✅ Event handling (onClick, onSubmit)
✅ Error handling (try/catch, alerts)
✅ Conditional rendering
✅ Array mapping (map)
✅ Responsive design (Tailwind)
✅ Accessibility (labels, semantic HTML)
✅ Performance (memoization opportunities)
✅ Code organization (grouped by feature)

---

## 🐛 Debugging Tips

### Check Modal Not Opening
- Verify state: `console.log(createPodModal)`
- Check button handler: `onClick={() => setCreatePodModal(true)}`
- Ensure Modal receives `isOpen={createPodModal}`

### Check Form Not Submitting
- Add `console.log()` in handler
- Check form validation
- Verify API endpoint exists
- Check network tab in DevTools

### Check Animation Not Playing
- Verify CSS in head tag
- Check animation class applied
- Inspect computed styles (F12)
- Test in Chrome (best animation support)

### Check Data Not Displaying
- Check fetch call in useEffect
- Verify API response structure
- Check state was updated
- Use React DevTools extension

---

**This comprehensive structure makes it easy to maintain, extend, and debug the interactive dashboard!** 🎉
