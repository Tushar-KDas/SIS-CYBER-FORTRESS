'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Clock, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchAlerts = () => {
    setLoading(true);
    let url = '/soc/alerts?limit=50';
    if (selectedSeverity !== 'ALL') url += `&severity=${selectedSeverity}`;
    if (selectedStatus !== 'ALL') url += `&status=${selectedStatus}`;

    apiClient(url)
      .then((data) => setAlerts(data?.alerts || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedSeverity, selectedStatus]);

  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'];
  const statuses = ['ALL', 'UNRESOLVED', 'RESOLVED', 'INVESTIGATING'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Aggregated Security Alerts</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Real-time stream of security findings and threat detections normalized across all 12 modules.
        </p>
      </div>

      {/* Filters Strip */}
      <div className="cyber-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-cyber-cyan" /> Severity:
          </span>
          {severities.map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                selectedSeverity === sev
                  ? 'bg-cyber-primary text-white shadow-cyber-glow'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold text-[11px]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg bg-cyber-bg border border-cyber-border px-3 py-1 text-white text-[11px] focus:outline-none focus:border-cyber-cyan"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e24] text-gray-400 font-semibold uppercase text-[10px] tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Alert Title & Details</th>
                <th className="px-5 py-3.5">Source Module</th>
                <th className="px-5 py-3.5">Target Resource</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Detected At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/60">
              {alerts.map((a) => {
                const badgeColor =
                  a.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : a.severity === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : a.severity === 'MEDIUM'
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                    : a.severity === 'LOW'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/40';

                return (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${badgeColor}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-md">
                      <div className="font-bold text-white text-xs">{a.title}</div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">{a.description}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-cyber-cyan text-xs">
                      {a.moduleKey}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-300 font-mono text-[11px]">
                      {a.targetResource || 'Platform Core'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          a.status === 'UNRESOLVED'
                            ? 'text-red-400'
                            : a.status === 'INVESTIGATING'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {a.status === 'UNRESOLVED' ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        <span>{a.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-400 text-[11px]">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {alerts.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                    No alerts matching the selected filter criteria.
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
