# Use Case Diagram

This document specifies the primary use cases and actor interactions for **Hold**.

```mermaid
flowchart LR
    User(["Authenticated User"])
    Admin(["System Administrator"])

    subgraph App ["Hold - Wallet Management Platform"]
        UC1(["Link Bank Account via AA"])
        UC2(["View Consolidated Net Worth"])
        UC3(["Inspect Cash Flow Analytics"])
        UC4(["Search & Filter Transactions"])
        UC5(["Create / Categorize Transaction"])
        UC6(["Toggle Privacy Mode (Mask Balances)"])
        UC7(["Query Hold AI Assistant"])
        UC8(["Export Financial Statements"])
        UC9(["Manage Budgets & Spending Limits"])
        UC10(["Audit & Security Logging"])
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9

    Admin --> UC10
    Admin --> UC2
```

### Key Use Cases
* **UC1 - Link Bank Account via AA:** Connect institution using consent OTP without handing over bank login passwords.
* **UC2 - View Consolidated Net Worth:** Real-time ledger calculation across all cash, bank, credit, and investment accounts.
* **UC6 - Toggle Privacy Mode:** Instant client-side masking of all financial numbers for privacy in public areas.
* **UC7 - Query Hold AI Assistant:** Converse with the assistant to discover spending patterns, savings opportunities, and anomaly warnings.
* **UC8 - Export Financial Statements:** Generate clean, exportable statements with optional password protection.
