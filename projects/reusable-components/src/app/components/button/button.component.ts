import {Component, computed, input, output} from '@angular/core';
import {BUTTON_BASE, BUTTON_SIZES, BUTTON_VARIANTS} from './button.styles';

type ButtonVariant = 'primary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      type="button"
      [class]="classes()"
      [disabled]="isDisabled()"
      (click)="onClick()"
    >
      @if (loading()) {
        <span class="absolute inline-block h-4 w-4 animate-spin rounded-pill border-2 border-current border-t-transparent"></span>
      }

      <span class="inline-flex items-center gap-sm" [class.opacity-0]="loading()">
        <ng-content select="ui-leading-icon"></ng-content>
        <ng-content></ng-content>
        <ng-content select="ui-trailing-icon"></ng-content>
      </span>
    </button>
  `,
})
export class UiButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  loading = input(false);
  disabled = input(false);
  clicked = output<void>();
  classes = computed(() => [BUTTON_BASE, BUTTON_SIZES[this.size()], BUTTON_VARIANTS[this.variant()]].join(' '));

  isDisabled = computed(() => this.disabled() || this.loading());
  onClick() {
    !this.isDisabled() && this.clicked.emit();
  }
}
