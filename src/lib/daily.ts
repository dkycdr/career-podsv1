// Daily.co room management helper
const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

export async function createDailyRoom(meetingId: string, title: string) {
  if (!DAILY_API_KEY) {
    console.warn('Daily.co API key not configured; skipping room creation');
    return null;
  }

  try {
    console.log('🔄 Creating Daily.co room for meeting:', meetingId, 'Title:', title);
    const res = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name: `room-${meetingId}`
      })
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('❌ Daily.co room creation error (HTTP', res.status, '):', err);
      return null;
    }

    const room = await res.json();
    console.log('✅ Daily.co room created successfully:', room.url);
    return room.url; // Returns the room join URL
  } catch (err) {
    console.error('❌ Error creating Daily.co room:', err);
    return null;
  }
}

export async function deleteDailyRoom(roomName: string) {
  if (!DAILY_API_KEY) return;

  try {
    await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });
  } catch (err) {
    console.error('Error deleting Daily.co room:', err);
  }
}

export function generateDailyToken(roomName: string, userName: string, exp?: number) {
  if (!DAILY_API_KEY) return null;

  // This is a simplified approach; ideally use a library or server-side token generation
  // For now, we'll just return the room URL and let Daily handle auth via room settings
  return `https://${roomName}.daily.co`;
}
