package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealth(t *testing.T) {
	t.Run("GET returns ok", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
		w := httptest.NewRecorder()

		Health(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}

		var resp HealthResponse
		if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}
		if resp.Status != "ok" {
			t.Errorf("status = %q, want %q", resp.Status, "ok")
		}
	})

	t.Run("POST returns method not allowed", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/health", nil)
		w := httptest.NewRecorder()

		Health(w, req)

		if w.Code != http.StatusMethodNotAllowed {
			t.Errorf("status = %d, want %d", w.Code, http.StatusMethodNotAllowed)
		}
	})
}

func TestCalculate(t *testing.T) {
	// Helper to build a request body.
	makeBody := func(op string, a *float64, b *float64) *bytes.Buffer {
		body := map[string]interface{}{"operation": op}
		if a != nil {
			body["a"] = *a
		}
		if b != nil {
			body["b"] = *b
		}
		data, _ := json.Marshal(body)
		return bytes.NewBuffer(data)
	}

	fp := func(v float64) *float64 { return &v }

	tests := []struct {
		name       string
		method     string
		body       *bytes.Buffer
		wantStatus int
		wantResult *float64
		wantError  string
	}{
		{
			name:       "addition",
			method:     http.MethodPost,
			body:       makeBody("add", fp(5), fp(3)),
			wantStatus: http.StatusOK,
			wantResult: fp(8),
		},
		{
			name:       "subtraction",
			method:     http.MethodPost,
			body:       makeBody("subtract", fp(10), fp(4)),
			wantStatus: http.StatusOK,
			wantResult: fp(6),
		},
		{
			name:       "multiplication",
			method:     http.MethodPost,
			body:       makeBody("multiply", fp(6), fp(7)),
			wantStatus: http.StatusOK,
			wantResult: fp(42),
		},
		{
			name:       "division",
			method:     http.MethodPost,
			body:       makeBody("divide", fp(15), fp(3)),
			wantStatus: http.StatusOK,
			wantResult: fp(5),
		},
		{
			name:       "power",
			method:     http.MethodPost,
			body:       makeBody("power", fp(2), fp(10)),
			wantStatus: http.StatusOK,
			wantResult: fp(1024),
		},
		{
			name:       "sqrt",
			method:     http.MethodPost,
			body:       makeBody("sqrt", fp(144), nil),
			wantStatus: http.StatusOK,
			wantResult: fp(12),
		},
		{
			name:       "percentage",
			method:     http.MethodPost,
			body:       makeBody("percentage", fp(20), fp(50)),
			wantStatus: http.StatusOK,
			wantResult: fp(10),
		},
		{
			name:       "division by zero",
			method:     http.MethodPost,
			body:       makeBody("divide", fp(5), fp(0)),
			wantStatus: http.StatusBadRequest,
			wantError:  "division by zero",
		},
		{
			name:       "sqrt negative",
			method:     http.MethodPost,
			body:       makeBody("sqrt", fp(-4), nil),
			wantStatus: http.StatusBadRequest,
			wantError:  "square root of negative number",
		},
		{
			name:       "unknown operation",
			method:     http.MethodPost,
			body:       makeBody("modulo", fp(5), fp(3)),
			wantStatus: http.StatusBadRequest,
			wantError:  "unknown operation",
		},
		{
			name:       "missing operation",
			method:     http.MethodPost,
			body:       makeBody("", fp(5), fp(3)),
			wantStatus: http.StatusBadRequest,
			wantError:  "operation is required",
		},
		{
			name:       "missing operand a",
			method:     http.MethodPost,
			body:       makeBody("add", nil, fp(3)),
			wantStatus: http.StatusBadRequest,
			wantError:  "operand 'a' is required",
		},
		{
			name:       "missing operand b for binary op",
			method:     http.MethodPost,
			body:       makeBody("add", fp(5), nil),
			wantStatus: http.StatusBadRequest,
			wantError:  "operand 'b' is required",
		},
		{
			name:       "invalid JSON",
			method:     http.MethodPost,
			body:       bytes.NewBufferString("{invalid}"),
			wantStatus: http.StatusBadRequest,
			wantError:  "invalid request body",
		},
		{
			name:       "wrong HTTP method",
			method:     http.MethodGet,
			body:       makeBody("add", fp(5), fp(3)),
			wantStatus: http.StatusMethodNotAllowed,
			wantError:  "method not allowed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/api/calculate", tt.body)
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			Calculate(w, req)

			if w.Code != tt.wantStatus {
				t.Errorf("status = %d, want %d, body = %s", w.Code, tt.wantStatus, w.Body.String())
			}

			if tt.wantResult != nil {
				var resp CalculateResponse
				if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}
				if resp.Result != *tt.wantResult {
					t.Errorf("result = %v, want %v", resp.Result, *tt.wantResult)
				}
			}

			if tt.wantError != "" {
				var resp ErrorResponse
				if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
					t.Fatalf("failed to decode error response: %v", err)
				}
				if !strings.Contains(resp.Error, tt.wantError) {
					t.Errorf("error = %q, want to contain %q", resp.Error, tt.wantError)
				}
			}
		})
	}
}
