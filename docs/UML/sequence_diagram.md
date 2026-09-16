# Sequence Diagrams

This document illustrates the sequential interaction flows for core workflows in **Hold**.

---

## 1. Bank Account Linking & Balance Sync Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (App)
    participant Client as React Native Client
    participant API as Go REST API
    participant AA as Account Aggregator Gateway
    participant Bank as Financial Institution (e.g. HDFC/SBI)
    participant DB as PostgreSQL Database

    User->>Client: Select "Link Bank Account" & choose Bank
    Client->>API: POST /api/accounts/link-intent { bank_id: "HDFC" }
    API->>AA: Initiate Consent Request
    AA-->>API: Return Consent Handle & OTP Challenge
    API-->>Client: Prompt User for OTP Consent
    User->>Client: Enters OTP & Confirms Consent
    Client->>API: POST /api/accounts/verify-consent { otp: "123456" }
    API->>AA: Validate OTP Consent
    AA->>Bank: Request Encrypted Financial Artifact
    Bank-->>AA: Encrypted Financial Record
    AA-->>API: Deliver Account Metadata & Initial Balances
    API->>DB: INSERT INTO accounts (user_id, masked_acc, balance)
    API->>DB: INSERT INTO transactions (initial historical batches)
    API-->>Client: 201 Created { account_id, balance }
    Client-->>User: Display newly linked Account Card & Updated Net Worth
```

---

## 2. Real-Time Net Worth & Analytical Query Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (App)
    participant Client as React Native Client
    participant API as Go REST API
    participant DB as PostgreSQL Database

    User->>Client: Opens Dashboard / Switches Timeframe to "1M"
    Client->>API: GET /api/analytics/networth?period=1M
    Note over API: Concurrently fetch account balances and historical deltas
    par Fetch Current Balances
        API->>DB: SELECT SUM(current_balance) FROM accounts WHERE user_id = $1
    and Fetch Timeframe Snapshots
        API->>DB: SELECT transaction_date, amount, transaction_type FROM transactions WHERE user_id = $1 AND transaction_date >= NOW() - INTERVAL '30 days'
    end
    Note over API: Compute sparkline datapoints & growth % in Go
    API-->>Client: 200 OK { net_worth, delta_pct, sparkline_points }
    Client-->>User: Render animated Net Worth Sparkline & Summary
```

---

## 3. Hold AI Financial Query Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (App)
    participant Client as React Native Client
    participant API as Go REST API
    participant AI as Hold AI Financial Engine
    participant DB as PostgreSQL Database

    User->>Client: Types "How much did I spend on Food this month?"
    Client->>API: POST /api/ai/query { prompt: "..." }
    API->>AI: Parse Intent & Extract Entities (Category="Food", Window="Current Month")
    AI->>DB: Query aggregated spend for category within date range
    DB-->>AI: Total spend: ₹14,280 across 23 transactions
    AI->>AI: Generate natural language summary with comparison to previous month
    AI-->>API: Synthesized Response & Actionable Insights
    API-->>Client: 200 OK { answer, total_amount, category, count }
    Client-->>User: Display interactive AI Chat bubble with insight pills
```
