/**
 * Add notifications to the active test user (Dwiky Candra)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNotificationsToActiveUser() {
  try {
    // Find Dwiky Candra
    const user = await prisma.user.findUnique({
      where: { email: 'dwiky.candra@student.president.ac.id' }
    });

    if (!user) {
      console.log('❌ User Dwiky Candra not found');
      return;
    }

    console.log(`\n📝 Adding notifications for: ${user.name}\n`);

    // Get user's pod
    const membership = await prisma.podMembership.findFirst({
      where: { userId: user.id },
      include: { pod: true }
    });

    const notifications = [
      {
        userId: user.id,
        type: 'POD_UPDATED',
        podId: membership?.podId || null,
        meetingId: null,
        message: '✏️ Pod "IT Career & Tech Stack" was updated',
      },
      {
        userId: user.id,
        type: 'NEW_MESSAGE',
        podId: membership?.podId || null,
        meetingId: null,
        message: '💬 New message in your pod from a member',
      },
      {
        userId: user.id,
        type: 'MEMBER_JOINED',
        podId: membership?.podId || null,
        meetingId: null,
        message: '👥 A new member joined your pod',
      },
      {
        userId: user.id,
        type: 'NEW_MEETING',
        podId: membership?.podId || null,
        meetingId: null,
        message: '📅 New meeting scheduled for tomorrow at 3 PM',
      },
    ];

    for (const notif of notifications) {
      await prisma.notification.create({ data: notif });
      console.log(`✅ ${notif.message}`);
    }

    const unread = await prisma.notification.count({
      where: { userId: user.id, read: false }
    });

    console.log(`\n🔴 Total unread: ${unread}`);
    console.log('✨ Done! Check dashboard to see notifications\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addNotificationsToActiveUser();
