#!/usr/bin/env bash
# Portable package manager shim:
# - Use real pnpm if available
# - Else use Corepack's pnpm (without needing symlink writes)
# - Else no-op with a helpful message (hooks won't hard-fail)
set -euo pipefail

# Prefer a locally installed pnpm on PATH
if command -v pnpm >/dev/null 2>&1; then
  exec pnpm "$@"
fi

# Use Corepack if present (common in Node 18/20 toolchains)
if command -v corepack >/dev/null 2>&1; then
  # Ensure an acceptable pnpm is prepared
  corepack pnpm -v >/dev/null 2>&1 || {
    # Activation may fail to symlink on read-only FS; direct exec still works
    corepack prepare pnpm@9.15.9 --activate >/dev/null 2>&1 || true
  }
  exec corepack pnpm "$@"
fi

# Fallback: don't hard-fail hooks in constrained envs
echo "⚠️  pnpm is not available and Corepack is missing. Skipping: pnpm $*" >&2
exit 0
