'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Filter, Settings, RefreshCw } from 'lucide-react';
import { Task, TaskCategory, TaskFormData, TaskTemplate, TaskTemplateFormData } from '@/types';
import { generateId } from '@/lib/storage';
import { 
  loadTasksFromDB,
  saveTaskToDB,
  updateTaskInDB,
  deleteTaskFromDB,
  loadTemplatesFromDB,
  saveTemplateToDB,
  updateTemplateInDB,
  deleteTemplateFromDB
} from '@/lib/dbStorage';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import TaskTemplateForm from '@/components/TaskTemplateForm';
import TaskTemplateCard from '@/components/TaskTemplateCard';

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
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
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
    loadDataFromDatabase();
  }, [categoryId]);

  const loadDataFromDatabase = async () => {
    try {
      const [dbTasks, dbTemplates] = await Promise.all([
        loadTasksFromDB(),
        loadTemplatesFromDB()
      ]);
      
      setTasks(dbTasks);
      setTemplates(dbTemplates);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddTask = async (formData: TaskFormData) => {
    const newTaskData = {
      id: generateId(),
      ...formData,
      category: categoryId, // Force the category to match the current page
      completed: false,
    };

    const savedTask = await saveTaskToDB(newTaskData);
    if (savedTask) {
      setTasks(prev => [savedTask, ...prev]);
      setShowTaskForm(false);
    }
  };

  const handleEditTask = async (formData: TaskFormData) => {
    if (!editingTask) return;

    const updatedTask = { ...editingTask, ...formData };
    const savedTask = await updateTaskInDB(updatedTask);
    
    if (savedTask) {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id ? savedTask : task
        )
      );
      setEditingTask(null);
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    const savedTask = await updateTaskInDB(updatedTask);
    
    if (savedTask) {
      setTasks(prev =>
        prev.map(t => t.id === id ? savedTask : t)
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTaskFromDB(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleAddTemplate = async (formData: TaskTemplateFormData) => {
    const newTemplateData = {
      id: generateId(),
      ...formData,
      dueDayOfMonth: formData.dueDayOfMonth || undefined,
    };

    const savedTemplate = await saveTemplateToDB(newTemplateData);
    if (savedTemplate) {
      setTemplates(prev => [savedTemplate, ...prev]);
      setShowTemplateForm(false);
    }
  };

  const handleEditTemplate = async (formData: TaskTemplateFormData) => {
    if (!editingTemplate) return;

    const updatedTemplate = { 
      ...editingTemplate, 
      ...formData, 
      dueDayOfMonth: formData.dueDayOfMonth || undefined 
    };
    
    const savedTemplate = await updateTemplateInDB(updatedTemplate);
    if (savedTemplate) {
      setTemplates(prev =>
        prev.map(template =>
          template.id === editingTemplate.id ? savedTemplate : template
        )
      );
      setEditingTemplate(null);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    const success = await deleteTemplateFromDB(id);
    if (success) {
      setTemplates(prev => prev.filter(template => template.id !== id));
    }
  };

  const handleGenerateFromTemplates = async () => {
    // Generate tasks from templates for current month
    const categoryTemplates = templates.filter(t => t.category === categoryId);
    const now = new Date();
    
    for (const template of categoryTemplates) {
      let dueDate = '';
      if (template.dueDayOfMonth) {
        const dueDateTime = new Date(now.getFullYear(), now.getMonth(), template.dueDayOfMonth);
        dueDate = dueDateTime.toISOString().split('T')[0];
      }
      
      const newTask = {
        id: generateId(),
        title: template.title,
        description: template.description || '',
        category: template.category,
        priority: template.priority,
        completed: false,
        dueDate,
      };
      
      const savedTask = await saveTaskToDB(newTask);
      if (savedTask) {
        setTasks(prev => [savedTask, ...prev]);
      }
    }
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
  
  // Get templates for this category
  const categoryTemplates = templates.filter(template => template.category === categoryId);
  const isRecurring = categoryId === 'month-end-phorest' || categoryId === 'phorest-monthly';

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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Add Task
              </button>
              
              {isRecurring && (
                <>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                      showTemplates
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400 text-gray-600'
                    }`}
                  >
                    <Settings size={16} />
                    Templates ({categoryTemplates.length})
                  </button>
                  
                  <button
                    onClick={handleGenerateFromTemplates}
                    className="px-4 py-2 rounded-lg border-2 border-green-300 hover:border-green-400 text-green-600 hover:bg-green-50 transition-all duration-200 flex items-center gap-2"
                    title="Generate tasks from templates for this month"
                  >
                    <RefreshCw size={16} />
                    Generate
                  </button>
                </>
              )}
            </div>

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

          {/* Template Management Section */}
          {isRecurring && showTemplates && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-900">
                  Monthly Task Templates
                </h3>
                <button
                  onClick={() => setShowTemplateForm(true)}
                  className="btn-primary text-sm flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Template
                </button>
              </div>
              
              <p className="text-sm text-blue-800 mb-4">
                Templates automatically create tasks each month. Your business templates are already loaded! Use "Generate" to create this month's tasks.
              </p>
              
              {categoryTemplates.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-blue-600 mb-2">No templates yet</p>
                  <button
                    onClick={() => setShowTemplateForm(true)}
                    className="btn-primary text-sm"
                  >
                    Create Your First Template
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryTemplates.map(template => (
                    <TaskTemplateCard
                      key={template.id}
                      template={template}
                      onEdit={setEditingTemplate}
                      onDelete={handleDeleteTemplate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

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

      {/* Template Form Modal */}
      {(showTemplateForm || editingTemplate) && (
        <TaskTemplateForm
          onSubmit={editingTemplate ? handleEditTemplate : handleAddTemplate}
          onCancel={() => {
            setShowTemplateForm(false);
            setEditingTemplate(null);
          }}
          initialData={editingTemplate || undefined}
          category={categoryId}
        />
      )}
    </div>
  );
}
