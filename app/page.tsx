'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Task, TaskCategory, TaskFormData } from '@/types';
import { loadTasks, saveTasks, generateId } from '@/lib/storage';
import TaskForm from '@/components/TaskForm';
import CategorySection from '@/components/CategorySection';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');

  // Load tasks on component mount
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // Save tasks whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 || loadTasks().length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleAddTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...formData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const handleEditTask = (formData: TaskFormData) => {
    if (!editingTask) return;

    setTasks(prev =>
      prev.map(task =>
        task.id === editingTask.id
          ? { ...task, ...formData, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setEditingTask(null);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Status filter
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
      default:
        return true;
    }
  });

  // Group tasks by category
  const tasksByCategory = {
    job: filteredTasks.filter(task => task.category === 'job'),
    'month-end': filteredTasks.filter(task => task.category === 'month-end'),
    personal: filteredTasks.filter(task => task.category === 'personal'),
    business: filteredTasks.filter(task => task.category === 'business'),
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-600">Stay organized, stay productive</p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.pending}</div>
              <div className="text-xs text-blue-600">Pending</div>
            </div>
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="bg-red-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="job">💼 Job</option>
              <option value="month-end">📅 Month-end</option>
              <option value="personal">🏠 Personal</option>
              <option value="business">🚀 Business</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' || selectedCategory !== 'all' 
                ? 'No tasks found' 
                : 'No tasks yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Add your first task to get started with organizing your life'}
            </p>
            {!searchTerm && filter === 'all' && selectedCategory === 'all' && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary"
              >
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          <div>
            {(Object.keys(tasksByCategory) as TaskCategory[]).map(category => (
              <CategorySection
                key={category}
                category={category}
                tasks={tasksByCategory[category]}
                onToggleTask={handleToggleTask}
                onEditTask={setEditingTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          initialData={editingTask || undefined}
        />
      )}
    </div>
  );
}
