import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('Starting database debug...');
    
    // Check if tables exist
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    console.log('Existing tables:', tablesResult.rows);
    
    // Try to create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE NOT NULL,
        due_date TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        due_day_of_month INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_generation (
        id TEXT PRIMARY KEY,
        last_generated TIMESTAMP NOT NULL,
        month TEXT NOT NULL
      );
    `;
    
    // Check tables again
    const tablesAfter = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    // Try to select from tasks table
    const tasksResult = await sql`SELECT * FROM tasks LIMIT 5;`;
    
    console.log('Debug complete');
    
    return NextResponse.json({
      success: true,
      tablesBefore: tablesResult.rows,
      tablesAfter: tablesAfter.rows,
      sampleTasks: tasksResult.rows,
      message: 'Database debug complete'
    });
  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
