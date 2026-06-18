#!/usr/bin/env bash
# Start the Go backend server.
# Usage: ./scripts/start-backend.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "==> Starting backend server..."
cd "$BACKEND_DIR"

# Build and run
go run ./cmd/server
