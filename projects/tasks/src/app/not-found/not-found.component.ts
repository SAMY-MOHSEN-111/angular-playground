import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="text-xl text-gray-600 mb-4">Page Not Found</p>
      <a routerLink="/dashboard" class="text-blue-500 hover:underline">Go to Dashboard</a>
    </div>
  `,
  styles: [`
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
}
