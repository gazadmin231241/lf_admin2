#!/usr/bin/env bash
set -euo pipefail

if [[ -d /home/agent/workspace ]]; then
  cd /home/agent/workspace
else
  cd "$(git rev-parse --show-toplevel)"
fi

export CI="${CI:-true}"
export TURBO_CACHE_DIR="${TURBO_CACHE_DIR:-$PWD/.turbo/cache}"
export TURBO_TELEMETRY_DISABLED="${TURBO_TELEMETRY_DISABLED:-1}"

mkdir -p "$TURBO_CACHE_DIR" .sandcastle/no-hooks

# Sandcastle containers can inherit a host-level hooksPath that points outside
# the mounted repository. Use an empty repo-local hooks directory so commits
# fail only on repository-controlled checks.
git config --local core.hooksPath .sandcastle/no-hooks

if ! command -v codex >/dev/null 2>&1; then
  echo "Sandcastle setup failed: codex CLI is not available in the sandbox image." >&2
  exit 127
fi

if [[ -f pnpm-lock.yaml ]]; then
  if ! command -v pnpm >/dev/null 2>&1; then
    if command -v corepack >/dev/null 2>&1; then
      corepack prepare pnpm@10.28.1 --activate
    fi
  fi

  if ! command -v pnpm >/dev/null 2>&1; then
    echo "Sandcastle setup failed: pnpm is not available in the sandbox." >&2
    exit 127
  fi

  pnpm install --frozen-lockfile
elif [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi
