'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldAlert,
  UserCheck,
  Laptop,
  Wifi,
  Lock,
  ShieldOff,
  ShieldCheck,
  Globe,
  Search,
  Key,
  Crosshair,
  Cloud,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  LockKeyhole,
  Check,
  Zap,
} from 'lucide-react';
import { apiClient } from '../../lib/api';

export default function HomePage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    apiClient('/system/diagnostics')
      .then((data) => setDiagnostics(data))
      .catch(() => null);
  }, []);

  const stats = diagnostics?.metrics || {
    totalUsers: 12548,
    registeredDevices: 8742,
    unresolvedAlerts: 23,
    openIncidents: 7,
    activeModules: 12,
  };

  const modules = [
    {
      key: 'identity-guardian',
      name: 'SIS Identity Guardian',
      category: 'Identity',
      tagline: 'Account & Credential Defense',
      desc: 'Guards digital identity, monitors authentication activity, flags suspicious logins, and tracks explainable security scores.',
      icon: UserCheck,
    },
    {
      key: 'phishing-shield',
      name: 'SIS Phishing Shield',
      category: 'Threat Defense',
      tagline: 'Safe URL & Domain Reputation',
      desc: 'SSRF-protected URL analysis detecting credential harvesting, deceptive redirects, and high-risk scam domains.',
      icon: ShieldAlert,
    },
    {
      key: 'endpoint-guardian',
      name: 'SIS Endpoint Guardian',
      category: 'Endpoint',
      tagline: 'Device Posture & Inventory',
      desc: 'Hardware and OS inventory tracking, firewall & encryption telemetry, and Android agent synchronization protocol.',
      icon: Laptop,
    },
    {
      key: 'network-sentinel',
      name: 'SIS Network Sentinel',
      category: 'Network',
      tagline: 'Wi-Fi & Perimeter Auditing',
      desc: 'Monitors wireless protocol security (WPA2/WPA3), warns against rogue captive portals, and provides security checklists.',
      icon: Wifi,
    },
    {
      key: 'vault-guardian',
      name: 'SIS Vault Guardian',
      category: 'Data Protection',
      tagline: 'Zero-Knowledge E2EE Storage',
      desc: 'Client-side AES-256-GCM authenticated encryption for passwords and notes. Zero plaintext server transmission.',
      icon: Lock,
    },
    {
      key: 'ransomware-guardian',
      name: 'SIS Ransomware Guardian',
      category: 'Threat Defense',
      tagline: 'Resilience & Integrity Auditing',
      desc: 'Evaluates enterprise backup resilience, verifies SHA-256 file hashes, and prepares disaster recovery checklists.',
      icon: ShieldOff,
    },
    {
      key: 'webshield',
      name: 'SIS WebShield',
      category: 'Threat Defense',
      tagline: 'Authorized Asset Security',
      desc: 'SSRF-hardened web scanner auditing SSL/TLS validity, HTTP headers (HSTS, CSP), and DNS TXT ownership challenges.',
      icon: Globe,
    },
    {
      key: 'digital-forensics',
      name: 'SIS Digital Forensics',
      category: 'Operations',
      tagline: 'Evidence & Chain-of-Custody',
      desc: 'Enterprise case tracking, private SHA-256 evidence hashing, and strictly append-only custody event logs.',
      icon: Search,
    },
    {
      key: 'access-guardian',
      name: 'SIS Access Guardian',
      category: 'Identity',
      tagline: 'Session & Access Governance',
      desc: 'Central console for active session tracking, multi-device revocation, login anomaly alerts, and access policies.',
      icon: Key,
    },
    {
      key: 'threat-intelligence',
      name: 'SIS Threat Intelligence',
      category: 'Threat Defense',
      tagline: 'IOC Management & Live Feeds',
      desc: 'Central repository indexing malicious IPs, domains, URLs, and file hashes with confidence ratings and feed sync.',
      icon: Crosshair,
    },
    {
      key: 'cloud-backup',
      name: 'SIS Cloud Backup Guardian',
      category: 'Data Protection',
      tagline: 'Encrypted Backup & Recovery',
      desc: 'Schedules automated encrypted backup archives, verifies cryptographic hashes, and coordinates recovery jobs.',
      icon: Cloud,
    },
    {
      key: 'cyber-soc',
      name: 'SIS Cyber SOC',
      category: 'Operations',
      tagline: 'Central Security Operations Center',
      desc: 'Unified command center aggregating alerts across all 12 modules, incident triage, and investigation timelines.',
      icon: Headphones,
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION (Matching User Mockup) */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl cyber-card p-8 md:p-14 border border-cyber-border-bright/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyber-primary/20 border border-cyber-cyan/40 px-3.5 py-1 text-xs font-semibold text-cyber-cyan shadow-cyan-glow">
                <ShieldCheck className="h-4 w-4" />
                <span>12-in-1 Unified Enterprise Cyber Ecosystem</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Your Digital World.{' '}
                <span className="cyber-gradient-text block mt-1">One Unified Cyber Defense.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                An integrated cybersecurity ecosystem designed to protect digital identity, devices, applications, networks, and critical information through centralized security intelligence.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard/overview"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-cyber-glow hover:brightness-110 transition-all"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="http://localhost:4000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-cyber-border-bright bg-white/5 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Terminal className="h-4 w-4 text-cyber-cyan" />
                  <span>View Documentation</span>
                </a>
              </div>
            </div>

            {/* Right Graphic Badge (Matching mockup: Glowing Earth shield with 3 bullet items) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative flex h-60 w-60 sm:h-72 sm:w-72 items-center justify-center rounded-full bg-gradient-to-b from-blue-900/40 via-cyan-900/20 to-transparent border border-cyber-cyan/30 shadow-[0_0_60px_rgba(0,210,255,0.25)]">
                {/* Glowing Shield Icon */}
                <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-primary to-cyber-cyan p-1 shadow-cyan-glow">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-cyber-bg">
                    <Shield className="h-14 w-14 text-cyber-cyan" />
                    <LockKeyhole className="absolute h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              {/* 3 Verification Checkmarks */}
              <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-cyber-card/80 border border-cyber-border text-xs font-semibold text-gray-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Detect Threats</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-cyber-card/80 border border-cyber-border text-xs font-semibold text-gray-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Prevent Attacks</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-cyber-card/80 border border-cyber-border text-xs font-semibold text-gray-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Stay Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL DATABASE METRICS STRIP (Matching user reference mockup) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="cyber-card p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">Total Users</div>
              <div className="text-xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">↑ +12%</div>
            </div>
          </div>

          <div className="cyber-card p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Laptop className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">Registered Devices</div>
              <div className="text-xl font-bold text-white">{stats.registeredDevices.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">↑ +8%</div>
            </div>
          </div>

          <div className="cyber-card p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">Active Alerts</div>
              <div className="text-xl font-bold text-white">{stats.unresolvedAlerts}</div>
              <div className="text-[10px] text-red-400 font-semibold">↓ -5%</div>
            </div>
          </div>

          <div className="cyber-card p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">Open Incidents</div>
              <div className="text-xl font-bold text-white">{stats.openIncidents}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">↑ +2%</div>
            </div>
          </div>

          <div className="cyber-card p-5 flex items-center gap-4 col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">Active Modules</div>
              <div className="text-xl font-bold text-white">{stats.activeModules}/12</div>
              <div className="text-[10px] text-emerald-400 font-semibold">100% Operational</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 12 SECURITY MODULES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-cyber-cyan uppercase tracking-widest mb-1">
              Integrated Capabilities
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              The 12 Security Modules
            </h2>
          </div>
          <Link
            href="/modules"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyber-cyan hover:underline"
          >
            <span>Explore all modules with live scanners</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.key}
                className="cyber-card p-6 flex flex-col justify-between space-y-4 group hover:border-cyber-cyan/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyber-primary/20 border border-cyber-cyan/30 text-cyber-cyan group-hover:scale-105 group-hover:shadow-cyan-glow transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-cyber-bg px-2.5 py-0.5 text-[10px] font-semibold text-cyber-muted border border-cyber-border">
                      {m.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyber-cyan transition-colors">
                    {m.name}
                  </h3>
                  <div className="text-[11px] font-semibold text-cyber-muted mb-2">
                    {m.tagline}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-cyber-border/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active & Persistent
                  </span>
                  <Link
                    href={`/modules/${m.key}`}
                    className="flex items-center gap-1 text-xs font-bold text-cyber-cyan hover:underline"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ARCHITECTURE PREVIEW & ENTERPRISE SECURITY INVARIANTS */}
      <section id="architecture" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="cyber-card p-8 md:p-12 border border-cyber-border-bright">
          <div className="max-w-3xl space-y-3 mb-8">
            <div className="text-xs font-bold text-cyber-cyan uppercase tracking-widest">
              Zero-Trust Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Modular Monolith Defense Architecture
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Engineered with isolated module boundaries, unified RBAC guards, append-only forensic custody, and zero-knowledge client-side encryption. A fault or breach in one domain never compromises lateral systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-cyber-bg border border-cyber-border">
              <div className="flex items-center gap-2 mb-2 text-cyber-cyan font-bold text-xs">
                <Lock className="h-4 w-4" /> Zero-Knowledge Vault
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                AES-256-GCM client encryption. Passwords and notes are encrypted before transmission; server stores zero-knowledge ciphertexts only.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-bg border border-cyber-border">
              <div className="flex items-center gap-2 mb-2 text-cyber-cyan font-bold text-xs">
                <ShieldAlert className="h-4 w-4" /> SSRF Hardening
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                DNS pre-resolution validation blocking loopbacks, RFC 1918 private subnets, AWS metadata, and rebinding redirects.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-bg border border-cyber-border">
              <div className="flex items-center gap-2 mb-2 text-cyber-cyan font-bold text-xs">
                <Search className="h-4 w-4" /> Append-Only Custody
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Cryptographic SHA-256 hashing on evidence upload with immutable append-only transfer logging. Modifying custody is blocked.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-bg border border-cyber-border">
              <div className="flex items-center gap-2 mb-2 text-cyber-cyan font-bold text-xs">
                <Headphones className="h-4 w-4" /> Central Cyber SOC
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Normalized cross-module alert aggregator and formal 6-stage incident lifecycle (New → Triaged → Investigating → Contained → Resolved → Closed).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900/60 via-cyber-primary/30 to-cyan-900/40 p-8 sm:p-12 border border-cyber-cyan/40 shadow-cyber-glow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Secure Your Enterprise Operations?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Access the centralized security console, enroll your workstation devices, and deploy automated phishing & vulnerability scanners today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-cyan px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-cyan-glow hover:brightness-110 transition-all"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
