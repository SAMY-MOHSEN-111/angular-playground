import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then((m) => m.TasksComponent),
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./new-task/new-task.component').then((m) => m.NewTaskComponent),
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./edit-task/edit-task.component').then((m) => m.EditTaskComponent),
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./task-detail/task-detail.component').then((m) => m.TaskDetailComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
