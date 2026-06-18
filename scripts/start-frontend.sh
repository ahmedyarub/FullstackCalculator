#!/usr/bin/env bash
# Start the React frontend dev server.
# Usage: ./scripts/start-frontend.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "==> Starting frontend dev server..."
cd "$FRONTEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "==> Installing dependencies..."
  npm install
fi

npm run dev
