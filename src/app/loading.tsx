export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.2),transparent_35%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          STEPHAN<span className="text-blue-500">.</span>EK
        </h1>

        <div className="w-64 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 animate-[loadingPulse_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm uppercase tracking-[0.2em]">Loading Experience</p>
      </div>
    </div>
  );
}
