'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isLengthValid = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumberOrSymbol = /[\d\W]/.test(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isLengthValid || !hasUpper || !hasLower || !hasNumberOrSymbol) {
      setError('Password does not meet required security complexity rules.');
      return;
    }

    setLoading(true);

    try {
      await register(fullName, email, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please review input.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-bg relative overflow-hidden">
      <div className="w-full max-w-md space-y-6">
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Corporate Account</h1>
          <p className="text-xs text-gray-400">Enroll your identity into the enterprise security perimeter</p>
        </div>

        <div className="cyber-card p-8 border border-cyber-border-bright space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Account registered successfully! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Corporate Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@enterprise.com"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters with symbol"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
                />
              </div>

              {/* Live Password Rules */}
              <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
                <span className={isLengthValid ? 'text-emerald-400' : 'text-gray-500'}>
                  {isLengthValid ? '✓' : '•'} 8+ characters
                </span>
                <span className={hasUpper ? 'text-emerald-400' : 'text-gray-500'}>
                  {hasUpper ? '✓' : '•'} Uppercase letter
                </span>
                <span className={hasLower ? 'text-emerald-400' : 'text-gray-500'}>
                  {hasLower ? '✓' : '•'} Lowercase letter
                </span>
                <span className={hasNumberOrSymbol ? 'text-emerald-400' : 'text-gray-500'}>
                  {hasNumberOrSymbol ? '✓' : '•'} Number or symbol
                </span>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 py-3 font-bold text-white shadow-cyber-glow hover:brightness-110 disabled:opacity-50 transition-all text-xs"
            >
              {loading ? (
                <span>Registering & Hashing Argon2id...</span>
              ) : (
                <>
                  <span>Create Account & Join Fortress</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-cyber-cyan font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
