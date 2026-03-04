# Angular Dashboard - Requirements & Testing Guide

## Run the generate-mock-data.js file to generate data

```Bash!
node generate-mock-data.js
```

## Project Overview

Build a modern Angular dashboard application using the latest Angular Signals paradigm and zoneless architecture. The application should demonstrate proficiency in routing, state management, data visualization, and interactive UI components.

## Technical Requirements

### Core Technologies

- **Angular Version:** 21
- **Change Detection:** Zoneless
- **State Management:** Angular Signals (no NgRx or other state libraries)
- **TypeScript:** Strict mode enabled
- **Styling:** CSS/SCSS (or Tailwind CSS)

### Architecture Pattern

- Standalone components (no NgModules)
- Signal-based reactive state management
- Zoneless change detection
- Clean component structure with separation of concerns

---

## Feature Requirements

### 1. Routing & Navigation Requirements

#### Implement Angular Router with at least 3 routes:

- Dashboard (home page with charts)
- Tasks/Todos page (drag and drop kanban board)
- Task details page (individual task view/edit)

#### Additional Requirements:

- ✅ Navigation menu/sidebar that highlights the active route
- ✅ Route guards for navigation (optional: protect certain routes)
- ✅ Lazy loading for at least one route module
- ✅ 404 Not Found page for invalid routes

#### Test Criteria

```typescript
// Test 1: Navigation works correctly
✓ Clicking navigation links updates the URL
✓ Browser back/forward buttons work
✓ Direct URL navigation loads correct component
✓ Active route is visually indicated in navigation

// Test 2: Lazy loading
✓ Check network tab - lazy routes load separately
✓ Initial bundle size is optimized
```

---

### 2. Charts & Data Visualization

#### Requirements

- ✅ Integrate a charting library (Chart.js, ng2-charts, or ApexCharts)
- ✅ Display at least 2 different chart types:
  - Tasks by status (pie/doughnut chart)
  - Tasks over time (line/bar chart)
- ✅ Charts update reactively when todo data changes
- ✅ Charts use signals for data binding
- ✅ Responsive chart sizing

#### Test Criteria

```typescript
// Test 1: Chart rendering
✓ Charts display on dashboard load
✓ Chart data is accurate
✓ Charts are responsive (resize with window)

// Test 2: Reactive updates
✓ Creating a new task updates the chart
✓ Moving task status updates pie chart
✓ Deleting a task updates charts
✓ Changes reflect immediately (no manual refresh)
```

---

### 3. Drag and Drop Kanban Board

#### Requirements

- ✅ Three columns: "Todo", "In Progress", "Done"
- ✅ Use Angular CDK Drag and Drop
- ✅ Tasks can be dragged between columns
- ✅ Visual feedback during drag (hover states, placeholders)
- ✅ Status updates automatically when dropped in new column
- ✅ Prevent invalid drops
- ✅ Drag handle for better UX (optional)

#### Test Criteria

```typescript
// Test 1: Drag functionality
✓ Can pick up task card
✓ Can drag task to different column
✓ Drop updates task status
✓ Task appears in correct position after drop

// Test 2: Visual feedback
✓ Drag placeholder shows where task will land
✓ Hover state on drop zones
✓ Smooth animations during drag/drop

// Test 3: State management
✓ Status change persists (via signal updates)
✓ Charts update when status changes
✓ No console errors during drag operations
```

---

### 4. Todo/Task Management

#### Requirements

**Create New Task**

- Form with fields: title, description, status, priority (optional)
- Form validation (title required, max length)
- Use reactive forms

**Edit Existing Task**

- Click task to open edit mode/modal
- Pre-populate form with existing data

**Delete Task**

- Delete button with confirmation

**Task Properties**

- Unique ID
- Title (required)
- Description
- Status: Todo | In Progress | Done
- Created date
- - Priority (optional): Low | Medium | High

#### Test Criteria

```typescript
// Test 1: Create task
✓ Form appears when "Add Task" clicked
✓ Validation shows errors for invalid input
✓ Cannot submit with empty title
✓ New task appears in "Todo" column
✓ Form resets after successful creation

// Test 2: Edit task
✓ Clicking task opens edit form
✓ Form is pre-filled with current data
✓ Changes save correctly
✓ UI updates immediately after save
✓ Cancel button discards changes

// Test 3: Delete task
✓ Delete button triggers confirmation
✓ Confirming removes task from board
✓ Canceling keeps task
✓ Charts update after deletion
```

---

### 5. Angular Signals Implementation

#### Requirements

- ✅ All state managed with signals (no traditional RxJS BehaviorSubjects for state)
- ✅ Use `signal()`, `computed()`, and `effect()` and so on ... appropriately
- ✅ Signal-based services for data management
- ✅ No manual change detection calls needed
- ✅ Computed signals for derived state (e.g., task counts, filtering)

#### Example Structure

```typescript
// Task Service
export class TaskService {
  // Writable signals
  #tasksSignal = signal<Task[]>([]);

  // Read-only public signal
  tasks = this.#tasksSignal.asReadonly();

  // Computed signals
  todoTasks = computed(() => this.tasks().filter((t) => t.status === "Todo"));

  inProgressTasks = computed(() => this.tasks().filter((t) => t.status === "In Progress"));

  doneTasks = computed(() => this.tasks().filter((t) => t.status === "Done"));

  taskStats = computed(() => ({
    total: this.tasks().length,
    todo: this.todoTasks().length,
    inProgress: this.inProgressTasks().length,
    done: this.doneTasks().length,
  }));
}
```

#### Test Criteria

```typescript
// Test 1: Signal reactivity
✓ UI updates when signal changes
✓ No manual change detection needed
✓ Computed signals recalculate automatically

// Test 2: No Zone.js
✓ Application runs without Zone.js
✓ No zone-related imports
✓ provideExperimentalZonelessChangeDetection() in config
```

---

### 6. Zoneless Configuration

#### Requirements

- ✅ `main.ts` configured with zoneless change detection
- ✅ No `zone.js` in polyfills
- ✅ All async operations trigger change detection via signals
- ✅ OnPush change detection strategy (if needed)

#### Configuration Example

```typescript
// main.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // other providers
  ],
});
```

#### Test Criteria

```typescript
// Test 1: Zoneless verification
✓ Check bundle - no zone.js included
✓ Application works without Zone.js polyfill
✓ All UI updates work correctly
✓ No console warnings about zones
```

---

## Code Quality Requirements

### TypeScript

- ✅ Strict mode enabled
- ✅ No `any` types (use proper typing)
- ✅ Interfaces/types for all data models
- ✅ Proper type inference

### Code Organization

- ✅ Components folder structure
- ✅ Services in separate files
- ✅ Models/interfaces in dedicated files
- ✅ Reusable components extracted

### Best Practices

- ✅ OnPush change detection where appropriate
- ✅ No memory leaks
- ✅ DRY principle followed
- ✅ Single Responsibility Principle
- ✅ Meaningful variable/function names

---

## Performance Requirements

- ✅ Initial load time < 3 seconds
- ✅ Smooth drag and drop (60fps)
- ✅ Charts render without lag
- ✅ Bundle size optimized (lazy loading)
- ✅ No unnecessary re-renders

---

## Bonus Features (Optional)

- Task filtering (by status, priority)
- Task search functionality
- Local storage persistence
- Dark mode toggle
- Task due dates
- Task assignment to users
- Export tasks to JSON/CSV
- Unit tests (vitest)
- E2E tests (Playwright)

---

## Deliverables

### Documentation

- Component documentation
- Signal flow explanation
- Setup and run instructions

### Demo

- Working application
- Deployed version (optional: github pages)

---

## Evaluation Criteria

| Category                | Weight | Criteria                                   |
| ----------------------- | ------ | ------------------------------------------ |
| Functionality           | 30%    | All features work as specified             |
| Signals Usage           | 25%    | Proper signal implementation, no manual CD |
| Code Quality            | 20%    | Clean, typed, organized code               |
| Zoneless Implementation | 15%    | Correctly configured and working           |
| UI/UX                   | 10%    | Responsive, intuitive interface            |

---
