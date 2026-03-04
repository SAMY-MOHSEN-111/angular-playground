import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { switchMap, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      @if (task(); as currentTask) {
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-3xl font-extrabold text-gray-900">{{ currentTask.title }}</h2>
          <div class="flex space-x-2">
            <button [routerLink]="['/tasks', currentTask.id, 'edit']" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Edit
            </button>
            <button (click)="deleteTask()" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Description</h3>
            <p class="text-gray-700">{{ currentTask.description }}</p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Details</h3>
            <ul class="space-y-2">
              <li><strong>Status:</strong> <span class="capitalize">{{ currentTask.status.replace('_', ' ') }}</span></li>
              <li><strong>Priority:</strong> <span class="capitalize">{{ currentTask.priority }}</span></li>
              <li><strong>Due Date:</strong> {{ currentTask.dueDate | date:'mediumDate' }}</li>
              <li><strong>Created At:</strong> {{ currentTask.createdAt | date:'medium' }}</li>
              <li><strong>Updated At:</strong> {{ currentTask.updatedAt | date:'medium' }}</li>
            </ul>
          </div>
          @if (currentTask.assignee; as assignee) {
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Assignee</h3>
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {{ assignee.avatar }}
                </div>
                <div>
                  <p class="font-medium">{{ assignee.name }}</p>
                  <p class="text-sm text-gray-500">{{ assignee.email }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <p class="text-center text-gray-500">Task not found.</p>
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  private taskId = toSignal(this.route.paramMap.pipe(
    map(params => params.get('id')!)
  ));

  task = computed(() =>
    this.taskService.tasks().find(t => t.id === this.taskId())
  );

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      const taskId = this.taskId();
      if (taskId) {
        this.taskService.deleteTask(taskId);
        this.router.navigate(['/tasks']);
      }
    }
  }
}