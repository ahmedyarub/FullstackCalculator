import { CalculateRequest, CalculateResponse, ErrorResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Sends a calculation request to the backend API.
 * Throws an Error with the server's error message on failure.
 */
export async function calculate(
  operation: string,
  a: number,
  b?: number
): Promise<CalculateResponse> {
  const body: CalculateRequest = { operation, a };
  if (b !== undefined) {
    body.b = b;
  }

  const response = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Calculation failed');
  }

  return response.json();
}

/**
 * Checks if the backend API is healthy.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
