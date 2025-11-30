'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  podId?: string;
}

interface NotificationPanelProps {
  userId: string;
}

export default function NotificationPanel({ userId }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Mark notification as read
  const handleMarkRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => {
          const notif = notifications.find(n => n.id === notificationId);
          return notif && !notif.read ? Math.max(0, prev - 1) : prev;
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      for (const notification of notifications) {
        await fetch(`/api/notifications/${notification.id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': userId,
          },
        });
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'POD_CREATED':
      case 'POD_UPDATED':
        return '📦';
      case 'NEW_MEETING':
      case 'MEETING_UPDATED':
        return '📅';
      case 'NEW_MESSAGE':
        return '💬';
      case 'MEMBER_JOINED':
        return '👥';
      default:
        return '🔔';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-400 hover:text-slate-300 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-2xl z-50 backdrop-blur-sm">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
            <h3 className="font-semibold text-slate-100">Notifications</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-slate-400 hover:text-slate-300"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-800/30 transition-colors ${
                      !notification.read ? 'bg-slate-800/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-100 break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkRead(notification.id)}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-cyan-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
