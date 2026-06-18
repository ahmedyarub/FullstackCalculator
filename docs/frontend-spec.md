# Frontend Specification

## Technology

- **Framework**: React 18+
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 5+
- **Testing**: Vitest + React Testing Library
- **Styling**: Vanilla CSS with CSS custom properties

## Component Architecture

```
App
└── Calculator
    ├── Display        Shows current value, expression, and errors
    └── Keypad
        └── Button[]   Individual calculator buttons
```

### Component Responsibilities

#### `App.tsx`
- Root component
- Renders page layout and Calculator

#### `Calculator.tsx`
- Main calculator container
- Uses `useCalculator` hook for state
- Passes state and callbacks to Display and Keypad

#### `Display.tsx`
- Shows the current expression (secondary line)
- Shows the current value or result (primary line)
- Shows error messages with distinct styling
- Shows loading indicator during API calls

#### `Keypad.tsx`
- Renders the button grid using CSS Grid
- Maps button definitions to Button components
- Handles button layout and grouping (numbers, operators, actions)

#### `Button.tsx`
- Individual button with label and onClick
- Supports variants: `number`, `operator`, `action`, `equals`
- Visual feedback on hover/active states

## State Management — `useCalculator` Hook

```typescript
interface CalculatorState {
  display: string;           // Current display value
  expression: string;        // Expression being built (e.g., "5 + ")
  previousValue: string | null;
  operation: string | null;
  waitingForSecondOperand: boolean;
  error: string | null;
  loading: boolean;
}
```

### State Transitions

| Action | Current State | Next State |
|--------|--------------|------------|
| Digit press | any | Append digit to display |
| Operator press | has display value | Store value, set operation, wait for second operand |
| Equals press | has both operands + operation | Call API, show result |
| Clear press | any | Reset all state |
| Decimal press | no decimal in display | Append "." to display |
| Sqrt press | has display value | Call API with sqrt operation |
| Percent press | has both operands | Call API with percentage operation |

### API Integration

The hook calls the API client when `=` is pressed or for unary operations (sqrt). Results update the display. Errors are shown on the display with red styling.

## API Client — `calculator.ts`

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function calculate(
  operation: string,
  a: number,
  b?: number
): Promise<{ result: number }>;
```

- Uses `fetch()` with `POST` method
- Throws on non-200 responses with the error message from the API
- Vite dev server proxies `/api` to `http://localhost:8080`

## Design System

### Color Palette (Dark Theme)

```css
--bg-primary: #0a0a0f;        /* Deep dark background */
--bg-secondary: #1a1a2e;      /* Card/calculator body */
--bg-glass: rgba(255,255,255,0.05); /* Glassmorphism panels */
--text-primary: #e0e0e0;
--text-secondary: #888;
--accent: #6c63ff;             /* Purple accent */
--accent-hover: #7c73ff;
--danger: #ff6b6b;             /* Error/division */
--success: #51cf66;            /* Result highlight */
--btn-number: rgba(255,255,255,0.08);
--btn-operator: rgba(108,99,255,0.3);
--btn-action: rgba(255,107,107,0.2);
```

### Typography

- Font family: `'Inter', system-ui, sans-serif`
- Display: 2.5rem, monospace feel
- Buttons: 1.25rem, semi-bold

### Responsive Breakpoints

- Desktop: max-width 400px calculator centered
- Tablet/Mobile (<768px): calculator fills width with padding
- Small mobile (<480px): larger buttons for touch targets

## Testing Strategy

### `useCalculator.test.ts`
- Digit entry and display updates
- Operation selection and state transitions
- API call triggering on equals
- Error handling from API failures
- Clear/reset functionality

### `Calculator.test.tsx`
- Renders all buttons
- Simulates a complete calculation flow
- Displays errors correctly
- Loading state during API call

## Build & Run

```bash
# Development (with proxy to backend at :8080)
cd frontend
npm install
npm run dev

# Production build
cd frontend
npm run build    # outputs to dist/

# Run tests
cd frontend
npm test
```

## Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
```
