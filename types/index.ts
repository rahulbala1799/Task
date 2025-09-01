export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export type TaskCategory = 'month-end-phorest' | 'phorest-monthly' | 'phorest-adhoc' | 'pnp-marketing' | 'pnp-printing' | 'personal';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface CategoryConfig {
  id: TaskCategory;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  dueDayOfMonth?: number; // Day of month when task is due (1-31)
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplateFormData {
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  dueDayOfMonth: number;
}

export interface MonthlyTaskGeneration {
  lastGenerated: string; // ISO date string of last generation
  month: string; // Format: "YYYY-MM"
}
