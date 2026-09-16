# Multi-stage Dockerfile for Hold Go Backend
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

# Copy module definitions
COPY go.mod go.sum* ./
RUN go mod download || true

# Copy backend source code
COPY . .

# Build static Go binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /app/server ./cmd/server/main.go

# Production runtime stage
FROM alpine:3.19

WORKDIR /app

# Install certificates and tzdata
RUN apk add --no-cache ca-certificates tzdata

# Copy binary from builder stage
COPY --from=builder /app/server /app/server
COPY --from=builder /app/migrations /app/migrations

# Expose HTTP API port
EXPOSE 8080

# Run server
ENTRYPOINT ["/app/server"]
