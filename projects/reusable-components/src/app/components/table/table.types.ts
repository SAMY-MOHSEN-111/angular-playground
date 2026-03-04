import { Type } from "@angular/core";

export type TTableRenderComponent<T, C = unknown> = {
  type: Type<C>;
  inputFn?: (row: T) => Record<string, unknown>;
};

export type TTableColumn<T, C = unknown> = {
  id: string;
  label: string;
  value?: keyof T;
  align?: 'left' | 'center' | 'right';
  width?: string;
  appliedClasses?: string;
  renderFn?: (row: T) => string;
  component?: TTableRenderComponent<T, C>;
};
