import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('Testing task update...');
    
    // Try to update a specific task using raw SQL
    const taskId = 'mf1bo3u9imvarmckdlh'; // The "Test" task from the debug output
    
    console.log('Updating task:', taskId);
    
    const updateResult = await sql`
      UPDATE tasks 
      SET completed = true, updated_at = NOW() 
      WHERE id = ${taskId}
      RETURNING *;
    `;
    
    console.log('Update result:', updateResult.rows);
    
    // Check if the update worked
    const checkResult = await sql`
      SELECT * FROM tasks WHERE id = ${taskId};
    `;
    
    console.log('Check result:', checkResult.rows);
    
    return NextResponse.json({
      success: true,
      updateResult: updateResult.rows,
      checkResult: checkResult.rows,
      message: 'Test update complete'
    });
  } catch (error) {
    console.error('Test update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
