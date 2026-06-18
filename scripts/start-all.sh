#!/usr/bin/env bash
# Start both backend and frontend concurrently.
# Usage: ./scripts/start-all.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================"
echo "  Fullstack Calculator — Starting All"
echo "============================================"
echo ""
echo "  Backend:  http://localhost:8080"
echo "  Frontend: http://localhost:5173"
echo ""
echo "============================================"

# Start backend in background
"$SCRIPT_DIR/start-backend.sh" &
BACKEND_PID=$!

# Start frontend in foreground
"$SCRIPT_DIR/start-frontend.sh"

# Cleanup: kill backend when frontend exits
kill $BACKEND_PID 2>/dev/null || true
