import { useCalculator } from '../hooks/useCalculator';
import { Display } from './Display';
import { Keypad } from './Keypad';

export function Calculator() {
  const {
    display,
    expression,
    error,
    loading,
    inputDigit,
    inputDecimal,
    selectOperation,
    performCalculation,
    performSqrt,
    clear,
    toggleSign,
    backspace,
  } = useCalculator();

  return (
    <div className="calculator" id="calculator">
      <Display
        value={display}
        expression={expression}
        error={error}
        loading={loading}
      />
      <Keypad
        onDigit={inputDigit}
        onDecimal={inputDecimal}
        onOperation={selectOperation}
        onEquals={performCalculation}
        onClear={clear}
        onSqrt={performSqrt}
        onToggleSign={toggleSign}
        onBackspace={backspace}
        disabled={loading}
      />
    </div>
  );
}
