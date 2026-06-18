import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '../components/Calculator';

// Mock the API module.
vi.mock('../api/calculator', () => ({
  calculate: vi.fn(),
}));

import { calculate } from '../api/calculator';

const mockCalculate = vi.mocked(calculate);

/** Helper to get the display value element. */
function getDisplayValue() {
  return document.getElementById('display-value')!;
}

describe('Calculator component', () => {
  it('renders the display and all buttons', () => {
    render(<Calculator />);

    // Display shows 0.
    expect(getDisplayValue().textContent).toBe('0');

    // Number buttons.
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
    }

    // Operator buttons.
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument();

    // Action buttons.
    expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '√' })).toBeInTheDocument();
  });

  it('updates display when digits are clicked', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '5' }));
    expect(getDisplayValue().textContent).toBe('5');

    await user.click(screen.getByRole('button', { name: '3' }));
    expect(getDisplayValue().textContent).toBe('53');
  });

  it('clears the display', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '9' }));
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(getDisplayValue().textContent).toBe('0');
  });

  it('performs a calculation via API', async () => {
    mockCalculate.mockResolvedValueOnce({ result: 15 });
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    await vi.waitFor(() => {
      expect(getDisplayValue().textContent).toBe('15');
    });
  });

  it('displays errors from the API', async () => {
    mockCalculate.mockRejectedValueOnce(new Error('division by zero'));
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '÷' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    await vi.waitFor(() => {
      expect(getDisplayValue().textContent).toContain('division by zero');
    });
  });
});
