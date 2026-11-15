'use client';

import React from 'react';
import { useAuth } from '../../../lib/auth-context';
import { User, Shield, Key, Mail, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Employee Security Profile</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          View your identity posture, assigned enterprise roles, and security certifications.
        </p>
      </div>

      <div className="cyber-card p-6 md:p-8 border border-cyber-border-bright space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-cyber-border">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyber-primary to-cyber-cyan text-white text-2xl font-black shadow-cyber-glow">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.fullName}</h2>
            <p className="text-xs text-cyber-cyan font-mono">{user?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user?.roles?.map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-cyber-primary/20 border border-cyber-cyan/40 px-2.5 py-0.5 text-[10px] font-bold text-cyber-cyan"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-cyber-bg border border-cyber-border">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Account Security Score
            </span>
            <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
              <span>{user?.securityScore || 98}%</span>
              <span className="text-xs font-semibold text-gray-300">(Excellent)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyber-bg border border-cyber-border">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Multi-Factor Authentication
            </span>
            <div className="text-base font-bold flex items-center gap-1.5 text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{user?.isMfaEnabled ? 'RFC 6238 TOTP Active' : 'Not Configured'}</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Granted RBAC Permissions ({user?.permissions?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-cyber-bg border border-cyber-border">
            {user?.permissions?.map((p) => (
              <span key={p} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-gray-300">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
