# API Specification

## Base URL

- **Local Development**: `http://localhost:8080`
- **Docker**: `http://localhost:8080` (backend service)
- **Frontend Proxy**: `/api` → proxied to backend in dev mode

---

## Endpoints

### `GET /api/health`

Health check endpoint.

**Response** `200 OK`:
```json
{
  "status": "ok"
}
```

---

### `POST /api/calculate`

Perform an arithmetic operation.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "operation": "string",
  "a": "number",
  "b": "number (optional for unary operations)"
}
```

**Supported Operations**:

| Operation | Operands | Formula | Example |
|-----------|----------|---------|---------|
| `add` | a, b | a + b | `{"operation":"add","a":5,"b":3}` → `{"result":8}` |
| `subtract` | a, b | a − b | `{"operation":"subtract","a":10,"b":4}` → `{"result":6}` |
| `multiply` | a, b | a × b | `{"operation":"multiply","a":6,"b":7}` → `{"result":42}` |
| `divide` | a, b | a ÷ b | `{"operation":"divide","a":15,"b":3}` → `{"result":5}` |
| `power` | a, b | a^b | `{"operation":"power","a":2,"b":10}` → `{"result":1024}` |
| `sqrt` | a | √a | `{"operation":"sqrt","a":144}` → `{"result":12}` |
| `percentage` | a, b | (a/100) × b | `{"operation":"percentage","a":20,"b":50}` → `{"result":10}` |

**Success Response** `200 OK`:
```json
{
  "result": 42
}
```

**Error Response** `400 Bad Request`:
```json
{
  "error": "division by zero"
}
```

**Error Scenarios**:

| Scenario | Error Message |
|----------|--------------|
| Division by zero | `"division by zero"` |
| Square root of negative | `"square root of negative number"` |
| Unknown operation | `"unknown operation: xyz"` |
| Missing operand `a` | `"operand 'a' is required"` |
| Missing operand `b` (binary ops) | `"operand 'b' is required for operation: add"` |
| Malformed JSON | `"invalid request body"` |
| Invalid number (NaN, Inf) | `"invalid numeric value"` |

---

## cURL Examples

```bash
# Health check
curl http://localhost:8080/api/health

# Addition
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":5,"b":3}'

# Division (success)
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","a":10,"b":3}'

# Division by zero (error)
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","a":10,"b":0}'

# Square root
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"sqrt","a":144}'

# Percentage: 20% of 50
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"percentage","a":20,"b":50}'
```

---

## CORS

The backend sets the following headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Preflight `OPTIONS` requests are handled automatically.
