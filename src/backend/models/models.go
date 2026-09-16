package models

import "time"

// User represents an authenticated Hold user
type User struct {
	ID                 string    `json:"id"`
	Email              string    `json:"email"`
	FullName           string    `json:"full_name"`
	Currency           string    `json:"currency"`
	PrivacyModeDefault bool      `json:"privacy_mode_default"`
	CreatedAt          time.Time `json:"created_at"`
}

// Account represents a financial institution or wallet
type Account struct {
	ID                  string    `json:"id"`
	UserID              string    `json:"user_id"`
	InstitutionName     string    `json:"institution_name"`
	AccountType         string    `json:"account_type"` // savings, checking, credit_card, investment, wallet
	AccountNumberMasked string    `json:"account_number_masked"`
	IFSCCode            string    `json:"ifsc_code"`
	CurrentBalance      float64   `json:"current_balance"`
	AvailableBalance    float64   `json:"available_balance"`
	Currency            string    `json:"currency"`
	LogoURL             string    `json:"logo_url,omitempty"`
	IsActive            bool      `json:"is_active"`
	LastSyncedAt        time.Time `json:"last_synced_at"`
	CreatedAt           time.Time `json:"created_at"`
}

// Category represents a standardized spending bucket
type Category struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	IconName     string `json:"icon_name"`
	ColorHex     string `json:"color_hex"`
	CategoryType string `json:"category_type"` // expense, income
}

// Transaction represents a financial flow entry
type Transaction struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	AccountID       string    `json:"account_id"`
	InstitutionName string    `json:"institution_name,omitempty"`
	CategoryID      string    `json:"category_id"`
	CategoryName    string    `json:"category_name,omitempty"`
	CategoryIcon    string    `json:"category_icon,omitempty"`
	CategoryColor   string    `json:"category_color,omitempty"`
	MerchantName    string    `json:"merchant_name"`
	Amount          float64   `json:"amount"`
	TransactionType string    `json:"transaction_type"` // debit, credit
	Description     string    `json:"description,omitempty"`
	Tags            []string  `json:"tags"`
	ReceiptURL      string    `json:"receipt_url,omitempty"`
	TransactionDate time.Time `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
}

// Budget represents a monthly spending ceiling
type Budget struct {
	ID           string  `json:"id"`
	UserID       string  `json:"user_id"`
	CategoryID   string  `json:"category_id"`
	CategoryName string  `json:"category_name,omitempty"`
	MonthlyLimit float64 `json:"monthly_limit"`
	CurrentSpent float64 `json:"current_spent"`
	PeriodMonth  string  `json:"period_month"`
}

// SparklinePoint for historical trend graphs
type SparklinePoint struct {
	Timestamp string  `json:"timestamp"`
	Balance   float64 `json:"balance"`
}

// NetWorthSummary holds aggregated wealth metrics
type NetWorthSummary struct {
	TotalNetWorth   float64          `json:"total_net_worth"`
	DeltaPercentage float64          `json:"delta_percentage"`
	DeltaAmount     float64          `json:"delta_amount"`
	Currency        string           `json:"currency"`
	Timeframe       string           `json:"timeframe"`
	SparklinePoints []SparklinePoint `json:"sparkline_points"`
	AccountCount    int              `json:"account_count"`
}

// CashFlowSummary contains inflow, outflow, and net savings
type CashFlowSummary struct {
	TotalInflow  float64 `json:"total_inflow"`
	TotalOutflow float64 `json:"total_outflow"`
	NetSavings   float64 `json:"net_savings"`
	SavingsRate  float64 `json:"savings_rate"` // percentage
	Month        string  `json:"month"`
}

// CategorySpend gives percentage breakdown for analytics
type CategorySpend struct {
	CategoryID   string  `json:"category_id"`
	CategoryName string  `json:"category_name"`
	IconName     string  `json:"icon_name"`
	ColorHex     string  `json:"color_hex"`
	TotalAmount  float64 `json:"total_amount"`
	Percentage   float64 `json:"percentage"`
	Count        int     `json:"count"`
}

// HoldAIQuery represents a natural language request
type HoldAIQuery struct {
	Query string `json:"query"`
}

// HoldAIResponse represents the intelligent assistant response
type HoldAIResponse struct {
	Query        string   `json:"query"`
	Answer       string   `json:"answer"`
	Confidence   float64  `json:"confidence"`
	ActionPills  []string `json:"action_pills,omitempty"`
	Category     string   `json:"category,omitempty"`
	AmountFound  *float64 `json:"amount_found,omitempty"`
	ComputedAt   time.Time`json:"computed_at"`
}

// Standard API response envelope
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}
