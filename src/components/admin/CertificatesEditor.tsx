'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CertificateInput } from '@/lib/admin-types';

const emptyCertificate = (): CertificateInput => ({
  title: '',
  issuer: '',
  fileUrl: '',
  externalUrl: '',
  issuedAt: '',
  sortOrder: 0,
  isActive: true,
});

export default function CertificatesEditor() {
  const [certificates, setCertificates] = useState<CertificateInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sortedCertificates = useMemo(
    () => [...certificates].sort((a, b) => a.sortOrder - b.sortOrder),
    [certificates]
  );

  const load = async () => {
    setMessage('');
    const response = await fetch('/api/admin/certificates', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Failed to auto-load certificates');
      setLoading(false);
      return;
    }

    setCertificates(data.certificates || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const update = <K extends keyof CertificateInput>(index: number, key: K, value: CertificateInput[K]) => {
    setCertificates((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const add = () => {
    setCertificates((current) => [...current, { ...emptyCertificate(), sortOrder: current.length + 1 }]);
  };

  const remove = (index: number) => {
    setCertificates((current) => current.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/certificates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to save certificates');
        return;
      }
      setMessage('Certificates saved successfully.');
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-300">Auto-loading certificates from PostgreSQL...</div>;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1 tracking-tight">Certificates CMS</h1>
          <p className="text-slate-400">Auto-loaded from Neon PostgreSQL. Add PDF URLs, preview URLs, and metadata.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700">Add Certificate</button>
          <button
            onClick={() => void save()}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-medium hover:bg-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {message && <p className="text-sm text-slate-300">{message}</p>}

      <div className="space-y-4">
        {sortedCertificates.map((certificate, index) => (
          <article key={`${certificate.title}-${index}`} className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Certificate #{index + 1}</h2>
              <button onClick={() => remove(index)} className="text-sm px-2 py-1 rounded bg-red-500/20 border border-red-400/30">
                Remove
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Title" value={certificate.title} onChange={(v) => update(index, 'title', v)} />
              <Input label="Issuer" value={certificate.issuer} onChange={(v) => update(index, 'issuer', v)} />
              <Input label="PDF URL (fileUrl)" value={certificate.fileUrl} onChange={(v) => update(index, 'fileUrl', v)} />
              <Input
                label="Preview URL (externalUrl)"
                value={certificate.externalUrl || ''}
                onChange={(v) => update(index, 'externalUrl', v)}
              />
              <Input label="Issued At" value={certificate.issuedAt || ''} onChange={(v) => update(index, 'issuedAt', v)} />
              <Input
                label="Sort Order"
                value={String(certificate.sortOrder)}
                onChange={(v) => update(index, 'sortOrder', Number(v) || 0)}
              />
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {certificate.fileUrl && (
                <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded bg-[#3b82f6]/20 border border-white/10">
                  Open PDF
                </a>
              )}
              {certificate.externalUrl && (
                <a href={certificate.externalUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded bg-[#10b981]/20 border border-white/10">
                  Open Preview
                </a>
              )}
            </div>

            <label className="inline-flex gap-2 text-sm text-gray-300 items-center">
              <input type="checkbox" checked={certificate.isActive} onChange={(e) => update(index, 'isActive', e.target.checked)} />
              Active
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500" />
    </label>
  );
}
