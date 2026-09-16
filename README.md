# Hold
## Project Description
**Hold** is a next-generation wallet and personal finance management system designed for effortless, privacy-focused financial awareness, inspired by **Fold Money** ([fold.money](https://fold.money/)).

The system provides users with a clean, unified view of their entire financial footprint—aggregating bank accounts, wallets, credit cards, and investments—without requiring manual expense entry or invasive email/SMS scraping. With real-time net worth tracking, automated transaction categorization, cash flow intelligence, proactive budget management, and an intelligent financial assistant (**Hold AI**), Hold empowers users to be painfully aware of their financial trajectory and build sustainable wealth habits.

Hold focuses on **security, privacy-first design, high performance, concurrency, and delightful user experience**.

## Key Features
* **Unified Account Aggregation** — Connect and consolidate multiple bank accounts, wallets, and credit cards into a single real-time dashboard.
* **Real-time Net Worth & Trend Tracking** — Dynamic net worth computation with interactive timeframe charts (1W, 1M, 3M, 1Y, All).
* **Automated Smart Categorization** — Automatic merchant detection and expense tagging without invasive email or SMS scraping.
* **Cash Flow & Analytics Engine** — Comprehensive inflow vs. outflow visual breakdowns, category spending distributions, and predictive burn-rate metrics.
* **Instant Search & Deep Filtering** — Sub-second fuzzy search across transactions with multi-criteria filters (merchant, tags, amount range, incoming/outgoing).
* **Hold AI Financial Assistant** — Context-aware AI assistant to answer questions like *"How much did I spend on dining out this month?"* or *"Can I afford a ₹15,000 trip?"*.
* **Privacy Mode & Security** — One-tap privacy eye toggle to obscure sensitive balances, biometric/PIN access lock, and AES-256 encrypted sensitive fields.
* **Bank Statement Exporter** — Instant PDF/CSV statement generation with password protection and custom date range filters.
* **High-Performance Go Backend** — Concurrent transaction processing and analytical aggregation powered by Go.

## Team Members
1. Garv Aditya Shandilya (2400290130077)
2. Ishan Gupta (2400290130091)
3. Kenjal Jedia (2400290130101)
4. Rudraksh Sharma (2400290130147)

## Technologies
### Frontend
* React Native
* Expo Framework
* TypeScript
* React Navigation
* Lucide Icons (Lucide React Native)
* SVG Micro-Charts

### Backend
* Go (Golang)
* Go HTTP Server / RESTful API
* Go Concurrency (Goroutines & Channels)
* Gorilla Mux / Standard HTTP Routing

### Database
* PostgreSQL
* SQL Migrations (Up/Down)
* Connection Pooling

### Security
* Field-Level Data Encryption
* JWT Authentication & Secure Session Management
* Zero Invasive Scraping (RBI Account Aggregator architecture principles)
* Client-Side Balance Masking (Privacy Mode)

## Requirements
The following tools are required to run the project:
* Docker
* Docker Compose
* Git

For local development without Docker, the following may also be required:
* Go (v1.22+)
* Node.js (v18+)
* npm / pnpm
* PostgreSQL (v15+)

## Project Structure
```
hold/
│
├── README.md
├── Makefile
├── docker-compose.yaml
│
├── docs/
│   ├── SRS/
│   │   └── SRS.md
│   └── UML/
│       ├── system_architecture.md
│       ├── database_schema.md
│       ├── sequence_diagram.md
│       └── use_case_diagram.md
│
├── src/
│   ├── frontend/
│   │   ├── App.tsx
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── components/
│   │       ├── navigation/
│   │       ├── screens/
│   │       ├── services/
│   │       ├── theme/
│   │       └── types/
│   │
│   └── backend/
│       ├── cmd/
│       │   └── server/
│       │       └── main.go
│       ├── handlers/
│       ├── models/
│       ├── migrations/
│       │   ├── 0001_init.up.sql
│       │   └── 0001_init.down.sql
│       ├── .env.example
│       ├── Dockerfile
│       └── go.mod
│
├── test/
│   ├── backend_test.go
│   └── frontend_test.js
│
└── .gitignore
```

## Docker Compose Usage
The project uses Docker Compose to run the complete application backend and database stack:
```
Frontend (React Native / Web)
       ↓
Backend (Go REST API)
       ↓
PostgreSQL Database
```

From the project root, build and start all services:
* `docker compose up --build`

To run the services in the background:
* `docker compose up --build -d`

To stop the services:
* `docker compose down`

To stop the services without removing the PostgreSQL data volume:
* `docker compose down`

The PostgreSQL data is stored in a named Docker volume (`hold_pgdata`) so that database data persists when containers are recreated.

## Useful Tips-->
The applications can be accessed locally at:
* Frontend (Metro / Web): http://localhost:8081 or http://localhost:19006
* Backend REST API: http://localhost:8080
* PostgreSQL: localhost:5432

API Health Endpoint:
* http://localhost:8080/api/health

## Database Migrations
Hold uses structured SQL database migration files to manage changes to the PostgreSQL database schema.
The current migration structure initializes all required relational tables including `users`, `accounts`, `categories`, `transactions`, `budgets`, and `audit_logs`.

Migration commands are provided through the project Makefile:
* Apply pending migrations:
  `make migrate-up`
* Rollback the most recent migration:
  `make migrate-down`
* Migration files are located at:
  `src/backend/migrations/`

## Fresh Clone Flow -->
A new developer can set up the project using the following steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/kenjaljedia/hold.git
   cd hold
   ```

2. Configure environment secrets:
   ```bash
   cp src/backend/.env.example src/backend/.env
   ```
   Update any optional custom configuration in `src/backend/.env`.

3. Start backend services:
   ```bash
   docker compose up --build
   ```

4. Launch the React Native Frontend:
   ```bash
   cd src/frontend
   pnpm install  # or npm install
   npx expo start
   ```
   * Press `w` to open in browser (Web mode)
   * Scan the QR code using **Expo Go** on iOS or Android

After the containers start:
* Frontend → http://localhost:8081 (or http://localhost:19006)
* Backend → http://localhost:8080
* Database → localhost:5432

## Troubleshooting
* **Check running containers**
  ```bash
  docker compose ps
  ```
* **View service logs**
  ```bash
  docker compose logs
  ```
* **View backend logs:**
  ```bash
  docker compose logs backend
  ```
* **View PostgreSQL logs:**
  ```bash
  docker compose logs postgres
  ```
* **Rebuild containers**
  If changes are not reflected:
  ```bash
  docker compose up --build
  ```
* **PostgreSQL is not ready**
  Check PostgreSQL health/status:
  ```bash
  docker compose ps
  ```
  The backend depends on PostgreSQL passing its health check before accepting traffic.
* **Stop and recreate containers**
  ```bash
  docker compose down
  docker compose up --build
  ```
  *(If you need to completely reset the development database, run `docker compose down -v`. This permanently deletes the stored database data volume, so use this only when a fresh database reset is intended).*

## Why We Use Docker Compose
Dockerfiles define how individual container images are built, but they do not manage multiple containers together.

Hold comprises multiple coordinated services:
* PostgreSQL 16 Database
* Go Concurrent Backend API
* React Native Frontend

Without Docker Compose, developers would have to manually create Docker networks, run containers one-by-one, configure environment variables, port mappings, volumes, and service startup order dependencies.

With Docker Compose, the entire development stack is declared in one `docker-compose.yaml` file and started with a single command:
```bash
docker compose up --build
```

**Dockerfile = builds one container image**  
**Docker Compose = runs, links, and manages multiple services together**

## Goals
The primary goals of Hold are to:
1. Provide a **privacy-first personal finance platform** without invasive SMS or email scraping.
2. Deliver a unified, **real-time overview of net worth and multi-bank balances**.
3. Offer deep **cash flow analytics and automatic transaction categorization**.
4. Deliver **Hold AI**, an intelligent in-app personal finance assistant.
5. Provide a **high-performance, concurrent Go backend** designed to scale.
6. Provide an elegant, delightful mobile experience inspired by Fold Money.

## Status
**Under Development**  
Team Members:
* Garv Aditya Shandilya (2400290130077)
* Ishan Gupta (2400290130091)
* Kenjal Jedia (2400290130101)
* Rudraksh Sharma (2400290130147)
