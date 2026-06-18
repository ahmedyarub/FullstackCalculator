// Package main is the entry point for the calculator API server.
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fullstack-calculator/backend/internal/handler"
	"github.com/fullstack-calculator/backend/internal/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", handler.Health)
	mux.HandleFunc("/api/calculate", handler.Calculate)

	// Wrap the mux with middleware: Logger → CORS → Handler.
	srv := middleware.Logger(middleware.CORS(mux))

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Calculator API server starting on %s", addr)
	if err := http.ListenAndServe(addr, srv); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
