'use client';

import React, { useState } from 'react';
import { FileWarning, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function ThreatReportsPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [category, setCategory] = useState('Credential Harvesting Phishing');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient('/phishing/report', {
        method: 'POST',
        body: JSON.stringify({ targetUrl, category, comment }),
      });
      setSubmitted(true);
      setTargetUrl('');
      setComment('');
    } catch (err: any) {
      alert(err?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Submit Threat Report</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Report suspicious URLs, deceptive emails, or scam sites directly to the enterprise Security Operations Center (SOC) for immediate triage.
        </p>
      </div>

      <div className="cyber-card p-6 md:p-8 border border-cyber-border-bright space-y-5">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Threat Report Dispatched to SOC</h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Your submission has been logged and aggregated into the Security Operations Center queue. An analyst will verify domain reputation and blacklists.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 rounded-lg bg-cyber-primary px-4 py-2 text-xs font-semibold text-white shadow-cyber-glow"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Suspicious URL / Domain</label>
              <input
                type="text"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://malicious-login-update.com/signin"
                className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Suspected Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white focus:outline-none focus:border-cyber-cyan text-xs"
              >
                <option value="Credential Harvesting Phishing">Credential Harvesting Phishing</option>
                <option value="Executive Impersonation (CEO Fraud)">Executive Impersonation (CEO Fraud)</option>
                <option value="Malware / Ransomware Dropper Link">Malware / Ransomware Dropper Link</option>
                <option value="Fake Technical Support Scam">Fake Technical Support Scam</option>
                <option value="Other Malicious Campaign">Other Malicious Campaign</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Context & Observations</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe how this threat was encountered (e.g. Received via unsolicited SMS asking for corporate VPN password)..."
                className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-6 py-2.5 font-bold text-white shadow-cyber-glow hover:brightness-110 disabled:opacity-50 transition-all text-xs"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Transmitting to SOC...' : 'Transmit Threat Report'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
