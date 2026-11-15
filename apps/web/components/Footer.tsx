import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Terminal, Activity, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-cyber-border bg-cyber-bg-secondary/60 text-gray-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-primary/20 border border-cyber-cyan/40">
                <Shield className="h-4 w-4 text-cyber-cyan" />
              </div>
              <span className="font-extrabold text-white text-sm">
                SIS CYBER <span className="text-cyber-cyan">FORTRESS</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Integrated enterprise cybersecurity ecosystem protecting digital identity, devices, applications, networks, and critical information.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All 12 Modules Operational & Guarded
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              12 Security Modules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/modules/identity-guardian" className="hover:text-cyber-cyan">Identity Guardian</Link></li>
              <li><Link href="/modules/phishing-shield" className="hover:text-cyber-cyan">Phishing Shield</Link></li>
              <li><Link href="/modules/endpoint-guardian" className="hover:text-cyber-cyan">Endpoint Guardian</Link></li>
              <li><Link href="/modules/network-sentinel" className="hover:text-cyber-cyan">Network Sentinel</Link></li>
              <li><Link href="/modules/vault-guardian" className="hover:text-cyber-cyan">Vault Guardian (E2EE)</Link></li>
              <li><Link href="/modules/cyber-soc" className="hover:text-cyber-cyan">Cyber SOC Command</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Platform & Governance
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/admin/super-admin" className="hover:text-cyber-cyan">Super Admin Panel</Link></li>
              <li><Link href="/admin/security-admin" className="hover:text-cyber-cyan">Security Admin SOC Desk</Link></li>
              <li><Link href="/admin/auditor" className="hover:text-cyber-cyan">Compliance Auditor Portal</Link></li>
              <li><a href="http://localhost:4000/api/docs" target="_blank" rel="noreferrer" className="hover:text-cyber-cyan">Swagger API Docs</a></li>
              <li><a href="http://localhost:4000/api/v1/system/health" target="_blank" rel="noreferrer" className="hover:text-cyber-cyan">Live API Health</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Compliance & Cryptography
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              Architected with Argon2id password hashing, RFC 6238 TOTP, AES-256-GCM zero-knowledge client encryption, and append-only forensic custody.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded bg-cyber-card px-2 py-0.5 text-[10px] text-cyber-cyan border border-cyber-border">AES-256-GCM</span>
              <span className="rounded bg-cyber-card px-2 py-0.5 text-[10px] text-cyber-cyan border border-cyber-border">Argon2id</span>
              <span className="rounded bg-cyber-card px-2 py-0.5 text-[10px] text-cyber-cyan border border-cyber-border">OWASP Top 10</span>
              <span className="rounded bg-cyber-card px-2 py-0.5 text-[10px] text-cyber-cyan border border-cyber-border">SSRF Guarded</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-cyber-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} SIS CYBER FORTRESS. All rights reserved. Enterprise Cybersecurity Ecosystem.
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/modules" className="hover:text-gray-300">Directory</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact Security Operations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
