import {Component} from '@angular/core';
import {UiButtonComponent} from '../components/button/button.component';
import {UiLeadingIconComponent} from '../components/icon/leading-icon.component';
import {UiTrailingIconComponent} from '../components/icon/trailing-icon.component';

@Component({
  standalone: true,
  'selector': 'ui-buttons-view',
  imports: [
    UiButtonComponent,
    UiLeadingIconComponent,
    UiTrailingIconComponent
  ],
  'template': `
    <div class="space-y-8">
      <!-- Variants -->
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-lg font-semibold text-gray-700">Variants</h2>
        <div class="flex gap-4 items-center">
          <ui-button variant="primary">Primary</ui-button>
          <ui-button variant="danger">Danger</ui-button>
          <ui-button variant="ghost">Ghost</ui-button>
          <ui-button variant="outlined">Ghost</ui-button>
        </div>
      </div>

      <!-- Sizes -->
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-lg font-semibold text-gray-700">Sizes</h2>
        <div class="flex gap-4 items-center">
          <ui-button size="sm">Small</ui-button>
          <ui-button size="md">Medium</ui-button>
          <ui-button size="lg">Large</ui-button>
        </div>
      </div>

      <!-- States -->
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-lg font-semibold text-gray-700">States</h2>
        <div class="flex gap-4 items-center">
          <ui-button>Normal</ui-button>
          <ui-button [loading]="true">Loading</ui-button>
          <ui-button [disabled]="true">Disabled</ui-button>
        </div>
      </div>

      <!-- Icons -->
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-lg font-semibold text-gray-700">With Icons</h2>
        <div class="flex gap-4 items-center">
          <ui-button>
            <ui-leading-icon>★</ui-leading-icon>
            Leading
          </ui-button>
          <ui-button>
            Trailing
            <ui-trailing-icon>➔</ui-trailing-icon>
          </ui-button>
          <ui-button>
            <ui-leading-icon>♻</ui-leading-icon>
            Both
            <ui-trailing-icon>▼</ui-trailing-icon>
          </ui-button>
          <ui-button variant="ghost">
            <ui-leading-icon>😂</ui-leading-icon>
            Ghost with Icons
            <ui-trailing-icon>😅</ui-trailing-icon>
          </ui-button>
        </div>
      </div>
    </div>
  `
})
export class ButtonsViewComponent {
}
