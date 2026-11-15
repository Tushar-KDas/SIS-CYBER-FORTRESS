'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  ShieldAlert,
  UserCheck,
  Laptop,
  Wifi,
  Lock,
  ShieldOff,
  Globe,
  Search,
  Key,
  Crosshair,
  Cloud,
  Headphones,
  Bell,
  Clock,
  FileWarning,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [modulesOpen, setModulesOpen] = useState(true);

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
  const isSecurityAdmin = user?.roles?.includes('SECURITY_ADMIN');
  const isAuditor = user?.roles?.includes('AUDITOR');

  const securityModules = [
    { name: 'Identity Guardian', href: '/dashboard/modules/identity-guardian', icon: UserCheck },
    { name: 'Phishing Shield', href: '/dashboard/modules/phishing-shield', icon: ShieldAlert },
    { name: 'Endpoint Guardian', href: '/dashboard/modules/endpoint-guardian', icon: Laptop },
    { name: 'Network Sentinel', href: '/dashboard/modules/network-sentinel', icon: Wifi },
    { name: 'Vault Guardian', href: '/dashboard/modules/vault-guardian', icon: Lock },
    { name: 'Ransomware Guardian', href: '/dashboard/modules/ransomware-guardian', icon: ShieldOff },
    { name: 'WebShield', href: '/dashboard/modules/webshield', icon: Globe },
    { name: 'Digital Forensics', href: '/dashboard/modules/digital-forensics', icon: Search },
    { name: 'Access Guardian', href: '/dashboard/modules/access-guardian', icon: Key },
    { name: 'Threat Intelligence', href: '/dashboard/modules/threat-intelligence', icon: Crosshair },
    { name: 'Cloud Backup Guardian', href: '/dashboard/modules/cloud-backup', icon: Cloud },
    { name: 'Cyber SOC', href: '/dashboard/modules/cyber-soc', icon: Headphones },
  ];

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard/overview', icon: LayoutDashboard },
  ];

  const secondaryNav = [
    { name: 'My Devices', href: '/dashboard/devices', icon: Laptop },
    { name: 'Security Alerts', href: '/dashboard/alerts', icon: Bell, badge: '3' },
    { name: 'Scan History', href: '/dashboard/scans', icon: Clock },
    { name: 'Threat Reports', href: '/dashboard/threat-reports', icon: FileWarning },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '5' },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-cyber-border bg-[#090e24] text-gray-300 min-h-screen">
      <div className="p-4 overflow-y-auto">
        {/* Brand Logo Header */}
        <Link href="/" className="flex items-center gap-3 mb-6 px-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-primary to-cyber-cyan p-0.5 shadow-cyber-glow">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070b19]">
              <Shield className="h-5 w-5 text-cyber-cyan" />
              <Lock className="absolute h-2 w-2 text-white" />
            </div>
          </div>
          <div>
            <span className="block text-sm font-extrabold tracking-wider text-white">
              SIS CYBER <span className="text-cyber-cyan">FORTRESS</span>
            </span>
          </div>
        </Link>

        {/* Admin Navigation Tiers */}
        {(isSuperAdmin || isSecurityAdmin || isAuditor) && (
          <div className="mb-4 p-2.5 rounded-lg bg-cyber-primary/10 border border-cyber-primary/30">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyber-cyan mb-2 flex items-center gap-1.5">
              <Zap className="h-3 w-3" /> Privileged Workspaces
            </div>
            <div className="space-y-1 text-xs">
              {isSuperAdmin && (
                <Link
                  href="/admin/super-admin"
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    pathname === '/admin/super-admin'
                      ? 'bg-cyber-primary text-white font-semibold'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  Super Admin Panel
                </Link>
              )}
              {(isSuperAdmin || isSecurityAdmin) && (
                <Link
                  href="/admin/security-admin"
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    pathname === '/admin/security-admin'
                      ? 'bg-cyber-primary text-white font-semibold'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  Security Admin (SOC)
                </Link>
              )}
              {isSuperAdmin && (
                <Link
                  href="/admin/module-admin"
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    pathname === '/admin/module-admin'
                      ? 'bg-cyber-primary text-white font-semibold'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  Module Admin Desk
                </Link>
              )}
              <Link
                href="/admin/auditor"
                className={`block px-2 py-1.5 rounded transition-colors ${
                  pathname === '/admin/auditor'
                    ? 'bg-cyber-primary text-white font-semibold'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                Compliance Auditor
              </Link>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="space-y-1 mb-4">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyber-primary text-white shadow-cyber-glow'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-cyber-cyan'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Security Modules Accordion */}
          <div>
            <button
              onClick={() => setModulesOpen(!modulesOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-cyber-cyan" />
                <span>Security Modules</span>
              </div>
              {modulesOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              )}
            </button>

            {modulesOpen && (
              <div className="mt-1 pl-6 space-y-0.5 border-l border-cyber-border/40 ml-4">
                {securityModules.map((mod) => {
                  const Icon = mod.icon;
                  const isActive = pathname === mod.href;
                  return (
                    <Link
                      key={mod.name}
                      href={mod.href}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                        isActive
                          ? 'bg-cyber-primary/20 text-cyber-cyan font-semibold border-l-2 border-cyber-cyan'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{mod.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Nav Items */}
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyber-primary text-white shadow-cyber-glow'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-red-500/80 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Security Score Widget (Matching user mockup) */}
      <div className="p-4 border-t border-cyber-border/60">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyber-card to-cyber-bg border border-emerald-500/30 flex items-center gap-3">
          <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-emerald-400/80 bg-emerald-500/10">
            <span className="text-xs font-extrabold text-emerald-400">98%</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Excellent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-gray-400">Your account is secure!</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
