'use client';

import { useEffect, useState } from 'react';
import type { ChatSessionWithMessages } from '@/lib/admin-types';

export default function ChatsViewer() {
  const [sessions, setSessions] = useState<ChatSessionWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const load = async () => {
    setStatus('');
    const response = await fetch('/api/admin/chats', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || 'Failed to load chats');
      setLoading(false);
      return;
    }

    setSessions((data.chatSessions || []) as ChatSessionWithMessages[]);
    setStatus(`Loaded ${data.chatSessions?.length || 0} sessions.`);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-2 tracking-tight">Chat Sessions</h1>
      <p className="text-slate-400 mb-4">Auto-loaded chat sessions stored by the portfolio assistant.</p>

      {status && <p className="text-sm text-slate-300 mb-3">{status}</p>}

      {loading && <p className="text-slate-300 mb-3">Loading chats...</p>}

      <div className="space-y-4">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-xl border border-slate-700 bg-[#0f172a] p-5">
            <div className="text-xs text-slate-400 mb-3">
              Session: {session.id} • Visitor: {session.visitorId} • {new Date(session.createdAt).toLocaleString()}
            </div>
            <div className="space-y-2">
              {session.messages.map((message) => (
                <div
                  key={message.id}
                  className={`text-sm p-3 rounded-lg border ${message.role === 'user' ? 'bg-[#1d4ed8]/15 border-blue-800/60' : 'bg-slate-800/60 border-slate-700'}`}
                >
                  <strong className="mr-2 capitalize text-slate-200">{message.role}:</strong>
                  {message.content}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
