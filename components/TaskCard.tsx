'use client';

import { useState } from 'react';
import { Check, Edit3, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'text-gray-500 bg-gray-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-orange-600 bg-orange-100',
  urgent: 'text-red-600 bg-red-100',
};

const categoryEmojis = {
  'month-end-phorest': '📅',
  'phorest-monthly': '🌲',
  'phorest-adhoc': '⚡',
  'pnp-marketing': '📢',
  'pnp-printing': '🖨️',
  'personal': '🏠',
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate && 
    new Date(task.dueDate).toDateString() === new Date().toDateString() && 
    !task.completed;

  return (
    <div className={`task-card ${task.completed ? 'opacity-60' : ''} ${
      isOverdue ? 'border-red-300 bg-red-50' : isDueToday ? 'border-yellow-300 bg-yellow-50' : ''
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-success-500 border-success-500 text-white'
              : 'border-gray-300 hover:border-success-500'
          }`}
        >
          {task.completed && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{categoryEmojis[task.category]}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          <h3 className={`font-medium mb-1 ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`text-sm mb-2 ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-600' : isDueToday ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              {isOverdue && <AlertCircle size={12} />}
              <Calendar size={12} />
              <span>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {isOverdue && <span className="font-medium">Overdue!</span>}
              {isDueToday && <span className="font-medium">Due Today</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Edit task"
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
            title={showDeleteConfirm ? 'Click again to confirm' : 'Delete task'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
