import { Task, TaskTemplate, MonthlyTaskGeneration } from '@/types';
import { loadTasks, saveTasks } from './storage';
import { loadTemplates, saveTemplates, loadMonthlyGeneration, saveMonthlyGeneration } from './templates';

export interface AppData {
  tasks: Task[];
  templates: TaskTemplate[];
  monthlyGeneration: MonthlyTaskGeneration | null;
  exportDate: string;
  version: string;
}

export const exportAllData = (): AppData => {
  const data: AppData = {
    tasks: loadTasks(),
    templates: loadTemplates(),
    monthlyGeneration: loadMonthlyGeneration(),
    exportDate: new Date().toISOString(),
    version: '1.0',
  };
  
  return data;
};

export const importAllData = (data: AppData): { success: boolean; message: string; stats: any } => {
  try {
    // Validate data structure
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid data format', stats: null };
    }

    const stats = {
      tasksImported: 0,
      templatesImported: 0,
      existingTasks: loadTasks().length,
      existingTemplates: loadTemplates().length,
    };

    // Import tasks
    if (Array.isArray(data.tasks)) {
      saveTasks(data.tasks);
      stats.tasksImported = data.tasks.length;
    }

    // Import templates
    if (Array.isArray(data.templates)) {
      saveTemplates(data.templates);
      stats.templatesImported = data.templates.length;
    }

    // Import monthly generation data
    if (data.monthlyGeneration) {
      saveMonthlyGeneration(data.monthlyGeneration);
    }

    return { 
      success: true, 
      message: 'Data imported successfully!', 
      stats 
    };
  } catch (error) {
    console.error('Import error:', error);
    return { 
      success: false, 
      message: 'Failed to import data: ' + (error instanceof Error ? error.message : 'Unknown error'), 
      stats: null 
    };
  }
};

export const downloadDataAsFile = () => {
  const data = exportAllData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskmanager-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadDataFromFile = (file: File): Promise<{ success: boolean; message: string; stats: any }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as AppData;
        const result = importAllData(data);
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          message: 'Invalid file format or corrupted data',
          stats: null,
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file',
        stats: null,
      });
    };
    
    reader.readAsText(file);
  });
};

// Quick sync via text (for copy/paste between devices)
export const getDataAsText = (): string => {
  const data = exportAllData();
  return JSON.stringify(data);
};

export const importDataFromText = (text: string): { success: boolean; message: string; stats: any } => {
  try {
    const data = JSON.parse(text) as AppData;
    return importAllData(data);
  } catch (error) {
    return {
      success: false,
      message: 'Invalid data format',
      stats: null,
    };
  }
};
