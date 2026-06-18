import { useState, useCallback } from 'react';
import { calculate } from '../api/calculator';

interface CalculatorState {
  display: string;
  expression: string;
  previousValue: string | null;
  operation: string | null;
  waitingForSecondOperand: boolean;
  error: string | null;
  loading: boolean;
}

const INITIAL_STATE: CalculatorState = {
  display: '0',
  expression: '',
  previousValue: null,
  operation: null,
  waitingForSecondOperand: false,
  error: null,
  loading: false,
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const inputDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.error) {
        return { ...INITIAL_STATE, display: digit, expression: '' };
      }

      if (prev.waitingForSecondOperand) {
        return {
          ...prev,
          display: digit,
          waitingForSecondOperand: false,
        };
      }

      const newDisplay = prev.display === '0' ? digit : prev.display + digit;
      return { ...prev, display: newDisplay };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.error) {
        return { ...INITIAL_STATE, display: '0.', expression: '' };
      }

      if (prev.waitingForSecondOperand) {
        return {
          ...prev,
          display: '0.',
          waitingForSecondOperand: false,
        };
      }

      if (prev.display.includes('.')) {
        return prev;
      }

      return { ...prev, display: prev.display + '.' };
    });
  }, []);

  const getOperatorSymbol = (op: string): string => {
    const symbols: Record<string, string> = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷',
      power: '^',
      percentage: '%',
    };
    return symbols[op] || op;
  };

  const selectOperation = useCallback((op: string) => {
    setState((prev) => {
      if (prev.error) return prev;

      const symbol = getOperatorSymbol(op);

      // If we already have an operation and are waiting for the second operand,
      // just update the operation (operator switching).
      if (prev.waitingForSecondOperand && prev.operation) {
        return {
          ...prev,
          operation: op,
          expression: `${prev.previousValue} ${symbol}`,
        };
      }

      return {
        ...prev,
        previousValue: prev.display,
        operation: op,
        expression: `${prev.display} ${symbol}`,
        waitingForSecondOperand: true,
      };
    });
  }, []);

  const performCalculation = useCallback(async () => {
    setState((prev) => {
      if (!prev.operation || !prev.previousValue) return prev;
      return { ...prev, loading: true, error: null };
    });

    // Read the latest state for the actual API call.
    setState((prev) => {
      if (!prev.loading) return prev;

      const a = parseFloat(prev.previousValue!);
      const b = parseFloat(prev.display);
      const op = prev.operation!;
      const symbol = getOperatorSymbol(op);

      // Launch the async calculation (we set state from the promise callback).
      calculate(op, a, b)
        .then((response) => {
          setState((s) => ({
            ...s,
            display: formatResult(response.result),
            expression: `${prev.previousValue} ${symbol} ${prev.display} =`,
            previousValue: null,
            operation: null,
            waitingForSecondOperand: false,
            loading: false,
            error: null,
          }));
        })
        .catch((err: Error) => {
          setState((s) => ({
            ...s,
            error: err.message,
            loading: false,
          }));
        });

      return prev; // Return unchanged — the promise callbacks handle updates.
    });
  }, []);

  const performSqrt = useCallback(async () => {
    const currentValue = parseFloat(state.display);

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await calculate('sqrt', currentValue);
      setState((prev) => ({
        ...prev,
        display: formatResult(response.result),
        expression: `√(${state.display})`,
        previousValue: null,
        operation: null,
        waitingForSecondOperand: false,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Calculation failed',
        loading: false,
      }));
    }
  }, [state.display]);

  const clear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const toggleSign = useCallback(() => {
    setState((prev) => {
      if (prev.error || prev.display === '0') return prev;
      const newDisplay = prev.display.startsWith('-')
        ? prev.display.slice(1)
        : '-' + prev.display;
      return { ...prev, display: newDisplay };
    });
  }, []);

  const backspace = useCallback(() => {
    setState((prev) => {
      if (prev.error) return INITIAL_STATE;
      if (prev.display.length <= 1 || (prev.display.length === 2 && prev.display.startsWith('-'))) {
        return { ...prev, display: '0' };
      }
      return { ...prev, display: prev.display.slice(0, -1) };
    });
  }, []);

  return {
    display: state.display,
    expression: state.expression,
    error: state.error,
    loading: state.loading,
    inputDigit,
    inputDecimal,
    selectOperation,
    performCalculation,
    performSqrt,
    clear,
    toggleSign,
    backspace,
  };
}

/**
 * Formats a numeric result for display, removing unnecessary trailing zeros.
 */
function formatResult(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // Show up to 10 decimal places, then strip trailing zeros.
  return parseFloat(value.toFixed(10)).toString();
}
