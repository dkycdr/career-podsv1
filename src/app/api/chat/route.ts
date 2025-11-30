import { NextRequest, NextResponse } from 'next/server';
import { getContextualInfo } from '@/lib/knowledge-base';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        id: crypto.randomUUID(),
        message: 'AI Assistant belum dikonfigurasi. Silakan hubungi admin untuk setup Groq API key.',
        conversationId
      }, { status: 200 });
    }

    // Call Groq API with retry logic
    let response;
    let lastError;
    
    // Get contextual knowledge base if relevant
    const contextInfo = getContextualInfo(message);
    
    // Build system prompt with knowledge base
    const systemPrompt = `Kamu adalah AI Assistant Career Pods untuk mahasiswa President University. 
Tugasmu membantu dengan:
- Career development dan guidance
- Skill tracking dan learning paths
- Mentorship connections
- Event information
- Platform features
- University programs

${contextInfo ? `\nInformasi tentang President University dan Career Pods:\n${contextInfo}` : ''}

Berikan jawaban yang:
1. Helpful dan actionable
2. Dalam bahasa yang sama dengan user (English atau Indonesian)
3. Spesifik terhadap President University dan Career Pods jika relevant
4. Ringkas tapi informatif
5. Encourage user untuk engage dengan platform

Jika pertanyaan tentang Career Pods, gunakan informasi di atas. 
Jika tidak tahu, suruh user contact support atau admin.`;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 512,
            top_p: 1,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        break; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        console.error(`Groq API attempt ${attempt} failed:`, error);
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    if (!response) {
      console.error('All retry attempts failed:', lastError);
      return NextResponse.json({
        id: crypto.randomUUID(),
        message: 'AI service tidak merespons. Coba lagi dalam beberapa detik.',
        conversationId
      }, { status: 200 });
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Groq API Error:', error);
      
      let errorMessage = 'Maaf, ada error dari AI service. Silakan coba lagi.';
      if (response.status === 401) {
        errorMessage = 'API key tidak valid. Silakan periksa konfigurasi.';
      } else if (response.status === 429) {
        errorMessage = 'Terlalu banyak request hari ini. Silakan coba besok.';
      } else if (response.status === 500 || response.status === 503) {
        errorMessage = 'AI service sedang maintenance. Coba lagi dalam beberapa menit.';
      }
      
      return NextResponse.json({
        id: crypto.randomUUID(),
        message: errorMessage,
        conversationId
      }, { status: 200 });
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Maaf, tidak ada response dari AI.';

    return NextResponse.json({
      id: crypto.randomUUID(),
      message: aiMessage,
      conversationId
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    let errorMsg = 'Ada error. Coba lagi?';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMsg = 'Request timeout. Network lambat?';
      } else if (error.message.includes('ECONNRESET')) {
        errorMsg = 'Koneksi terputus. Coba lagi.';
      } else if (error.message.includes('fetch failed')) {
        errorMsg = 'Gagal terhubung ke AI service. Coba lagi.';
      }
    }
    
    return NextResponse.json({
      id: crypto.randomUUID(),
      message: errorMsg,
      conversationId: 'default'
    }, { status: 200 });
  }
}
