package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/kenjaljedia/hold/src/backend/models"
)

// AnalyticsHandler computes wealth and cash flow insights
type AnalyticsHandler struct {
	DB *sql.DB
}

// NewAnalyticsHandler initializes a new AnalyticsHandler
func NewAnalyticsHandler(db *sql.DB) *AnalyticsHandler {
	return &AnalyticsHandler{DB: db}
}

// GetNetWorthSummary handles GET /api/analytics/networth
func (h *AnalyticsHandler) GetNetWorthSummary(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	timeframe := r.URL.Query().Get("period")
	if timeframe == "" {
		timeframe = "1M"
	}

	summary := models.NetWorthSummary{
		TotalNetWorth:   482950.00,
		DeltaPercentage: 8.42,
		DeltaAmount:     37550.00,
		Currency:        "INR",
		Timeframe:       timeframe,
		AccountCount:    4,
		SparklinePoints: []models.SparklinePoint{
			{Timestamp: "Day 1", Balance: 445400.00},
			{Timestamp: "Day 5", Balance: 448200.00},
			{Timestamp: "Day 10", Balance: 441000.00},
			{Timestamp: "Day 15", Balance: 456000.00},
			{Timestamp: "Day 20", Balance: 462500.00},
			{Timestamp: "Day 25", Balance: 479100.00},
			{Timestamp: "Day 30", Balance: 482950.00},
		},
	}

	if h.DB != nil {
		var total sql.NullFloat64
		var count int
		err := h.DB.QueryRow(`SELECT SUM(current_balance), COUNT(*) FROM accounts WHERE is_active = TRUE`).Scan(&total, &count)
		if err == nil && total.Valid {
			summary.TotalNetWorth = total.Float64
			summary.AccountCount = count
		}
	}

	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data:    summary,
	})
}

// GetCashFlowSummary handles GET /api/analytics/cashflow
func (h *AnalyticsHandler) GetCashFlowSummary(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	cashflow := models.CashFlowSummary{
		TotalInflow:  125000.00,
		TotalOutflow: 18489.00,
		NetSavings:   106511.00,
		SavingsRate:  85.2,
		Month:        "September 2026",
	}

	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data:    cashflow,
	})
}

// GetCategoryBreakdown handles GET /api/analytics/categories
func (h *AnalyticsHandler) GetCategoryBreakdown(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	categories := []models.CategorySpend{
		{CategoryID: "c1", CategoryName: "Food & Drinks", IconName: "utensils", ColorHex: "#F59E0B", TotalAmount: 1270.00, Percentage: 38.2, Count: 2},
		{CategoryID: "c2", CategoryName: "Shopping", IconName: "shopping-bag", ColorHex: "#EC4899", TotalAmount: 1150.00, Percentage: 34.6, Count: 1},
		{CategoryID: "c6", CategoryName: "Subscriptions", IconName: "film", ColorHex: "#6366F1", TotalAmount: 649.00, Percentage: 19.5, Count: 1},
		{CategoryID: "c4", CategoryName: "Travel & Transit", IconName: "car", ColorHex: "#3B82F6", TotalAmount: 420.00, Percentage: 12.6, Count: 1},
	}

	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data:    categories,
	})
}
