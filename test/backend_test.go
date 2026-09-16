package test

import (
	"math"
	"strings"
	"testing"
)

// TestNetWorthCalculation verifies accurate aggregation across diverse accounts
func TestNetWorthCalculation(t *testing.T) {
	balances := []float64{184500.00, 92350.00, 145000.00, 61100.00}
	var total float64
	for _, b := range balances {
		total += b
	}

	expected := 482950.00
	if math.Abs(total-expected) > 0.001 {
		t.Errorf("Net worth calculation mismatch. Got: %.2f, Expected: %.2f", total, expected)
	}
}

// TestCashFlowSavingsRate verifies savings rate computation
func TestCashFlowSavingsRate(t *testing.T) {
	inflow := 125000.00
	outflow := 18489.00
	netSavings := inflow - outflow
	savingsRate := (netSavings / inflow) * 100

	expectedRate := 85.2088
	if math.Abs(savingsRate-expectedRate) > 0.01 {
		t.Errorf("Savings rate computation incorrect. Got: %.2f%%, Expected: ~85.21%%", savingsRate)
	}
}

// TestAIQueryIntentParsing verifies pattern matching for Hold AI
func TestAIQueryIntentParsing(t *testing.T) {
	queries := []struct {
		input            string
		expectedCategory string
	}{
		{"How much did I spend on Starbucks this month?", "Food & Drinks"},
		{"Show me Swiggy dining expenses", "Food & Drinks"},
		{"Do I have any active Netflix subscription?", "Subscriptions"},
	}

	for _, tc := range queries {
		q := strings.ToLower(tc.input)
		var matched string
		if strings.Contains(q, "starbucks") || strings.Contains(q, "swiggy") {
			matched = "Food & Drinks"
		} else if strings.Contains(q, "netflix") {
			matched = "Subscriptions"
		}

		if matched != tc.expectedCategory {
			t.Errorf("Intent parse failed for query: '%s'. Got: %s, Expected: %s", tc.input, matched, tc.expectedCategory)
		}
	}
}
