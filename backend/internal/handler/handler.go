// Package handler provides HTTP request handlers for the calculator API.
package handler

import (
	"encoding/json"
	"log"
	"math"
	"net/http"

	"github.com/fullstack-calculator/backend/internal/calculator"
)

// CalculateRequest represents the JSON body of a calculation request.
type CalculateRequest struct {
	Operation string   `json:"operation"`
	A         *float64 `json:"a"`
	B         *float64 `json:"b,omitempty"`
}

// CalculateResponse represents a successful calculation result.
type CalculateResponse struct {
	Result float64 `json:"result"`
}

// ErrorResponse represents an error response.
type ErrorResponse struct {
	Error string `json:"error"`
}

// HealthResponse represents the health check response.
type HealthResponse struct {
	Status string `json:"status"`
}

// writeJSON writes a JSON response with the given status code.
func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("error encoding response: %v", err)
	}
}

// writeError writes a JSON error response.
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, ErrorResponse{Error: message})
}

// Health handles GET /api/health requests.
func Health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, http.StatusOK, HealthResponse{Status: "ok"})
}

// Calculate handles POST /api/calculate requests.
func Calculate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var req CalculateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// Validate operation field.
	if req.Operation == "" {
		writeError(w, http.StatusBadRequest, "operation is required")
		return
	}

	// Validate operand 'a'.
	if req.A == nil {
		writeError(w, http.StatusBadRequest, "operand 'a' is required")
		return
	}

	// Check for NaN/Inf in input values.
	if math.IsNaN(*req.A) || math.IsInf(*req.A, 0) {
		writeError(w, http.StatusBadRequest, "invalid numeric value for 'a'")
		return
	}
	if req.B != nil && (math.IsNaN(*req.B) || math.IsInf(*req.B, 0)) {
		writeError(w, http.StatusBadRequest, "invalid numeric value for 'b'")
		return
	}

	result, err := calculator.Calculate(req.Operation, *req.A, req.B)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, CalculateResponse{Result: result})
}
