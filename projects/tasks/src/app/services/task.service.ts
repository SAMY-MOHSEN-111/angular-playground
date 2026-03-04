import { inject, Injectable, computed, signal, effect, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task, Assignee } from '../models/task.model';
import { tap, catchError, of, map } from 'rxjs';

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef); // Used for RxJS Interop cleanup

  private tasksUrl = 'http://localhost:3000/tasks';
  private usersUrl = 'http://localhost:3000/users';
  private localStorageKey = 'angular_kanban_tasks';

  // 1. FILTER SIGNALS (The inputs)
  statusFilter = signal<TaskStatus | 'all'>('all');
  priorityFilter = signal<TaskPriority | 'all'>('all');
  searchQuery = signal<string>('');

  // 2. DATA SOURCES & STATE

  // USERS: Read-only resource.
  // We use toSignal to convert the Observable directly into a Signal.
  // This removes the need to manually subscribe in the constructor.
  users = toSignal(
    this.http.get<Assignee[]>(this.usersUrl).pipe(
      catchError(err => {
        console.error('Error loading users', err);
        return of([] as Assignee[]);
      })
    ),
    { initialValue: [] as Assignee[] }
  );

  // TASKS: Mutable state.
  // We initialize with LocalStorage data immediately (Synchronous) for instant load.
  #tasksSignal = signal<Task[]>(this.loadFromStorage());

  // Expose specific signals if needed, or just the computed views
  tasks = this.#tasksSignal.asReadonly();

  // 3. COMPUTED VIEWS (The derived state)
  filteredTasks = computed(() => {
    // 1. Dependency tracking
    const tasks = this.tasks();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const query = this.searchQuery().toLowerCase();

    // 2. Filter Logic
    return tasks.filter(task => {
      const matchStatus = status === 'all' || task.status === status;
      const matchPriority = priority === 'all' || task.priority === priority;
      const matchQuery = !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee?.name.toLowerCase().includes(query) ||
        task.tags.some(t => t.toLowerCase().includes(query));

      return matchStatus && matchPriority && matchQuery;
    });
  });

  // Categorized Computeds (Cheap to create as they depend on filteredTasks)
  todoTasks = computed(() => this.filteredTasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.filteredTasks().filter(t => t.status === 'in_progress'));
  doneTasks = computed(() => this.filteredTasks().filter(t => t.status === 'done'));

  taskStats = computed(() => ({
    total: this.filteredTasks().length,
    todo: this.todoTasks().length,
    inProgress: this.inProgressTasks().length,
    done: this.doneTasks().length,
  }));

  constructor() {
    // 4. HYDRATION (Sync Server State)
    // We subscribe once to refresh the data from the server.
    // takeUntilDestroyed handles cleanup automatically.
    this.http.get<Task[]>(this.tasksUrl).pipe(
      takeUntilDestroyed(), // RxJS Interop: Auto-unsubscribe when service/component destroys
      catchError(error => {
        console.error('Server sync failed, using local data', error);
        return of(null); // Return null so we don't wipe local data on error
      })
    ).subscribe(serverTasks => {
      if (serverTasks) {
        this.#tasksSignal.set(serverTasks);
      }
    });

    // 5. PERSISTENCE EFFECT
    // Reacts purely to state changes.
    // Whenever #tasksSignal updates (via add, delete, or http load), we save to LS.
    effect(() => {
      const currentTasks = this.#tasksSignal();
      localStorage.setItem(this.localStorageKey, JSON.stringify(currentTasks));
    });
  }

  // 6. ACTIONS (Mutations)
  // We use Optimistic Updates: Update Signal immediately, then sync with API.

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignee'>) {
    const newTask = this.createTaskObject(taskData);

    // Optimistic Update: Add to UI immediately
    this.#tasksSignal.update(tasks => [...tasks, newTask]);

    // API Sync
    this.http.post<Task>(this.tasksUrl, newTask).pipe(
      takeUntilDestroyed(this.destroyRef), // Ensure request completes or cleans up
      catchError(err => {
        console.error('Failed to add task', err);
        // Rollback on error
        this.#tasksSignal.update(tasks => tasks.filter(t => t.id !== newTask.id));
        return of(null);
      })
    ).subscribe();
  }

  updateTask(updatedTask: Task) {
    // Optimistic Update
    const taskWithTimestamp = { ...updatedTask, updatedAt: new Date().toISOString() };

    this.#tasksSignal.update(tasks =>
      tasks.map(t => t.id === updatedTask.id ? taskWithTimestamp : t)
    );

    this.http.put<Task>(`${this.tasksUrl}/${updatedTask.id}`, taskWithTimestamp).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        console.error('Failed to update task', err);
        // We could roll back here, but for simplicity we just log
        return of(null);
      })
    ).subscribe();
  }

  deleteTask(id: string) {
    // Optimistic Update: Remove from UI immediately
    const previousTasks = this.#tasksSignal(); // snapshot for rollback
    this.#tasksSignal.update(tasks => tasks.filter(t => t.id !== id));

    this.http.delete(`${this.tasksUrl}/${id}`).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        console.error('Failed to delete', err);
        // Rollback
        this.#tasksSignal.set(previousTasks);
        return of(null);
      })
    ).subscribe();
  }

  // --- Helper Methods ---

  private loadFromStorage(): Task[] {
    const stored = localStorage.getItem(this.localStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private createTaskObject(taskData: any): Task {
    // Safe user fallback logic
    const currentUser = this.users()[0] || this.getFallbackUser();

    return {
      ...taskData,
      id: crypto.randomUUID(), // Generate ID locally for optimistic UI
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: currentUser,
      tags: taskData.tags || []
    };
  }

  private getFallbackUser(): Assignee {
    return { id: 'u0', name: 'Unknown', avatar: '', email: '', role: 'Guest' };
  }
}
