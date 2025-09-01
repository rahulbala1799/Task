'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, TrendingUp } from 'lucide-react';
import { loadTasksFromDB } from '@/lib/dbStorage';
import { Task, TaskCategory } from '@/types';

const categories = [
  {
    id: 'month-end-phorest' as TaskCategory,
    name: 'Month End Phorest',
    description: 'Monthly closing tasks and reports',
    emoji: '📅',
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'phorest-monthly' as TaskCategory,
    name: 'Phorest Monthly Tasks',
    description: 'Regular monthly Phorest activities',
    emoji: '🌲',
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'phorest-adhoc' as TaskCategory,
    name: 'Phorest Ad Hoc Tasks',
    description: 'One-off and urgent Phorest tasks',
    emoji: '⚡',
    color: 'from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'pnp-marketing' as TaskCategory,
    name: 'PnP Marketing Tasks',
    description: 'Marketing campaigns and promotions',
    emoji: '📢',
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'pnp-printing' as TaskCategory,
    name: 'PnP Printing Tasks',
    description: 'Print production and fulfillment',
    emoji: '🖨️',
    color: 'from-indigo-500 to-indigo-600',
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: 'personal' as TaskCategory,
    name: 'Personal Life Tasks',
    description: 'Personal goals and activities',
    emoji: '🏠',
    color: 'from-pink-500 to-pink-600',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasksFromDatabase();
  }, []);

  const loadTasksFromDatabase = async () => {
    setIsLoading(true);
    try {
      // Initialize database tables first
      await fetch('/api/init-db', { method: 'POST' });
      
      // Seed business templates if this is first time
      await fetch('/api/seed-templates', { method: 'POST' });
      
      // Load tasks from database
      const dbTasks = await loadTasksFromDB();
      setTasks(dbTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryStats = (categoryId: TaskCategory) => {
    const categoryTasks = tasks.filter(task => task.category === categoryId);
    const pending = categoryTasks.filter(task => !task.completed).length;
    const overdue = categoryTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length;
    return { total: categoryTasks.length, pending, overdue };
  };

  const totalStats = {
    total: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
                  <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
              <p className="text-gray-600">Choose a category to manage your tasks</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
              >
                <TrendingUp size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
              >
                <Calendar size={20} />
                <span className="hidden sm:inline">Calendar</span>
              </Link>
            </div>
          </div>
        </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{totalStats.total}</div>
              <div className="text-xs text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{totalStats.pending}</div>
              <div className="text-xs text-blue-600">Pending</div>
            </div>
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{totalStats.completed}</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="bg-red-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">{totalStats.overdue}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group block"
              >
                <div className={`${category.bgColor} rounded-xl p-6 border-2 border-transparent hover:border-gray-200 transition-all duration-200 group-hover:shadow-lg group-active:scale-95`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                      {category.emoji}
                    </div>
                    {stats.overdue > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {stats.overdue} overdue
                      </div>
                    )}
                  </div>

                  <h3 className={`text-lg font-semibold ${category.textColor} mb-2`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${category.textColor}`}>
                          {stats.total}
                        </div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {stats.pending}
                        </div>
                        <div className="text-xs text-gray-500">Pending</div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Add Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need to add a task quickly?</p>
          <Link 
            href="/add-task"
            className="btn-primary inline-flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Quick Add Task
          </Link>
          
          <p className="text-xs text-gray-500 mt-2">
            🎉 Your tasks automatically sync across all devices!
          </p>
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your task manager...</p>
          </div>
        </div>
      )}
    </div>
  );
}
