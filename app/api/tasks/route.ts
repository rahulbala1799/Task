import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, type NewTask } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTask: NewTask = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdTask] = await db.insert(tasks).values(newTask).returning();
    return NextResponse.json(createdTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT request body:', body);
    const { id, title, description, category, priority, completed, dueDate } = body;

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
