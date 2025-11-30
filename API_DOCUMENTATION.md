# API Documentation - AI Chatbot

## Endpoint: POST /api/chat

### Purpose
Menerima message dari user dan mengembalikan response dari AI (DeepSeek API)

### Request

#### URL
```
POST http://localhost:3000/api/chat
POST https://yourdomain.com/api/chat (production)
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "message": "Bagaimana cara belajar React?",
  "conversationId": "default"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| message | string | Yes | Pertanyaan/pesan dari user |
| conversationId | string | No | ID untuk tracking conversation (default: "default") |

### Response

#### Success Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Untuk belajar React, berikut langkah-langkahnya:\n\n1. **Pahami JavaScript terlebih dahulu**\n   - ES6+ syntax (arrow functions, destructuring, etc)\n   - Async/await, promises\n   - Callbacks\n\n2. **Belajar React Fundamentals**\n   - Components (functional & class)\n   - JSX\n   - Props & State\n   - Lifecycle methods / Hooks\n\n3. **Practice dengan Projects**\n   - Todo App\n   - Weather App\n   - E-commerce UI\n\n4. **Advanced Topics**\n   - Context API\n   - Redux/Zustand\n   - Performance optimization\n\nRekomendasi: Mulai dengan freecodecamp.org atau scrimba.com",
  "conversationId": "default"
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": "Message cannot be empty"
}
```

#### Error Response (500 Internal Server Error)
```json
{
  "error": "Failed to get AI response"
}
```

### Example Usage

#### JavaScript/TypeScript
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'What skills should I learn?',
    conversationId: 'user-123'
  })
});

const data = await response.json();
console.log(data.message); // AI response
```

#### cURL
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bagaimana cara menjadi fullstack developer?",
    "conversationId": "default"
  }'
```

#### Python
```python
import requests

response = requests.post(
    'http://localhost:3000/api/chat',
    json={
        'message': 'Tips untuk job interview?',
        'conversationId': 'default'
    }
)

print(response.json()['message'])
```

#### Fetch (Browser)
```javascript
async function askAI(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) throw new Error('API error');
    
    const { message: aiResponse } = await response.json();
    return aiResponse;
  } catch (error) {
    console.error('Chat error:', error);
    return 'Maaf, ada error. Silakan coba lagi.';
  }
}

// Usage
const response = await askAI('Gimana cara belajar?');
console.log(response);
```

## Backend Implementation

### File Location
```
src/app/api/chat/route.ts
```

### Key Features
1. **System Prompt**: Career development focused
2. **Model**: DeepSeek Chat
3. **Temperature**: 0.7 (balanced creativity vs accuracy)
4. **Max Tokens**: 500 (reasonable length response)
5. **Language**: Bilingual (English/Indonesian)

### Environment Requirements
```env
DEEPSEEK_API_KEY=sk_xxxxx
```

### Error Handling
- Empty message validation
- API key validation
- DeepSeek API error handling
- Proper HTTP status codes
- User-friendly error messages

## Rate Limiting & Quotas

### DeepSeek API Limits
- Free tier: $10 credits
- Rate limit: 60 requests/minute
- Max tokens per request: 4000

### Cost per Message
```
Average message: 300-500 tokens
Cost: ~$0.0003-$0.0005 per message
10 credits allows: ~20,000 messages
Sufficient for: 1000+ users with 20 msgs each
```

## Security Considerations

### Input Validation
- ✓ Message not empty
- ✓ Message length reasonable
- ✓ SQL injection prevention (no direct DB queries)
- ✓ XSS prevention (Next.js auto-escaping)

### API Key Protection
- ✓ Only in server-side environment variables
- ✓ Never exposed to client-side
- ✓ Not logged in plain text

### Response Handling
- ✓ Error details not exposed to client
- ✓ Proper error logging server-side
- ✓ CORS headers if needed

## Testing

### Unit Test Example
```typescript
import { POST } from '@/app/api/chat/route';

describe('Chat API', () => {
  it('should return AI response', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        conversationId: 'test'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBeDefined();
    expect(data.id).toBeDefined();
  });

  it('should reject empty message', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '' })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

## Integration with Frontend

### ChatBot Component
- Uses `/api/chat` endpoint
- Handles loading states
- Stores messages in local state
- Auto-scrolls to latest message
- Error recovery

### Usage in Dashboard
```tsx
<div className="lg:col-span-1">
  <ChatBot />
</div>
```

## Monitoring & Logging

### Server Logs
```
POST /api/chat 200 - 2.3s
POST /api/chat 400 - 0.1s (empty message)
POST /api/chat 500 - 1.5s (API error)
```

### Metrics to Track
- Request count
- Response time
- Error rate
- API credit usage
- User engagement

## Future Enhancements

- [ ] Conversation history persistence (database)
- [ ] Per-user message limits
- [ ] Context awareness (user profile, skills, goals)
- [ ] Response streaming
- [ ] Multi-turn conversations
- [ ] Rating system for responses
- [ ] Admin dashboard for metrics
- [ ] A/B testing different prompts
- [ ] Voice input/output support
- [ ] Integration with calendar/meetings API

## Support & Debugging

### Common Issues

**"API key not found"**
- Check `.env.local` exists
- Verify environment variable is set
- Restart dev server

**"Slow response"**
- DeepSeek API may be busy
- Check internet connection
- Normal: 2-5 seconds per response

**"Empty response"**
- Check API key is valid
- Verify free credits available
- Check request format

### Debug Mode
```typescript
// Add to route.ts for debugging
console.log('Chat API called:', { message, conversationId });
console.log('API response:', data);
```

---

**Version:** 1.0
**Last Updated:** Nov 30, 2025
**Status:** ✅ Production Ready
