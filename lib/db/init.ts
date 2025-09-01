import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Create tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE NOT NULL,
        due_date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Create templates table
    await sql`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        due_day_of_month INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Create monthly_generation table
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_generation (
        id TEXT PRIMARY KEY,
        last_generated TIMESTAMP NOT NULL,
        month TEXT NOT NULL
      );
    `;

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}
