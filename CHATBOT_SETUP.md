# AI Chatbot Setup Guide

## Step 1: Get DeepSeek API Key (FREE)

1. Go to https://api.deepseek.com
2. Sign up dengan Google/Email
3. Dapatkan API key di dashboard (gratis ada $10 credits)
4. Copy API key-nya

## Step 2: Setup Environment Variables

Buat file `.env.local` di root folder project:

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk_xxxxxx_paste_api_key_kamu_di_sini_xxxxxx
```

## Step 3: Test Locally

```powershell
npm run dev
```

Buka: http://localhost:3000/dashboard
- Click tab "Progress"
- Chat dengan AI Assistant di sidebar kanan

## Features

✅ Free AI chatbot (DeepSeek API)
✅ Career development assistance
✅ Skill & mentorship advice
✅ Message history dalam session
✅ Dark theme UI
✅ Auto-scroll & loading states
✅ Bilingual support (English/Indonesian)

## Deployment Steps

### Option 1: Deploy ke Vercel

```powershell
npm i -g vercel
vercel login
vercel --prod
```

Follow prompts dan set DEEPSEEK_API_KEY di Vercel dashboard

### Option 2: Deploy ke Railway

```powershell
npm i -g @railway/cli
railway login
railway init
railway up
```

Set environment variable di Railway dashboard

## API Endpoint

- **POST** `/api/chat`
- Body:
```json
{
  "message": "Bagaimana cara belajar React?",
  "conversationId": "default"
}
```

- Response:
```json
{
  "id": "uuid",
  "message": "AI response...",
  "conversationId": "default"
}
```

## Troubleshooting

**Error: API key not found**
- Make sure `.env.local` sudah di root folder
- Restart `npm run dev`
- Check API key format (harus dimulai dengan `sk_`)

**Error: DeepSeek API returned error**
- Verify API key di https://api.deepseek.com/app/api_keys
- Check free credits (minimum $0.01 needed)
- Try simple message dulu

**Chat tidak muncul**
- Check browser console untuk error messages
- Make sure Network tab menunjukkan request `/api/chat` berhasil
- Try refresh page

## Future Enhancements

- [ ] Simpan chat history ke database
- [ ] Per-user conversation history
- [ ] Typing indicators
- [ ] Voice chat support
- [ ] File upload untuk resume review
- [ ] Scheduled AI coaching sessions
