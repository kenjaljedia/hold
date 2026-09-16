package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kenjaljedia/hold/src/backend/models"
)

// TransactionHandler handles ledger and spending actions
type TransactionHandler struct {
	DB *sql.DB
}

// NewTransactionHandler initializes a new TransactionHandler
func NewTransactionHandler(db *sql.DB) *TransactionHandler {
	return &TransactionHandler{DB: db}
}

// GetTransactions handles GET /api/transactions
func (h *TransactionHandler) GetTransactions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	query := r.URL.Query().Get("q")
	txType := r.URL.Query().Get("type")
	category := r.URL.Query().Get("category")

	if h.DB == nil {
		filtered := filterDemoTransactions(query, txType, category)
		json.NewEncoder(w).Encode(models.APIResponse{
			Success: true,
			Data:    filtered,
		})
		return
	}

	sqlQuery := `
		SELECT t.id, t.user_id, t.account_id, a.institution_name,
		       t.category_id, COALESCE(c.name, 'Other'), COALESCE(c.icon_name, 'circle'), COALESCE(c.color_hex, '#94A3B8'),
		       t.merchant_name, t.amount, t.transaction_type, t.description,
		       t.transaction_date, t.created_at
		FROM transactions t
		LEFT JOIN accounts a ON t.account_id = a.id
		LEFT JOIN categories c ON t.category_id = c.id
		WHERE 1=1
	`
	var args []interface{}
	argIdx := 1

	if query != "" {
		sqlQuery += ` AND (LOWER(t.merchant_name) LIKE LOWER($` + string(rune('0'+argIdx)) + `) OR LOWER(t.description) LIKE LOWER($` + string(rune('0'+argIdx)) + `))`
		args = append(args, "%"+query+"%")
		argIdx++
	}

	if txType != "" {
		sqlQuery += ` AND t.transaction_type = $` + string(rune('0'+argIdx))
		args = append(args, txType)
		argIdx++
	}

	sqlQuery += ` ORDER BY t.transaction_date DESC LIMIT 50`

	rows, err := h.DB.Query(sqlQuery, args...)
	if err != nil {
		filtered := filterDemoTransactions(query, txType, category)
		json.NewEncoder(w).Encode(models.APIResponse{
			Success: true,
			Data:    filtered,
		})
		return
	}
	defer rows.Close()

	var transactions []models.Transaction
	for rows.Next() {
		var t models.Transaction
		var desc sql.NullString
		err := rows.Scan(
			&t.ID, &t.UserID, &t.AccountID, &t.InstitutionName,
			&t.CategoryID, &t.CategoryName, &t.CategoryIcon, &t.CategoryColor,
			&t.MerchantName, &t.Amount, &t.TransactionType, &desc,
			&t.TransactionDate, &t.CreatedAt,
		)
		if err == nil {
			if desc.Valid {
				t.Description = desc.String
			}
			t.Tags = []string{}
			transactions = append(transactions, t)
		}
	}

	if len(transactions) == 0 && query == "" {
		transactions = getDemoTransactions()
	}

	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data:    transactions,
	})
}

// CreateTransaction handles POST /api/transactions
func (h *TransactionHandler) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		AccountID       string   `json:"account_id"`
		MerchantName    string   `json:"merchant_name"`
		Amount          float64  `json:"amount"`
		TransactionType string   `json:"transaction_type"` // debit or credit
		CategoryName    string   `json:"category_name"`
		Description     string   `json:"description"`
		Tags            []string `json:"tags"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"success":false,"error":"Invalid request format"}`, http.StatusBadRequest)
		return
	}

	newTx := models.Transaction{
		ID:              uuid.New().String(),
		UserID:          "a0000000-0000-0000-0000-000000000001",
		AccountID:       req.AccountID,
		MerchantName:    req.MerchantName,
		Amount:          req.Amount,
		TransactionType: req.TransactionType,
		CategoryName:    req.CategoryName,
		Description:     req.Description,
		Tags:            req.Tags,
		TransactionDate: time.Now(),
		CreatedAt:       time.Now(),
	}

	if h.DB != nil {
		_, _ = h.DB.Exec(`
			INSERT INTO transactions (id, user_id, account_id, merchant_name, amount, transaction_type, description, transaction_date)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`, newTx.ID, newTx.UserID, newTx.AccountID, newTx.MerchantName, newTx.Amount, newTx.TransactionType, newTx.Description, newTx.TransactionDate)

		// Update balance
		delta := -newTx.Amount
		if newTx.TransactionType == "credit" {
			delta = newTx.Amount
		}
		_, _ = h.DB.Exec(`UPDATE accounts SET current_balance = current_balance + $1 WHERE id = $2`, delta, newTx.AccountID)
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Message: "Transaction recorded successfully",
		Data:    newTx,
	})
}

// GetCategories handles GET /api/categories
func (h *TransactionHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	categories := []models.Category{
		{ID: "c1", Name: "Food & Drinks", IconName: "utensils", ColorHex: "#F59E0B", CategoryType: "expense"},
		{ID: "c2", Name: "Shopping", IconName: "shopping-bag", ColorHex: "#EC4899", CategoryType: "expense"},
		{ID: "c3", Name: "Housing & Rent", IconName: "home", ColorHex: "#8B5CF6", CategoryType: "expense"},
		{ID: "c4", Name: "Travel & Transit", IconName: "car", ColorHex: "#3B82F6", CategoryType: "expense"},
		{ID: "c5", Name: "Utilities & Bills", IconName: "zap", ColorHex: "#EAB308", CategoryType: "expense"},
		{ID: "c6", Name: "Subscriptions", IconName: "film", ColorHex: "#6366F1", CategoryType: "expense"},
		{ID: "c7", Name: "Investments", IconName: "trending-up", ColorHex: "#10B981", CategoryType: "expense"},
		{ID: "c8", Name: "Salary & Income", IconName: "briefcase", ColorHex: "#10B981", CategoryType: "income"},
		{ID: "c9", Name: "Health & Wellness", IconName: "activity", ColorHex: "#EF4444", CategoryType: "expense"},
	}

	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data:    categories,
	})
}

func filterDemoTransactions(query, txType, category string) []models.Transaction {
	all := getDemoTransactions()
	var result []models.Transaction
	for _, tx := range all {
		if txType != "" && tx.TransactionType != txType {
			continue
		}
		if category != "" && !strings.EqualFold(tx.CategoryName, category) {
			continue
		}
		if query != "" {
			qLower := strings.ToLower(query)
			if !strings.Contains(strings.ToLower(tx.MerchantName), qLower) &&
				!strings.Contains(strings.ToLower(tx.CategoryName), qLower) &&
				!strings.Contains(strings.ToLower(tx.Description), qLower) {
				continue
			}
		}
		result = append(result, tx)
	}
	return result
}

func getDemoTransactions() []models.Transaction {
	now := time.Now()
	return []models.Transaction{
		{
			ID:              "tx-1",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000001",
			InstitutionName: "HDFC Bank",
			CategoryName:    "Salary & Income",
			CategoryIcon:    "briefcase",
			CategoryColor:   "#10B981",
			MerchantName:    "Tech Corp Global",
			Amount:          125000.00,
			TransactionType: "credit",
			Description:     "Monthly Salary Credit - September",
			Tags:            []string{"Salary", "DirectDeposit"},
			TransactionDate: now.Add(-2 * 24 * time.Hour),
		},
		{
			ID:              "tx-2",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000001",
			InstitutionName: "HDFC Bank",
			CategoryName:    "Food & Drinks",
			CategoryIcon:    "utensils",
			CategoryColor:   "#F59E0B",
			MerchantName:    "Starbucks Coffee",
			Amount:          380.00,
			TransactionType: "debit",
			Description:     "Morning Cold Brew and Bagel",
			Tags:            []string{"Coffee", "Breakfast"},
			TransactionDate: now.Add(-4 * time.Hour),
		},
		{
			ID:              "tx-3",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000002",
			InstitutionName: "State Bank of India",
			CategoryName:    "Travel & Transit",
			CategoryIcon:    "car",
			CategoryColor:   "#3B82F6",
			MerchantName:    "Uber India",
			Amount:          420.00,
			TransactionType: "debit",
			Description:     "Ride to Tech Hub Office",
			Tags:            []string{"Commute", "Work"},
			TransactionDate: now.Add(-26 * time.Hour),
		},
		{
			ID:              "tx-4",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000003",
			InstitutionName: "ICICI Bank",
			CategoryName:    "Food & Drinks",
			CategoryIcon:    "utensils",
			CategoryColor:   "#F59E0B",
			MerchantName:    "Swiggy Gourmet",
			Amount:          890.00,
			TransactionType: "debit",
			Description:     "Dinner delivery with team",
			Tags:            []string{"Dinner", "Team"},
			TransactionDate: now.Add(-30 * time.Hour),
		},
		{
			ID:              "tx-5",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000001",
			InstitutionName: "HDFC Bank",
			CategoryName:    "Subscriptions",
			CategoryIcon:    "film",
			CategoryColor:   "#6366F1",
			MerchantName:    "Netflix Family",
			Amount:          649.00,
			TransactionType: "debit",
			Description:     "Recurring Premium 4K plan",
			Tags:            []string{"Recurring", "Entertainment"},
			TransactionDate: now.Add(-72 * time.Hour),
		},
		{
			ID:              "tx-6",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000002",
			InstitutionName: "State Bank of India",
			CategoryName:    "Shopping",
			CategoryIcon:    "shopping-bag",
			CategoryColor:   "#EC4899",
			MerchantName:    "Blinkit Quick Mart",
			Amount:          1150.00,
			TransactionType: "debit",
			Description:     "Household essentials & groceries",
			Tags:            []string{"Groceries"},
			TransactionDate: now.Add(-120 * time.Hour),
		},
		{
			ID:              "tx-7",
			UserID:          "a0000000-0000-0000-0000-000000000001",
			AccountID:       "b0000000-0000-0000-0000-000000000001",
			InstitutionName: "HDFC Bank",
			CategoryName:    "Investments",
			CategoryIcon:    "trending-up",
			CategoryColor:   "#10B981",
			MerchantName:    "Zerodha Coin SIP",
			Amount:          15000.00,
			TransactionType: "debit",
			Description:     "Nifty 50 Index Mutual Fund SIP",
			Tags:            []string{"SIP", "Wealth"},
			TransactionDate: now.Add(-140 * time.Hour),
		},
	}
}
