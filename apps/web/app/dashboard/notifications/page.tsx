'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, ShieldAlert, AlertTriangle, Clock } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    setLoading(true);
    apiClient('/notifications')
      .then((data) => setNotifications(data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    await apiClient('/notifications/read-all', { method: 'POST' });
    loadNotifications();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Notifications & Advisories</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Security alerts, administrative notices, and session notifications affecting your account.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-cyber-cyan hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`cyber-card p-4 flex items-start gap-3.5 transition-all ${
              !n.isRead ? 'border-cyber-primary/60 bg-cyber-primary/5' : ''
            }`}
          >
            <div className="p-2 rounded-lg bg-cyber-primary/20 text-cyber-cyan flex-shrink-0 mt-0.5">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-white">{n.title}</h3>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}

        {notifications.length === 0 && !loading && (
          <div className="cyber-card p-12 text-center text-gray-400 text-xs">
            No notifications available. Your security perimeter is calm and clear.
          </div>
        )}
      </div>
    </div>
  );
}
