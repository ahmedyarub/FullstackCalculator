import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../hooks/useCalculator';

// Mock the API module.
vi.mock('../api/calculator', () => ({
  calculate: vi.fn(),
}));

import { calculate } from '../api/calculator';

const mockCalculate = vi.mocked(calculate);

describe('useCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('digit input', () => {
    it('starts with display showing 0', () => {
      const { result } = renderHook(() => useCalculator());
      expect(result.current.display).toBe('0');
    });

    it('replaces 0 with first digit', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      expect(result.current.display).toBe('5');
    });

    it('appends subsequent digits', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('1'));
      act(() => result.current.inputDigit('2'));
      act(() => result.current.inputDigit('3'));
      expect(result.current.display).toBe('123');
    });
  });

  describe('decimal input', () => {
    it('adds decimal point', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('3'));
      act(() => result.current.inputDecimal());
      expect(result.current.display).toBe('3.');
    });

    it('prevents multiple decimal points', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('3'));
      act(() => result.current.inputDecimal());
      act(() => result.current.inputDecimal());
      expect(result.current.display).toBe('3.');
    });

    it('starts with 0. when decimal pressed first', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDecimal());
      expect(result.current.display).toBe('0.');
    });
  });

  describe('clear', () => {
    it('resets all state', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      act(() => result.current.clear());
      expect(result.current.display).toBe('0');
      expect(result.current.expression).toBe('');
      expect(result.current.error).toBeNull();
    });
  });

  describe('toggle sign', () => {
    it('negates a positive number', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      act(() => result.current.toggleSign());
      expect(result.current.display).toBe('-5');
    });

    it('makes negative number positive', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      act(() => result.current.toggleSign());
      act(() => result.current.toggleSign());
      expect(result.current.display).toBe('5');
    });

    it('does nothing when display is 0', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.toggleSign());
      expect(result.current.display).toBe('0');
    });
  });

  describe('backspace', () => {
    it('removes last digit', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('1'));
      act(() => result.current.inputDigit('2'));
      act(() => result.current.inputDigit('3'));
      act(() => result.current.backspace());
      expect(result.current.display).toBe('12');
    });

    it('resets to 0 when last digit removed', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      act(() => result.current.backspace());
      expect(result.current.display).toBe('0');
    });
  });

  describe('operation selection', () => {
    it('sets expression with operator symbol', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      act(() => result.current.selectOperation('add'));
      expect(result.current.expression).toBe('5 +');
    });

    it('allows switching operators', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.inputDigit('5'));
      act(() => result.current.selectOperation('add'));
      act(() => result.current.selectOperation('subtract'));
      expect(result.current.expression).toBe('5 −');
    });
  });

  describe('calculation', () => {
    it('calls API and displays result', async () => {
      mockCalculate.mockResolvedValueOnce({ result: 8 });

      const { result } = renderHook(() => useCalculator());

      act(() => result.current.inputDigit('5'));
      act(() => result.current.selectOperation('add'));
      act(() => result.current.inputDigit('3'));

      await act(async () => {
        result.current.performCalculation();
      });

      // Wait for async state updates.
      await vi.waitFor(() => {
        expect(result.current.display).toBe('8');
      });
    });

    it('displays API errors', async () => {
      mockCalculate.mockRejectedValueOnce(new Error('division by zero'));

      const { result } = renderHook(() => useCalculator());

      act(() => result.current.inputDigit('5'));
      act(() => result.current.selectOperation('divide'));
      act(() => result.current.inputDigit('0'));

      await act(async () => {
        result.current.performCalculation();
      });

      await vi.waitFor(() => {
        expect(result.current.error).toBe('division by zero');
      });
    });
  });

  describe('sqrt', () => {
    it('calls API with sqrt operation', async () => {
      mockCalculate.mockResolvedValueOnce({ result: 12 });

      const { result } = renderHook(() => useCalculator());

      act(() => result.current.inputDigit('1'));
      act(() => result.current.inputDigit('4'));
      act(() => result.current.inputDigit('4'));

      await act(async () => {
        await result.current.performSqrt();
      });

      expect(mockCalculate).toHaveBeenCalledWith('sqrt', 144);
      expect(result.current.display).toBe('12');
    });

    it('displays error for negative sqrt', async () => {
      mockCalculate.mockRejectedValueOnce(
        new Error('square root of negative number')
      );

      const { result } = renderHook(() => useCalculator());

      act(() => result.current.toggleSign()); // won't work since display is '0'
      act(() => result.current.inputDigit('4'));
      act(() => result.current.toggleSign()); // now '-4'

      await act(async () => {
        await result.current.performSqrt();
      });

      expect(result.current.error).toBe('square root of negative number');
    });
  });
});
