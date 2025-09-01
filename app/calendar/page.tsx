'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@/types';
import { loadTasksFromDB, updateTaskInDB, deleteTaskFromDB } from '@/lib/dbStorage';
import TaskCard from '@/components/TaskCard';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadTasksFromDatabase();
  }, []);

  const loadTasksFromDatabase = async () => {
    try {
      const dbTasks = await loadTasksFromDB();
      setTasks(dbTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get tasks for a specific date
  const getTasksForDate = (date: string): Task[] => {
    return tasks.filter(task => task.dueDate === date);
  };

  // Get task count for a specific date
  const getTaskCountForDate = (date: string): { total: number; pending: number; overdue: number } => {
    const dayTasks = getTasksForDate(date);
    const today = new Date().toISOString().split('T')[0];
    const isPastDue = date < today;
    
    return {
      total: dayTasks.length,
      pending: dayTasks.filter(task => !task.completed).length,
      overdue: isPastDue ? dayTasks.filter(task => !task.completed).length : 0,
    };
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Handle task operations
  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    const savedTask = await updateTaskInDB(updatedTask);
    
    if (savedTask) {
      setTasks(prev => prev.map(t => t.id === id ? savedTask : t));
    }
  };

  const handleEditTask = (task: Task) => {
    // Redirect to the category page where they can edit
    const categoryUrl = `/category/${task.category}`;
    window.location.href = categoryUrl;
  };

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTaskFromDB(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <CalendarIcon size={32} className="text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                  <p className="text-sm text-gray-600">View tasks by date</p>
                </div>
              </div>
            </div>

            <button
              onClick={goToToday}
              className="btn-primary"
            >
              Today
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {MONTHS[month]} {year}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS_OF_WEEK.map(day => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="aspect-square" />;
                    }

                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const taskStats = getTaskCountForDate(dateString);
                    const isToday = dateString === today;
                    const isSelected = selectedDate === dateString;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(selectedDate === dateString ? null : dateString)}
                        className={`aspect-square p-2 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : isToday
                            ? 'border-primary-300 bg-primary-25'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="h-full flex flex-col items-center justify-between">
                          <span className={`text-sm font-medium ${
                            isToday ? 'text-primary-600' : 'text-gray-900'
                          }`}>
                            {day}
                          </span>
                          
                          {taskStats.total > 0 && (
                            <div className="flex flex-col items-center gap-1">
                              <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                taskStats.overdue > 0
                                  ? 'bg-red-100 text-red-600'
                                  : taskStats.pending > 0
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : 'bg-green-100 text-green-600'
                              }`}>
                                {taskStats.total}
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate 
                    ? `Tasks for ${new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}`
                    : 'Select a date'
                  }
                </h3>
              </div>

              <div className="p-4">
                {!selectedDate ? (
                  <div className="text-center py-8">
                    <CalendarIcon size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Click on a date to view tasks</p>
                  </div>
                ) : selectedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tasks scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 bg-white rounded-xl shadow-sm border p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs font-medium">N</span>
                  </div>
                  <span className="text-gray-600">Overdue tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-medium">N</span>
                  </div>
                  <span className="text-gray-600">Pending tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-medium">N</span>
                  </div>
                  <span className="text-gray-600">All tasks completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
