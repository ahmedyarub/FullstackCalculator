import { Button } from './Button';
import { ButtonConfig } from '../types';

const BUTTONS: ButtonConfig[] = [
  // Row 1: Actions
  { label: 'C', value: 'clear', variant: 'action' },
  { label: '±', value: 'toggleSign', variant: 'action' },
  { label: '%', value: 'percentage', variant: 'action' },
  { label: '÷', value: 'divide', variant: 'operator' },

  // Row 2
  { label: '7', value: '7', variant: 'number' },
  { label: '8', value: '8', variant: 'number' },
  { label: '9', value: '9', variant: 'number' },
  { label: '×', value: 'multiply', variant: 'operator' },

  // Row 3
  { label: '4', value: '4', variant: 'number' },
  { label: '5', value: '5', variant: 'number' },
  { label: '6', value: '6', variant: 'number' },
  { label: '−', value: 'subtract', variant: 'operator' },

  // Row 4
  { label: '1', value: '1', variant: 'number' },
  { label: '2', value: '2', variant: 'number' },
  { label: '3', value: '3', variant: 'number' },
  { label: '+', value: 'add', variant: 'operator' },

  // Row 5
  { label: '√', value: 'sqrt', variant: 'action' },
  { label: '0', value: '0', variant: 'number' },
  { label: '.', value: '.', variant: 'number' },
  { label: '=', value: 'equals', variant: 'equals' },
];

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperation: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onSqrt: () => void;
  onToggleSign: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

export function Keypad({
  onDigit,
  onDecimal,
  onOperation,
  onEquals,
  onClear,
  onSqrt,
  onToggleSign,
  disabled,
}: KeypadProps) {
  const handleClick = (value: string) => {
    // Digits
    if (/^[0-9]$/.test(value)) {
      onDigit(value);
      return;
    }

    // Decimal
    if (value === '.') {
      onDecimal();
      return;
    }

    // Operations
    if (['add', 'subtract', 'multiply', 'divide', 'power'].includes(value)) {
      onOperation(value);
      return;
    }

    // Special actions
    switch (value) {
      case 'equals':
        onEquals();
        break;
      case 'clear':
        onClear();
        break;
      case 'sqrt':
        onSqrt();
        break;
      case 'toggleSign':
        onToggleSign();
        break;
      case 'percentage':
        onOperation('percentage');
        break;
    }
  };

  return (
    <div className="keypad" id="calculator-keypad">
      {BUTTONS.map((btn) => (
        <Button
          key={btn.value}
          config={btn}
          onClick={handleClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
