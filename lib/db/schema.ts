import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  priority: text('priority').notNull(),
  completed: boolean('completed').default(false).notNull(),
  dueDate: text('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  priority: text('priority').notNull(),
  dueDayOfMonth: integer('due_day_of_month'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const monthlyGeneration = pgTable('monthly_generation', {
  id: text('id').primaryKey(),
  lastGenerated: timestamp('last_generated').notNull(),
  month: text('month').notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type MonthlyGeneration = typeof monthlyGeneration.$inferSelect;
export type NewMonthlyGeneration = typeof monthlyGeneration.$inferInsert;
