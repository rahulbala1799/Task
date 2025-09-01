import { TaskTemplate, Task, TaskCategory, MonthlyTaskGeneration } from '@/types';
import { generateId } from './storage';

const TEMPLATES_KEY = 'taskmanager_templates';
const GENERATION_KEY = 'taskmanager_monthly_generation';

export const loadTemplates = (): TaskTemplate[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

export const saveTemplates = (templates: TaskTemplate[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates:', error);
  }
};

export const loadMonthlyGeneration = (): MonthlyTaskGeneration | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(GENERATION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading monthly generation:', error);
    return null;
  }
};

export const saveMonthlyGeneration = (generation: MonthlyTaskGeneration): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(GENERATION_KEY, JSON.stringify(generation));
  } catch (error) {
    console.error('Error saving monthly generation:', error);
  }
};

export const getTemplatesByCategory = (category: TaskCategory): TaskTemplate[] => {
  return loadTemplates().filter(template => template.category === category);
};

export const generateTasksFromTemplates = (
  category: TaskCategory, 
  targetMonth?: string // Format: "YYYY-MM", defaults to current month
): Task[] => {
  const templates = getTemplatesByCategory(category);
  const now = new Date();
  const month = targetMonth || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [year, monthNum] = month.split('-').map(Number);
  
  return templates.map(template => {
    // Calculate due date if dueDayOfMonth is specified
    let dueDate = '';
    if (template.dueDayOfMonth) {
      const dueDateTime = new Date(year, monthNum - 1, template.dueDayOfMonth);
      dueDate = dueDateTime.toISOString().split('T')[0];
    }
    
    return {
      id: generateId(),
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority,
      completed: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueDate,
    };
  });
};

export const shouldGenerateMonthlyTasks = (): boolean => {
  const generation = loadMonthlyGeneration();
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  
  return !generation || generation.month !== currentMonth;
};

export const markMonthlyTasksGenerated = (): void => {
  const now = new Date();
  const generation: MonthlyTaskGeneration = {
    lastGenerated: now.toISOString(),
    month: now.toISOString().slice(0, 7), // "YYYY-MM"
  };
  
  saveMonthlyGeneration(generation);
};

// Helper function to check if a category supports templates
export const isRecurringCategory = (category: TaskCategory): boolean => {
  return category === 'month-end-phorest' || category === 'phorest-monthly';
};
