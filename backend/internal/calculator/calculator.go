// Package calculator provides pure arithmetic functions for the calculator API.
// All functions are stateless, side-effect-free, and return (float64, error).
package calculator

import (
	"errors"
	"fmt"
	"math"
)

// Sentinel errors for known error conditions.
var (
	ErrDivisionByZero    = errors.New("division by zero")
	ErrNegativeSqrt      = errors.New("square root of negative number")
	ErrInvalidNumber     = errors.New("invalid numeric value")
	ErrUnknownOperation  = errors.New("unknown operation")
)

// Add returns a + b.
func Add(a, b float64) (float64, error) {
	result := a + b
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Subtract returns a - b.
func Subtract(a, b float64) (float64, error) {
	result := a - b
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Multiply returns a * b.
func Multiply(a, b float64) (float64, error) {
	result := a * b
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Divide returns a / b. Returns ErrDivisionByZero if b is zero.
func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivisionByZero
	}
	result := a / b
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Power returns a raised to the power of b.
func Power(a, b float64) (float64, error) {
	result := math.Pow(a, b)
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Sqrt returns the square root of a. Returns ErrNegativeSqrt if a is negative.
func Sqrt(a float64) (float64, error) {
	if a < 0 {
		return 0, ErrNegativeSqrt
	}
	result := math.Sqrt(a)
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Percentage returns a% of b (i.e., (a / 100) * b).
func Percentage(a, b float64) (float64, error) {
	result := (a / 100) * b
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidNumber
	}
	return result, nil
}

// Calculate dispatches to the appropriate function based on the operation string.
func Calculate(operation string, a float64, b *float64) (float64, error) {
	switch operation {
	case "add":
		if b == nil {
			return 0, errors.New("operand 'b' is required for operation: add")
		}
		return Add(a, *b)
	case "subtract":
		if b == nil {
			return 0, errors.New("operand 'b' is required for operation: subtract")
		}
		return Subtract(a, *b)
	case "multiply":
		if b == nil {
			return 0, errors.New("operand 'b' is required for operation: multiply")
		}
		return Multiply(a, *b)
	case "divide":
		if b == nil {
			return 0, errors.New("operand 'b' is required for operation: divide")
		}
		return Divide(a, *b)
	case "power":
		if b == nil {
			return 0, errors.New("operand 'b' is required for operation: power")
		}
		return Power(a, *b)
	case "sqrt":
		return Sqrt(a)
	case "percentage":
		if b == nil {
			return 0, errors.New("operand 'b' is required for operation: percentage")
		}
		return Percentage(a, *b)
	default:
		return 0, fmt.Errorf("%w: %s", ErrUnknownOperation, operation)
	}
}
