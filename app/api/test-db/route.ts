import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Try to select all tasks
    const allTasks = await db.select().from(tasks);
    console.log('Database query successful, found tasks:', allTasks.length);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      taskCount: allTasks.length,
      tasks: allTasks 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
