'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { Task, TaskCategory, TaskFormData } from '@/types';
import { loadTasks, saveTasks, generateId } from '@/lib/storage';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';

const categoryConfig = {
  'month-end-phorest': { 
    name: 'Month End Phorest', 
    emoji: '📅', 
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Monthly closing tasks and reports'
  },
  'phorest-monthly': { 
    name: 'Phorest Monthly Tasks', 
    emoji: '🌲', 
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Regular monthly Phorest activities'
  },
  'phorest-adhoc': { 
    name: 'Phorest Ad Hoc Tasks', 
    emoji: '⚡', 
    color: 'from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'One-off and urgent Phorest tasks'
  },
  'pnp-marketing': { 
    name: 'PnP Marketing Tasks', 
    emoji: '📢', 
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Marketing campaigns and promotions'
  },
  'pnp-printing': { 
    name: 'PnP Printing Tasks', 
    emoji: '🖨️', 
    color: 'from-indigo-500 to-indigo-600',
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Print production and fulfillment'
  },
  'personal': { 
    name: 'Personal Life Tasks', 
    emoji: '🏠', 
    color: 'from-pink-500 to-pink-600',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Personal goals and activities'
  },
};

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as TaskCategory;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const config = categoryConfig[categoryId];

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || loadTasks().length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleAddTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...formData,
      category: categoryId, // Force the category to match the current page
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

  // Filter tasks for this category
  const categoryTasks = tasks.filter(task => task.category === categoryId);

  // Apply search and filter
  const filteredTasks = categoryTasks.filter(task => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
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

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const stats = {
    total: categoryTasks.length,
    pending: categoryTasks.filter(task => !task.completed).length,
    completed: categoryTasks.filter(task => task.completed).length,
    overdue: categoryTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`${config.bgColor} border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className={config.textColor} />
            </Link>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white text-xl shadow-md`}>
                {config.emoji}
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${config.textColor}`}>
                  {config.name}
                </h1>
                <p className="text-gray-600">{config.description}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white bg-opacity-50 rounded-lg p-3 text-center">
              <div className={`text-lg font-bold ${config.textColor}`}>{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="bg-blue-100 bg-opacity-70 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.pending}</div>
              <div className="text-xs text-blue-600">Pending</div>
            </div>
            <div className="bg-green-100 bg-opacity-70 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="bg-red-100 bg-opacity-70 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>

            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 bg-white bg-opacity-70"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{config.emoji}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' 
                ? 'No tasks found' 
                : 'No tasks yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter'
                : `Add your first ${config.name.toLowerCase()} task`}
            </p>
            {!searchTerm && filter === 'all' && (
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
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Pending Tasks ({pendingTasks.length})
                </h2>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={setEditingTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✅</span>
                  Completed Tasks ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={setEditingTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
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
          initialData={editingTask ? editingTask : { category: categoryId }}
        />
      )}
    </div>
  );
}
