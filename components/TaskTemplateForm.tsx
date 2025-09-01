'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { TaskTemplateFormData, TaskCategory, Priority } from '@/types';

interface TaskTemplateFormProps {
  onSubmit: (template: TaskTemplateFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskTemplateFormData>;
  category: TaskCategory;
}

const priorities: { id: Priority; name: string; color: string }[] = [
  { id: 'low', name: 'Low', color: 'text-gray-600' },
  { id: 'medium', name: 'Medium', color: 'text-yellow-600' },
  { id: 'high', name: 'High', color: 'text-orange-600' },
  { id: 'urgent', name: 'Urgent', color: 'text-red-600' },
];

const categoryNames = {
  'month-end-phorest': 'Month End Phorest',
  'phorest-monthly': 'Phorest Monthly Tasks',
};

export default function TaskTemplateForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  category 
}: TaskTemplateFormProps) {
  const [formData, setFormData] = useState<TaskTemplateFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category,
    priority: initialData?.priority || 'medium',
    dueDayOfMonth: initialData?.dueDayOfMonth || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  const categoryName = categoryNames[category as keyof typeof categoryNames] || category;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Template' : 'Add Template Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Template for {categoryName}</strong><br />
              This task will be automatically created every month.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="What needs to be done every month?"
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
              placeholder="Add details about this recurring task..."
            />
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
              Due Day of Month (Optional)
            </label>
            <select
              value={formData.dueDayOfMonth}
              onChange={(e) => setFormData({ ...formData, dueDayOfMonth: parseInt(e.target.value) })}
              className="input-field"
            >
              <option value={0}>No specific due date</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of the month
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              When should this task be due each month?
            </p>
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
              {initialData ? 'Update' : 'Add'} Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
