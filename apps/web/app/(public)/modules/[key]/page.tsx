'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
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
  CheckCircle2,
  ArrowRight,
  Terminal,
  Layers,
  ArrowLeft,
} from 'lucide-react';

const MODULES_DATA: Record<string, any> = {
  'identity-guardian': {
    name: 'SIS Identity Guardian',
    tagline: 'Digital Identity & Account Protection',
    category: 'Identity',
    icon: UserCheck,
    desc: 'Guards digital identity, monitors authentication activity, flags suspicious logins, and tracks explainable security scores.',
    architecture: 'Centralized authentication telemetry stream observing login outcomes, IP geolocation consistency, and RFC 6238 TOTP enforcement.',
    endpoints: [
      { method: 'GET', path: '/api/v1/identity/overview', desc: 'Get explainable security score breakdown' },
      { method: 'GET', path: '/api/v1/identity/login-history', desc: 'Query user authentication timeline' },
      { method: 'POST', path: '/api/v1/auth/mfa/setup', desc: 'Initiate TOTP MFA enrollment' },
    ],
    invariants: [
      'Plaintext passwords are never accepted for breach scans',
      'Security score is derived only from explainable, verifiable signals',
      'Brute force login attempts trigger automatic rate throttling and SOC alert aggregation',
    ],
  },
  'phishing-shield': {
    name: 'SIS Phishing Shield',
    tagline: 'Safe URL & Domain Reputation Scanner',
    category: 'Threat Defense',
    icon: ShieldAlert,
    desc: 'SSRF-protected URL analysis detecting credential harvesting, deceptive redirects, and high-risk scam domains.',
    architecture: 'Two-tier scanner executing strict pre-resolution DNS validation followed by live IOC matching against threat databases and pattern heuristics.',
    endpoints: [
      { method: 'POST', path: '/api/v1/phishing/scan', desc: 'Scan URL with SSRF protection and threat classification' },
      { method: 'GET', path: '/api/v1/phishing/scans', desc: 'List historical scans' },
      { method: 'POST', path: '/api/v1/phishing/report', desc: 'Submit malicious target report to SOC' },
    ],
    invariants: [
      'Strict SSRF defense: Loopback, RFC 1918 private subnets, and AWS metadata are rejected',
      'Never visits target links blindly or executes arbitrary client JavaScript',
      'Returns Unknown when evidence is insufficient rather than false assurances of safety',
    ],
  },
  'endpoint-guardian': {
    name: 'SIS Endpoint Guardian',
    tagline: 'Device Security Posture & Inventory',
    category: 'Endpoint',
    icon: Laptop,
    desc: 'Hardware and OS inventory tracking, firewall & encryption telemetry, and Android agent synchronization protocol.',
    architecture: 'Relational device registry mapping device hardware fingerprints to telemetry snapshots, prepared for future Android agent sync.',
    endpoints: [
      { method: 'POST', path: '/api/v1/devices/register', desc: 'Enroll hardware endpoint' },
      { method: 'GET', path: '/api/v1/devices', desc: 'List registered endpoints' },
      { method: 'POST', path: '/api/v1/devices/:id/telemetry', desc: 'Sync device posture snapshot' },
    ],
    invariants: [
      'Clearly identifies manually submitted data vs. authenticated agent sync telemetry',
      'Never invents installed applications or spoofed properties in browser mode',
      'Pre-configured contracts for future Kotlin Jetpack Compose Android app integration',
    ],
  },
  'network-sentinel': {
    name: 'SIS Network Sentinel',
    tagline: 'Network Security Awareness & Wi-Fi Auditing',
    category: 'Network',
    icon: Wifi,
    desc: 'Monitors wireless protocol security (WPA2/WPA3), warns against rogue captive portals, and provides security checklists.',
    architecture: 'Network telemetry ingestion auditing Wi-Fi encryption protocols, captive portal detection, and enterprise perimeter checklists.',
    endpoints: [
      { method: 'POST', path: '/api/v1/network/snapshots', desc: 'Submit wireless snapshot audit' },
      { method: 'GET', path: '/api/v1/network/snapshots', desc: 'List historical network evaluations' },
      { method: 'GET', path: '/api/v1/network/checklist', desc: 'Get hardening checklist' },
    ],
    invariants: [
      'Clearly separates browser-entered checklists from mobile-collected telemetry',
      'High-risk open Wi-Fi triggers immediate SOC alert aggregation',
      'Evaluates WPA3, WPA2-Enterprise, and legacy WEP/WPA vulnerabilities',
    ],
  },
  'vault-guardian': {
    name: 'SIS Vault Guardian',
    tagline: 'Zero-Knowledge Encrypted Password & Note Vault',
    category: 'Data Protection',
    icon: Lock,
    desc: 'Client-side AES-256-GCM authenticated encryption for passwords and notes. Zero plaintext server transmission.',
    architecture: 'Zero-Knowledge architecture. Master passphrase derives AES-256 key in browser using Argon2id/PBKDF2; server only stores ciphertext, IV, and GCM tag.',
    endpoints: [
      { method: 'POST', path: '/api/v1/vault/items', desc: 'Store encrypted ciphertext payload' },
      { method: 'GET', path: '/api/v1/vault/items', desc: 'List user encrypted records' },
      { method: 'DELETE', path: '/api/v1/vault/items/:id', desc: 'Permanently remove encrypted record' },
    ],
    invariants: [
      'Server NEVER receives or stores master password, plaintext notes, or recovery keys',
      'Unique 96-bit random IV generated per item; nonce reuse is strictly prohibited',
      'Auditors and Super Admins cannot decrypt user stored secrets',
    ],
  },
  'ransomware-guardian': {
    name: 'SIS Ransomware Guardian',
    tagline: 'Ransomware Risk Awareness & Data Recovery Readiness',
    category: 'Threat Defense',
    icon: ShieldOff,
    desc: 'Evaluates enterprise backup resilience, verifies SHA-256 file hashes, and prepares disaster recovery checklists.',
    architecture: 'Disaster recovery preparedness analyzer cross-referencing backup job health with cryptographic baseline hashes.',
    endpoints: [
      { method: 'GET', path: '/api/v1/ransomware/readiness', desc: 'Get enterprise resilience score' },
      { method: 'POST', path: '/api/v1/ransomware/verify-file', desc: 'Verify file against tamper hash baseline' },
    ],
    invariants: [
      'Never performs destructive testing or unauthorized filesystem surveillance',
      'Safe file integrity monitoring bounded strictly to authorized application data',
      'Integrity verified exclusively via SHA-256 cryptographic hashes',
    ],
  },
  'webshield': {
    name: 'SIS WebShield',
    tagline: 'Authorized Website Security Scanning',
    category: 'Threat Defense',
    icon: Globe,
    desc: 'SSRF-hardened web scanner auditing SSL/TLS validity, HTTP headers (HSTS, CSP), and DNS TXT ownership challenges.',
    architecture: 'Passive external vulnerability scanner with DNS challenge ownership verification and SSRF pre-resolution engine.',
    endpoints: [
      { method: 'POST', path: '/api/v1/webshield/assets', desc: 'Register domain asset for scanning' },
      { method: 'POST', path: '/api/v1/webshield/assets/:id/verify', desc: 'Verify ownership challenge token' },
      { method: 'POST', path: '/api/v1/webshield/assets/:id/scan', desc: 'Execute SSRF-safe security audit' },
    ],
    invariants: [
      'Only scans explicitly authorized enterprise assets with verified DNS ownership',
      'Strict SSRF defense: All target IPs are validated against private network blocks',
      'Redirect limits (max 3) with DNS re-resolution to prevent rebinding',
    ],
  },
  'digital-forensics': {
    name: 'SIS Digital Forensics',
    tagline: 'Evidence & Incident Case Management',
    category: 'Operations',
    icon: Search,
    desc: 'Enterprise case tracking, private SHA-256 evidence ingestion, and strictly append-only custody event logs.',
    architecture: 'Immutable evidence repository calculating SHA-256 checksums at ingestion and maintaining append-only chain-of-custody tables.',
    endpoints: [
      { method: 'POST', path: '/api/v1/forensics/cases', desc: 'Open forensic case' },
      { method: 'POST', path: '/api/v1/forensics/cases/:id/evidence', desc: 'Ingest evidence and record hash' },
      { method: 'POST', path: '/api/v1/forensics/cases/:id/evidence/:evidenceId/custody', desc: 'Append-only custody transfer' },
    ],
    invariants: [
      'Evidence files stored in private storage; never exposed through public links',
      'Custody event log is strictly append-only; update/delete operations are rejected',
      'Tamper reason, timestamp, and actor ID recorded for every custody event',
    ],
  },
  'access-guardian': {
    name: 'SIS Access Guardian',
    tagline: 'Session & Access Governance',
    category: 'Identity',
    icon: Key,
    desc: 'Central console for active session tracking, multi-device revocation, login anomaly alerts, and access policies.',
    architecture: 'Session token validation engine backed by PostgreSQL session records with remote revocation triggers.',
    endpoints: [
      { method: 'GET', path: '/api/v1/auth/sessions', desc: 'List user active sessions' },
      { method: 'DELETE', path: '/api/v1/auth/sessions/:id', desc: 'Revoke active session' },
      { method: 'POST', path: '/api/v1/auth/sessions/revoke-others', desc: 'Terminate all other active sessions' },
    ],
    invariants: [
      'Shared architecture with core authentication service; no duplicate conflicting auth',
      'Session revocation immediately rejects subsequent API requests at JwtAuthGuard',
      'Tokens are stored in database with device fingerprint and expiration timestamps',
    ],
  },
  'threat-intelligence': {
    name: 'SIS Threat Intelligence',
    tagline: 'IOC Management & Live Feeds',
    category: 'Threat Defense',
    icon: Crosshair,
    desc: 'Central repository indexing malicious IPs, domains, URLs, and file hashes with confidence ratings and feed sync.',
    architecture: 'High-performance indexed IOC store supporting multi-type indicator search, severity tagging, and feed synchronization.',
    endpoints: [
      { method: 'GET', path: '/api/v1/threat-intel/indicators', desc: 'List Indicators of Compromise' },
      { method: 'GET', path: '/api/v1/threat-intel/search', desc: 'Fast IOC search across IP, domain, hash' },
      { method: 'POST', path: '/api/v1/threat-intel/feeds/sync', desc: 'Synchronize external threat feeds' },
    ],
    invariants: [
      'Never invents threat indicators; stores genuine source attribution',
      'Deduplicates incoming feed indicators based on unique (type, value) index',
      'Feeds integrated into Phishing Shield scanner for immediate threat lookup',
    ],
  },
  'cloud-backup': {
    name: 'SIS Cloud Backup Guardian',
    tagline: 'Encrypted Backup & Recovery Management',
    category: 'Data Protection',
    icon: Cloud,
    desc: 'Schedules automated encrypted backup archives, verifies cryptographic hashes, and coordinates recovery jobs.',
    architecture: 'Backup job coordinator computing cryptographic SHA-256 archives and validating restoration integrity.',
    endpoints: [
      { method: 'GET', path: '/api/v1/backups/jobs', desc: 'List scheduled and completed backup archives' },
      { method: 'POST', path: '/api/v1/backups/jobs', desc: 'Trigger manual encrypted backup' },
      { method: 'GET', path: '/api/v1/backups/:id/integrity', desc: 'Verify archive hash integrity' },
    ],
    invariants: [
      'Encrypted payloads only; plaintext credentials are never backed up unencrypted',
      'Integrity is cryptographically verified before any restore operation begins',
      'Restoration requires privileged administrative role',
    ],
  },
  'cyber-soc': {
    name: 'SIS Cyber SOC',
    tagline: 'Central Security Operations Center',
    category: 'Operations',
    icon: Headphones,
    desc: 'Unified command center aggregating alerts across all 12 modules, incident triage, and investigation timelines.',
    architecture: 'Event-driven alert normalizer and state machine managing incidents through strict lifecycle stages.',
    endpoints: [
      { method: 'GET', path: '/api/v1/soc/overview', desc: 'Get SOC metrics and 7-day trend arrays' },
      { method: 'GET', path: '/api/v1/soc/alerts', desc: 'Query normalized alert queue' },
      { method: 'POST', path: '/api/v1/soc/incidents', desc: 'Declare and triage new security incident' },
      { method: 'PATCH', path: '/api/v1/soc/incidents/:id/status', desc: 'State machine status transition' },
    ],
    invariants: [
      'Aggregates real alerts from other modules; never generates fake numbers',
      'Enforces strict state transitions: New → Triaged → Investigating → Containment → Resolved → Closed',
      'Analyst notes and timeline events are permanently recorded for auditability',
    ],
  },
};

export default function ModuleDetailPage() {
  const params = useParams();
  const key = Array.isArray(params?.key) ? params.key[0] : params?.key || 'identity-guardian';
  const moduleData = MODULES_DATA[key] || MODULES_DATA['identity-guardian'];
  const Icon = moduleData.icon;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/modules"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-cyan hover:underline mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Module Catalog</span>
        </Link>
      </div>

      {/* Module Header Card */}
      <div className="cyber-card p-8 border border-cyber-border-bright">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-primary to-cyber-cyan p-0.5 shadow-cyber-glow">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-cyber-bg">
                <Icon className="h-8 w-8 text-cyber-cyan" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-cyber-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-cyber-cyan border border-cyber-cyan/30">
                  {moduleData.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Persistent
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{moduleData.name}</h1>
              <p className="text-xs text-cyber-muted font-medium">{moduleData.tagline}</p>
            </div>
          </div>

          <Link
            href={`/dashboard/modules/${key}`}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110 transition-all self-start sm:self-auto"
          >
            <span>Launch Module Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-300 leading-relaxed border-t border-cyber-border/60 pt-4">
          {moduleData.desc}
        </p>
      </div>

      {/* Technical Architecture & Invariants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-card p-6 space-y-3">
          <div className="text-xs font-bold text-cyber-cyan uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4" /> Technical Architecture
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {moduleData.architecture}
          </p>
        </div>

        <div className="cyber-card p-6 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security Invariants
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {moduleData.invariants.map((inv: string) => (
              <li key={inv} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{inv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* REST API Endpoints Contract */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-cyber-border/60">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyber-cyan" /> Verified REST Endpoints Contract
          </div>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-cyber-cyan hover:underline"
          >
            Swagger OpenAPI Interactive →
          </a>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {moduleData.endpoints.map((ep: any) => (
            <div
              key={ep.path}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-cyber-bg border border-cyber-border gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    ep.method === 'GET'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : ep.method === 'POST'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-gray-200">{ep.path}</span>
              </div>
              <span className="text-[11px] font-sans text-gray-400">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
