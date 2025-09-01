'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { TaskFormData, TaskCategory, Priority } from '@/types';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
}

const categories: { id: TaskCategory; name: string; emoji: string }[] = [
  { id: 'month-end-phorest', name: 'Month End Phorest', emoji: '📅' },
  { id: 'phorest-monthly', name: 'Phorest Monthly', emoji: '🌲' },
  { id: 'phorest-adhoc', name: 'Phorest Ad Hoc', emoji: '⚡' },
  { id: 'pnp-marketing', name: 'PnP Marketing', emoji: '📢' },
  { id: 'pnp-printing', name: 'PnP Printing', emoji: '🖨️' },
  { id: 'personal', name: 'Personal Life', emoji: '🏠' },
];

const priorities: { id: Priority; name: string; color: string }[] = [
  { id: 'low', name: 'Low', color: 'text-gray-600' },
  { id: 'medium', name: 'Medium', color: 'text-yellow-600' },
  { id: 'high', name: 'High', color: 'text-orange-600' },
  { id: 'urgent', name: 'Urgent', color: 'text-red-600' },
];

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'personal',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea-field"
              rows={3}
              placeholder="Add more details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.id })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    formData.category === category.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl">{category.emoji}</div>
                  <div className="text-sm font-medium text-left">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.id })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.priority === priority.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${priority.color}`}>
                    {priority.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              {initialData ? 'Update' : 'Add'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
