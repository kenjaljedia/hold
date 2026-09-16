# System Architecture Diagram

This document illustrates the high-level architecture of **Hold**, highlighting the interactions between the cross-platform React Native frontend, the Go REST API backend, and the PostgreSQL database.

```mermaid
graph TD
    subgraph Client Tier ["Client Tier (Mobile & Web)"]
        UI["React Native / Expo App"]
        Store["State & Cache Layer"]
        UI --> Store
    end

    subgraph Gateway ["Network & Security Layer"]
        CORS["CORS & Request Middleware"]
        Auth["JWT Token Validator"]
    end

    subgraph Backend Tier ["Backend Tier (Go REST API)"]
        Router["HTTP Router / Mux"]
        
        subgraph Handlers ["REST Controllers"]
            H_Account["Account Handler"]
            H_Tx["Transaction Handler"]
            H_Analytics["Analytics & Cash Flow Handler"]
            H_AI["Hold AI Assistant Handler"]
        end

        subgraph Core Engine ["Core Financial Engines"]
            Calc["Net Worth & Trend Calculator"]
            Categorizer["Rule-Based Transaction Categorizer"]
            QueryEngine["AI Spending Query Engine"]
        end
    end

    subgraph Data Tier ["Data Tier (PostgreSQL 16)"]
        DB[(PostgreSQL Database)]
        V_Accounts[("accounts table")]
        V_Tx[("transactions table")]
        V_Cat[("categories table")]
        V_Budgets[("budgets table")]
        
        DB --- V_Accounts
        DB --- V_Tx
        DB --- V_Cat
        DB --- V_Budgets
    end

    UI -->|"HTTPS / REST JSON"| CORS
    CORS --> Auth
    Auth --> Router
    Router --> H_Account
    Router --> H_Tx
    Router --> H_Analytics
    Router --> H_AI

    H_Account --> Calc
    H_Tx --> Categorizer
    H_Analytics --> Calc
    H_AI --> QueryEngine

    Calc -->|"SQL (pgx / database/sql)"| DB
    Categorizer -->|"SQL"| DB
    QueryEngine -->|"SQL"| DB
```

### Architectural Highlights
* **Client Tier:** Built with React Native and Expo for unified iOS, Android, and Web rendering. Implements optimistic updates, client-side balance privacy masking, and offline caching.
* **Backend Tier:** High-concurrency Go REST API leveraging goroutines for computing multi-account balance rollups and analytical series in parallel.
* **Data Tier:** Relational PostgreSQL schema with foreign keys, cascading constraints, and compound B-tree indexes on `(user_id, transaction_date)`.
