import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType, Chart, registerables, ScaleOptionsByType } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="p-6">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Dashboard Overview</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Total Tasks</h3>
          <p class="text-4xl font-bold text-blue-600">{{ taskService.taskStats().total }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Tasks To Do</h3>
          <p class="text-4xl font-bold text-red-500">{{ taskService.taskStats().todo }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Tasks In Progress</h3>
          <p class="text-4xl font-bold text-yellow-500">{{ taskService.taskStats().inProgress }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Tasks Done</h3>
          <p class="text-4xl font-bold text-green-600">{{ taskService.taskStats().done }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Tasks by Status</h3>
          <div style="display: block; width: 100%; max-width: 400px;">
            <canvas baseChart
              [data]="pieChartData()"
              [options]="pieChartOptions"
              type="pie">
            </canvas>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Tasks Over Time (Placeholder)</h3>
          <div style="display: block; width: 100%; max-width: 600px;">
            <canvas baseChart
              [data]="lineChartData()"
              [options]="lineChartOptions"
              type="line">
            </canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  taskService = inject(TaskService);

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Status Distribution'
      }
    }
  };
  public pieChartData = computed<ChartConfiguration<'pie'>['data']>(() => {
    const stats = this.taskService.taskStats();
    return {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [
        {
          data: [stats.todo, stats.inProgress, stats.done],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        },
      ],
    };
  });

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tasks Trend Over Time'
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Placeholder labels
      } as ScaleOptionsByType<'category'>,
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks'
        }
      }
    }
  };
  public lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const xScales = this.lineChartOptions.scales?.['x'] as ScaleOptionsByType<'category'> | undefined;
    const labels = xScales?.labels as string[] | undefined;
    return {
      labels: labels || [],
      datasets: [
        {
          data: [65, 59, 80, 81, 56, 55], // Placeholder data
          label: 'Tasks Created',
          fill: true,
          tension: 0.3,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };
  });
}
