const BUTTON_BASE =
  'relative inline-flex items-center justify-center gap-sm font-medium transition-colors ' +
  'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

const BUTTON_SIZES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-sm py-xs text-xs rounded-sm',
  md: 'px-md py-sm text-sm rounded-md',
  lg: 'px-lg py-md text-md rounded-md',
};

const BUTTON_VARIANTS: Record<'primary' | 'danger' | 'ghost', string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  danger: 'bg-danger text-danger-foreground hover:bg-danger-hover',
  ghost: 'bg-transparent text-primary hover:bg-primary/10',
};

export {BUTTON_BASE, BUTTON_SIZES, BUTTON_VARIANTS};
