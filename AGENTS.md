# AGENTS.md — AI Agent Instructions

## Project Overview

This is a **Fullstack Calculator** application consisting of:

- **Backend**: Go REST API microservice (`backend/`)
- **Frontend**: React + TypeScript SPA built with Vite (`frontend/`)

The frontend consumes the backend API to perform arithmetic operations.

## Repository Structure

```
FullstackCalculator/
├── backend/           # Go microservice
│   ├── cmd/server/    # Entry point
│   └── internal/      # Business logic (calculator, handler, middleware)
├── frontend/          # React + TypeScript + Vite
│   └── src/           # Components, hooks, API client, types
├── scripts/           # Cross-platform startup scripts
├── docs/              # Architecture and spec documents
│   ├── Architecture.md
│   ├── api-spec.md
│   ├── backend-spec.md
│   └── frontend-spec.md
├── docker-compose.yml
└── README.md
```

## Coding Standards

### Go (Backend)

- Use **idiomatic Go**: short variable names in small scopes, descriptive names for exported symbols
- Follow the [Effective Go](https://go.dev/doc/effective_go) guide
- Error handling: always check errors, return them with context using `fmt.Errorf("operation: %w", err)`
- Package structure follows the **Standard Go Project Layout** conventions
- Tests live alongside source files (`*_test.go`)
- Use `net/http` standard library — no external frameworks
- JSON responses use `encoding/json` with proper struct tags

### TypeScript / React (Frontend)

- Strict TypeScript — no `any` types
- Functional components with hooks only (no class components)
- Custom hooks for business logic (e.g., `useCalculator`)
- CSS Modules or vanilla CSS — no utility-first frameworks
- Named exports preferred over default exports
- API client is a thin abstraction over `fetch()`

### General

- All code must be **cross-platform** (Windows, Linux, macOS)
- Use forward slashes in paths where possible
- Shell scripts must have both `.sh` (bash) and `.bat` (Windows) variants
- No hardcoded OS-specific paths

## API Contract

The backend exposes a single unified endpoint:

```
POST /api/calculate
Content-Type: application/json

{
  "operation": "add" | "subtract" | "multiply" | "divide" | "power" | "sqrt" | "percentage",
  "a": number,
  "b": number  // optional for sqrt
}

→ 200: { "result": number }
→ 400: { "error": "description" }
```

Health check: `GET /api/health → { "status": "ok" }`

## Testing

- **Backend**: `cd backend && go test ./... -v -cover`
- **Frontend**: `cd frontend && npm test`

## Running

- **Local**: Use `scripts/start-backend` and `scripts/start-frontend` (or IntelliJ/GoLand run configs)
- **Docker**: `docker-compose up --build`

## Key Design Decisions

1. **Single `/api/calculate` endpoint** rather than per-operation endpoints — reduces routing complexity, single request/response contract
2. **Pure calculator package** with zero dependencies — all math logic is isolated and trivially testable
3. **Custom `useCalculator` hook** encapsulates all state machine logic — components remain purely presentational
4. **No external Go frameworks** — standard library `net/http` is sufficient and avoids dependency bloat
5. **Vite proxy** in development to avoid CORS issues; explicit CORS middleware for production
