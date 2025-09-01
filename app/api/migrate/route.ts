import { NextRequest, NextResponse } from 'next/server';
import { db, tasks, templates, monthlyGeneration, NewTask, NewTemplate, NewMonthlyGeneration } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks: localTasks, templates: localTemplates, monthlyGeneration: localGeneration } = body;

    let migratedTasks = 0;
    let migratedTemplates = 0;

    // Migrate tasks
    if (Array.isArray(localTasks)) {
      for (const task of localTasks) {
        const newTask: NewTask = {
          id: task.id,
          title: task.title,
          description: task.description || null,
          category: task.category,
          priority: task.priority,
          completed: task.completed,
          dueDate: task.dueDate || null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        };

        try {
          await db.insert(tasks).values(newTask).onConflictDoNothing();
          migratedTasks++;
        } catch (error) {
          console.warn('Failed to migrate task:', task.id, error);
        }
      }
    }

    // Migrate templates
    if (Array.isArray(localTemplates)) {
      for (const template of localTemplates) {
        const newTemplate: NewTemplate = {
          id: template.id,
          title: template.title,
          description: template.description || null,
          category: template.category,
          priority: template.priority,
          dueDayOfMonth: template.dueDayOfMonth || null,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
        };

        try {
          await db.insert(templates).values(newTemplate).onConflictDoNothing();
          migratedTemplates++;
        } catch (error) {
          console.warn('Failed to migrate template:', template.id, error);
        }
      }
    }

    // Migrate monthly generation data
    if (localGeneration) {
      const newGeneration: NewMonthlyGeneration = {
        id: 'main',
        lastGenerated: new Date(localGeneration.lastGenerated),
        month: localGeneration.month,
      };

      try {
        await db.insert(monthlyGeneration).values(newGeneration).onConflictDoUpdate({
          target: monthlyGeneration.id,
          set: {
            lastGenerated: newGeneration.lastGenerated,
            month: newGeneration.month,
          },
        });
      } catch (error) {
        console.warn('Failed to migrate monthly generation:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed: ${migratedTasks} tasks and ${migratedTemplates} templates migrated`,
      stats: {
        migratedTasks,
        migratedTemplates,
      },
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Failed to migrate data', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
