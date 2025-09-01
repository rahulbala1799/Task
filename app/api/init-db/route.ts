import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';

export async function POST() {
  try {
    const success = await initializeDatabase();
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database initialized successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to initialize database' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
