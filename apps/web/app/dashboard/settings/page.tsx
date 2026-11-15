'use client';

import React, { useState } from 'react';
import { Shield, KeyRound, CheckCircle2, AlertCircle, QrCode, Lock } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { apiClient } from '../../../lib/api';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [mfaData, setMfaData] = useState<any>(null);
  const [totpCode, setTotpCode] = useState('');
  const [mfaSuccess, setMfaSuccess] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [loadingMfa, setLoadingMfa] = useState(false);

  const startMfaSetup = async () => {
    setLoadingMfa(true);
    setMfaError(null);
    try {
      const data = await apiClient('/auth/mfa/setup', { method: 'POST' });
      setMfaData(data);
    } catch (err: any) {
      setMfaError(err?.message || 'Failed to initiate MFA setup.');
    } finally {
      setLoadingMfa(false);
    }
  };

  const verifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError(null);
    try {
      await apiClient('/auth/mfa/verify', {
        method: 'POST',
        body: JSON.stringify({ code: totpCode }),
      });
      setMfaSuccess(true);
      setMfaData(null);
      await refreshUser();
    } catch (err: any) {
      setMfaError(err?.message || 'Invalid 6-digit code. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Account Security & Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure Multi-Factor Authentication, cryptographic keys, and password policies.
        </p>
      </div>

      {/* MFA Configuration Card */}
      <div className="cyber-card p-6 md:p-8 border border-cyber-border-bright space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-primary/20 text-cyber-cyan border border-cyber-cyan/30">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Two-Factor Authentication (TOTP)</h3>
              <p className="text-xs text-gray-400">RFC 6238 time-based one-time passwords via Authenticator app</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              user?.isMfaEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {user?.isMfaEnabled ? 'Enabled & Active' : 'Not Configured'}
          </span>
        </div>

        {mfaError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{mfaError}</span>
          </div>
        )}

        {mfaSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Multi-Factor Authentication enabled successfully! Account security score updated.</span>
          </div>
        )}

        {!user?.isMfaEnabled && !mfaData && (
          <div className="space-y-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              Adding Multi-Factor Authentication significantly protects your corporate account against credential stuffing and brute force attacks.
            </p>
            <button
              onClick={startMfaSetup}
              disabled={loadingMfa}
              className="rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-cyber-glow hover:brightness-110 disabled:opacity-50"
            >
              {loadingMfa ? 'Generating Cryptographic Secret...' : 'Setup Multi-Factor Authentication'}
            </button>
          </div>
        )}

        {mfaData && (
          <div className="p-5 rounded-xl bg-cyber-bg border border-cyber-cyan/40 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Step 1: Scan QR Code with Authenticator App
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-xl">
                {/* QR Code image */}
                <img src={mfaData.qrCodeDataUrl} alt="MFA QR Code" className="h-36 w-36" />
              </div>
              <div className="space-y-2 text-xs">
                <p className="text-gray-300 leading-relaxed">
                  Open Google Authenticator, Authy, or 1Password, tap "Scan QR Code", and point your camera at this code.
                </p>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Manual Key:</span>
                  <code className="text-cyber-cyan font-mono text-xs select-all bg-white/5 px-2 py-1 rounded">
                    {mfaData.secret}
                  </code>
                </div>
              </div>
            </div>

            <form onSubmit={verifyMfa} className="pt-3 border-t border-cyber-border space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Step 2: Enter 6-Digit Verification Code
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-36 text-center font-mono font-bold text-base tracking-[0.3em] rounded-lg bg-cyber-card border border-cyber-border px-3 py-1.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        )}

        {user?.isMfaEnabled && (
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Your account is protected with hardware/software token 2FA.</span>
          </div>
        )}
      </div>
    </div>
  );
}
