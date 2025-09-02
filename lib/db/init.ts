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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        is_recurring BOOLEAN DEFAULT FALSE,
        recurring_type TEXT,
        recurring_interval INTEGER,
        recurring_days TEXT,
        recurring_day_of_month INTEGER,
        last_generated TEXT,
        parent_recurring_id TEXT
      );
    `;

    // Add new columns to existing tasks table if they don't exist
    try {
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring_type TEXT;`;
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring_interval INTEGER;`;
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring_days TEXT;`;
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring_day_of_month INTEGER;`;
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_generated TEXT;`;
      await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS parent_recurring_id TEXT;`;
    } catch (error) {
      // Columns might already exist, that's okay
      console.log('Some columns may already exist:', error);
    }

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
