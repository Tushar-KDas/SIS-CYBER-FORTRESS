'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, ChevronRight, UserCheck, Terminal } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-border/80 bg-cyber-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-primary to-cyber-cyan p-0.5 shadow-cyber-glow transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-cyber-bg">
              <Shield className="h-5 w-5 text-cyber-cyan transition-colors group-hover:text-white" />
              <Lock className="absolute h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <span className="block text-base font-extrabold tracking-wider text-white">
              SIS CYBER <span className="text-cyber-cyan">FORTRESS</span>
            </span>
            <span className="block text-[10px] font-medium tracking-widest text-cyber-muted uppercase">
              Unified Cyber Defense
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-cyber-cyan transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-cyber-cyan transition-colors">
            About
          </Link>
          <Link href="/modules" className="hover:text-cyber-cyan transition-colors">
            Security Modules
          </Link>
          <Link href="/#architecture" className="hover:text-cyber-cyan transition-colors">
            Platform
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-cyber-cyan" />
            API Docs
          </a>
          <Link href="/contact" className="hover:text-cyber-cyan transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-2 rounded-lg bg-cyber-primary/20 px-4 py-2 text-xs font-semibold text-cyber-cyan border border-cyber-primary/40 hover:bg-cyber-primary/30 transition-all shadow-cyber-glow"
              >
                <UserCheck className="h-4 w-4" />
                Console ({user.roles[0] || 'User'})
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-xs font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyber-primary to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-cyber-glow hover:brightness-110 transition-all"
              >
                <span>Secure Your Account</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
