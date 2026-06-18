import type { ButtonConfig } from '../types';

interface ButtonProps {
  config: ButtonConfig;
  onClick: (value: string) => void;
  disabled?: boolean;
}

export function Button({ config, onClick, disabled }: ButtonProps) {
  return (
    <button
      id={`btn-${config.value}`}
      className={`calc-btn calc-btn--${config.variant}${config.wide ? ' calc-btn--wide' : ''}`}
      onClick={() => onClick(config.value)}
      disabled={disabled}
      aria-label={config.label}
    >
      {config.label}
    </button>
  );
}
