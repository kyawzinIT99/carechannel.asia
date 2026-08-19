#!/bin/sh
set -e
HOOK="${RENDER_DEPLOY_HOOK:-}"
if [ -z "$HOOK" ] && [ -f .env.render ]; then
  HOOK=$(grep '^RENDER_DEPLOY_HOOK=' .env.render | cut -d= -f2- | tr -d '"' | tr -d "'")
fi
if [ -z "$HOOK" ]; then
  echo "Missing RENDER_DEPLOY_HOOK. Copy .env.render.example to .env.render and paste the Deploy Hook URL from Render Settings." >&2
  exit 1
fi
curl -fsS -X POST "$HOOK"
echo
echo "Render deploy requested for carechannel."
