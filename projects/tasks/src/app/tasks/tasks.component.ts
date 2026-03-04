import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder, RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Task Board</h2>
        <div class="flex space-x-4">
          <button [routerLink]="['/tasks/new']" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Create Task
          </button>
          <button (click)="exportToJson()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export to JSON
          </button>
          <button (click)="exportToCsv()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export to CSV
          </button>
        </div>
      </div>

      <!-- Filter Controls and Search -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div class="flex space-x-4">
          <div>
            <label for="statusFilter" class="block text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              id="statusFilter"
              [ngModel]="taskService.statusFilter()"
              (ngModelChange)="taskService.statusFilter.set($event)"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label for="priorityFilter" class="block text-sm font-medium text-gray-700">Filter by Priority:</label>
            <select
              id="priorityFilter"
              [ngModel]="taskService.priorityFilter()"
              (ngModelChange)="taskService.priorityFilter.set($event)"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="w-full sm:w-1/3">
          <label for="searchQuery" class="block text-sm font-medium text-gray-700">Search Tasks:</label>
          <input
            id="searchQuery"
            type="text"
            [(ngModel)]="taskService.searchQuery"
            placeholder="Search by title, description, assignee, tag"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>


      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" cdkDropListGroup>
        <!-- To Do Column -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">To Do ({{ taskService.todoTasks().length }})</h3>
          <div
            id="todoList"
            cdkDropList
            [cdkDropListData]="taskService.todoTasks()"
            class="min-h-[100px] p-2 bg-white rounded-md border border-dashed border-gray-300"
            (cdkDropListDropped)="drop($event)"
          >
            @for (task of taskService.todoTasks(); track task.id) {
              <div
                class="bg-blue-100 p-3 mb-3 rounded-md shadow-sm cursor-grab"
                cdkDrag
                [cdkDragPreviewClass]="['custom-drag-preview', task.status + '-preview']"
                [routerLink]="['/tasks', task.id]"
              >
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-blue-800">{{ task.title }}</h4>
                  <span class="text-sm text-gray-600">{{ task.priority }}</span>
                </div>
                <p class="text-sm text-blue-700 mt-1">{{ task.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <span>Due: {{ task.dueDate | date }}</span>
                  @if (task.assignee) {
                    <div class="flex items-center space-x-1">
                      <div class="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">
                        {{ task.assignee.avatar }}
                      </div>
                      <span class="font-medium">{{ task.assignee.name }}</span>
                    </div>
                  }
                </div>
              </div>
            }
            <div *cdkDragPlaceholder class="bg-gray-200 border border-dashed border-gray-400 h-16 rounded-md"></div>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">In Progress ({{ taskService.inProgressTasks().length }})</h3>
          <div
            id="inProgressList"
            cdkDropList
            [cdkDropListData]="taskService.inProgressTasks()"
            class="min-h-[100px] p-2 bg-white rounded-md border border-dashed border-gray-300"
            (cdkDropListDropped)="drop($event)"
          >
            @for (task of taskService.inProgressTasks(); track task.id) {
              <div
                class="bg-yellow-100 p-3 mb-3 rounded-md shadow-sm cursor-grab"
                cdkDrag
                [cdkDragPreviewClass]="['custom-drag-preview', task.status + '-preview']"
                [routerLink]="['/tasks', task.id]"
              >
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-yellow-800">{{ task.title }}</h4>
                  <span class="text-sm text-gray-600">{{ task.priority }}</span>
                </div>
                <p class="text-sm text-yellow-700 mt-1">{{ task.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <span>Due: {{ task.dueDate | date }}</span>
                  @if (task.assignee) {
                    <div class="flex items-center space-x-1">
                      <div class="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">
                        {{ task.assignee.avatar }}
                      </div>
                      <span class="font-medium">{{ task.assignee.name }}</span>
                    </div>
                  }
                </div>
              </div>
            }
            <div *cdkDragPlaceholder class="bg-gray-200 border border-dashed border-gray-400 h-16 rounded-md"></div>
          </div>
        </div>

        <!-- Done Column -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Done ({{ taskService.doneTasks().length }})</h3>
          <div
            id="doneList"
            cdkDropList
            [cdkDropListData]="taskService.doneTasks()"
            class="min-h-[100px] p-2 bg-white rounded-md border border-dashed border-gray-300"
            (cdkDropListDropped)="drop($event)"
          >
            @for (task of taskService.doneTasks(); track task.id) {
              <div
                class="bg-green-100 p-3 mb-3 rounded-md shadow-sm cursor-grab"
                cdkDrag
                [cdkDragPreviewClass]="['custom-drag-preview', task.status + '-preview']"
                [routerLink]="['/tasks', task.id]"
              >
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-green-800">{{ task.title }}</h4>
                  <span class="text-sm text-gray-600">{{ task.priority }}</span>
                </div>
                <p class="text-sm text-green-700 mt-1">{{ task.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <span>Due: {{ task.dueDate | date }}</span>
                  @if (task.assignee) {
                    <div class="flex items-center space-x-1">
                      <div class="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">
                        {{ task.assignee.avatar }}
                      </div>
                      <span class="font-medium">{{ task.assignee.name }}</span>
                    </div>
                  }
                </div>
              </div>
            }
            <div *cdkDragPlaceholder class="bg-gray-200 border border-dashed border-gray-400 h-16 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  taskService = inject(TaskService);

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      let newStatus: 'todo' | 'in_progress' | 'done';
      switch (event.container.id) {
        case 'todoList':
          newStatus = 'todo';
          break;
        case 'inProgressList':
          newStatus = 'in_progress';
          break;
        case 'doneList':
          newStatus = 'done';
          break;
        default:
          return; // Should not happen
      }

      this.taskService.updateTask({ ...task, status: newStatus });
    }
  }

  exportToJson() {
    const data = JSON.stringify(this.taskService.filteredTasks(), null, 2);
    this.downloadFile(data, 'tasks.json', 'application/json');
  }

  exportToCsv() {
    const tasks = this.taskService.filteredTasks();
    if (tasks.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const headers = Object.keys(tasks[0]).filter(key => key !== 'assignee' && key !== 'tags');
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add headers

    for (const task of tasks) {
      const values = headers.map(header => {
        // Handle nested assignee object and arrays for tags
        if (header === 'assignee' && task.assignee) {
          return task.assignee.name; // Export assignee name
        }
        if (header === 'tags' && task.tags) {
          return `"${task.tags.join(';')}"`; // Join tags with semicolon and quote
        }
        const value = (task as any)[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }

    const data = csvRows.join('\n');
    this.downloadFile(data, 'tasks.csv', 'text/csv');
  }

  private downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
