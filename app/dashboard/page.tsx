'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Award,
  BarChart3,
  Zap,
  Trophy,
  Flame
} from 'lucide-react';
import { Task, TaskCategory } from '@/types';
import { loadTasksFromDB } from '@/lib/dbStorage';

interface ProductivityMetrics {
  today: {
    completed: number;
    total: number;
    completionRate: number;
    overdue: number;
    onTime: number;
  };
  week: {
    completed: number;
    total: number;
    completionRate: number;
    streak: number;
  };
  month: {
    completed: number;
    total: number;
    completionRate: number;
    avgPerDay: number;
  };
  categories: {
    [key: string]: {
      completed: number;
      total: number;
      completionRate: number;
    };
  };
}

const categoryConfig = {
  'month-end-phorest': { name: 'Month End Phorest', emoji: '📅', color: 'text-purple-600' },
  'phorest-monthly': { name: 'Phorest Monthly', emoji: '🌲', color: 'text-green-600' },
  'phorest-adhoc': { name: 'Phorest Ad Hoc', emoji: '⚡', color: 'text-yellow-600' },
  'pnp-marketing': { name: 'PnP Marketing', emoji: '📢', color: 'text-blue-600' },
  'pnp-printing': { name: 'PnP Printing', emoji: '🖨️', color: 'text-indigo-600' },
  'personal': { name: 'Personal Life', emoji: '🏠', color: 'text-pink-600' },
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);

  useEffect(() => {
    loadTasksFromDatabase();
  }, []);

  const loadTasksFromDatabase = async () => {
    try {
      const allTasks = await loadTasksFromDB();
      setTasks(allTasks);
      calculateMetrics(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const calculateMetrics = (allTasks: Task[]) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // Today's metrics
    const todayTasks = allTasks.filter(task => 
      task.createdAt.split('T')[0] === today || 
      task.dueDate === today ||
      (task.updatedAt.split('T')[0] === today && task.completed)
    );

    const todayCompleted = todayTasks.filter(task => task.completed);
    const todayOverdue = todayTasks.filter(task => 
      task.dueDate && task.dueDate < today && !task.completed
    );
    const todayOnTime = todayCompleted.filter(task => 
      !task.dueDate || task.dueDate >= today
    );

    // Week's metrics
    const weekTasks = allTasks.filter(task => 
      task.createdAt.split('T')[0] >= weekAgo ||
      (task.dueDate && task.dueDate >= weekAgo) ||
      (task.updatedAt.split('T')[0] >= weekAgo && task.completed)
    );
    const weekCompleted = weekTasks.filter(task => task.completed);

    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    const checkDate = new Date(now);
    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayTasks = allTasks.filter(task => 
        task.updatedAt.split('T')[0] === dateStr && task.completed
      );
      if (dayTasks.length > 0) {
        streak++;
      } else if (i > 0) { // Don't break streak on first day if no tasks
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Month's metrics
    const monthTasks = allTasks.filter(task => 
      task.createdAt.split('T')[0] >= monthAgo ||
      (task.dueDate && task.dueDate >= monthAgo) ||
      (task.updatedAt.split('T')[0] >= monthAgo && task.completed)
    );
    const monthCompleted = monthTasks.filter(task => task.completed);
    const daysInMonth = now.getDate();

    // Category metrics
    const categories: { [key: string]: { completed: number; total: number; completionRate: number } } = {};
    
    Object.keys(categoryConfig).forEach(categoryId => {
      const categoryTasks = allTasks.filter(task => task.category === categoryId);
      const categoryCompleted = categoryTasks.filter(task => task.completed);
      
      categories[categoryId] = {
        completed: categoryCompleted.length,
        total: categoryTasks.length,
        completionRate: categoryTasks.length > 0 ? (categoryCompleted.length / categoryTasks.length) * 100 : 0,
      };
    });

    const calculatedMetrics: ProductivityMetrics = {
      today: {
        completed: todayCompleted.length,
        total: todayTasks.length,
        completionRate: todayTasks.length > 0 ? (todayCompleted.length / todayTasks.length) * 100 : 0,
        overdue: todayOverdue.length,
        onTime: todayOnTime.length,
      },
      week: {
        completed: weekCompleted.length,
        total: weekTasks.length,
        completionRate: weekTasks.length > 0 ? (weekCompleted.length / weekTasks.length) * 100 : 0,
        streak,
      },
      month: {
        completed: monthCompleted.length,
        total: monthTasks.length,
        completionRate: monthTasks.length > 0 ? (monthCompleted.length / monthTasks.length) * 100 : 0,
        avgPerDay: monthCompleted.length / daysInMonth,
      },
      categories,
    };

    setMetrics(calculatedMetrics);
  };

  const getMotivationalMessage = () => {
    if (!metrics) return "Loading your progress...";
    
    const rate = metrics.today.completionRate;
    const streak = metrics.week.streak;
    
    if (rate === 100) return "🎉 Perfect day! You're crushing it!";
    if (rate >= 80) return "🔥 Amazing work! Keep the momentum going!";
    if (rate >= 60) return "💪 Great progress! You're doing well!";
    if (rate >= 40) return "⚡ Good start! Keep pushing forward!";
    if (streak > 0) return `🌟 ${streak} day streak! Don't break it now!`;
    return "🚀 Every task completed is a win! Let's go!";
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🏆";
    if (streak >= 14) return "🔥";
    if (streak >= 7) return "⚡";
    if (streak >= 3) return "🌟";
    return "💪";
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={48} className="text-primary-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your productivity metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <TrendingUp size={32} className="text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Productivity Dashboard</h1>
                  <p className="text-sm text-gray-600">Track your progress and achievements</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Today's Progress</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.today.completionRate >= 80 ? 'bg-green-500' :
                  metrics.today.completionRate >= 60 ? 'bg-yellow-500' :
                  metrics.today.completionRate >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(metrics.today.completionRate)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{getMotivationalMessage()}</h2>
              <p className="text-primary-100">
                {metrics.today.completed} tasks completed today • {metrics.week.streak} day streak {getStreakEmoji(metrics.week.streak)}
              </p>
            </div>
            <Trophy size={48} className="text-primary-200" />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Today's Completion Rate */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-primary-500" size={24} />
              <span className="text-2xl font-bold text-primary-600">
                {Math.round(metrics.today.completionRate)}%
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Today's Success Rate</h3>
            <p className="text-sm text-gray-600">
              {metrics.today.completed} of {metrics.today.total} tasks completed
            </p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.today.completionRate}%` }}
              />
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-orange-600">
                {metrics.week.streak}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Current Streak</h3>
            <p className="text-sm text-gray-600">
              Consecutive days with completed tasks
            </p>
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: Math.min(metrics.week.streak, 7) }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" />
              ))}
              {metrics.week.streak > 7 && (
                <span className="text-xs text-gray-500 ml-1">+{metrics.week.streak - 7}</span>
              )}
            </div>
          </div>

          {/* Weekly Performance */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(metrics.week.completionRate)}%
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Weekly Performance</h3>
            <p className="text-sm text-gray-600">
              {metrics.week.completed} of {metrics.week.total} tasks this week
            </p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.week.completionRate}%` }}
              />
            </div>
          </div>

          {/* Monthly Average */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-green-500" size={24} />
              <span className="text-2xl font-bold text-green-600">
                {metrics.month.avgPerDay.toFixed(1)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Daily Average</h3>
            <p className="text-sm text-gray-600">
              Tasks completed per day this month
            </p>
            <div className="mt-3">
              <div className="text-xs text-gray-500">
                {metrics.month.completed} total this month
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="text-primary-500" size={20} />
              Category Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(metrics.categories).map(([categoryId, stats]) => {
                const config = categoryConfig[categoryId as TaskCategory];
                if (!config || stats.total === 0) return null;

                return (
                  <div key={categoryId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{config.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900">{config.name}</div>
                        <div className="text-sm text-gray-500">
                          {stats.completed}/{stats.total} completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${config.color}`}>
                        {Math.round(stats.completionRate)}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            config.color.includes('purple') ? 'bg-purple-500' :
                            config.color.includes('green') ? 'bg-green-500' :
                            config.color.includes('yellow') ? 'bg-yellow-500' :
                            config.color.includes('blue') ? 'bg-blue-500' :
                            config.color.includes('indigo') ? 'bg-indigo-500' :
                            'bg-pink-500'
                          }`}
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats & Achievements */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              Quick Stats & Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="font-medium text-green-900">Tasks Completed Today</span>
                </div>
                <span className="text-xl font-bold text-green-600">{metrics.today.completed}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-500" size={20} />
                  <span className="font-medium text-blue-900">On-Time Completions</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{metrics.today.onTime}</span>
              </div>

              {metrics.today.overdue > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-red-500" size={20} />
                    <span className="font-medium text-red-900">Overdue Tasks</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{metrics.today.overdue}</span>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">🏆 Achievements</h4>
                <div className="space-y-2 text-sm">
                  {metrics.week.streak >= 7 && (
                    <div className="text-orange-600">🔥 Week Warrior - 7+ day streak!</div>
                  )}
                  {metrics.today.completionRate === 100 && (
                    <div className="text-green-600">✨ Perfect Day - 100% completion!</div>
                  )}
                  {metrics.month.completed >= 50 && (
                    <div className="text-blue-600">💪 Productivity Beast - 50+ tasks this month!</div>
                  )}
                  {metrics.today.overdue === 0 && (
                    <div className="text-purple-600">⏰ Time Master - No overdue tasks!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
