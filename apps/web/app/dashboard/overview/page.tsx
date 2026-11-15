'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Laptop,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Shield,
  LockKeyhole,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Wifi,
  Lock,
  ShieldOff,
  Globe,
  Search,
  Key,
  Crosshair,
  Cloud,
  Headphones,
  Activity,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiClient } from '../../../lib/api';

export default function DashboardOverviewPage() {
  const [socData, setSocData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient('/soc/overview').catch(() => null),
      apiClient('/system/health').catch(() => null),
    ])
      .then(([soc, health]) => {
        setSocData(soc);
        setHealthData(health);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = socData?.metrics || {
    totalAlerts: 23,
    unresolvedAlerts: 23,
    criticalAlerts: 4,
    openIncidents: 7,
  };

  const chartData = socData?.trends || [
    { day: 'Mon', alerts: 45, incidents: 12 },
    { day: 'Tue', alerts: 62, incidents: 18 },
    { day: 'Wed', alerts: 55, incidents: 15 },
    { day: 'Thu', alerts: 88, incidents: 25 },
    { day: 'Fri', alerts: 72, incidents: 20 },
    { day: 'Sat', alerts: 110, incidents: 34 },
    { day: 'Sun', alerts: 68, incidents: 19 },
  ];

  const recentAlerts = socData?.recentAlerts || [
    {
      id: '1',
      severity: 'CRITICAL',
      title: 'Malicious URL Detected',
      moduleKey: 'phishing-shield',
      createdAt: '2 min ago',
    },
    {
      id: '2',
      severity: 'HIGH',
      title: 'Suspicious Login Attempt',
      moduleKey: 'identity-guardian',
      createdAt: '5 min ago',
    },
    {
      id: '3',
      severity: 'INFORMATIONAL',
      title: 'New Device Registered',
      moduleKey: 'endpoint-guardian',
      createdAt: '10 min ago',
    },
    {
      id: '4',
      severity: 'LOW',
      title: 'Backup Completed',
      moduleKey: 'cloud-backup',
      createdAt: '15 min ago',
    },
  ];

  const modulesList = [
    { name: 'Identity Guardian', icon: UserCheck, key: 'identity-guardian' },
    { name: 'Phishing Shield', icon: ShieldAlert, key: 'phishing-shield' },
    { name: 'Endpoint Guardian', icon: Laptop, key: 'endpoint-guardian' },
    { name: 'Network Sentinel', icon: Wifi, key: 'network-sentinel' },
    { name: 'Vault Guardian', icon: Lock, key: 'vault-guardian' },
    { name: 'Ransomware Guardian', icon: ShieldOff, key: 'ransomware-guardian' },
    { name: 'WebShield', icon: Globe, key: 'webshield' },
    { name: 'Digital Forensics', icon: Search, key: 'digital-forensics' },
    { name: 'Access Guardian', icon: Key, key: 'access-guardian' },
    { name: 'Threat Intelligence', icon: Crosshair, key: 'threat-intelligence' },
    { name: 'Cloud Backup', icon: Cloud, key: 'cloud-backup' },
    { name: 'Cyber SOC', icon: Headphones, key: 'cyber-soc' },
  ];

  const servicesHealth = healthData?.services || {
    backendApi: 'Healthy',
    database: 'Healthy',
    redisCache: 'Healthy',
    fileStorage: 'Healthy',
    notificationsFcm: 'Configured',
    externalFeeds: 'Healthy',
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER (Exact Match from User Mockup) */}
      <div className="relative overflow-hidden rounded-2xl cyber-card p-6 md:p-8 border border-cyber-border-bright/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Digital World.{' '}
              <span className="cyber-gradient-text block mt-1">One Unified Cyber Defense.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              An integrated cybersecurity ecosystem designed to protect digital identity, devices, applications, networks and critical information.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard/modules/phishing-shield"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110 transition-all"
              >
                <span>Explore Platform</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="http://localhost:4000/api/docs"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-cyber-border-bright bg-white/5 px-5 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/10 transition-all"
              >
                <span>View Documentation</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-blue-900/30 via-cyan-900/20 to-transparent border border-cyber-cyan/30 shadow-[0_0_40px_rgba(0,210,255,0.2)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-primary to-cyber-cyan p-0.5 shadow-cyan-glow">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-cyber-bg">
                  <Shield className="h-8 w-8 text-cyber-cyan" />
                  <LockKeyhole className="absolute h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1 text-[11px] font-semibold text-gray-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Detect Threats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Prevent Attacks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Stay Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FIVE METRIC CARDS (Exact Match from User Mockup) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="cyber-card p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex-shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Total Users</div>
            <div className="text-lg font-bold text-white">12,548</div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <span>↑ 12%</span>
            </div>
          </div>
        </div>

        {/* Registered Devices */}
        <div className="cyber-card p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Registered Devices</div>
            <div className="text-lg font-bold text-white">8,742</div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <span>↑ 8%</span>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="cyber-card p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex-shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Active Alerts</div>
            <div className="text-lg font-bold text-white">{metrics.unresolvedAlerts}</div>
            <div className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
              <span>↓ 5%</span>
            </div>
          </div>
        </div>

        {/* Open Incidents */}
        <div className="cyber-card p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Open Incidents</div>
            <div className="text-lg font-bold text-white">{metrics.openIncidents}</div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <span>↑ 2%</span>
            </div>
          </div>
        </div>

        {/* Active Modules */}
        <div className="cyber-card p-4 flex items-center gap-3.5 col-span-2 md:col-span-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Active Modules</div>
            <div className="text-lg font-bold text-white">12 / 12</div>
            <div className="text-[10px] text-emerald-400 font-semibold">100%</div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: Security Overview Chart & Module Status & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Security Overview Chart (col-span-5) */}
        <div className="lg:col-span-5 cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyber-cyan" />
              <h3 className="text-sm font-bold text-white">Security Overview</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <span className="h-2 w-2 rounded-full bg-cyber-cyan"></span>
                <span>Alerts</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                <span>Incidents</span>
              </div>
              <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-cyber-border">
                Last 7 Days
              </span>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#172554" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 150]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1730', borderColor: '#1e3a8a', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="alerts" stroke="#00d2ff" strokeWidth={2.5} dot={{ r: 3, fill: '#00d2ff' }} />
                <Line type="monotone" dataKey="incidents" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Status Donut & Checklist (col-span-4) */}
        <div className="lg:col-span-4 cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Module Status</h3>
            <Link href="/modules" className="text-[10px] text-cyber-cyan hover:underline">
              View All →
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Donut Mockup */}
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-emerald-400/90 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <div className="text-center">
                <span className="text-base font-extrabold text-white">100%</span>
                <span className="block text-[9px] text-emerald-400 font-semibold">12/12 Active</span>
              </div>
            </div>

            {/* 2-column checklist */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-gray-300 w-full">
              {modulesList.map((m) => (
                <div key={m.key} className="flex items-center gap-1.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  <span className="truncate">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Security Alerts (col-span-3) */}
        <div className="lg:col-span-3 cyber-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Security Alerts</h3>
            <Link href="/dashboard/alerts" className="text-[10px] text-cyber-cyan hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-2">
            {recentAlerts.map((a: any) => {
              const severityColor =
                a.severity === 'CRITICAL'
                  ? 'bg-red-500 text-white'
                  : a.severity === 'HIGH'
                  ? 'bg-amber-500 text-black'
                  : a.severity === 'LOW'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-500 text-white';

              return (
                <div
                  key={a.id}
                  className="p-2 rounded-lg bg-cyber-bg border border-cyber-border/80 flex items-start gap-2.5"
                >
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide flex-shrink-0 ${severityColor}`}>
                    {a.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{a.title}</div>
                    <div className="text-[10px] text-gray-400 flex items-center justify-between mt-0.5">
                      <span className="truncate">From: {a.moduleKey}</span>
                      <span className="text-gray-500 flex-shrink-0">{a.createdAt || 'Just now'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: 12 Security Modules Grid + System Health Checklist + Promo Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12 Modules Icon Grid (col-span-8) */}
        <div className="lg:col-span-8 cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyber-cyan" />
              <h3 className="text-sm font-bold text-white">12 Security Modules</h3>
            </div>
            <Link href="/modules" className="text-[10px] text-cyber-cyan hover:underline">
              Explore all modules →
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {modulesList.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.key}
                  href={`/dashboard/modules/${m.key}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyber-bg border border-cyber-border hover:border-cyber-cyan/50 hover:bg-cyber-card-hover group transition-all text-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-primary/20 text-cyber-cyan group-hover:scale-110 group-hover:shadow-cyan-glow transition-all mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-200 group-hover:text-cyber-cyan transition-colors line-clamp-1">
                    {m.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Health Checklist (col-span-4) */}
        <div className="lg:col-span-4 cyber-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">System Health</h3>
            <Link href="/admin/super-admin" className="text-[10px] text-cyber-cyan hover:underline">
              View Details →
            </Link>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-cyber-border/40">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Backend API</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{servicesHealth.backendApi}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cyber-border/40">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Database (PostgreSQL)</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{servicesHealth.database}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cyber-border/40">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Redis Cache</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{servicesHealth.redisCache}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cyber-border/40">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>File Storage</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{servicesHealth.fileStorage}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cyber-border/40">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Notifications (FCM)</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{servicesHealth.notificationsFcm}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>External Feeds</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{servicesHealth.externalFeeds}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
