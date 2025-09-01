# Task Manager - Stay Organized

A comprehensive task manager designed specifically for managing multiple aspects of life including job tasks, month-end responsibilities, personal life, and business activities.

## Features

- **Multi-Category Organization**: Separate your tasks into Job, Month-end, Personal, and Business categories
- **Priority Management**: Set task priorities (Low, Medium, High, Urgent) with visual indicators
- **Due Date Tracking**: Set due dates with overdue and due-today notifications
- **Mobile-First Design**: Optimized for touch interactions and mobile use
- **Local Storage**: All data is stored locally in your browser
- **Search & Filter**: Easily find tasks with search and category/status filters
- **Progress Tracking**: Visual stats showing total, pending, completed, and overdue tasks

## Technology Stack

- **Next.js 14** - React framework optimized for production
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Beautiful, customizable icons
- **Local Storage** - Client-side data persistence

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

This app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with zero configuration

## Usage

### Adding Tasks
1. Click the "Add Task" button
2. Fill in the task details:
   - **Title**: What needs to be done
   - **Description**: Additional details (optional)
   - **Category**: Job, Month-end, Personal, or Business
   - **Priority**: Low, Medium, High, or Urgent
   - **Due Date**: When the task should be completed (optional)

### Managing Tasks
- **Complete**: Click the circle next to a task to mark it as completed
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the delete icon (click twice to confirm)

### Organization
- Tasks are automatically grouped by category
- Completed tasks appear below pending tasks in each category
- Use search and filters to find specific tasks
- Visual indicators show overdue and due-today tasks

## Mobile Optimization

- Touch-friendly interface with appropriate touch targets
- Responsive design that works on all screen sizes
- Optimized for one-handed use
- PWA-ready with manifest.json for app-like experience

## Data Storage

All task data is stored locally in your browser's localStorage. This means:
- No account required
- Data persists between sessions
- Works offline
- Privacy-focused (data never leaves your device)

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript features
- localStorage
- CSS Grid and Flexbox
