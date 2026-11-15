'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function ScansPage() {
  const [urlInput, setUrlInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = () => {
    apiClient('/phishing/scans')
      .then((data) => setScanHistory(data || []))
      .catch(() => setScanHistory([]));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setError(null);
    setScanResult(null);
    setLoading(true);

    try {
      const result = await apiClient('/phishing/scan', {
        method: 'POST',
        body: JSON.stringify({ url: urlInput }),
      });
      setScanResult(result);
      loadHistory();
    } catch (err: any) {
      setError(err?.message || 'Scan failed. Possible SSRF block or invalid domain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Security Scanners & Historical Audits</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Execute real-time SSRF-safe URL threat classification and inspect historical vulnerability scan logs.
        </p>
      </div>

      {/* URL Scanner Box */}
      <div className="cyber-card p-6 md:p-8 border border-cyber-border-bright space-y-5">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-5 w-5 text-cyber-cyan" />
          <h2 className="text-base font-bold text-white">SIS Phishing Shield — Live URL Scanner</h2>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste target URL to inspect (e.g. https://secure-login-account-update.xyz)..."
            className="flex-1 rounded-xl bg-cyber-bg border border-cyber-border px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Inspecting Signals...' : 'Analyze URL'}</span>
          </button>
        </form>

        {/* Demo Quick Pre-fills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
          <span>Quick test targets:</span>
          <button
            type="button"
            onClick={() => setUrlInput('https://secure-login-account-update.xyz')}
            className="rounded bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 hover:bg-red-500/20"
          >
            Known Malicious Phish (IOC Match)
          </button>
          <button
            type="button"
            onClick={() => setUrlInput('https://appleid-verify-account.support-online.net')}
            className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 hover:bg-amber-500/20"
          >
            Suspicious Deceptive Domain
          </button>
          <button
            type="button"
            onClick={() => setUrlInput('http://127.0.0.1:8080/admin')}
            className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 hover:bg-blue-500/20"
          >
            SSRF Loopback Probe (Blocked)
          </button>
        </div>

        {/* Scan Error Alert */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <div className="font-bold">Scan Request Terminated</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Scan Results Card */}
        {scanResult && (
          <div className="rounded-xl bg-cyber-bg border border-cyber-border p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyber-border/60">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Inspected Target</span>
                <span className="font-mono font-bold text-white text-xs">{scanResult.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    scanResult.riskLevel.includes('Malicious')
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : scanResult.riskLevel.includes('Suspicious')
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {scanResult.riskLevel}
                </span>
                <span className="rounded bg-white/5 border border-cyber-border px-2 py-1 text-[11px] text-cyber-cyan font-bold">
                  {scanResult.confidenceScore}% Confidence
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Threat Classification:</span>
                <span className="font-semibold text-white">{scanResult.threatCategory}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Domain Name:</span>
                <span className="font-mono text-gray-200">{scanResult.domain}</span>
              </div>
            </div>

            {scanResult.heuristics?.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Engine Evaluation Signals
                </span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {scanResult.heuristics.map((h: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyber-cyan flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Historical Scans Table */}
      <div className="cyber-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">Historical Scan Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e24] text-gray-400 font-semibold text-[10px] uppercase tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-4 py-2.5">Domain / URL</th>
                <th className="px-4 py-2.5">Risk Rating</th>
                <th className="px-4 py-2.5">Threat Category</th>
                <th className="px-4 py-2.5">Confidence</th>
                <th className="px-4 py-2.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40">
              {scanHistory.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="px-4 py-2.5 font-mono text-gray-200 max-w-xs truncate">{s.url}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.riskLevel.includes('Malicious')
                          ? 'bg-red-500/20 text-red-400'
                          : s.riskLevel.includes('Suspicious')
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {s.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-300">{s.threatCategory || 'None'}</td>
                  <td className="px-4 py-2.5 font-semibold text-cyber-cyan">{s.confidenceScore}%</td>
                  <td className="px-4 py-2.5 text-gray-400 text-[11px]">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {scanHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 text-xs">
                    No scans recorded yet. Enter a URL above to perform your first audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
