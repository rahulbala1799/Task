import { Task, TaskTemplate, MonthlyTaskGeneration } from '@/types';

// Task operations
export const loadTasksFromDB = async (): Promise<Task[]> => {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    
    const tasks = await response.json();
    // Convert database format to app format
    return tasks.map((task: any) => ({
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || new Date().toISOString(),
      dueDate: task.dueDate || undefined,
    }));
  } catch (error) {
    console.error('Error loading tasks from database:', error);
    return [];
  }
};

export const saveTaskToDB = async (task: Omit<Task, 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) throw new Error('Failed to save task');
    return await response.json();
  } catch (error) {
    console.error('Error saving task to database:', error);
    return null;
  }
};

export const updateTaskInDB = async (task: Task): Promise<Task | null> => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    console.error('Error updating task in database:', error);
    return null;
  }
};

export const deleteTaskFromDB = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting task from database:', error);
    return false;
  }
};

// Template operations
export const loadTemplatesFromDB = async (): Promise<TaskTemplate[]> => {
  try {
    const response = await fetch('/api/templates');
    if (!response.ok) throw new Error('Failed to fetch templates');
    
    const templates = await response.json();
    return templates.map((template: any) => ({
      ...template,
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: template.updatedAt || new Date().toISOString(),
      dueDayOfMonth: template.dueDayOfMonth || undefined,
    }));
  } catch (error) {
    console.error('Error loading templates from database:', error);
    return [];
  }
};

export const saveTemplateToDB = async (template: Omit<TaskTemplate, 'createdAt' | 'updatedAt'>): Promise<TaskTemplate | null> => {
  try {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });
    
    if (!response.ok) throw new Error('Failed to save template');
    return await response.json();
  } catch (error) {
    console.error('Error saving template to database:', error);
    return null;
  }
};

export const updateTemplateInDB = async (template: TaskTemplate): Promise<TaskTemplate | null> => {
  try {
    const response = await fetch('/api/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });
    
    if (!response.ok) throw new Error('Failed to update template');
    return await response.json();
  } catch (error) {
    console.error('Error updating template in database:', error);
    return null;
  }
};

export const deleteTemplateFromDB = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/templates?id=${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting template from database:', error);
    return false;
  }
};

// Migration utility
export const migrateLocalStorageToDatabase = async (): Promise<{ success: boolean; message: string; stats?: any }> => {
  try {
    // Get data from localStorage
    const tasks = JSON.parse(localStorage.getItem('taskmanager_tasks') || '[]');
    const templates = JSON.parse(localStorage.getItem('taskmanager_templates') || '[]');
    const monthlyGeneration = JSON.parse(localStorage.getItem('taskmanager_monthly_generation') || 'null');

    const response = await fetch('/api/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tasks,
        templates,
        monthlyGeneration,
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      // Clear localStorage after successful migration
      localStorage.removeItem('taskmanager_tasks');
      localStorage.removeItem('taskmanager_templates');
      localStorage.removeItem('taskmanager_monthly_generation');
      
      return result;
    } else {
      throw new Error(result.error || 'Migration failed');
    }
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Migration failed',
    };
  }
};
