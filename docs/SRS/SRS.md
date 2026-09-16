# Software Requirements Specification (SRS)
## Project Name: Hold (Wallet Management System)
**Document Version:** 1.0.0  
**Status:** Under Development  
**Academic Batch:** 2026-27 IT-B  
**Project Reference:** Inspired by Fold Money ([fold.money](https://fold.money/))

---

### Project Team Members
1. **Garv Aditya Shandilya** (Roll No: `2400290130077`)
2. **Ishan Gupta** (Roll No: `2400290130091`)
3. **Kenjal Jedia** (Roll No: `2400290130101`)
4. **Rudraksh Sharma** (Roll No: `2400290130147`)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to provide a complete and formal Software Requirements Specification (SRS) for **Hold**, a privacy-centric personal wallet and wealth management system. This document outlines the functional and non-functional requirements, user interaction flows, data models, and architectural constraints governing the frontend (React Native / Expo), backend (Go REST API), and database tier (PostgreSQL).

### 1.2 Scope
Traditional expense trackers rely on invasive methods such as parsing private SMS inboxes, scraping email accounts, or demanding tedious manual data entry. **Hold** solves this by offering a unified, privacy-first financial dashboard inspired by **Fold Money**. It enables users to:
* Aggregate multiple bank accounts, digital wallets, and credit cards.
* Track real-time consolidated net worth and balance trends.
* Automatically categorize transactions into meaningful spending groups without invasive access permissions.
* Inspect cash flow dynamics (inflows vs. outflows) and budget consumption.
* Query their financial history via an embedded natural language assistant (**Hold AI**).
* Secure their data using client-side balance masking (Privacy Mode) and field-level encryption.

### 1.3 Definitions, Acronyms, and Abbreviations
* **AA:** Account Aggregator (RBI-regulated consent framework for financial data sharing).
* **PII:** Personally Identifiable Information.
* **REST:** Representational State Transfer.
* **JWT:** JSON Web Token.
* **RBAC:** Role-Based Access Control.
* **SRS:** Software Requirements Specification.
* **UPI:** Unified Payments Interface.

---

## 2. Overall Description

### 2.1 Product Perspective
Hold is an autonomous multi-tier application comprising:
1. **Mobile / Web Client (React Native & Expo):** Cross-platform user interface rendering interactive charts, account cards, searchable feeds, and privacy controls.
2. **Core API Server (Go):** High-throughput, concurrent microservice handling financial math, aggregation, search, authentication, and AI-assisted financial query parsing.
3. **Relational Database (PostgreSQL):** ACID-compliant persistent storage with indexed foreign keys, constraints, and audit trails.

### 2.2 User Personas
* **Working Professional:** Holds multiple salary and savings accounts (e.g., HDFC, ICICI, SBI), wants a single consolidated net worth view without manual spreadsheets.
* **Budget-Conscious Student/Freelancer:** Needs instant feedback on category limits (Food, Transit, Subscriptions) and quick cash flow insights.
* **Privacy Advocate:** Demands zero email/SMS scraping permissions and requires on-demand screen blurring when checking balances in public spaces.

### 2.3 Operating Environment
* **Mobile Platforms:** iOS 15.0+, Android 10.0+ via Expo Runtime.
* **Web Browsers:** Chrome, Safari, Firefox, Edge (via React Native Web).
* **Server Environment:** Linux Docker containers, Go 1.22 runtime.
* **Database:** PostgreSQL 16 on Docker named volume.

---

## 3. System Features & Functional Requirements

### 3.1 FR-1: Multi-Account & Wallet Aggregation
* **FR-1.1:** The system shall allow users to connect multiple bank accounts (e.g., State Bank of India, HDFC Bank, ICICI Bank, Axis Bank), digital wallets, and investment balances.
* **FR-1.2:** Account cards must display masked account numbers (`•••• 4091`), current ledger balance, available balance, bank identifiers, and IFSC codes.
* **FR-1.3:** The system shall support one-click copy of account and routing numbers.

### 3.2 FR-2: Real-Time Net Worth & Trend Visualizer
* **FR-2.1:** The system shall compute total net worth dynamically across all active accounts:
  $$\text{Net Worth} = \sum \text{Savings Balances} + \sum \text{Investments} - \sum \text{Credit Dues}$$
* **FR-2.2:** The dashboard shall provide interactive timeframe selection (`1W`, `1M`, `3M`, `1Y`, `ALL`) updating sparkline trend visualizations.
* **FR-2.3:** A percentage change indicator must display growth or decline relative to the start of the selected timeframe.

### 3.3 FR-3: Transaction Engine, Search & Tagging
* **FR-3.1:** The system shall log both credit (inflow) and debit (outflow) transactions with millisecond timestamps, merchant name, category ID, and linked account ID.
* **FR-3.2:** The transaction feed must provide instant client-side and server-side search by merchant name, category, or notes.
* **FR-3.3:** Quick filter chips must allow segmenting transactions by `All`, `Incoming`, `Outgoing`, `Today`, `This Week`, and `This Month`.
* **FR-3.4:** Users can attach custom tags (e.g., `#Personal`, `#Work`, `#Vacation`, `#Reimbursable`) and notes to any transaction.

### 3.4 FR-4: Cash Flow & Category Intelligence
* **FR-4.1:** The system shall compute monthly cash flow:
  $$\text{Net Savings} = \text{Total Income} - \text{Total Expenses}$$
* **FR-4.2:** The system shall render category spending distributions (Food & Dining, Shopping, Travel, Bills, Entertainment, Investments).
* **FR-4.3:** Budget progress bars shall indicate current spend vs allocated ceiling with warning states (Yellow > 80%, Red > 100%).

### 3.5 FR-5: Hold AI Financial Assistant
* **FR-5.1:** The app shall include an integrated AI chat interface capable of parsing user queries against their financial records.
* **FR-5.2:** Supported queries include:
  * Spend breakdowns: *"How much did I spend on groceries this month?"*
  * Affordability queries: *"Can I afford a ₹15,000 gadget this week?"*
  * Recurring bill checks: *"What subscriptions are due next week?"*
* **FR-5.3:** Pre-configured suggestion chips shall allow one-tap execution of frequent queries.

### 3.6 FR-6: Privacy Mode & Security
* **FR-6.1:** A global "Privacy Eye" toggle must immediately mask all monetary values with `₹ •••••` across all cards, graphs, and transaction lists.
* **FR-6.2:** All sensitive payload data transferred between client and backend shall use TLS 1.3 encryption.
* **FR-6.3:** Passwords and authentication tokens must be hashed using bcrypt and signed with JWT.

### 3.7 FR-7: Statement Generation & Export
* **FR-7.1:** Users can export account statements filtered by date ranges in CSV and PDF formats.
* **FR-7.2:** Optional password protection on exported financial statement files.

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
* **Response Time:** Backend REST API endpoints must respond in $< 100\text{ ms}$ for standard queries under normal loads.
* **Frontend Rendering:** Smooth 60fps animations on mobile transitions, list scrolling, and modal sheets.
* **Database Query Performance:** All queries on transactions and accounts must utilize foreign key and composite indexes.

### 4.2 Security Requirements
* Zero third-party data selling or tracking.
* No SMS reading permissions requested.
* No email inbox scraping permissions requested.
* Environment secrets (database credentials, JWT keys) managed strictly via `.env` and environment variables.

### 4.3 Reliability & Availability
* Graceful fallback to cached/offline state when network connectivity is disrupted.
* PostgreSQL database persistence guaranteed via named Docker volumes.
* Idempotent database migrations.

---

## 5. Architectural Verification & Acceptance Criteria
1. The backend compiles cleanly in Go and boots within the Docker Compose network.
2. PostgreSQL tables initialize automatically on fresh container startup via `0001_init.up.sql`.
3. The React Native frontend builds and launches without runtime crashes on Web and Mobile.
4. All unit tests pass during `make test`.
