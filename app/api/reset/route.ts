import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, templates, monthlyGeneration } from '@/lib/db/schema';

export async function POST() {
  try {
    // Delete all tasks
    await db.delete(tasks);
    
    // Delete all templates
    await db.delete(templates);
    
    // Delete all monthly generation records
    await db.delete(monthlyGeneration);
    
    return NextResponse.json({ 
      success: true, 
      message: 'All data cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}
