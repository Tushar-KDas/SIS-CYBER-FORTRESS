'use client';

import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Globe, Shield, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = () => {
    setLoading(true);
    apiClient('/auth/sessions')
      .then((data) => setSessions(data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const revokeSession = async (id: string) => {
    if (!confirm('Are you sure you want to terminate this active session?')) return;
    try {
      await apiClient(`/auth/sessions/${id}`, { method: 'DELETE' });
      loadSessions();
    } catch (err: any) {
      alert(err?.message || 'Failed to revoke session');
    }
  };

  const revokeOthers = async () => {
    if (!confirm('Are you sure you want to log out all other devices and browser sessions?')) return;
    try {
      await apiClient('/auth/sessions/revoke-others', { method: 'POST' });
      loadSessions();
    } catch (err: any) {
      alert(err?.message || 'Failed to revoke sessions');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Active Corporate Sessions</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor and manage active browser sessions authorized to access your security console.
          </p>
        </div>
        <button
          onClick={revokeOthers}
          className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all self-start sm:self-auto"
        >
          Terminate All Other Sessions
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((s, idx) => (
          <div
            key={s.id}
            className="cyber-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-primary/20 text-cyber-cyan border border-cyber-cyan/30 flex-shrink-0">
                {s.deviceType?.includes('Mobile') ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{s.deviceType || 'Web Browser'}</span>
                  {idx === 0 && (
                    <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-extrabold uppercase">
                      Current Session
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                  IP: {s.ipAddress || '127.0.0.1'} • {s.userAgent?.substring(0, 40) || 'Unknown Browser'}...
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-500" />
                Last active: {new Date(s.lastActiveAt).toLocaleTimeString()}
              </span>
              <button
                onClick={() => revokeSession(s.id)}
                className="flex items-center gap-1 rounded bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-red-400 hover:bg-red-500/20 text-[11px]"
              >
                <Trash2 className="h-3 w-3" />
                <span>Revoke</span>
              </button>
            </div>
          </div>
        ))}

        {sessions.length === 0 && !loading && (
          <div className="cyber-card p-10 text-center text-gray-400 text-xs">
            No active sessions found.
          </div>
        )}
      </div>
    </div>
  );
}
