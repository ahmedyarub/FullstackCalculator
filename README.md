# Fullstack Calculator

A full-stack calculator application with a **React (TypeScript)** frontend and **Go** backend microservice. The frontend consumes the backend REST API to perform basic and advanced arithmetic operations.

![Go](https://img.shields.io/badge/Go-1.23-00ADD8?logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [API Reference](#api-reference)
- [Testing](#testing)
- [IDE Run Configurations](#ide-run-configurations)
- [CI/CD](#cicd)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)

---

## Architecture

See [Architecture.md](docs/Architecture.md) for detailed diagrams.

```
┌──────────────┐       HTTP        ┌──────────────┐
│   React UI   │  ──── /api ────►  │   Go API     │
│  (Vite dev)  │   POST JSON       │  (net/http)  │
│  Port 5173   │  ◄──── JSON ───── │  Port 8080   │
└──────────────┘                   └──────────────┘
```

- **Frontend**: React + TypeScript SPA, built with Vite
- **Backend**: Go REST API using standard library only
- **Communication**: JSON over HTTP (`POST /api/calculate`)

---

## Features

| Category | Features |
|----------|----------|
| **Operations** | Addition, Subtraction, Multiplication, Division, Exponentiation, Square Root, Percentage |
| **Frontend** | Dark glassmorphism UI, responsive design, loading states, error display, keyboard-style layout |
| **Backend** | Input validation, edge case handling (div/0, √negative), JSON errors, CORS support |
| **DevOps** | Docker Compose, GitHub Actions CI/CD, cross-platform scripts |
| **Quality** | 54+ backend tests (86%+ coverage), 23 frontend tests, TypeScript strict mode, ESLint |

---

## Setup Instructions

### Prerequisites

| Tool | Version | Required For |
|------|---------|-------------|
| [Go](https://go.dev/dl/) | 1.23+ | Backend |
| [Node.js](https://nodejs.org/) | 20+ | Frontend |
| [Docker](https://www.docker.com/) | 24+ | Docker deployment (optional) |

### Clone the Repository

```bash
git clone https://github.com/your-username/FullstackCalculator.git
cd FullstackCalculator
```

---

## Running Locally

### Option 1: Shell Scripts

**Linux / macOS:**
```bash
# Start both backend and frontend
chmod +x scripts/*.sh
./scripts/start-all.sh

# Or start individually
./scripts/start-backend.sh   # Terminal 1
./scripts/start-frontend.sh  # Terminal 2
```

**Windows:**
```cmd
REM Start both backend and frontend
scripts\start-all.bat

REM Or start individually
scripts\start-backend.bat   REM Terminal 1
scripts\start-frontend.bat  REM Terminal 2
```

### Option 2: Manual

**Backend:**
```bash
cd backend
go run ./cmd/server
# Server starts on http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

### Option 3: IDE Run Configurations

See [IDE Run Configurations](#ide-run-configurations) below.

---

## Running with Docker

```bash
# Build and start both services
docker compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8080

# Stop
docker compose down
```

---

## API Reference

Full API specification: [docs/api-spec.md](docs/api-spec.md)

### Health Check

```bash
curl http://localhost:8080/api/health
# → {"status":"ok"}
```

### Calculate

```bash
# Addition: 5 + 3 = 8
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":5,"b":3}'
# → {"result":8}

# Division: 10 / 3 = 3.333...
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","a":10,"b":3}'
# → {"result":3.3333333333333335}

# Square Root: √144 = 12
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"sqrt","a":144}'
# → {"result":12}

# Percentage: 20% of 50 = 10
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"percentage","a":20,"b":50}'
# → {"result":10}

# Error: Division by zero
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","a":10,"b":0}'
# → {"error":"division by zero"} (HTTP 400)
```

### Supported Operations

| Operation | Operands | Formula |
|-----------|----------|---------|
| `add` | a, b | a + b |
| `subtract` | a, b | a − b |
| `multiply` | a, b | a × b |
| `divide` | a, b | a ÷ b |
| `power` | a, b | a^b |
| `sqrt` | a | √a |
| `percentage` | a, b | (a/100) × b |

---

## Testing

### Run All Tests

**Linux / macOS:**
```bash
./scripts/run-tests.sh
```

**Windows:**
```cmd
scripts\run-tests.bat
```

### Backend Tests

```bash
cd backend
go test ./... -v -cover
```

**Output:** 54 tests, 86.8% coverage on calculator package, 84.8% on handler package.

### Frontend Tests

```bash
cd frontend
npm test
```

**Output:** 23 tests across 2 test files (hook tests + component tests).

---

## IDE Run Configurations

Pre-configured IntelliJ / GoLand run configurations are included in `.idea/runConfigurations/`:

| Configuration | Description |
|--------------|-------------|
| **Backend (Go)** | Runs the Go API server on port 8080 |
| **Frontend (npm dev)** | Runs Vite dev server with HMR |
| **Backend Tests** | Runs all Go tests |
| **Frontend Tests (npm)** | Runs Vitest test suite |
| **Docker Compose** | Builds and runs docker-compose |

These appear automatically in IntelliJ IDEA and GoLand when you open the project.

---

## CI/CD

### Automatic (on push/PR to main)

**`.github/workflows/ci.yml`** runs:
1. Backend: Go test with coverage
2. Frontend: TypeScript check → ESLint → Vitest → Production build
3. Docker: Compose build + health check verification

### Manual Deploy (workflow_dispatch)

**`.github/workflows/deploy.yml`** deploys to an imaginary AWS account:
- Targets: **staging** or **production** (selectable)
- Builds and pushes Docker images to ECR
- Updates ECS services with new task definitions
- Waits for deployment stability

---

## Project Structure

```
FullstackCalculator/
├── backend/                          # Go microservice
│   ├── cmd/server/main.go           #   Server entry point
│   ├── internal/
│   │   ├── calculator/              #   Pure math functions + tests
│   │   ├── handler/                 #   HTTP handlers + tests
│   │   └── middleware/              #   CORS middleware
│   ├── Dockerfile
│   └── go.mod
├── frontend/                         # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/calculator.ts        #   API client
│   │   ├── components/              #   Calculator, Display, Keypad, Button
│   │   ├── hooks/useCalculator.ts   #   State machine hook
│   │   ├── types/index.ts           #   Shared types
│   │   └── __tests__/               #   Test files
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── scripts/                          # Cross-platform startup scripts
│   ├── start-backend.sh/.bat
│   ├── start-frontend.sh/.bat
│   ├── start-all.sh/.bat
│   └── run-tests.sh/.bat
├── docs/                             # Documentation
│   ├── Architecture.md              #   Mermaid diagrams
│   ├── api-spec.md                  #   API specification
│   ├── backend-spec.md              #   Backend spec
│   └── frontend-spec.md            #   Frontend spec
├── .github/
│   ├── workflows/ci.yml            #   CI pipeline
│   ├── workflows/deploy.yml        #   Manual deploy to AWS
│   └── copilot-instructions.md     #   AI coding instructions
├── .idea/runConfigurations/          # IDE run configs
├── AGENTS.md                         # AI agent instructions
├── docker-compose.yml
└── README.md
```

---

## Design Decisions

### Architecture

| Decision | Rationale |
|----------|-----------|
| **Single `/api/calculate` endpoint** | Simpler than per-operation endpoints. One request/response contract to validate and test. Easy to extend with new operations. |
| **Pure `calculator` package** | Zero dependencies, zero side effects. The math logic is completely isolated from HTTP concerns, making it trivially testable. |
| **Standard library `net/http`** | For an API this size, external frameworks add complexity without proportional benefit. No dependency management overhead. |
| **Custom `useCalculator` hook** | All state machine logic in one place. Components remain purely presentational. No need for Redux/Zustand for this scope. |
| **Pointer types for operands** | `*float64` in the request struct distinguishes "field not provided" (nil) from "field is zero" (0.0), preventing ambiguous validation. |

### Frontend

| Decision | Rationale |
|----------|-----------|
| **Vite** | Fastest dev server with native TypeScript support and simple proxy config for API calls. |
| **Vanilla CSS** | Full control over the design. No build-time overhead. CSS custom properties provide a design token system. |
| **Glassmorphism dark theme** | Modern, premium aesthetic. High contrast for readability. Ambient orb animations add depth without distracting. |
| **API calls for every operation** | Ensures the frontend is a thin client. All computation happens server-side, matching the requirement of backend-driven calculations. |

### DevOps

| Decision | Rationale |
|----------|-----------|
| **Multi-stage Docker builds** | Minimal final images. Build tools don't ship to production. |
| **Docker Compose with health checks** | Frontend waits for backend to be healthy before starting. |
| **Cross-platform scripts** | Both `.sh` (Linux/macOS) and `.bat` (Windows) variants ensure the project works everywhere. |
| **IDE run configurations** | Lower barrier to entry for developers using IntelliJ/GoLand. One-click run. |

---

## AI Tooling Prompts

This project was built using spec-driven development with AI assistance. Key prompts used:

1. **Initial scaffold**: "Build a full-stack calculator with React frontend and Go backend following spec-driven development..."
2. **Architecture docs**: "Create architectural MD file with Mermaid diagrams"
3. **AI agent files**: "Create spec files used by AI agents, add AGENTS.md and copilot instructions"
4. **CI/CD**: "Create GitHub Actions CI/CD with auto tests and manual AWS deploy"
5. **Cross-platform**: "Add shell scripts and ensure Windows/Linux/macOS compatibility"

See [AGENTS.md](AGENTS.md) for AI agent instructions and coding standards used throughout.
