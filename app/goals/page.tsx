'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit3, Trash2, Target, Calendar, CheckCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'financial' | 'learning';
  priority: 'low' | 'medium' | 'high';
  targetDate: string;
  completed: boolean;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

const categoryConfig = {
  personal: { name: 'Personal', emoji: '🌟', color: 'bg-purple-500' },
  professional: { name: 'Professional', emoji: '💼', color: 'bg-blue-500' },
  health: { name: 'Health', emoji: '💪', color: 'bg-green-500' },
  financial: { name: 'Financial', emoji: '💰', color: 'bg-yellow-500' },
  learning: { name: 'Learning', emoji: '📚', color: 'bg-indigo-500' },
};

const priorityColors = {
  low: 'text-gray-500 bg-gray-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-red-600 bg-red-100',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    targetDate: '',
    progress: 0,
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const savedGoals = localStorage.getItem('taskmanager_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    localStorage.setItem('taskmanager_goals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      // Update existing goal
      const updatedGoals = goals.map(goal =>
        goal.id === editingGoal.id
          ? {
              ...goal,
              ...formData,
              completed: formData.progress === 100,
              updatedAt: new Date().toISOString(),
            }
          : goal
      );
      saveGoals(updatedGoals);
      setEditingGoal(null);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        completed: formData.progress === 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveGoals([...goals, newGoal]);
    }

    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: '',
      progress: 0,
    });
    setShowForm(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate,
      progress: goal.progress,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== id);
      saveGoals(updatedGoals);
    }
  };

  const updateProgress = (id: string, newProgress: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id
        ? {
            ...goal,
            progress: newProgress,
            completed: newProgress === 100,
            updatedAt: new Date().toISOString(),
          }
        : goal
    );
    saveGoals(updatedGoals);
  };

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">🎯 Goals</h1>
                <p className="text-sm text-gray-500">
                  {activeGoals.length} active • {completedGoals.length} completed
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Goal Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter goal title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.emoji} {config.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Goal['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress ({formData.progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'personal',
                      priority: 'medium',
                      targetDate: '',
                      progress: 0,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h2>
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateProgress={updateProgress}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Goals</h2>
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateProgress={updateProgress}
                />
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-500 mb-4">Start by creating your first goal to track your progress</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function GoalCard({ goal, onEdit, onDelete, onUpdateProgress }: {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}) {
  const config = categoryConfig[goal.category];
  const isOverdue = goal.targetDate && new Date(goal.targetDate) < new Date() && !goal.completed;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${goal.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{config.emoji}</span>
          <div className="flex-1">
            <h3 className={`font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {goal.title}
            </h3>
            {goal.description && (
              <p className={`text-sm mt-1 ${goal.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {goal.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
                {config.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}>
                {goal.priority}
              </span>
              {goal.targetDate && (
                <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                  <Calendar size={12} />
                  <span>
                    {new Date(goal.targetDate).toLocaleDateString()}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {goal.completed && <CheckCircle size={16} className="text-green-500" />}
          <button
            onClick={() => onEdit(goal)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit3 size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Trash2 size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${goal.completed ? 'bg-green-500' : 'bg-purple-500'}`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        {!goal.completed && (
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={goal.progress}
              onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
