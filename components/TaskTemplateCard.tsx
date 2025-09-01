'use client';

import { useState } from 'react';
import { Edit3, Trash2, Calendar, Repeat } from 'lucide-react';
import { TaskTemplate } from '@/types';

interface TaskTemplateCardProps {
  template: TaskTemplate;
  onEdit: (template: TaskTemplate) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'text-gray-500 bg-gray-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-orange-600 bg-orange-100',
  urgent: 'text-red-600 bg-red-100',
};

export default function TaskTemplateCard({ template, onEdit, onDelete }: TaskTemplateCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(template.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const getDueDateText = () => {
    if (!template.dueDayOfMonth) return 'No due date';
    
    const day = template.dueDayOfMonth;
    const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
    return `Due ${day}${suffix} of each month`;
  };

  return (
    <div className="task-card border-l-4 border-l-blue-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <Repeat size={14} className="text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[template.priority]}`}>
              {template.priority}
            </span>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
              Template
            </span>
          </div>

          <h3 className="font-medium mb-1 text-gray-900">
            {template.title}
          </h3>

          {template.description && (
            <p className="text-sm mb-2 text-gray-600">
              {template.description}
            </p>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={12} />
            <span>{getDueDateText()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(template)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Edit template"
          >
            <Edit3 size={16} className="text-gray-500" />
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 rounded-full transition-colors ${
              showDeleteConfirm
                ? 'bg-red-100 hover:bg-red-200 text-red-600'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title={showDeleteConfirm ? 'Click again to confirm' : 'Delete template'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
