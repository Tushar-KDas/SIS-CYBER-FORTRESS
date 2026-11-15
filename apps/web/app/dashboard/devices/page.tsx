'use client';

import React, { useState, useEffect } from 'react';
import { Laptop, Plus, Shield, CheckCircle2, Clock, Smartphone, Monitor } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    platform: 'WINDOWS',
    osVersion: 'Windows 11 Enterprise (23H2)',
    ipAddress: '192.168.1.105',
  });

  const loadDevices = () => {
    setLoading(true);
    apiClient('/devices')
      .then((data) => setDevices(data || []))
      .catch(() => setDevices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/devices/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setShowAddModal(false);
      setForm({
        name: '',
        platform: 'WINDOWS',
        osVersion: 'Windows 11 Enterprise (23H2)',
        ipAddress: '192.168.1.105',
      });
      loadDevices();
    } catch (err: any) {
      alert(err?.message || 'Failed to register device');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Enrolled Hardware Endpoints</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage authorized workstations, laptops, and mobile devices linked to your corporate account.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Enroll New Device</span>
        </button>
      </div>

      {/* Devices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((d) => (
          <div key={d.id} className="cyber-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyber-primary/20 text-cyber-cyan border border-cyber-cyan/30">
                  {d.platform === 'ANDROID' || d.platform === 'IOS' ? (
                    <Smartphone className="h-5 w-5" />
                  ) : (
                    <Laptop className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{d.name}</h3>
                  <div className="text-[11px] text-gray-400">{d.platform} • {d.osVersion}</div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {d.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-cyber-border/60">
              <div>
                <span className="text-gray-400 block text-[10px]">Security Posture</span>
                <span className="font-bold text-emerald-400">{d.securityScore}% Healthy</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">IP Address</span>
                <span className="font-mono text-gray-200">{d.ipAddress || '192.168.1.100'}</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 pt-1">
              <Clock className="h-3 w-3" />
              <span>Last seen telemetry: {new Date(d.lastSeenAt).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {devices.length === 0 && !loading && (
          <div className="col-span-3 text-center py-12 cyber-card text-gray-400 text-xs">
            No devices enrolled yet. Click "Enroll New Device" to register your first endpoint.
          </div>
        )}
      </div>

      {/* Enroll Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card p-6 w-full max-w-md space-y-4 border border-cyber-cyan/40">
            <h3 className="text-base font-bold text-white">Enroll New Endpoint Device</h3>
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Device Name / Hostname</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. ThinkPad-X1-Workstation"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Operating System</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="WINDOWS">Windows</option>
                  <option value="MACOS">macOS</option>
                  <option value="LINUX">Linux</option>
                  <option value="ANDROID">Android (Future Mobile Phase)</option>
                  <option value="IOS">iOS</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">OS Version / Build</label>
                <input
                  type="text"
                  required
                  value={form.osVersion}
                  onChange={(e) => setForm({ ...form, osVersion: e.target.value })}
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Local IP Address</label>
                <input
                  type="text"
                  value={form.ipAddress}
                  onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-4 py-2 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyber-primary px-4 py-2 font-bold text-white shadow-cyber-glow hover:brightness-110"
                >
                  Enroll Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
