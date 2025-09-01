'use client';

import { Task, TaskCategory } from '@/types';
import TaskCard from './TaskCard';

interface CategorySectionProps {
  category: TaskCategory;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const categoryConfig = {
  job: { name: 'Job', emoji: '💼', color: 'text-blue-600' },
  'month-end': { name: 'Month-end Tasks', emoji: '📅', color: 'text-purple-600' },
  personal: { name: 'Personal Life', emoji: '🏠', color: 'text-green-600' },
  business: { name: 'Business', emoji: '🚀', color: 'text-orange-600' },
};

export default function CategorySection({
  category,
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: CategorySectionProps) {
  const config = categoryConfig[category];
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      <div className={`category-header ${config.color}`}>
        <span className="text-2xl">{config.emoji}</span>
        <span>{config.name}</span>
        <span className="text-sm font-normal text-gray-500 ml-auto">
          {pendingTasks.length} pending
          {completedTasks.length > 0 && `, ${completedTasks.length} completed`}
        </span>
      </div>

      <div className="space-y-3">
        {/* Pending tasks first */}
        {pendingTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <span>✅</span>
              Completed ({completedTasks.length})
            </h4>
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
