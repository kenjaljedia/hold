package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"github.com/kenjaljedia/hold/src/backend/handlers"
)

// enableCORS sets cross-origin headers
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	sslMode := os.Getenv("DB_SSLMODE")

	if dbHost == "" {
		dbHost = "localhost"
	}
	if dbPort == "" {
		dbPort = "5432"
	}
	if dbUser == "" {
		dbUser = "postgres"
	}
	if dbPass == "" {
		dbPass = "postgres"
	}
	if dbName == "" {
		dbName = "hold_db"
	}
	if sslMode == "" {
		sslMode = "disable"
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s connect_timeout=5",
		dbHost, dbPort, dbUser, dbPass, dbName, sslMode)

	log.Printf("[Hold Backend] Connecting to PostgreSQL at %s:%s/%s...", dbHost, dbPort, dbName)

	var db *sql.DB
	var err error

	// Connect with retry
	for attempts := 1; attempts <= 5; attempts++ {
		db, err = sql.Open("postgres", dsn)
		if err == nil {
			err = db.Ping()
			if err == nil {
				log.Println("[Hold Backend] Successfully connected to PostgreSQL!")
				break
			}
		}
		log.Printf("[Hold Backend] Database connection attempt %d/5 failed: %v. Retrying in 2s...", attempts, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Printf("[Hold Backend] Warning: Running in offline demo mode without active PostgreSQL: %v", err)
		db = nil
	}

	// Initialize Handlers
	accountHandler := handlers.NewAccountHandler(db)
	txHandler := handlers.NewTransactionHandler(db)
	analyticsHandler := handlers.NewAnalyticsHandler(db)
	aiHandler := handlers.NewAIHandler(db)

	mux := http.NewServeMux()

	// Health Check
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		status := "ok"
		dbStatus := "connected"
		if db == nil {
			dbStatus = "offline-fallback"
		}
		w.Write([]byte(fmt.Sprintf(`{"status":"%s","database":"%s","service":"hold-backend","version":"1.0.0"}`, status, dbStatus)))
	})

	// Accounts
	mux.HandleFunc("/api/accounts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			accountHandler.GetAccounts(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/accounts/link", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			accountHandler.LinkAccount(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	// Transactions
	mux.HandleFunc("/api/transactions", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			txHandler.GetTransactions(w, r)
		case http.MethodPost:
			txHandler.CreateTransaction(w, r)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/categories", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			txHandler.GetCategories(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	// Analytics
	mux.HandleFunc("/api/analytics/networth", func(w http.ResponseWriter, r *http.Request) {
		analyticsHandler.GetNetWorthSummary(w, r)
	})

	mux.HandleFunc("/api/analytics/cashflow", func(w http.ResponseWriter, r *http.Request) {
		analyticsHandler.GetCashFlowSummary(w, r)
	})

	mux.HandleFunc("/api/analytics/categories", func(w http.ResponseWriter, r *http.Request) {
		analyticsHandler.GetCategoryBreakdown(w, r)
	})

	// Hold AI
	mux.HandleFunc("/api/ai/ask", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			aiHandler.HandleQuery(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	handler := enableCORS(mux)

	serverAddr := ":" + port
	log.Printf("[Hold Backend] Server listening on http://localhost%s", serverAddr)
	log.Printf("[Hold Backend] Health endpoint: http://localhost%s/api/health", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, handler))
}
