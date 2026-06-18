# Backend Specification

## Technology

- **Language**: Go 1.23+
- **Framework**: Standard library (`net/http`)
- **Port**: 8080 (configurable via `PORT` environment variable)

## Package Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── calculator/
│   │   ├── calculator.go        # Pure arithmetic functions
│   │   └── calculator_test.go   # Unit tests for all operations
│   ├── handler/
│   │   ├── handler.go           # HTTP request handlers
│   │   └── handler_test.go      # Integration tests using httptest
│   └── middleware/
│       └── cors.go              # CORS middleware
├── go.mod
└── go.sum
```

## Design Principles

### Separation of Concerns

1. **`calculator` package**: Pure functions with zero external dependencies. Each function takes numeric arguments and returns `(float64, error)`. No HTTP, no JSON, no side effects.

2. **`handler` package**: HTTP layer only. Responsibilities:
   - Parse JSON request bodies
   - Validate required fields
   - Delegate to `calculator` package
   - Format JSON responses
   - Set appropriate HTTP status codes

3. **`middleware` package**: Cross-cutting concerns (CORS). Applied as handler wrappers.

### Error Handling

- Calculator functions return typed errors for known conditions (division by zero, negative sqrt)
- Handlers map calculator errors to HTTP 400 responses
- Malformed requests return HTTP 400 with descriptive messages
- Unknown routes return HTTP 404
- The server logs errors to stdout

### Request/Response Types

```go
// CalculateRequest represents the incoming JSON body
type CalculateRequest struct {
    Operation string   `json:"operation"`
    A         *float64 `json:"a"`
    B         *float64 `json:"b,omitempty"`
}

// CalculateResponse represents a successful result
type CalculateResponse struct {
    Result float64 `json:"result"`
}

// ErrorResponse represents an error result
type ErrorResponse struct {
    Error string `json:"error"`
}
```

> **Note**: `A` and `B` are pointer types (`*float64`) to distinguish between "field not provided" (nil) and "field is zero" (0.0).

## Testing Strategy

- **Unit tests** (`calculator_test.go`): Table-driven tests covering:
  - All 7 operations with normal inputs
  - Edge cases: division by zero, sqrt of negative, large numbers, zero operands
  - Floating-point precision expectations

- **Integration tests** (`handler_test.go`): Using `httptest.NewRecorder()`:
  - Valid requests for each operation
  - Missing fields
  - Invalid JSON
  - Unknown operations
  - CORS headers verification

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP server listen port |

## Build & Run

```bash
# Development
cd backend
go run ./cmd/server

# Build binary
cd backend
go build -o bin/calculator-api ./cmd/server

# Run tests with coverage
cd backend
go test ./... -v -cover
```
