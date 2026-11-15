'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, Shield, Settings, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { apiClient } from '../../../lib/api';
import Link from 'next/link';

export default function ModuleAdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [assignedModules, setAssignedModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      apiClient('/modules')
        .then((allMods: any[]) => {
          if (user.roles?.includes('SUPER_ADMIN')) {
            // Super admin sees all
            setAssignedModules(allMods);
          } else {
            // Filter strictly to user's database module assignments
            const myKeys = (user as any)?.moduleAssignments || [];
            setAssignedModules(allMods.filter((m) => myKeys.includes(m.key)));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg text-cyber-cyan text-xs">
        Loading Module Workspace...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyber-primary/20 px-3 py-0.5 text-[10px] font-bold text-cyber-cyan border border-cyber-cyan/30 mb-1">
          <Layers className="h-3 w-3" />
          <span>Delegated Scope</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Module Administrator Workspace</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Access is strictly restricted to cybersecurity modules explicitly assigned to your account in the database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedModules.map((m) => (
          <div key={m.id} className="cyber-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-cyber-primary/20 text-cyber-cyan border border-cyber-cyan/30 px-2.5 py-0.5 text-[10px] font-bold">
                  {m.category}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{m.name}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{m.description}</p>
            </div>

            <div className="pt-3 border-t border-cyber-border/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500">Key: {m.key}</span>
              <Link
                href={`/dashboard/modules/${m.key}`}
                className="flex items-center gap-1 text-xs font-bold text-cyber-cyan hover:underline"
              >
                <span>Open Module</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}

        {assignedModules.length === 0 && !loading && (
          <div className="col-span-3 cyber-card p-12 text-center text-gray-400 text-xs">
            <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <div className="font-bold text-white text-sm mb-1">No Modules Assigned Yet</div>
            <p className="max-w-md mx-auto">
              Your account holds the MODULE_ADMIN role, but no specific cybersecurity modules have been assigned by a Super Admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
