import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-bg text-center">
      <div className="cyber-card p-8 max-w-md space-y-4 border border-red-500/40">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-red-500/20 text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-white">Access Denied (HTTP 403)</h1>
        <p className="text-xs text-gray-300 leading-relaxed">
          Your current account role does not hold the necessary RBAC permissions to access this administrative workspace. This security violation has been logged to the immutable audit trail.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/overview"
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyber-primary px-5 py-2.5 text-xs font-bold text-white shadow-cyber-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to User Security Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
