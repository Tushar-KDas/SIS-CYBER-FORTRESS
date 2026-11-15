'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  ShieldAlert,
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
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function ModulesDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const modules = [
    {
      key: 'identity-guardian',
      name: 'SIS Identity Guardian',
      category: 'Identity',
      tagline: 'Digital Identity & Account Protection',
      desc: 'Monitors user authentication activity, flags anomalous and suspicious logins, enforces Multi-Factor Authentication, and computes an explainable account security score.',
      icon: UserCheck,
      capabilities: ['Login Activity Audit', 'Suspicious Login Alerts', 'MFA Status Enforcer', 'Explainable Security Score', 'Breach Monitoring Interface'],
    },
    {
      key: 'phishing-shield',
      name: 'SIS Phishing Shield',
      category: 'Threat Defense',
      tagline: 'Phishing, Scam & Malicious URL Awareness',
      desc: 'Safe URL and domain scanner with strict SSRF defense. Evaluates domain reputation against live threat feeds and inspects heuristic deception patterns.',
      icon: ShieldAlert,
      capabilities: ['SSRF-Guarded URL Inspection', 'Live Threat Feed IOC Matching', 'Heuristic Brand Impersonation Rules', 'User Threat Report Submissions', 'Auto-Alert SOC Triage'],
    },
    {
      key: 'endpoint-guardian',
      name: 'SIS Endpoint Guardian',
      category: 'Endpoint',
      tagline: 'Device Security Posture & Inventory',
      desc: 'Enterprise hardware inventory managing enrolled laptops, desktops, and mobile devices. Tracks OS versions, patch levels, disk encryption, and firewall status.',
      icon: Laptop,
      capabilities: ['Device Registration & Inventory', 'OS Patch Level Auditing', 'Firewall & Encryption Telemetry', 'Security Posture Scoring', 'Android Sync Protocol Ready'],
    },
    {
      key: 'network-sentinel',
      name: 'SIS Network Sentinel',
      category: 'Network',
      tagline: 'Network Security Awareness & Wi-Fi Auditing',
      desc: 'Monitors wireless protocol security, detects unencrypted public Wi-Fi and captive portals, and provides interactive network hardening checklists.',
      icon: Wifi,
      capabilities: ['Wireless Protocol Auditing (WPA2/WPA3)', 'Rogue Hotspot & Public Warning', 'Network Snapshot Logging', 'Hardening Checklists'],
    },
    {
      key: 'vault-guardian',
      name: 'SIS Vault Guardian',
      category: 'Data Protection',
      tagline: 'Zero-Knowledge Encrypted Password & Note Vault',
      desc: 'Client-side AES-256-GCM authenticated encryption for passwords, secure notes, and credentials. The server only stores ciphertexts with zero plaintext access.',
      icon: Lock,
      capabilities: ['Client-Side AES-256-GCM Encryption', 'Zero-Knowledge Server Storage', 'Secure Notes & Passwords', 'Cryptographic Recovery Flow', 'Tamper-Evident Tags'],
    },
    {
      key: 'ransomware-guardian',
      name: 'SIS Ransomware Guardian',
      category: 'Threat Defense',
      tagline: 'Ransomware Risk Awareness & Data Recovery Readiness',
      desc: 'Evaluates enterprise backup resilience, verifies SHA-256 cryptographic file hashes, and ensures rapid disaster recovery readiness.',
      icon: ShieldOff,
      capabilities: ['Backup Readiness Auditing', 'Cryptographic SHA-256 File Integrity', 'Safe File Change Tracking', 'Disaster Recovery Checklists'],
    },
    {
      key: 'webshield',
      name: 'SIS WebShield',
      category: 'Threat Defense',
      tagline: 'Authorized Website Security Scanning',
      desc: 'Active and passive web vulnerability scanner auditing SSL/TLS certificates, HTTP security headers (HSTS, CSP, XFO), and DNS TXT ownership challenges with SSRF protection.',
      icon: Globe,
      capabilities: ['DNS TXT Ownership Verification', 'SSL/TLS Validity & Expiry Checks', 'HTTP Security Header Auditing', 'SSRF Pre-Resolution Engine', 'Remediation Recommendations'],
    },
    {
      key: 'digital-forensics',
      name: 'SIS Digital Forensics',
      category: 'Operations',
      tagline: 'Evidence & Incident Case Management',
      desc: 'Enterprise forensic case tracking, private SHA-256 evidence ingestion, and strictly append-only chain-of-custody logging.',
      icon: Search,
      capabilities: ['Forensic Case File Management', 'SHA-256 Cryptographic Evidence Hash', 'Append-Only Custody Log', 'Tamper Reason Tracking', 'Case Report Generation'],
    },
    {
      key: 'access-guardian',
      name: 'SIS Access Guardian',
      category: 'Identity',
      tagline: 'Centralized Authentication & Session Governance',
      desc: 'Central console for active session tracking, multi-device remote revocation, login anomaly alerts, and access policies.',
      icon: Key,
      capabilities: ['Active Session Remote Revocation', 'Device-Level Session Termination', 'Login Anomaly Alerts', 'RBAC Access Policy Governance'],
    },
    {
      key: 'threat-intelligence',
      name: 'SIS Threat Intelligence',
      category: 'Threat Defense',
      tagline: 'Cyber Threat Feed & Indicator Management',
      desc: 'Centralized Indicators of Compromise (IOC) repository indexing malicious IPs, domains, URLs, and malware file hashes with confidence ratings.',
      icon: Crosshair,
      capabilities: ['Multi-Type IOC Management (IP/Domain/URL/Hash)', 'Threat Severity & Confidence Scoring', 'External Feed Sync Engine', 'Fast Threat Search & Deduplication'],
    },
    {
      key: 'cloud-backup',
      name: 'SIS Cloud Backup Guardian',
      category: 'Data Protection',
      tagline: 'Encrypted Backup & Recovery Management',
      desc: 'Schedules automated encrypted backup archives, verifies cryptographic hashes, and coordinates recovery jobs.',
      icon: Cloud,
      capabilities: ['Automated Backup Job Scheduling', 'Encrypted Storage Driver', 'Cryptographic Restoration Verification', 'Retention Policy Governance'],
    },
    {
      key: 'cyber-soc',
      name: 'SIS Cyber SOC',
      category: 'Operations',
      tagline: 'Centralized Security Operations Center',
      desc: 'Unified command center aggregating alerts across all 12 modules, orchestrating formal incident triage, and tracking investigation timelines.',
      icon: Headphones,
      capabilities: ['Cross-Module Alert Aggregator', '6-Stage Incident Response Workflow', 'Analyst Notes & Timeline Logging', 'Incident Severity Matrix', 'SOC Analytics'],
    },
  ];

  const categories = ['All', 'Identity', 'Endpoint', 'Network', 'Data Protection', 'Threat Defense', 'Operations'];

  const filteredModules = selectedCategory === 'All'
    ? modules
    : modules.filter((m) => m.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="text-xs font-bold text-cyber-cyan uppercase tracking-widest mb-1">
          Cyber Fortress Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          The 12 Security Modules
        </h1>
        <p className="text-sm text-gray-300 mt-2 max-w-2xl">
          Browse all twelve operational modules. Each module maintains its own database schema, secure API endpoints, and authenticated operational workspace.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-cyber-border">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-2 font-medium">
          <Filter className="h-3.5 w-3.5 text-cyber-cyan" />
          <span>Category:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-cyber-primary text-white shadow-cyber-glow'
                : 'bg-cyber-card text-gray-300 hover:bg-white/10 hover:text-white border border-cyber-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className="cyber-card p-6 flex flex-col justify-between space-y-4 hover:border-cyber-cyan/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyber-primary/20 border border-cyber-cyan/30 text-cyber-cyan">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-cyber-bg px-2.5 py-0.5 text-[10px] font-semibold text-cyber-cyan border border-cyber-border">
                    {m.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{m.name}</h3>
                <div className="text-xs font-semibold text-cyber-muted mb-3">{m.tagline}</div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">{m.desc}</p>

                <div className="space-y-1.5 pt-2 border-t border-cyber-border/40">
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Core Capabilities
                  </div>
                  <ul className="space-y-1 text-[11px] text-gray-300">
                    {m.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan"></span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-cyber-border/60 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Active Module
                </span>
                <Link
                  href={`/modules/${m.key}`}
                  className="flex items-center gap-1.5 rounded-lg bg-cyber-primary/20 px-3 py-1.5 text-xs font-bold text-cyber-cyan border border-cyber-primary/40 hover:bg-cyber-primary/30 transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
