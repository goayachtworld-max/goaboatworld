'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, KeyRound, Ship } from 'lucide-react';
import { inputCls } from '@/components/AdminUI';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [linkState, setLinkState] = useState<'checking' | 'valid' | 'invalid'>(
    token ? 'checking' : 'invalid'
  );

  useEffect(() => {
    if (!token) return;
    fetch(`/api/admin/reset-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => setLinkState(data.valid ? 'valid' : 'invalid'))
      .catch(() => setLinkState('invalid'));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Reset failed. The link may have expired — request a new one.');
        if (res.status === 400) setLinkState('invalid');
        return;
      }
      // Force a fresh sign-in with the new password (old tokens die with it).
      sessionStorage.removeItem('gbw_admin_token');
      setDone(true);
    } catch {
      setError('Reset failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#1A3C35] rounded-xl flex items-center justify-center mx-auto mb-4">
          <Ship className="w-6 h-6 text-[#3D9B7D]" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Reset admin password</h1>
        <p className="text-[13px] text-gray-400 mt-1">Goaboatworld Admin</p>
      </div>

      {linkState === 'checking' && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-[#3D9B7D] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {linkState === 'invalid' && !done && (
        <div className="text-center space-y-4">
          <p className="text-[13px] text-red-500">
            This reset link is invalid or has expired. Please request a new one from the admin sign
            in page.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center w-full bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl h-12 text-[14px] font-bold transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      )}

      {linkState === 'valid' && !done && (
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min. 8 characters)"
            autoFocus
            className={inputCls}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className={inputCls}
          />
          {error && <p className="text-[13px] text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl h-12 text-[14px] font-bold transition-colors disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            {saving ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      )}

      {done && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-[14px] text-gray-600">
            Your admin password has been updated. You can sign in with the new password now.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center w-full bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-xl h-12 text-[14px] font-bold transition-colors"
          >
            Go to admin sign in
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminResetPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Suspense
        fallback={
          <div className="w-12 h-12 border-4 border-[#3D9B7D] border-t-transparent rounded-full animate-spin" />
        }
      >
        <ResetForm />
      </Suspense>
    </div>
  );
}
