/**
 * Test script to create sample notifications and test the notification system
 * Run with: node test-notifications.mjs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestNotifications() {
  try {
    // Get the first user
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`\n📝 Creating test notifications for user: ${user.name} (${user.id})\n`);

    // Get a pod if exists
    const pod = await prisma.pod.findFirst({
      where: {
        memberships: {
          some: { userId: user.id }
        }
      }
    });

    const notifications = [
      {
        userId: user.id,
        type: 'POD_CREATED',
        podId: pod?.id || null,
        meetingId: null,
        message: '📦 You created a new pod "Web Development Basics"',
      },
      {
        userId: user.id,
        type: 'MEMBER_JOINED',
        podId: pod?.id || null,
        meetingId: null,
        message: '👥 John Doe joined your pod',
      },
      {
        userId: user.id,
        type: 'NEW_MESSAGE',
        podId: pod?.id || null,
        meetingId: null,
        message: '💬 New message in "Web Development Basics" pod from Jane Smith',
      },
      {
        userId: user.id,
        type: 'NEW_MEETING',
        podId: pod?.id || null,
        meetingId: null,
        message: '📅 New meeting scheduled: "React Advanced Concepts" on Dec 2, 2025',
      },
      {
        userId: user.id,
        type: 'POD_UPDATED',
        podId: pod?.id || null,
        meetingId: null,
        message: '✏️ Pod "Web Development Basics" was updated by the lead',
      },
    ];

    for (const notif of notifications) {
      const created = await prisma.notification.create({
        data: notif,
      });
      console.log(`✅ Created: ${created.message}`);
    }

    // Get all notifications for user
    const allNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`\n📊 Total notifications for ${user.name}: ${allNotifications.length}`);
    
    const unreadCount = allNotifications.filter(n => !n.read).length;
    console.log(`🔴 Unread notifications: ${unreadCount}`);
    console.log(`✅ Read notifications: ${allNotifications.length - unreadCount}`);

    console.log('\n📬 All notifications:');
    allNotifications.forEach((n, i) => {
      const status = n.read ? '✅' : '🔴';
      console.log(`${i + 1}. ${status} ${n.message}`);
    });

    console.log('\n✨ Test notifications created successfully!');
    console.log('📍 Visit http://localhost:3000/dashboard to see them\n');

  } catch (error) {
    console.error('❌ Error creating notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestNotifications();
