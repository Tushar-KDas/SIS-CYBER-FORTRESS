import React from 'react';
import { Shield, Lock, Award, Server, Users, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyber-primary/20 px-3 py-1 text-xs font-semibold text-cyber-cyan border border-cyber-cyan/30">
          <Shield className="h-3.5 w-3.5" />
          <span>Enterprise Cyber Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          About SIS Cyber Fortress
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          SIS CYBER FORTRESS was conceived as an answer to enterprise tool sprawl. Rather than managing disconnected point solutions, SIS unifies twelve critical cybersecurity pillars into one synchronized defense monolith.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero-Knowledge Privacy</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Our Vault Guardian implements client-side authenticated AES-256-GCM encryption. Enterprise administrators and backend databases cannot decrypt stored passwords or sensitive notes.
          </p>
        </div>

        <div className="cyber-card p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Fake Implementation</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Every statistic, alert, and incident is queryable from persistent PostgreSQL tables. Scanners execute genuine network pre-resolution and pattern heuristic scoring.
          </p>
        </div>

        <div className="cyber-card p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Immutable Audit Custody</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Forensic evidence computes SHA-256 cryptographic hashes immediately upon ingestion. Chain-of-custody transfer records are append-only and mathematically tamper-evident.
          </p>
        </div>
      </div>

      <div className="cyber-card p-8 border border-cyber-border-bright text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Explore the Architecture First-Hand</h2>
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Review our comprehensive technical specifications, database schema diagrams, and developer guides in our interactive documentation portal.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/modules"
            className="rounded-xl bg-cyber-primary px-5 py-2.5 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110"
          >
            Explore 12 Modules
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-cyber-border bg-white/5 px-5 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/10"
          >
            Swagger API Reference
          </a>
        </div>
      </div>
    </div>
  );
}
