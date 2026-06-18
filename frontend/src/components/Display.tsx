interface DisplayProps {
  value: string;
  expression: string;
  error: string | null;
  loading: boolean;
}

export function Display({ value, expression, error, loading }: DisplayProps) {
  return (
    <div className="display" id="calculator-display">
      <div className="display__expression" id="display-expression">
        {expression || '\u00A0'}
      </div>
      <div
        className={`display__value${error ? ' display__value--error' : ''}${loading ? ' display__value--loading' : ''}`}
        id="display-value"
      >
        {error ? `Error: ${error}` : value}
      </div>
      {loading && <div className="display__loading-bar" />}
    </div>
  );
}
