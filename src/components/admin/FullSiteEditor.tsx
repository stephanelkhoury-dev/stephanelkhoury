'use client';

import { useState } from 'react';

export default function FullSiteEditor() {
  const [json, setJson] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setStatus('');
    const response = await fetch('/api/admin/content', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || 'Failed to load full CMS data');
      return;
    }

    setJson(JSON.stringify(data, null, 2));
    setStatus('Loaded full site data successfully.');
  };

  const save = async () => {
    setStatus('');
    setLoading(true);
    try {
      const parsed = JSON.parse(json);
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Failed to save full CMS data');
        return;
      }

      setStatus('Full site content saved successfully.');
      await load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Invalid JSON payload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">Full Site Editor</h1>
        <p className="text-slate-400">
          Edit every block, project, system, and certificate in one JSON payload. This is your complete site-level CMS.
        </p>
      </header>

      <div className="flex gap-2">
        <button onClick={() => void load()} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700">
          Load Full Data
        </button>
        <button
          onClick={() => void save()}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-medium hover:bg-white disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Full Data'}
        </button>
      </div>

      {status && <p className="text-sm text-slate-300">{status}</p>}

      <textarea
        value={json}
        onChange={(event) => setJson(event.target.value)}
        className="w-full h-[620px] rounded-lg bg-[#020617] border border-slate-700 p-3 font-mono text-xs"
        placeholder="Click 'Load Full Data' to start editing full-site JSON"
      />
    </section>
  );
}
