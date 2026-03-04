import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="p-6">
      <app-task-form [task]="task()" (save)="onSave($event)"></app-task-form>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTaskComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  private taskId = toSignal(this.route.paramMap.pipe(
    map(params => params.get('id')!)
  ));

  task = computed(() =>
    this.taskService.tasks().find(t => t.id === this.taskId())
  );

  onSave(task: Task) {
    this.taskService.updateTask(task);
    this.router.navigate(['/tasks', task.id]);
  }
}
