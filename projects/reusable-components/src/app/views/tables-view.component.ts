import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TableComponent} from '../components/table/table';
import {StatusBadgeComponent} from '../components/badge/badge';
import {TTableColumn} from '../components/table/table.types';

export interface KanbanTask {
  id: string;
  title: string;
  image: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: string;
}

@Component({
  standalone: true,
  selector: 'ui-tables-view',
  imports: [
    TableComponent
  ],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Task Management</h1>
      <ui-table
      [tableDataRows]="tasks"
      [tableHeaderColumns]="columns"
      [isTableSelectionEnabled]="false">
    </ui-table>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesViewComponent {
  columns: TTableColumn<KanbanTask>[] = [
    {
      id: 'id',
      label: 'ID',
      value: 'id',
      width: 'minmax(80px, 0.5fr)',
      align: 'left'
    },
    {
      id: 'title',
      label: 'Task Title',
      value: 'title',
      width: 'minmax(250px, 2fr)'
    },
    {
      id: "image",
      label: 'Image',
      width: 'minmax(120px, 144px)',
      renderFn: (row: KanbanTask) => `<img src="${row.image}" alt="Task Image" class="rounded-md object-cover" />`
    },
    {
      id: 'assignee',
      label: 'Assignee',
      width: 'minmax(150px, 150px)',
      renderFn: (row: KanbanTask) => `
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            ${row.assignee.charAt(0)}
          </div>
          <span class="font-medium text-gray-700">${row.assignee}</span>
        </div>
      `
    },
    {
      id: 'status',
      label: 'Status',
      width: '120px',
      align: 'center',
      component: {
        type: StatusBadgeComponent,
        inputFn: (row: KanbanTask) => ({ status: row.status })
      }
    },
  ];

  // 2. Mock Data Array
  tasks: KanbanTask[] = [
    {
      id: 'TSK-001',
      title: 'Implement drag-and-drop functionality for columns, Implement drag-and-drop functionality for columns',
      image: "",
      status: 'In Progress',
      assignee: 'Ahmed'
    },
    {
      id: 'TSK-002',
      title: 'Design API for multi-tenant invitations',
      image: "",
      status: 'Done',
      assignee: 'Sarah'
    },
    {
      id: 'TSK-003',
      title: 'Refactor dashboard table to use CSS Grid and Tailwind',
      image: "",
      status: 'To Do',
      assignee: 'Omar'
    }
  ];
}
