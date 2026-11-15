'use client';

import React, { useState } from 'react';
import { Search, Bell, Shield, LogOut, User } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import Link from 'next/link';

export function TopHeader() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 border-b border-cyber-border bg-[#090e24]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-80 md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search across platform (IOCs, alerts, devices, logs)..."
          className="w-full rounded-full bg-[#0d1730] border border-cyber-border/80 pl-10 pr-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyber-cyan transition-colors"
        />
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              5
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-cyber-card border border-cyber-border shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-cyber-border mb-2">
                <span className="text-xs font-bold text-white">Security Notifications</span>
                <span className="text-[10px] text-cyber-cyan cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="font-semibold text-red-400 text-[11px]">Critical Phishing Alert</div>
                  <div className="text-gray-300 text-[10px]">Malicious URL identified in campaign triage.</div>
                </div>
                <div className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="font-semibold text-amber-400 text-[11px]">Suspicious Login Flagged</div>
                  <div className="text-gray-300 text-[10px]">Failed attempt from Tor node blocked.</div>
                </div>
              </div>
              <Link
                href="/dashboard/notifications"
                onClick={() => setNotificationsOpen(false)}
                className="block text-center mt-3 text-[11px] text-cyber-cyan hover:underline"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyber-primary to-cyber-cyan text-white font-bold text-xs shadow-cyber-glow">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {user?.fullName || 'Enterprise User'}
              </div>
              <div className="text-[10px] text-cyber-muted font-medium">
                {user?.roles?.[0] || 'User'}
              </div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-cyber-card border border-cyber-border shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-cyber-border/80">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>MFA & Account Security</span>
              </Link>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 border-t border-cyber-border/60 mt-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
