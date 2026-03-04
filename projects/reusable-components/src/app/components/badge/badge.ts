import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-2 py-1 text-xs font-medium rounded-full"
          [ngClass]="{
            'bg-green-100 text-green-800': status() === 'Done',
            'bg-blue-100 text-blue-800': status() === 'In Progress',
            'bg-gray-100 text-gray-800': status() === 'To Do'
          }">
      {{ status() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<string>();
}
