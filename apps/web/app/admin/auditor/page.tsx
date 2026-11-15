'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Shield,
  FileText,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { apiClient } from '../../../lib/api';

export default function AuditorDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [filterAction, setFilterAction] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('sis_jwt_token') || sessionStorage.getItem('sis_jwt_token')) : null;
      if (!user && token) {
        return;
      }
      if (!user || (!user.roles.includes('AUDITOR') && !user.roles.includes('SUPER_ADMIN'))) {
        router.push('/unauthorized');
        return;
      }
      loadLogs();
      apiClient('/forensics/cases')
        .then((data) => setCases(data || []))
        .catch(() => setCases([]));
    }
  }, [user, isLoading, router]);

  const loadLogs = () => {
    setLoading(true);
    let url = '/audit-logs?limit=50';
    if (filterAction) url += `&action=${filterAction}`;

    apiClient(url)
      .then((data) => setLogs(data?.logs || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  const exportAuditReport = async () => {
    const data = await apiClient('/reports/export');
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sis_audit_compliance_report_${Date.now()}.json`;
    a.click();
  };

  if (isLoading || (!user?.roles?.includes('AUDITOR') && !user?.roles?.includes('SUPER_ADMIN'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg text-cyber-cyan text-xs">
        Verifying Compliance Auditor Permissions...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyber-border">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 mb-1">
            <Lock className="h-3 w-3" />
            <span>Strictly Read-Only Access Tier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Compliance & Audit Portal</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Immutable inspection of authentication events, forensic evidence custody, administrative changes, and compliance proofs.
          </p>
        </div>
        <button
          onClick={exportAuditReport}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110 self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Compliance Report</span>
        </button>
      </div>

      {/* Audit Log Stream */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyber-cyan" />
            <h2 className="text-base font-bold text-white">Immutable Event Audit Trail ({logs.length})</h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              placeholder="Filter by action keyword..."
              className="rounded-lg bg-cyber-bg border border-cyber-border px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
            />
            <button
              onClick={loadLogs}
              className="rounded-lg bg-white/5 border border-cyber-border px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white"
            >
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e24] text-gray-400 uppercase text-[10px] tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action Event</th>
                <th className="px-4 py-3">Actor Email</th>
                <th className="px-4 py-3">Resource Type</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="px-4 py-2.5 text-gray-400 font-sans text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-cyber-cyan">{log.action}</td>
                  <td className="px-4 py-2.5 text-gray-300 font-sans">{log.actorEmail || log.actor?.email || 'System'}</td>
                  <td className="px-4 py-2.5 text-gray-400 font-sans">{log.resourceType}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.outcome === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {log.outcome}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-400">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 font-sans text-xs">
                    No audit records matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Evidence Custody Verification */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Forensic Evidence & SHA-256 Custody Audit</h2>
          </div>
          <span className="text-xs text-gray-400">Total Cases: {cases.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {cases.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-cyber-bg border border-cyber-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyber-cyan text-xs">{c.caseNumber}</span>
                <span className="rounded bg-white/5 border border-cyber-border px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {c.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-xs">{c.title}</h3>
              <p className="text-[11px] text-gray-400">{c.description}</p>
              <div className="pt-2 border-t border-cyber-border/40 flex items-center justify-between text-[10px] text-gray-400">
                <span>Evidence Records: {c._count?.evidenceRecords || 0}</span>
                <span>Custody Transfers: {c._count?.custodyEvents || 0}</span>
              </div>
            </div>
          ))}

          {cases.length === 0 && (
            <div className="col-span-2 text-center py-6 text-gray-500 text-xs">
              No active forensic cases on record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
