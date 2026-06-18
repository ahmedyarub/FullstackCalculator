package calculator

import (
	"math"
	"testing"
)

// helper to create a float64 pointer for test table entries.
func fp(v float64) *float64 { return &v }

func TestAdd(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"positive numbers", 2, 3, 5, false},
		{"negative numbers", -2, -3, -5, false},
		{"mixed signs", -2, 3, 1, false},
		{"zeros", 0, 0, 0, false},
		{"decimals", 0.1, 0.2, 0.30000000000000004, false},
		{"large numbers", 1e15, 1e15, 2e15, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Add(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Add() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Add() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"positive result", 5, 3, 2, false},
		{"negative result", 3, 5, -2, false},
		{"same numbers", 7, 7, 0, false},
		{"zeros", 0, 0, 0, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Subtract(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Subtract() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Subtract() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"positive numbers", 4, 5, 20, false},
		{"by zero", 4, 0, 0, false},
		{"negative numbers", -3, -4, 12, false},
		{"mixed signs", -3, 4, -12, false},
		{"decimals", 0.5, 0.5, 0.25, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Multiply(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Multiply() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Multiply() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"even division", 10, 2, 5, false},
		{"decimal result", 10, 3, 3.3333333333333335, false},
		{"by one", 7, 1, 7, false},
		{"zero numerator", 0, 5, 0, false},
		{"division by zero", 10, 0, 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Divide(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Divide() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("Divide() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPower(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"square", 3, 2, 9, false},
		{"cube", 2, 3, 8, false},
		{"power of zero", 5, 0, 1, false},
		{"zero base", 0, 5, 0, false},
		{"negative exponent", 2, -1, 0.5, false},
		{"fractional exponent", 4, 0.5, 2, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Power(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Power() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("Power() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSqrt(t *testing.T) {
	tests := []struct {
		name    string
		a       float64
		want    float64
		wantErr bool
	}{
		{"perfect square", 144, 12, false},
		{"non-perfect", 2, math.Sqrt(2), false},
		{"zero", 0, 0, false},
		{"one", 1, 1, false},
		{"negative number", -4, 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Sqrt(tt.a)
			if (err != nil) != tt.wantErr {
				t.Errorf("Sqrt() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("Sqrt() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPercentage(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"20 percent of 50", 20, 50, 10, false},
		{"100 percent", 100, 42, 42, false},
		{"0 percent", 0, 100, 0, false},
		{"50 percent of 200", 50, 200, 100, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Percentage(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Percentage() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Percentage() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCalculate(t *testing.T) {
	tests := []struct {
		name    string
		op      string
		a       float64
		b       *float64
		want    float64
		wantErr bool
	}{
		{"add", "add", 2, fp(3), 5, false},
		{"subtract", "subtract", 5, fp(3), 2, false},
		{"multiply", "multiply", 4, fp(5), 20, false},
		{"divide", "divide", 10, fp(2), 5, false},
		{"power", "power", 2, fp(3), 8, false},
		{"sqrt", "sqrt", 9, nil, 3, false},
		{"percentage", "percentage", 25, fp(200), 50, false},
		{"unknown op", "modulo", 5, fp(3), 0, true},
		{"add missing b", "add", 5, nil, 0, true},
		{"subtract missing b", "subtract", 5, nil, 0, true},
		{"multiply missing b", "multiply", 5, nil, 0, true},
		{"divide missing b", "divide", 5, nil, 0, true},
		{"power missing b", "power", 5, nil, 0, true},
		{"percentage missing b", "percentage", 5, nil, 0, true},
		{"divide by zero", "divide", 5, fp(0), 0, true},
		{"sqrt negative", "sqrt", -4, nil, 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Calculate(tt.op, tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("Calculate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("Calculate() = %v, want %v", got, tt.want)
			}
		})
	}
}
