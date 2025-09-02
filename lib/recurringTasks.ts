import { Task } from '@/types';

export function generateNextTaskDate(task: Task, fromDate: Date = new Date()): Date | null {
  if (!task.isRecurring || !task.recurringType) return null;

  const nextDate = new Date(fromDate);

  switch (task.recurringType) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case 'weekly':
      if (!task.recurringDays || task.recurringDays.length === 0) return null;
      
      // Find the next day that matches one of the recurring days
      let daysToAdd = 1;
      for (let i = 1; i <= 7; i++) {
        const testDate = new Date(fromDate);
        testDate.setDate(testDate.getDate() + i);
        const dayOfWeek = testDate.getDay();
        
        if (task.recurringDays.includes(dayOfWeek)) {
          daysToAdd = i;
          break;
        }
      }
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      break;

    case 'monthly':
      if (!task.recurringDayOfMonth) return null;
      
      // Move to next month
      nextDate.setMonth(nextDate.getMonth() + 1);
      nextDate.setDate(task.recurringDayOfMonth);
      
      // Handle cases where the day doesn't exist in the month (e.g., Feb 31)
      if (nextDate.getDate() !== task.recurringDayOfMonth) {
        // Set to last day of the month
        nextDate.setDate(0);
      }
      break;

    case 'custom':
      if (!task.recurringInterval) return null;
      nextDate.setDate(nextDate.getDate() + task.recurringInterval);
      break;

    default:
      return null;
  }

  return nextDate;
}

export function createRecurringTaskInstance(originalTask: Task, dueDate: Date): Task {
  const newTask: Task = {
    ...originalTask,
    id: Math.random().toString(36).substr(2, 15),
    completed: false,
    dueDate: dueDate.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentRecurringId: originalTask.id,
    // Don't make the generated task recurring itself
    isRecurring: false,
    recurringType: undefined,
    recurringInterval: undefined,
    recurringDays: undefined,
    recurringDayOfMonth: undefined,
    lastGenerated: undefined,
  };

  return newTask;
}

export function shouldGenerateNewTask(task: Task): boolean {
  if (!task.isRecurring || !task.recurringType) return false;

  const now = new Date();
  const lastGenerated = task.lastGenerated ? new Date(task.lastGenerated) : new Date(task.createdAt);
  
  // Check if we need to generate a new task based on the recurring schedule
  const nextDueDate = generateNextTaskDate(task, lastGenerated);
  if (!nextDueDate) return false;

  // Generate if the next due date is today or in the past
  return nextDueDate <= now;
}

export function getRecurringTaskDescription(task: Task): string {
  if (!task.isRecurring || !task.recurringType) return '';

  switch (task.recurringType) {
    case 'daily':
      return 'Repeats daily';
    
    case 'weekly':
      if (!task.recurringDays || task.recurringDays.length === 0) return 'Repeats weekly';
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const selectedDays = task.recurringDays.map(day => dayNames[day]).join(', ');
      return `Repeats weekly on ${selectedDays}`;
    
    case 'monthly':
      const dayOfMonth = task.recurringDayOfMonth || 1;
      const suffix = getDaySuffix(dayOfMonth);
      return `Repeats monthly on the ${dayOfMonth}${suffix}`;
    
    case 'custom':
      const interval = task.recurringInterval || 1;
      return `Repeats every ${interval} day${interval > 1 ? 's' : ''}`;
    
    default:
      return 'Recurring task';
  }
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function processRecurringTasks(tasks: Task[]): Task[] {
  const newTasks: Task[] = [];
  const updatedTasks: Task[] = [];

  for (const task of tasks) {
    if (task.isRecurring && shouldGenerateNewTask(task)) {
      // Generate new task instance
      const lastGenerated = task.lastGenerated ? new Date(task.lastGenerated) : new Date(task.createdAt);
      const nextDueDate = generateNextTaskDate(task, lastGenerated);
      
      if (nextDueDate) {
        const newTask = createRecurringTaskInstance(task, nextDueDate);
        newTasks.push(newTask);
        
        // Update the original task's lastGenerated date
        updatedTasks.push({
          ...task,
          lastGenerated: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        updatedTasks.push(task);
      }
    } else {
      updatedTasks.push(task);
    }
  }

  return [...updatedTasks, ...newTasks];
}
