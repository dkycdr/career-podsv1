# 🤖 AI Chatbot Integration - Complete Setup Guide

## ✅ Apa yang sudah dibuat

### 1. **Backend API** (`/src/app/api/chat/route.ts`)
```typescript
- Endpoint: POST /api/chat
- Provider: DeepSeek API (Free)
- Features:
  ✓ Accepts: message, conversationId
  ✓ System prompt: Career development focused
  ✓ Bilingual support (EN/ID)
  ✓ Error handling
  ✓ Returns: AI response dengan timestamp
```

### 2. **Frontend Component** (`/src/components/ChatBot.tsx`)
```typescript
- Dark theme UI (matches dashboard)
- Features:
  ✓ Message history display
  ✓ Auto-scroll to latest message
  ✓ Loading states with spinner
  ✓ Clear chat button
  ✓ Input validation
  ✓ Message counter
  ✓ Timestamp for each message
  ✓ User/AI avatar icons
```

### 3. **Dashboard Integration** (DataDrivenDashboard.tsx)
```
Progress Tab Layout:
┌─────────────────────────────────────────────────────┐
│                                                     │
│    Progress Dashboard (2/3 width)  │  ChatBot (1/3) │
│                                    │                │
│    - Skills Development             │  Message      │
│    - Career Goals                   │  History      │
│    - Achievements                   │                │
│                                    │  Input Field   │
│                                    │                │
└─────────────────────────────────────────────────────┘
```

## 🚀 Setup Steps (5 Menit)

### Step 1: Daftar DeepSeek (Free)
```
1. Buka https://api.deepseek.com
2. Sign up (Google/Email)
3. Dapat free $10 credits
4. Copy API key dari dashboard
```

### Step 2: Setup Environment Variable
```powershell
# Buka D:\New\.env.local dan tambah:
DEEPSEEK_API_KEY=sk_paste_your_key_here
```

### Step 3: Test Locally
```powershell
cd "D:\New"
npm run dev
# Buka http://localhost:3000
# Login → Dashboard → Progress Tab
# Chat dengan bot di sidebar kanan!
```

## 📝 Contoh Pertanyaan untuk Bot

**Career Development:**
- "Bagaimana cara menjadi React developer profesional?"
- "Apa skill yang penting untuk data scientist?"
- "Gimana tips job search yang efektif?"

**Skill Learning:**
- "Saya baru belajar Python, langkah apa selanjutnya?"
- "Framework mana yang lebih baik untuk job market?"
- "Bagaimana cara praktik coding setiap hari?"

**Mentorship:**
- "Gimana cara networking di tech industry?"
- "Tips untuk interview dengan startup?"
- "Bagaimana work-life balance di tech?"

## 🌐 Deploy ke Production

### Option A: Vercel (Recommended)
```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set env variable di Vercel Dashboard:
# - Settings → Environment Variables
# - Add: DEEPSEEK_API_KEY=sk_xxx
```

### Option B: Railway
```powershell
# Install Railway CLI
npm i -g @railway/cli

# Login & Deploy
railway login
railway init
railway up

# Set env di Railway Dashboard
```

### Option C: Render
```
1. Push code ke GitHub
2. Connect repo di https://render.com
3. Set environment variable
4. Deploy otomatis!
```

## 📊 File Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           ← Chat API endpoint
│   ├── dashboard/
│   │   └── page.tsx               ← Updated with ChatBot
│   └── ...
├── components/
│   ├── ChatBot.tsx                ← New chatbot UI
│   ├── dashboard/
│   │   └── DataDrivenDashboard.tsx ← Integrated ChatBot
│   └── ...
├── .env.local                      ← Add DEEPSEEK_API_KEY
└── .env.local.example              ← Template

docs/
├── CHATBOT_SETUP.md               ← Detailed setup guide
└── README.md
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not found" | Check `.env.local` exists dan format benar |
| Chat tidak muncul | Refresh page, check console errors |
| Slow response | DeepSeek API take ~2-5 sec, normal |
| 401 Unauthorized | Verify API key di https://api.deepseek.com |
| Empty response | Check API key punya credits |

## 💡 Future Enhancements

- [x] Basic chatbot working ✓
- [ ] Save chat history to database
- [ ] Per-user conversation history
- [ ] Typing indicators from AI
- [ ] Voice chat support
- [ ] Resume review with AI
- [ ] Career path recommendations
- [ ] Scheduled AI coaching sessions
- [ ] Integration with calendar/meetings
- [ ] AI-powered pod recommendations

## 💰 Cost Analysis

**DeepSeek API (Current Setup):**
- Free tier: $10 credits (enough for ~1000+ conversations)
- Pricing: ~$0.003 per 1K tokens
- Average conversation: 300-500 tokens
- Cost per chat: ~$0.001-$0.002

**Compare dengan alternatives:**
- OpenAI GPT-4: ~$0.03 per 1K tokens (15x lebih mahal)
- Claude: ~$0.008 per 1K tokens (3x lebih mahal)
- Local Ollama: Free tapi resource heavy

## 📞 Support

Kalau ada masalah:
1. Check console browser (F12)
2. Check terminal/server logs
3. Verify `.env.local` setting
4. Try dengan simple message dulu
5. Check DeepSeek API status

---

**Status:** ✅ Ready to use
**Last Updated:** Nov 30, 2025
**Version:** 1.0
