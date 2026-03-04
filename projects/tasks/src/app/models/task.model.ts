export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  isOverdue?: boolean;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Stat {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: 'positive' | 'negative';
  color: string;
}

export interface Meta {
  totalTasks: number;
  totalUsers: number;
  generatedAt: string;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
  };
}

export interface Data {
  tasks: Task[];
  statistics: Stat[];
  users: Assignee[];
  meta: Meta;
}
