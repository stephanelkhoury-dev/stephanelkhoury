'use client';

import { useState } from 'react';

export default function JsonResourceEditor({
  title,
  endpoint,
  keyName,
  description,
}: {
  title: string;
  endpoint: string;
  keyName: string;
  description: string;
}) {
  const [json, setJson] = useState('[]');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setStatus('');
    const response = await fetch(endpoint, { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || 'Failed to load data');
      return;
    }

    setJson(JSON.stringify(data[keyName] ?? [], null, 2));
    setStatus('Loaded successfully.');
  };

  const save = async () => {
    setStatus('');
    setLoading(true);
    try {
      const parsed = JSON.parse(json);
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [keyName]: parsed }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Failed to save data');
        return;
      }

      setStatus('Saved successfully.');
      await load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Invalid JSON');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400 mb-4">{description}</p>

      <div className="flex gap-2 mb-4">
        <button onClick={() => void load()} className="px-4 py-2 rounded-lg bg-[#3b82f6]">
          Load
        </button>
        <button
          onClick={() => void save()}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[#10b981] text-black font-semibold disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {status && <p className="text-sm text-gray-300 mb-3">{status}</p>}

      <textarea
        value={json}
        onChange={(event) => setJson(event.target.value)}
        className="w-full h-[520px] rounded-lg bg-[#0a0f1a] border border-white/10 p-3 font-mono text-xs"
      />
    </section>
  );
}
