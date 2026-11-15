'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones,
  ShieldAlert,
  AlertTriangle,
  Crosshair,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { apiClient } from '../../../lib/api';

export default function SecurityAdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [socOverview, setSocOverview] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [iocs, setIocs] = useState<any[]>([]);
  const [searchIoc, setSearchIoc] = useState('');
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showIocModal, setShowIocModal] = useState(false);

  const [incidentForm, setIncidentForm] = useState({
    title: '',
    summary: '',
    priority: 'HIGH',
  });

  const [iocForm, setIocForm] = useState({
    type: 'DOMAIN',
    value: '',
    severity: 'HIGH',
    confidenceScore: 90,
    tags: 'phishing,scam',
    description: '',
  });

  useEffect(() => {
    if (!isLoading) {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('sis_jwt_token') || sessionStorage.getItem('sis_jwt_token')) : null;
      if (!user && token) {
        return;
      }
      if (!user || (!user.roles.includes('SECURITY_ADMIN') && !user.roles.includes('SUPER_ADMIN'))) {
        router.push('/unauthorized');
        return;
      }
      loadAll();
    }
  }, [user, isLoading, router]);

  const loadAll = () => {
    Promise.all([
      apiClient('/soc/overview').catch(() => null),
      apiClient('/soc/incidents').catch(() => null),
      apiClient('/soc/alerts?limit=20').catch(() => null),
      apiClient('/threat-intel/indicators?limit=20').catch(() => null),
    ]).then(([soc, incs, alts, intel]) => {
      setSocOverview(soc);
      setIncidents(incs?.incidents || []);
      setAlerts(alts?.alerts || []);
      setIocs(intel?.indicators || []);
    });
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/soc/incidents', {
        method: 'POST',
        body: JSON.stringify(incidentForm),
      });
      setShowIncidentModal(false);
      setIncidentForm({ title: '', summary: '', priority: 'HIGH' });
      loadAll();
    } catch (err: any) {
      alert(err?.message || 'Failed to create incident');
    }
  };

  const handleCreateIoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/threat-intel/indicators', {
        method: 'POST',
        body: JSON.stringify(iocForm),
      });
      setShowIocModal(false);
      setIocForm({ type: 'DOMAIN', value: '', severity: 'HIGH', confidenceScore: 90, tags: 'phishing,scam', description: '' });
      loadAll();
    } catch (err: any) {
      alert(err?.message || 'Failed to add indicator');
    }
  };

  const handleTransitionStatus = async (incidentId: string, nextStatus: string) => {
    try {
      await apiClient(`/soc/incidents/${incidentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus, comment: `Security analyst transitioned status to ${nextStatus}` }),
      });
      loadAll();
    } catch (err: any) {
      alert(err?.message || 'Status transition rejected by state machine');
    }
  };

  if (isLoading || (!user?.roles?.includes('SECURITY_ADMIN') && !user?.roles?.includes('SUPER_ADMIN'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg text-cyber-cyan text-xs">
        Verifying Security Admin Authorization...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyber-border">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyber-primary/20 px-3 py-0.5 text-[10px] font-bold text-cyber-cyan border border-cyber-cyan/30 mb-1">
            <Headphones className="h-3 w-3" />
            <span>Cyber SOC Command Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Security Administrator Console</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Operational triage desk for incident investigation, cross-module alert aggregation, and threat intelligence curation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIncidentModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-cyber-glow"
          >
            <Plus className="h-4 w-4" />
            <span>Declare Incident</span>
          </button>
          <button
            onClick={() => setShowIocModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-cyber-glow"
          >
            <Crosshair className="h-4 w-4" />
            <span>Add Threat IOC</span>
          </button>
        </div>
      </div>

      {/* Incident Lifecycle Queue */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Active Incident Response Triage ({incidents.length})</h2>
          </div>
          <span className="text-xs text-gray-400">Strict State Machine: NEW → TRIAGED → INVESTIGATING → CONTAINMENT → RESOLVED → CLOSED</span>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-cyber-bg border border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-cyber-cyan text-xs">{inc.incidentNumber}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      inc.priority === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400'
                        : inc.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {inc.priority}
                  </span>
                  <span className="text-sm font-bold text-white">{inc.title}</span>
                </div>
                <p className="text-[11px] text-gray-300 max-w-2xl">{inc.summary}</p>
                <div className="text-[10px] text-gray-500 flex items-center gap-3 pt-1">
                  <span>Declared: {new Date(inc.createdAt).toLocaleString()}</span>
                  <span>Related Alerts: {inc._count?.alerts || 0}</span>
                </div>
              </div>

              {/* State Machine Transition Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/5 border border-cyber-border px-2.5 py-1 text-xs font-bold text-amber-400">
                  Status: {inc.status}
                </span>

                {inc.status === 'NEW' && (
                  <button
                    onClick={() => handleTransitionStatus(inc.id, 'TRIAGED')}
                    className="rounded bg-cyber-primary/20 border border-cyber-primary/40 px-2.5 py-1 text-cyber-cyan hover:bg-cyber-primary/30 text-[11px] font-bold"
                  >
                    Mark Triaged →
                  </button>
                )}
                {inc.status === 'TRIAGED' && (
                  <button
                    onClick={() => handleTransitionStatus(inc.id, 'INVESTIGATING')}
                    className="rounded bg-cyber-primary/20 border border-cyber-primary/40 px-2.5 py-1 text-cyber-cyan hover:bg-cyber-primary/30 text-[11px] font-bold"
                  >
                    Investigate →
                  </button>
                )}
                {inc.status === 'INVESTIGATING' && (
                  <button
                    onClick={() => handleTransitionStatus(inc.id, 'CONTAINMENT')}
                    className="rounded bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-amber-400 hover:bg-amber-500/30 text-[11px] font-bold"
                  >
                    Contain →
                  </button>
                )}
                {inc.status === 'CONTAINMENT' && (
                  <button
                    onClick={() => handleTransitionStatus(inc.id, 'RESOLVED')}
                    className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold"
                  >
                    Resolve →
                  </button>
                )}
                {inc.status === 'RESOLVED' && (
                  <button
                    onClick={() => handleTransitionStatus(inc.id, 'CLOSED')}
                    className="rounded bg-gray-500/20 border border-gray-500/40 px-2.5 py-1 text-gray-300 hover:bg-gray-500/30 text-[11px] font-bold"
                  >
                    Close Incident
                  </button>
                )}
              </div>
            </div>
          ))}

          {incidents.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              No open incidents in SOC queue. All historical incidents have been contained or closed.
            </div>
          )}
        </div>
      </div>

      {/* Threat Intelligence IOC Management */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-cyber-cyan" />
            <h2 className="text-base font-bold text-white">Threat Intelligence Indicators of Compromise (IOCs)</h2>
          </div>
          <span className="text-xs text-cyber-cyan font-mono">Total indexed: {iocs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e24] text-gray-400 uppercase text-[10px] tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Indicator Value</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Source Attribution</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 font-mono">
              {iocs.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-white/5">
                  <td className="px-4 py-2.5 text-cyber-cyan font-bold">{ioc.type}</td>
                  <td className="px-4 py-2.5 text-white max-w-xs truncate">{ioc.value}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-500/20 text-red-400">
                      {ioc.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-sans font-bold text-emerald-400">{ioc.confidenceScore}%</td>
                  <td className="px-4 py-2.5 font-sans text-gray-400 text-[11px]">{ioc.source}</td>
                  <td className="px-4 py-2.5 font-sans text-gray-500 text-[10px]">{ioc.tags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declare Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card p-6 w-full max-w-md space-y-4 border border-red-500/50">
            <h3 className="text-sm font-bold text-white">Declare New Security Incident</h3>
            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  value={incidentForm.title}
                  onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                  placeholder="e.g. Distributed Credential Harvesting Attack"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Priority</label>
                <select
                  value={incidentForm.priority}
                  onChange={(e) => setIncidentForm({ ...incidentForm, priority: e.target.value })}
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Summary & Initial Impact</label>
                <textarea
                  rows={3}
                  required
                  value={incidentForm.summary}
                  onChange={(e) => setIncidentForm({ ...incidentForm, summary: e.target.value })}
                  placeholder="Initial observations and compromised scope..."
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="rounded-lg px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white shadow-cyber-glow"
                >
                  Declare Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add IOC Modal */}
      {showIocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card p-6 w-full max-w-md space-y-4 border border-cyber-cyan/50">
            <h3 className="text-sm font-bold text-white">Add Threat Intelligence Indicator (IOC)</h3>
            <form onSubmit={handleCreateIoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Indicator Type</label>
                <select
                  value={iocForm.type}
                  onChange={(e) => setIocForm({ ...iocForm, type: e.target.value })}
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="DOMAIN">Domain</option>
                  <option value="IP">IP Address</option>
                  <option value="URL">URL</option>
                  <option value="FILE_HASH_SHA256">SHA-256 File Hash</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Indicator Value</label>
                <input
                  type="text"
                  required
                  value={iocForm.value}
                  onChange={(e) => setIocForm({ ...iocForm, value: e.target.value })}
                  placeholder="e.g. 185.220.101.5 or bad-phish.xyz"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={iocForm.tags}
                  onChange={(e) => setIocForm({ ...iocForm, tags: e.target.value })}
                  placeholder="phishing,tor-exit,credential-harvesting"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setShowIocModal(false)}
                  className="rounded-lg px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyber-primary px-4 py-2 font-bold text-white shadow-cyber-glow"
                >
                  Add Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
