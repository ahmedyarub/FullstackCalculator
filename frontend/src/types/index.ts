export interface CalculateRequest {
  operation: string;
  a: number;
  b?: number;
}

export interface CalculateResponse {
  result: number;
}

export interface ErrorResponse {
  error: string;
}

export type Operation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'percentage';

export interface ButtonConfig {
  label: string;
  value: string;
  variant: 'number' | 'operator' | 'action' | 'equals';
  wide?: boolean;
}
