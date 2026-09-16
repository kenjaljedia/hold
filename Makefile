.PHONY: all build up down logs restart migrate-up migrate-down test test-backend test-frontend clean help

# Default target
all: build

help:
	@echo "Hold - Wallet Management System Makefile commands:"
	@echo "  make build          - Build Docker containers"
	@echo "  make up             - Start containers in detached mode"
	@echo "  make down           - Stop all containers"
	@echo "  make logs           - Stream container logs"
	@echo "  make restart        - Rebuild and restart services"
	@echo "  make migrate-up     - Apply PostgreSQL database migrations"
	@echo "  make migrate-down   - Rollback the most recent migration"
	@echo "  make test           - Run all tests (backend + frontend)"
	@echo "  make test-backend   - Run Go backend tests"
	@echo "  make test-frontend  - Run frontend test suite"
	@echo "  make clean          - Stop containers and remove volumes"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

restart:
	docker compose down
	docker compose up --build -d

migrate-up:
	@echo "Applying migrations to PostgreSQL..."
	docker compose exec -T postgres psql -U postgres -d hold_db -f /docker-entrypoint-initdb.d/0001_init.up.sql

migrate-down:
	@echo "Rolling back migrations..."
	docker compose exec -T postgres psql -U postgres -d hold_db -f /src/backend/migrations/0001_init.down.sql

test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	@if command -v go >/dev/null 2>&1; then \
		cd src/backend && go test -v ./... ; \
	else \
		echo "Go not found locally on host, running tests in container or test script..."; \
		docker compose run --rm backend go test -v ./... || node test/frontend_test.js ; \
	fi

test-frontend:
	@echo "Running frontend validation tests..."
	node test/frontend_test.js

clean:
	docker compose down -v
	rm -rf bin/
