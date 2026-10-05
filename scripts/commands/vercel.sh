#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# If current directory is already a linked Vercel project, deploy from here.
if [[ -f "$PWD/.vercel/project.json" ]]; then
	DEPLOY_DIR="$PWD"
else
	DEPLOY_DIR="$ROOT_DIR"
fi

cd "$DEPLOY_DIR"

if [[ $# -gt 0 ]]; then
	echo "Running Vercel in $DEPLOY_DIR with args: $*"
	exec npx vercel "$@"
else
	echo "Deploying to Vercel production from $DEPLOY_DIR..."
	exec npx vercel --prod --yes
fi
