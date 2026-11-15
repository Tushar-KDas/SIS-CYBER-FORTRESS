'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password, isMfaStep ? mfaCode : undefined);

      if (res.mfaRequired) {
        setIsMfaStep(true);
        setLoading(false);
        return;
      }

      // Check primary role for redirection
      const roles = res.user?.roles || [];
      if (roles.includes('SUPER_ADMIN')) {
        router.push('/admin/super-admin');
      } else if (roles.includes('SECURITY_ADMIN')) {
        router.push('/admin/security-admin');
      } else if (roles.includes('AUDITOR')) {
        router.push('/admin/auditor');
      } else {
        router.push('/dashboard/overview');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const fillSuperAdminDemo = () => {
    setEmail('superadmin@sisfortress.cyber');
    setPassword('Fortress#SuperAdmin2026!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-primary to-cyber-cyan p-0.5 shadow-cyber-glow">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-cyber-bg">
                <Shield className="h-5 w-5 text-cyber-cyan" />
              </div>
            </div>
            <span className="text-lg font-extrabold text-white">
              SIS CYBER <span className="text-cyber-cyan">FORTRESS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Authentication</h1>
          <p className="text-xs text-gray-400">Sign in with authorized corporate credentials</p>
        </div>

        {/* Form Card */}
        <div className="cyber-card p-8 border border-cyber-border-bright space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {!isMfaStep ? (
              <>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@enterprise.com"
                      className="w-full rounded-lg bg-cyber-bg border border-cyber-border pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-gray-300 font-semibold">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg bg-cyber-bg border border-cyber-border pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 text-center">
                  <KeyRound className="h-6 w-6 text-cyber-cyan mx-auto mb-1" />
                  <div className="font-bold text-white text-xs">Multi-Factor Authentication Required</div>
                  <p className="text-[10px] text-gray-300 mt-1">
                    Enter the 6-digit TOTP code generated by your authenticator app for {email}.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">6-Digit TOTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono font-bold text-base rounded-lg bg-cyber-bg border border-cyber-cyan px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 py-3 font-bold text-white shadow-cyber-glow hover:brightness-110 disabled:opacity-50 transition-all text-xs"
            >
              {loading ? (
                <span>Authenticating with Argon2id...</span>
              ) : isMfaStep ? (
                <span>Verify MFA & Sign In</span>
              ) : (
                <>
                  <span>Sign In to Cyber Fortress</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-Fill */}
          <div className="pt-3 border-t border-cyber-border/60 text-center">
            <button
              type="button"
              onClick={fillSuperAdminDemo}
              className="text-[11px] text-cyber-cyan hover:underline"
            >
              Fill Super Admin Demo Credentials (CLI Bootstrapped)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400">
          Need an account?{' '}
          <Link href="/register" className="text-cyber-cyan font-semibold hover:underline">
            Register new employee account
          </Link>
        </div>
      </div>
    </div>
  );
}
