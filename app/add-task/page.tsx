'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Task, TaskFormData } from '@/types';
import { loadTasks, saveTasks, generateId } from '@/lib/storage';
import TaskForm from '@/components/TaskForm';

export default function AddTaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

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
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Task</h1>
              <p className="text-sm text-gray-600">Create a task in any category</p>
            </div>
          </div>
        </div>
      </header>

      {/* Task Form */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
}
