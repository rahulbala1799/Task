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
