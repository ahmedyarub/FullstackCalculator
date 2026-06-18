#!/usr/bin/env bash
# Run all tests (backend + frontend).
# Usage: ./scripts/run-tests.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "============================================"
echo "  Running All Tests"
echo "============================================"

echo ""
echo "==> Backend tests..."
cd "$PROJECT_ROOT/backend"
go test ./... -v -cover

echo ""
echo "==> Frontend tests..."
cd "$PROJECT_ROOT/frontend"
if [ ! -d "node_modules" ]; then
  npm install
fi
npm test

echo ""
echo "============================================"
echo "  All tests passed!"
echo "============================================"
