import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { signal } from '@angular/core';
import { Task, Assignee } from '../models/task.model';
import { toSignal } from '@angular/core/rxjs-interop';

// Mock data
const MOCK_USERS: Assignee[] = [
  { id: 'user-001', name: 'John Doe', avatar: 'JD', email: 'john.doe@company.com', role: 'Developer' },
  { id: 'user-002', name: 'Sarah Smith', avatar: 'SS', email: 'sarah.smith@company.com', role: 'Designer' },
];

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo', priority: 'high', dueDate: '2026-03-01', assignee: MOCK_USERS[0], tags: ['dev'], createdAt: '', updatedAt: '' },
  { id: '2', title: 'Task 2', description: 'Desc 2', status: 'in_progress', priority: 'medium', dueDate: '2026-03-05', assignee: MOCK_USERS[1], tags: ['design'], createdAt: '', updatedAt: '' },
  { id: '3', title: 'Task 3', description: 'Desc 3', status: 'done', priority: 'low', dueDate: '2026-03-10', assignee: MOCK_USERS[0], tags: ['dev'], createdAt: '', updatedAt: '' },
  { id: '4', title: 'Another Todo', description: 'Important', status: 'todo', priority: 'high', dueDate: '2026-03-02', assignee: MOCK_USERS[1], tags: ['urgent'], createdAt: '', updatedAt: '' },
];

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Initial requests for users and tasks
    const usersReq = httpTestingController.expectOne('http://localhost:3000/users');
    usersReq.flush(MOCK_USERS);
    const tasksReq = httpTestingController.expectOne('http://localhost:3000/tasks');
    tasksReq.flush(MOCK_TASKS);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load tasks from json-server and initialize signals', () => {
    expect(service.tasks()).toEqual(MOCK_TASKS);
    expect(service.users()).toEqual(MOCK_USERS);
    expect(service.todoTasks().length).toBe(2);
    expect(service.inProgressTasks().length).toBe(1);
    expect(service.doneTasks().length).toBe(1);
    expect(service.taskStats().total).toBe(4);
  });

  it('should load tasks from localStorage if available', () => {
    localStorage.setItem('angular_kanban_tasks', JSON.stringify([MOCK_TASKS[0]]));
    // Re-create service to trigger localStorage load
    service = new TaskService(TestBed.inject(HttpClient)); // Inject HttpClient manually
    expect(service.tasks()).toEqual([MOCK_TASKS[0]]);
  });

  it('should add a task', (done) => {
    const newTaskDetails = {
      title: 'New Task',
      description: 'New Description',
      status: 'todo' as 'todo',
      priority: 'low' as 'low',
      dueDate: '2026-03-15',
      tags: ['new']
    };

    service.addTask(newTaskDetails);

    const req = httpTestingController.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('POST');
    // Expect the assignee to be the first user from MOCK_USERS if available
    expect(req.request.body.assignee).toEqual(MOCK_USERS[0]);
    req.flush({ ...newTaskDetails, id: '5', assignee: MOCK_USERS[0], createdAt: '', updatedAt: '' });

    // Wait for the asynchronous update to the signal
    setTimeout(() => {
      expect(service.tasks().length).toBe(MOCK_TASKS.length + 1);
      expect(service.tasks()).toContain(jasmine.objectContaining({ title: 'New Task' }));
      done();
    }, 0);
  });

  it('should update a task', (done) => {
    const updatedTask: Task = { ...MOCK_TASKS[0], title: 'Updated Task 1' };
    service.updateTask(updatedTask);

    const req = httpTestingController.expectOne(`http://localhost:3000/tasks/${updatedTask.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);

    setTimeout(() => {
      expect(service.tasks()).toContain(jasmine.objectContaining({ title: 'Updated Task 1' }));
      done();
    }, 0);
  });

  it('should delete a task', (done) => {
    const taskIdToDelete = MOCK_TASKS[0].id;
    service.deleteTask(taskIdToDelete);

    const req = httpTestingController.expectOne(`http://localhost:3000/tasks/${taskIdToDelete}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    setTimeout(() => {
      expect(service.tasks().length).toBe(MOCK_TASKS.length - 1);
      expect(service.tasks().find(t => t.id === taskIdToDelete)).toBeUndefined();
      done();
    }, 0);
  });

  it('should filter tasks by status', () => {
    service.statusFilter.set('done');
    expect(service.filteredTasks().length).toBe(1);
    expect(service.filteredTasks()[0].status).toBe('done');
  });

  it('should filter tasks by priority', () => {
    service.priorityFilter.set('high');
    expect(service.filteredTasks().length).toBe(2);
    expect(service.filteredTasks().every(t => t.priority === 'high')).toBe(true);
  });

  it('should filter tasks by search query', () => {
    service.searchQuery.set('task 1');
    expect(service.filteredTasks().length).toBe(1);
    expect(service.filteredTasks()[0].title).toBe('Task 1');

    service.searchQuery.set('sarah smith'); // Search by assignee name
    expect(service.filteredTasks().length).toBe(2);
  });

  it('should combine filters', () => {
    service.statusFilter.set('todo');
    service.priorityFilter.set('high');
    service.searchQuery.set('task');
    expect(service.filteredTasks().length).toBe(1);
    expect(service.filteredTasks()[0].id).toBe('1');
  });

  it('should save tasks to localStorage on changes', (done) => {
    const updatedTask: Task = { ...MOCK_TASKS[0], title: 'LocalStorage Test' };
    service.updateTask(updatedTask);

    const req = httpTestingController.expectOne(`http://localhost:3000/tasks/${updatedTask.id}`);
    req.flush(updatedTask);

    setTimeout(() => {
      expect(localStorage.getItem('angular_kanban_tasks')).toContain('LocalStorage Test');
      done();
    }, 0);
  });
});