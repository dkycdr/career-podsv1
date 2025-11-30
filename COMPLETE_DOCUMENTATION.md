# 🚀 Career Explorer Pods - Complete Web Application Documentation

**Project Name:** Career Explorer Pods  
**Repository:** career-pods (dkycdr)  
**Technology Stack:** Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL  
**Status:** Active Development

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Pages & Routes](#pages--routes)
6. [API Endpoints](#api-endpoints)
7. [Components](#components)
8. [Features](#features)
9. [Setup & Installation](#setup--installation)
10. [Development](#development)

---

## 🎯 Project Overview

**Career Explorer Pods** adalah platform web yang memfasilitasi eksplorasi karir untuk mahasiswa President University. Platform ini menghubungkan mahasiswa dalam kelompok kecil (pods) yang dipandu oleh mentor, memberikan kesempatan untuk:

- 🎓 Menjelajahi berbagai pilihan karir
- 👥 Berkolaborasi dengan teman sebaya
- 📚 Mendapatkan bimbingan dari mentor profesional
- 📊 Melacak progres dan pencapaian
- 🤝 Membangun jaringan profesional

### Target Users
- **Mahasiswa President University** - Peserta aktif dalam pods
- **Mentor/Pembimbing** - Membimbing dan mengelola pods
- **Admin** - Mengelola sistem, users, dan aktivitas

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework dengan App Router
- **TypeScript 5** - Type-safe programming
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library berkualitas tinggi
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js + Express** (via custom server.ts)
- **Prisma ORM** - Database abstraction layer
- **Socket.IO** - Real-time WebSocket communication
- **NextAuth.js** - Authentication

### Database & Services
- **PostgreSQL (Neon)** - Primary database
- **Meilisearch** - Full-text search engine
- **Daily.co** - Video conferencing
- **AWS** - Cloud storage

### UI Components & Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **TanStack Table** - Data table management
- **TanStack Query** - Data fetching & caching
- **DND Kit** - Drag and drop
- **Recharts** - Data visualization
- **Next Intl** - Internationalization

---

## 📁 Project Structure

```
career-pods/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── dashboard/                # Dashboard page
│   │   ├── profile/                  # User profile page
│   │   ├── change-password/          # Password change page
│   │   ├── success/                  # Success page
│   │   ├── admin/                    # Admin panel
│   │   ├── user/[id]/                # User detail page
│   │   └── api/                      # API routes
│   │       ├── auth/                 # Authentication endpoints
│   │       ├── users/                # User management
│   │       ├── pods/                 # Pod management
│   │       ├── meetings/             # Meeting management
│   │       ├── mentor-sessions/      # Mentor sessions
│   │       ├── progress/             # Progress tracking
│   │       ├── skills/               # Skills management
│   │       ├── career-interests/     # Career interests
│   │       ├── user-skills/          # User skills
│   │       ├── pod-materials/        # Pod materials
│   │       ├── activities/           # Activity logging
│   │       ├── health/               # Health check
│   │       ├── matching/             # Pod matching algorithm
│   │       ├── student/              # Student operations
│   │       └── admin/                # Admin operations
│   ├── components/                   # React components
│   │   ├── dashboard/                # Dashboard variants
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DataDrivenDashboard.tsx
│   │   │   ├── UnifiedDashboard.tsx
│   │   │   ├── CareerExplorerDashboard.tsx
│   │   │   └── ProgressBasedDashboard.tsx
│   │   ├── onboarding/               # Onboarding flow
│   │   │   ├── OnboardingFlow.tsx
│   │   │   ├── PersonalInfoStep.tsx
│   │   │   ├── AvailabilityStep.tsx
│   │   │   ├── CareerInterestsStep.tsx
│   │   │   ├── SkillsGoalsStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── progress/                 # Progress tracking
│   │   │   ├── ProgressDashboard.tsx
│   │   │   ├── ProgressCard.tsx
│   │   │   ├── AddSkillModal.tsx
│   │   │   └── CareerGoalModal.tsx
│   │   ├── meetings/                 # Meeting components
│   │   │   └── MeetingDetails.tsx
│   │   ├── search/                   # Search functionality
│   │   │   └── SearchUsers.tsx
│   │   └── ui/                       # shadcn/ui components
│   │       └── [various UI components]
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-mobile.ts
│   │   ├── use-toast.ts
│   │   └── useStudentDashboard.ts
│   ├── lib/                          # Utility functions
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── socket.ts                 # Socket.IO setup
│   │   ├── daily.ts                  # Daily.co integration
│   │   ├── db.ts                     # Database utilities
│   │   ├── search.ts                 # Meilisearch integration
│   │   └── utils.ts                  # General utilities
│   └── data/
│       └── mockData.ts               # Mock data for development
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding script
├── scripts/
│   └── indexUsers.ts                 # Meilisearch indexing
├── public/
│   ├── robots.txt
│   └── uploads/                      # User uploaded files
├── db/
│   └── dumps/                        # Database backups
├── server.ts                         # Custom Node.js server
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── eslint.config.mjs                 # ESLint configuration
└── postcss.config.mjs                # PostCSS configuration
```

---

## 🗄️ Database Schema

### Core Models

#### **User**
Stores user account information and relationships.

```prisma
model User {
  id              String      @id @default(cuid())
  email           String      @unique
  name            String?
  role            UserRole    @default(STUDENT)
  studentId       String?     @unique
  major           String?
  year            Int?
  avatar          String?
  bio             String?
  availability    String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  password        String
  
  // Relationships
  podMemberships  PodMembership[]
  mentorSessions  MentorSession[] @relation("MentorSessions")
  menteeSessions  MentorSession[] @relation("MenteeSessions")
  meetingNotes    MeetingNote[]
  meetings        Meeting[]
  progress        Progress[]
  careerInterests CareerInterest[]
  skills          UserSkill[]
  podMaterials    PodMaterial[]
}
```

#### **Pod**
Represents a study group for career exploration.

```prisma
model Pod {
  id              String          @id @default(cuid())
  name            String
  description     String?
  status          PodStatus       @default(ACTIVE)
  maxMembers      Int             @default(5)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relationships
  members         PodMembership[]
  meetings        Meeting[]
  materials       PodMaterial[]
}
```

#### **PodMembership**
Links users to pods with their role and status.

```prisma
model PodMembership {
  id              String          @id @default(cuid())
  userId          String
  podId           String
  role            PodRole         @default(MEMBER)
  joinedAt        DateTime        @default(now())
  status          MemberStatus    @default(ACTIVE)
  
  // Relationships
  user            User            @relation(fields: [userId], references: [id])
  pod             Pod             @relation(fields: [podId], references: [id])
}
```

#### **Meeting**
Represents scheduled meetings between pod members.

```prisma
model Meeting {
  id              String          @id @default(cuid())
  podId           String
  userId          String
  title           String
  description     String?
  scheduledDate   DateTime
  duration        Int?
  status          MeetingStatus   @default(SCHEDULED)
  location        String?
  meetingLink     String?
  
  // Relationships
  pod             Pod             @relation(fields: [podId], references: [id])
  user            User            @relation(fields: [userId], references: [id])
  notes           MeetingNote[]
}
```

#### **MentorSession**
One-on-one mentoring sessions.

```prisma
model MentorSession {
  id              String          @id @default(cuid())
  mentorId        String
  menteeId        String
  topic           String
  scheduledDate   DateTime
  duration        Int?
  status          SessionStatus   @default(SCHEDULED)
  notes           String?
  
  // Relationships
  mentor          User            @relation("MentorSessions", fields: [mentorId], references: [id])
  mentee          User            @relation("MenteeSessions", fields: [menteeId], references: [id])
}
```

#### **Progress**
Tracks user's career development and achievements.

```prisma
model Progress {
  id              String          @id @default(cuid())
  userId          String
  category        String
  title           String
  description     String?
  status          ProgressStatus  @default(IN_PROGRESS)
  completedDate   DateTime?
  createdAt       DateTime        @default(now())
  
  // Relationships
  user            User            @relation(fields: [userId], references: [id])
}
```

#### **CareerInterest**
User's career interests and preferences.

```prisma
model CareerInterest {
  id              String          @id @default(cuid())
  userId          String
  industry        String
  role            String
  priority        Int?
  description     String?
  createdAt       DateTime        @default(now())
  
  // Relationships
  user            User            @relation(fields: [userId], references: [id])
}
```

#### **UserSkill**
Skills acquired or tracked by users.

```prisma
model UserSkill {
  id              String          @id @default(cuid())
  userId          String
  skillName       String
  proficiency     String?
  acquiredDate    DateTime?
  
  // Relationships
  user            User            @relation(fields: [userId], references: [id])
}
```

#### **PodMaterial**
Learning materials shared in pods.

```prisma
model PodMaterial {
  id              String          @id @default(cuid())
  podId           String
  userId          String
  title           String
  description     String?
  content         String?
  type            String
  fileUrl         String?
  createdAt       DateTime        @default(now())
  
  // Relationships
  pod             Pod             @relation(fields: [podId], references: [id])
  user            User            @relation(fields: [userId], references: [id])
}
```

#### **Activity**
Tracks user activities for analytics.

```prisma
model Activity {
  id              String          @id @default(cuid())
  userId          String
  action          String
  description     String?
  timestamp       DateTime        @default(now())
}
```

---

## 📄 Pages & Routes

### Public Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Landing page dengan fitur platform |
| `/login` | `login/page.tsx` | Login untuk users yang sudah terdaftar |
| `/register` | `register/page.tsx` | Registrasi user baru |

### Protected Pages (Authenticated Users)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `dashboard/page.tsx` | Main dashboard dengan analytics |
| `/profile` | `profile/page.tsx` | User profile management |
| `/change-password` | `change-password/page.tsx` | Change password form |
| `/user/[id]` | `user/[id]/page.tsx` | View other user's profile |
| `/success` | `success/page.tsx` | Success confirmation page |

### Admin Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | `admin/page.tsx` | Admin control panel |

---

## 🔌 API Endpoints

### Authentication (`/api/auth/*`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Users (`/api/users/*`)
- `GET /api/users` - List all users (paginated)
- `GET /api/users/[id]` - Get specific user details
- `PUT /api/users/[id]` - Update user profile
- `DELETE /api/users/[id]` - Delete user account
- `GET /api/users/search` - Search users by name/email
- `GET /api/users/[id]/skills` - Get user skills

### Pods (`/api/pods/*`)
- `GET /api/pods` - List all pods
- `POST /api/pods` - Create new pod
- `GET /api/pods/[id]` - Get pod details
- `PUT /api/pods/[id]` - Update pod
- `DELETE /api/pods/[id]` - Delete pod
- `GET /api/pods/[id]/members` - Get pod members
- `POST /api/pods/[id]/join` - Join pod
- `POST /api/pods/[id]/leave` - Leave pod

### Meetings (`/api/meetings/*`)
- `GET /api/meetings` - List meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/[id]` - Get meeting details
- `PUT /api/meetings/[id]` - Update meeting
- `DELETE /api/meetings/[id]` - Cancel meeting
- `GET /api/meetings/[id]/notes` - Get meeting notes

### Mentor Sessions (`/api/mentor-sessions/*`)
- `GET /api/mentor-sessions` - List sessions
- `POST /api/mentor-sessions` - Schedule session
- `GET /api/mentor-sessions/[id]` - Get session details
- `PUT /api/mentor-sessions/[id]` - Update session
- `DELETE /api/mentor-sessions/[id]` - Cancel session

### Progress (`/api/progress/*`)
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Log progress
- `GET /api/progress/[id]` - Get specific progress
- `PUT /api/progress/[id]` - Update progress
- `DELETE /api/progress/[id]` - Delete progress entry

### Skills (`/api/skills/*`)
- `GET /api/skills` - List all skills
- `GET /api/user-skills` - Get user's skills
- `POST /api/user-skills` - Add skill to user
- `DELETE /api/user-skills/[id]` - Remove skill

### Career Interests (`/api/career-interests/*`)
- `GET /api/career-interests` - Get user's interests
- `POST /api/career-interests` - Add interest
- `PUT /api/career-interests/[id]` - Update interest
- `DELETE /api/career-interests/[id]` - Remove interest

### Pod Materials (`/api/pod-materials/*`)
- `GET /api/pod-materials` - List materials
- `POST /api/pod-materials` - Upload material
- `GET /api/pod-materials/[id]` - Get material details
- `DELETE /api/pod-materials/[id]` - Delete material

### Matching (`/api/matching/*`)
- `POST /api/matching/match-users` - AI-powered pod matching

### Student (`/api/student/*`)
- `GET /api/student/my-pods` - Get my pods
- `GET /api/student/recommended-pods` - Get pod recommendations

### Admin (`/api/admin/*`)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/pods` - Manage pods
- `POST /api/admin/activities` - View activities

### Health (`/api/health`)
- `GET /api/health` - Health check endpoint

### Activities (`/api/activities/*`)
- `GET /api/activities` - Get activity logs
- `POST /api/activities` - Log activity

---

## 🧩 Components

### Dashboard Components
- **`Dashboard.tsx`** - Basic dashboard layout
- **`DataDrivenDashboard.tsx`** - Analytics-focused dashboard
- **`UnifiedDashboard.tsx`** - Combined view
- **`CareerExplorerDashboard.tsx`** - Career path focused
- **`ProgressBasedDashboard.tsx`** - Progress tracking view

### Onboarding Components
- **`OnboardingFlow.tsx`** - Main onboarding orchestrator
- **`PersonalInfoStep.tsx`** - Basic user info collection
- **`AvailabilityStep.tsx`** - Schedule availability
- **`CareerInterestsStep.tsx`** - Career preferences
- **`SkillsGoalsStep.tsx`** - Skills and goals
- **`ReviewStep.tsx`** - Review and confirm

### Progress Components
- **`ProgressDashboard.tsx`** - Main progress view
- **`ProgressCard.tsx`** - Individual progress item
- **`AddSkillModal.tsx`** - Add skill dialog
- **`CareerGoalModal.tsx`** - Add career goal dialog

### Other Components
- **`MeetingDetails.tsx`** - Meeting information display
- **`SearchUsers.tsx`** - User search functionality
- **shadcn/ui components** - Reusable UI primitives (Button, Card, Dialog, etc.)

---

## ✨ Key Features

### 1. User Management
- ✅ User registration and login
- ✅ Profile creation and editing
- ✅ Role-based access (Student, Mentor, Admin)
- ✅ Password management
- ✅ User search functionality

### 2. Pod System
- ✅ Create and manage career pods
- ✅ Join/leave pods
- ✅ Pod member management
- ✅ Pod status tracking
- ✅ Material sharing within pods

### 3. Meetings & Sessions
- ✅ Schedule pod meetings
- ✅ Meeting notes and documentation
- ✅ Mentor-mentee session scheduling
- ✅ Meeting history and analytics

### 4. Career Development
- ✅ Career interest tracking
- ✅ Skill management and proficiency levels
- ✅ Progress monitoring
- ✅ Goal setting and tracking
- ✅ Career path recommendations

### 5. Real-time Communication
- ✅ Socket.IO integration for live updates
- ✅ WebSocket support at `/api/socketio`
- ✅ Real-time notifications

### 6. Search & Discovery
- ✅ Full-text search via Meilisearch
- ✅ User discovery
- ✅ Pod recommendations
- ✅ AI-powered pod matching

### 7. Analytics & Dashboard
- ✅ User progress visualization
- ✅ Career interest analytics
- ✅ Activity tracking
- ✅ Skill progression charts
- ✅ Attendance and participation metrics

### 8. Video Conferencing
- ✅ Daily.co integration for meetings
- ✅ Virtual meeting links
- ✅ Recording capabilities

### 9. Admin Management
- ✅ User management dashboard
- ✅ Pod administration
- ✅ Activity monitoring
- ✅ System statistics
- ✅ Platform analytics

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (or use Neon for cloud hosting)
- Git

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/dkycdr/career-pods.git
cd career-pods

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# Update .env.local with:
# DATABASE_URL=postgresql://user:password@host:port/database
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key

# 4. Setup database
npx prisma db push

# 5. Seed database (optional)
npm run db:seed

# 6. Index users for search (optional)
npm run meili:index
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_mZbHDc0M6ACV@ep-morning-band-aexwxv80-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Daily.co (Video Conferencing)
DAILY_API_KEY=your-daily-api-key

# Meilisearch (Search Engine)
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_KEY=your-meilisearch-key

# AWS (File Storage)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name

# Vercel (if deployed)
VERCEL_OIDC_TOKEN=your-vercel-token
```

---

## 💻 Development

### Running the Application

```bash
# Development server with hot reload
npm run dev

# The app will be available at http://localhost:3000
# Socket.IO will be at ws://localhost:3000/api/socketio
# Prisma Studio at http://localhost:5555
```

### Available Scripts

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database commands
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
npm run db:seed      # Seed database

# Search indexing
npm run meili:index  # Index users for search
```

### Project Commands in Detail

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm run dev` | Start dev server with hot reload | `npm run dev` |
| `npm run build` | Build for production | `npm run build` |
| `npm start` | Run production build | `npm start` |
| `npm run db:studio` | Open Prisma Studio GUI | `npm run db:studio` |
| `npm run db:migrate` | Create new migration | `npm run db:migrate` |
| `npm run db:push` | Sync schema to database | `npm run db:push` |
| `npm run db:reset` | Reset database | `npm run db:reset` |
| `npm run meili:index` | Rebuild Meilisearch indexes | `npm run meili:index` |

### Debugging

```bash
# Enable debug mode
DEBUG=* npm run dev

# View Prisma logs
PRISMA_DEBUG_LOGS=* npm run dev
```

### Code Quality

```bash
# Run linting
npm run lint

# Format with Prettier (if configured)
npm run format
```

---

## 🔐 Security Features

- ✅ NextAuth.js authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Environment variable protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Rate limiting on API endpoints
- ✅ Role-based access control (RBAC)

---

## 📊 Performance Optimization

- ✅ Connection pooling (Neon)
- ✅ Database indexing
- ✅ Query optimization with Prisma
- ✅ Full-text search with Meilisearch
- ✅ Image optimization with Sharp
- ✅ Caching strategies
- ✅ Code splitting with Next.js

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Verify connection
npx prisma db execute --stdin --schema prisma/schema.prisma

# Check environment variables
echo $DATABASE_URL
```

### Prisma Client Issues
```bash
# Regenerate client
npx prisma generate

# Clear and reinstall
rm -rf node_modules/.prisma
npm install
```

### Socket.IO Connection Issues
- Check firewall settings
- Verify WebSocket is enabled
- Check browser console for errors

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Socket.IO](https://socket.io/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 📝 License

This project is part of President University's career exploration platform.

---

## 👥 Contributors

- **Project Lead:** Dwiky Candra
- **Repository:** [career-pods](https://github.com/dkycdr/career-pods)

---

**Last Updated:** November 30, 2025  
**Version:** 0.1.0
