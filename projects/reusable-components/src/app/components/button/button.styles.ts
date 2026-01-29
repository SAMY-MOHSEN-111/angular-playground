const BUTTON_BASE =
  'relative inline-flex items-center justify-center gap-sm font-medium transition-colors cursor-pointer' +
  'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-sm py-xs text-xs rounded-sm',
  md: 'px-md py-sm text-sm rounded-md',
  lg: 'px-lg py-md text-md rounded-md',
};

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'outlined';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  danger: 'bg-danger text-danger-foreground hover:bg-danger-hover',
  ghost: 'bg-transparent text-primary hover:bg-primary/10',
  outlined: 'bg-transparent text-primary hover:bg-primary/10 border border-primary'
};

export {BUTTON_BASE, BUTTON_SIZES, BUTTON_VARIANTS, type ButtonSize , type ButtonVariant};
