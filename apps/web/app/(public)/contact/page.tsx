'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Enterprise Security Triage',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Contact Security Operations
        </h1>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Need assistance or wish to report an enterprise incident to the SOC team? Submit your inquiry through our encrypted contact gateway.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="cyber-card p-5 space-y-2">
            <div className="text-xs font-bold text-cyber-cyan uppercase">Security Desk</div>
            <div className="text-sm font-semibold text-white">soc@sisfortress.cyber</div>
            <p className="text-[11px] text-gray-400">24/7/365 Incident Triage & Response</p>
          </div>

          <div className="cyber-card p-5 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase">Emergency Hotline</div>
            <div className="text-sm font-semibold text-white">+1 (800) 555-CYBER</div>
            <p className="text-[11px] text-gray-400">Priority Critical Incident Escalation</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="cyber-card p-8 border border-cyber-border-bright">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Transmission Received</h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Your communication has been dispatched to the Security Operations Center. A lead incident responder will triage your submission shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-lg bg-cyber-primary px-4 py-2 text-xs font-semibold text-white"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Security Lead / Analyst"
                    className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Enterprise Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="analyst@enterprise.com"
                    className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Target Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                  >
                    <option value="Enterprise Security Triage">Enterprise Security Triage</option>
                    <option value="Incident Response Escalation">Incident Response Escalation</option>
                    <option value="Compliance & Audit Inquiries">Compliance & Audit Inquiries</option>
                    <option value="Threat Intelligence Coordination">Threat Intelligence Coordination</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Inquiry / Incident Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding the security event, asset domain, or inquiry..."
                    className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-primary to-blue-600 py-3 font-bold text-white shadow-cyber-glow hover:brightness-110 transition-all text-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmit Security Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
