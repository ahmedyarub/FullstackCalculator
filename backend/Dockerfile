# ================================
# Stage 1: Build the Go binary
# ================================
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go.mod first for better layer caching.
COPY go.mod ./
RUN go mod download

# Copy source and build.
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /calculator-api ./cmd/server

# ================================
# Stage 2: Minimal runtime
# ================================
FROM alpine:3.19

RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /calculator-api .

EXPOSE 8080

ENV PORT=8080

ENTRYPOINT ["./calculator-api"]
