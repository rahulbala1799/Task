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
  // Recurring task fields
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurringInterval?: number; // For custom: every X days
  recurringDays?: number[]; // For weekly: [0,1,2,3,4,5,6] (Sunday=0)
  recurringDayOfMonth?: number; // For monthly: day of month (1-31)
  lastGenerated?: string; // Last date this recurring task generated a new instance
  parentRecurringId?: string; // If this task was generated from a recurring task
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
  // Recurring task fields
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurringInterval?: number;
  recurringDays?: number[];
  recurringDayOfMonth?: number;
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
