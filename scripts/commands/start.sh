#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PORT="${PORT:-3333}"

if lsof -ti tcp:"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use. If this is your Next.js server, run: stop"
  exit 0
fi

cd "$ROOT_DIR"
echo "Starting development server on port $PORT..."
exec npm run dev
