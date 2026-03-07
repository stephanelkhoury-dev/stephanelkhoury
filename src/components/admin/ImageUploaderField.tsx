'use client';

import { useRef, useState } from 'react';

type ImageUploaderFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
};

export default function ImageUploaderField({ label, value, onChange, helperText }: ImageUploaderFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('');

  const uploadFile = async (file: File) => {
    setUploading(true);
    setStatus('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Upload failed');
        return;
      }

      onChange(data.url);
      setStatus('Upload complete');
    } catch {
      setStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-700/70 bg-[#020617] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-200 font-medium">{label}</p>
        {status && <p className="text-xs text-slate-400">{status}</p>}
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`rounded-lg border border-dashed p-4 text-center transition-colors ${
          dragActive ? 'border-cyan-300 bg-cyan-500/10' : 'border-slate-600 bg-slate-900/40'
        }`}
      >
        {value ? (
          <img src={value} alt={label} className="mx-auto mb-3 h-28 w-full max-w-[220px] object-cover rounded-md border border-slate-700" />
        ) : (
          <div className="mx-auto mb-3 h-28 w-full max-w-[220px] rounded-md border border-slate-700 bg-slate-900/70 grid place-items-center text-xs text-slate-500">
            Image placeholder
          </div>
        )}

        <p className="text-xs text-slate-300">Drag and drop image here</p>
        <p className="text-[11px] text-slate-500 mt-1">or use the upload button</p>

        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-md bg-slate-200 text-slate-900 text-xs font-medium hover:bg-white disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-md border border-slate-600 text-xs hover:bg-slate-800"
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) await uploadFile(file);
            event.target.value = '';
          }}
        />
      </div>

      <label className="block">
        <span className="text-xs text-slate-400">Image URL</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 text-sm"
        />
      </label>

      {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
}
