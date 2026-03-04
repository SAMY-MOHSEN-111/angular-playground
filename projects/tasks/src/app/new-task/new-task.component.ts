import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="p-6">
      <app-task-form (save)="onSave($event)"></app-task-form>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskComponent {
  private router = inject(Router);
  private taskService = inject(TaskService);

  async onSave(task: Task) {
    this.taskService.addTask(task);
    await this.router.navigate(['/tasks']);
  }
}
