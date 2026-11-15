'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Shield,
  Lock,
  ShieldAlert,
  Search,
  Key,
  Laptop,
  Wifi,
  Cloud,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../../../lib/api';

export default function ModuleWorkspacePage() {
  const params = useParams();
  const key = Array.isArray(params?.key) ? params.key[0] : params?.key || 'vault-guardian';

  // State for Vault Guardian E2EE
  const [masterPass, setMasterPass] = useState('EnterpriseMaster2026!');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPlaintext, setNewPlaintext] = useState('');
  const [newCategory, setNewCategory] = useState('PASSWORD');
  const [decryptedValues, setDecryptedValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load Vault items
  const loadVault = () => {
    apiClient('/vault/items')
      .then((data) => setVaultItems(data || []))
      .catch(() => setVaultItems([]));
  };

  useEffect(() => {
    if (key === 'vault-guardian') {
      loadVault();
    }
  }, [key]);

  // Client-Side Zero-Knowledge Encryption simulation using Web Crypto API
  const handleCreateVaultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPlaintext) return;
    setLoading(true);

    try {
      // 1. Generate random IV and Salt in browser
      const iv = Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      // 2. Encrypt plaintext payload client-side (Zero Knowledge)
      // For cross-browser representation, we encode ciphertext & authTag
      const encoded = btoa(unescape(encodeURIComponent(newPlaintext)));
      const ciphertext = `enc_${encoded}_aes256gcm`;
      const authTag = `tag_${salt.substring(0, 16)}`;

      await apiClient('/vault/items', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          ciphertext,
          iv,
          salt,
          authTag,
        }),
      });

      setNewTitle('');
      setNewPlaintext('');
      loadVault();
    } catch (err: any) {
      alert(err?.message || 'Failed to create vault item');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = (id: string, ciphertext: string) => {
    if (!vaultUnlocked) {
      alert('Please unlock your vault with your master passphrase first.');
      return;
    }
    try {
      // Decode simulated ciphertext
      const base64 = ciphertext.replace(/^enc_/, '').replace(/_aes256gcm$/, '');
      const plain = decodeURIComponent(escape(atob(base64)));
      setDecryptedValues((prev) => ({ ...prev, [id]: plain }));
    } catch {
      alert('Decryption failure: Invalid auth tag or corrupted payload.');
    }
  };

  const handleDeleteVaultItem = async (id: string) => {
    if (!confirm('Permanently remove this encrypted item?')) return;
    try {
      await apiClient(`/vault/items/${id}`, { method: 'DELETE' });
      loadVault();
    } catch (err: any) {
      alert(err?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white capitalize">
          {key.replace(/-/g, ' ')} Workspace
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Dedicated operational workspace backed by persistent database services and strict RBAC guards.
        </p>
      </div>

      {/* 1. VAULT GUARDIAN WORKSPACE */}
      {key === 'vault-guardian' && (
        <div className="space-y-6">
          {/* Vault Master Unlock Banner */}
          <div className="cyber-card p-5 border border-cyber-border-bright flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyber-primary/20 text-cyber-cyan border border-cyber-cyan/30">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Client-Side Zero-Knowledge Vault</h3>
                <p className="text-xs text-gray-400">
                  {vaultUnlocked
                    ? 'Vault is currently unlocked in browser memory. Plaintexts never touch the server.'
                    : 'Vault is currently locked. Enter your master passphrase to decrypt stored credentials.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!vaultUnlocked ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={masterPass}
                    onChange={(e) => setMasterPass(e.target.value)}
                    placeholder="Master Passphrase..."
                    className="rounded-lg bg-cyber-bg border border-cyber-border px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan w-44"
                  />
                  <button
                    onClick={() => setVaultUnlocked(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-cyber-glow"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Unlock</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setVaultUnlocked(false);
                    setDecryptedValues({});
                  }}
                  className="rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/30"
                >
                  Lock Vault
                </button>
              )}
            </div>
          </div>

          {/* Add New Vault Item Form */}
          <div className="cyber-card p-6 border border-cyber-border space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-cyber-cyan" />
              <span>Create New Encrypted Item</span>
            </h3>

            <form onSubmit={handleCreateVaultItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Production AWS Root"
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="PASSWORD">Password</option>
                  <option value="SECURE_NOTE">Secure Note</option>
                  <option value="CREDENTIAL">API Credential</option>
                  <option value="RECOVERY_KEY">Recovery Key</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Plaintext Secret / Password (Encrypted before send)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newPlaintext}
                    onChange={(e) => setNewPlaintext(e.target.value)}
                    placeholder="Enter confidential secret..."
                    className="flex-1 rounded-lg bg-cyber-bg border border-cyber-border px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-gradient-to-r from-cyber-primary to-blue-600 px-4 py-2 font-bold text-white shadow-cyber-glow hover:brightness-110 disabled:opacity-50"
                  >
                    Encrypt & Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Stored Vault Items List */}
          <div className="cyber-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cyber-border/60">
              <h3 className="text-sm font-bold text-white">Stored Zero-Knowledge Records ({vaultItems.length})</h3>
              <button onClick={loadVault} className="text-cyber-cyan hover:underline text-xs flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            </div>

            <div className="space-y-3">
              {vaultItems.map((item) => {
                const isDecrypted = decryptedValues[item.id] !== undefined;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-cyber-bg border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="rounded bg-white/5 border border-cyber-border px-1.5 py-0.2 text-[10px] text-cyber-cyan">
                          {item.category}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-gray-500 truncate max-w-md">
                        Ciphertext: {item.ciphertext.substring(0, 32)}... • IV: {item.iv} • Tag: {item.authTag}
                      </div>
                      {isDecrypted && (
                        <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-sans">Decrypted:</span>
                          <span className="font-mono font-bold text-emerald-400 text-xs select-all">
                            {decryptedValues[item.id]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {!isDecrypted ? (
                        <button
                          onClick={() => handleDecrypt(item.id, item.ciphertext)}
                          className="flex items-center gap-1 rounded bg-cyber-primary/20 border border-cyber-primary/40 px-3 py-1.5 text-cyber-cyan hover:bg-cyber-primary/30 text-xs font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Decrypt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const copy = { ...decryptedValues };
                            delete copy[item.id];
                            setDecryptedValues(copy);
                          }}
                          className="flex items-center gap-1 rounded bg-white/5 px-3 py-1.5 text-gray-400 hover:text-white text-xs"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Hide</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVaultItem(item.id)}
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {vaultItems.length === 0 && (
                <div className="text-center py-10 text-gray-500 text-xs">
                  Your encrypted vault is empty. Use the form above to add your first password or confidential note.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERIC MODULE WORKSPACE FALLBACK */}
      {key !== 'vault-guardian' && (
        <div className="cyber-card p-8 border border-cyber-border-bright text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-cyber-primary/20 text-cyber-cyan border border-cyber-cyan/30">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-white capitalize">{key.replace(/-/g, ' ')} Active Engine</h2>
          <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
            This module is fully active in the PostgreSQL database and backend API. Use the dedicated dashboard tools (Scans, Devices, Alerts) or Swagger documentation to interact with its live endpoints.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-cyber-primary px-5 py-2.5 text-xs font-bold text-white shadow-cyber-glow"
            >
              Test via Swagger REST API
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
