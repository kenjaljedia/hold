# Database Schema & Entity-Relationship (ER) Diagram

This document describes the relational database schema implemented in **Hold** for PostgreSQL.

```mermaid
erDiagram
    USERS ||--o{ ACCOUNTS : owns
    USERS ||--o{ TRANSACTIONS : executes
    USERS ||--o{ BUDGETS : defines
    USERS ||--o{ AUDIT_LOGS : records
    ACCOUNTS ||--o{ TRANSACTIONS : contains
    CATEGORIES ||--o{ TRANSACTIONS : classifies
    CATEGORIES ||--o{ BUDGETS : monitors

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string currency
        boolean privacy_mode_default
        timestamp created_at
        timestamp updated_at
    }

    ACCOUNTS {
        uuid id PK
        uuid user_id FK
        string institution_name
        string account_type
        string account_number_masked
        string ifsc_code
        decimal current_balance
        decimal available_balance
        string currency
        string logo_url
        boolean is_active
        timestamp last_synced_at
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        string name
        string icon_name
        string color_hex
        string category_type
        timestamp created_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        uuid account_id FK
        uuid category_id FK
        string merchant_name
        decimal amount
        string transaction_type
        string description
        string[] tags
        string receipt_url
        timestamp transaction_date
        timestamp created_at
    }

    BUDGETS {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        decimal monthly_limit
        decimal current_spent
        string period_month
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        jsonb metadata
        timestamp created_at
    }
```

### Table Specifications

#### 1. `users`
Stores authenticated user profiles, preferences, and default display currency.

#### 2. `accounts`
Represents individual bank accounts (e.g. HDFC, SBI), credit cards, investment portfolios, or cash reserves. `account_number_masked` ensures sensitive banking digits are never stored in raw plaintext.

#### 3. `categories`
Standardized transaction classifications (e.g. Food & Drinks, Travel, Bills & Utilities, Shopping, Investment, Salary).

#### 4. `transactions`
Double-entry or ledger-level transactions tagged by account, category, merchant, and user-defined tags. Compound index on `(user_id, transaction_date DESC)` ensures instantaneous feed scrolling.

#### 5. `budgets`
Tracks monthly category ceilings and current burn rate for proactive alerting.

#### 6. `audit_logs`
Logs critical modifications, export requests, and authentication events for transparency and audit compliance.
