import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, type NewTask } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { sql } = await import('@vercel/postgres');
    
    const result = await sql`
      SELECT * FROM tasks ORDER BY created_at DESC;
    `;
    
    // Convert database format back to app format
    const formattedTasks = result.rows.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      completed: task.completed,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      isRecurring: task.is_recurring,
      recurringType: task.recurring_type,
      recurringInterval: task.recurring_interval,
      recurringDays: task.recurring_days ? JSON.parse(task.recurring_days) : undefined,
      recurringDayOfMonth: task.recurring_day_of_month,
      lastGenerated: task.last_generated,
      parentRecurringId: task.parent_recurring_id,
    }));
    
    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST request body:', body);
    
    const { 
      id, title, description, category, priority, dueDate,
      isRecurring, recurringType, recurringInterval, recurringDays, recurringDayOfMonth
    } = body;

    // Use direct SQL for consistency
    const { sql } = await import('@vercel/postgres');
    
    const taskId = id || Math.random().toString(36).substr(2, 15);
    
    const insertResult = await sql`
      INSERT INTO tasks (
        id, title, description, category, priority, due_date,
        is_recurring, recurring_type, recurring_interval, recurring_days, recurring_day_of_month,
        completed, created_at, updated_at
      ) VALUES (
        ${taskId},
        ${title},
        ${description || ''},
        ${category},
        ${priority || 'medium'},
        ${dueDate || null},
        ${isRecurring || false},
        ${recurringType || null},
        ${recurringInterval || null},
        ${recurringDays ? JSON.stringify(recurringDays) : null},
        ${recurringDayOfMonth || null},
        false,
        NOW(),
        NOW()
      )
      RETURNING *;
    `;

    console.log('Database insert result:', insertResult.rows);

    if (insertResult.rows.length === 0) {
      throw new Error('Failed to create task');
    }

    const createdTask = insertResult.rows[0];
    
    // Convert database format back to app format
    const formattedTask = {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      category: createdTask.category,
      priority: createdTask.priority,
      completed: createdTask.completed,
      dueDate: createdTask.due_date,
      createdAt: createdTask.created_at,
      updatedAt: createdTask.updated_at,
      isRecurring: createdTask.is_recurring,
      recurringType: createdTask.recurring_type,
      recurringInterval: createdTask.recurring_interval,
      recurringDays: createdTask.recurring_days ? JSON.parse(createdTask.recurring_days) : undefined,
      recurringDayOfMonth: createdTask.recurring_day_of_month,
      lastGenerated: createdTask.last_generated,
      parentRecurringId: createdTask.parent_recurring_id,
    };

    return NextResponse.json(formattedTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT request body:', body);
    const { 
      id, title, description, category, priority, completed, dueDate,
      isRecurring, recurringType, recurringInterval, recurringDays, recurringDayOfMonth,
      lastGenerated, parentRecurringId
    } = body;

    if (!id) {
      console.error('No ID provided in update request');
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    console.log('Updating task with ID:', id);

    // Use direct SQL instead of Drizzle ORM to avoid any ORM issues
    const { sql } = await import('@vercel/postgres');
    
    const updateResult = await sql`
      UPDATE tasks 
      SET 
        title = ${title || ''},
        description = ${description || ''},
        category = ${category || ''},
        priority = ${priority || 'medium'},
        completed = ${completed || false},
        due_date = ${dueDate || null},
        is_recurring = ${isRecurring || false},
        recurring_type = ${recurringType || null},
        recurring_interval = ${recurringInterval || null},
        recurring_days = ${recurringDays ? JSON.stringify(recurringDays) : null},
        recurring_day_of_month = ${recurringDayOfMonth || null},
        last_generated = ${lastGenerated || null},
        parent_recurring_id = ${parentRecurringId || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    console.log('Database update result:', updateResult.rows);

    if (updateResult.rows.length === 0) {
      console.error('Task not found in database:', id);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = updateResult.rows[0];
    
    // Convert database format back to app format
    const formattedTask = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      category: updatedTask.category,
      priority: updatedTask.priority,
      completed: updatedTask.completed,
      dueDate: updatedTask.due_date,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
      isRecurring: updatedTask.is_recurring,
      recurringType: updatedTask.recurring_type,
      recurringInterval: updatedTask.recurring_interval,
      recurringDays: updatedTask.recurring_days ? JSON.parse(updatedTask.recurring_days) : undefined,
      recurringDayOfMonth: updatedTask.recurring_day_of_month,
      lastGenerated: updatedTask.last_generated,
      parentRecurringId: updatedTask.parent_recurring_id,
    };

    return NextResponse.json(formattedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await db.delete(tasks).where(eq(tasks.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
