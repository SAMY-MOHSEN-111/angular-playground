import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task, Assignee } from '../models/task.model';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service'; // Import TaskService

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">{{ task ? 'Edit Task' : 'Create Task' }}</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            formControlName="title"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
            <div class="text-red-500 text-sm mt-1">Title is required.</div>
          }
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            formControlName="status"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            formControlName="priority"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="assignee" class="block text-sm font-medium text-gray-700">Assignee</label>
          <select
            id="assignee"
            formControlName="assignee"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            @for (user of taskService.users(); track user.id) {
              <option [ngValue]="user">{{ user.name }}</option>
            }
          </select>
        </div>

        <div class="flex justify-end space-x-4">
          <button type="button" (click)="onCancel()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" [disabled]="taskForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task?: Task;
  @Output() save = new EventEmitter<Task>();

  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  protected taskService = inject(TaskService); // Make protected to be accessible in template

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    status: ['todo', Validators.required],
    priority: ['medium', Validators.required],
    assignee: [null, Validators.required], // Add assignee form control
  });

  ngOnInit() {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      this.updateForm();
    }
  }

  updateForm() {
    if (this.task) {
      this.taskForm.patchValue(this.task);
    } else {
      // Set default assignee for new tasks if available
      if (this.taskService.users().length > 0) {
        this.taskForm.get('assignee')?.patchValue(this.taskService.users()[0]);
      }
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.save.emit({
        ...this.task,
        ...this.taskForm.value,
        assignee: this.taskForm.get('assignee')?.value, // Ensure assignee object is passed
      });
    }
  }

  async onCancel() {
    await this.router.navigate(['/tasks']);
  }
}
