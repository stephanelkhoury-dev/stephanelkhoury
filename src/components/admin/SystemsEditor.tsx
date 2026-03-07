'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SystemInput } from '@/lib/admin-types';

const emptySystem = (): SystemInput => ({
  name: '',
  slug: '',
  logoUrl: '',
  shortDescription: '',
  experience: '',
  projectLinks: [],
  certificateLinks: [],
  resourceLinks: [],
  sortOrder: 0,
  isActive: true,
});

export default function SystemsEditor() {
  const [systems, setSystems] = useState<SystemInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sortedSystems = useMemo(() => [...systems].sort((a, b) => a.sortOrder - b.sortOrder), [systems]);

  const load = async () => {
    setMessage('');
    const response = await fetch('/api/admin/systems', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Failed to auto-load systems');
      setLoading(false);
      return;
    }

    setSystems(data.systems || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const update = <K extends keyof SystemInput>(index: number, key: K, value: SystemInput[K]) => {
    setSystems((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const add = () => {
    setSystems((current) => [...current, { ...emptySystem(), sortOrder: current.length + 1 }]);
  };

  const remove = (index: number) => {
    setSystems((current) => current.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/systems', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systems }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to save systems');
        return;
      }
      setMessage('Systems saved successfully.');
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-300">Auto-loading systems from PostgreSQL...</div>;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1 tracking-tight">Systems CMS</h1>
          <p className="text-slate-400">Auto-loaded from Neon PostgreSQL with full platform metadata editing.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700">Add System</button>
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
        {sortedSystems.map((system, index) => (
          <article key={`${system.slug}-${index}`} className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">System #{index + 1}</h2>
              <button onClick={() => remove(index)} className="text-sm px-2 py-1 rounded bg-red-500/20 border border-red-400/30">
                Remove
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Name" value={system.name} onChange={(v) => update(index, 'name', v)} />
              <Input label="Slug" value={system.slug} onChange={(v) => update(index, 'slug', v)} />
              <Input label="Logo URL" value={system.logoUrl} onChange={(v) => update(index, 'logoUrl', v)} />
              <Input
                label="Sort Order"
                value={String(system.sortOrder)}
                onChange={(v) => update(index, 'sortOrder', Number(v) || 0)}
              />
              <TextArea
                label="Short Description"
                value={system.shortDescription}
                onChange={(v) => update(index, 'shortDescription', v)}
              />
              <TextArea label="Experience" value={system.experience} onChange={(v) => update(index, 'experience', v)} />
              <TextArea
                label="Project Links (one per line)"
                value={system.projectLinks.join('\n')}
                onChange={(v) => update(index, 'projectLinks', v.split('\n').map((x) => x.trim()).filter(Boolean))}
              />
              <TextArea
                label="Certificate Links (one per line)"
                value={system.certificateLinks.join('\n')}
                onChange={(v) => update(index, 'certificateLinks', v.split('\n').map((x) => x.trim()).filter(Boolean))}
              />
              <TextArea
                label="Resource Links (one per line)"
                value={system.resourceLinks.join('\n')}
                onChange={(v) => update(index, 'resourceLinks', v.split('\n').map((x) => x.trim()).filter(Boolean))}
              />
            </div>

            <label className="inline-flex gap-2 text-sm text-gray-300 items-center">
              <input type="checkbox" checked={system.isActive} onChange={(e) => update(index, 'isActive', e.target.checked)} />
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

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-xs text-slate-400">{label}</span>
      <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500" />
    </label>
  );
}
