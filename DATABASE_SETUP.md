# Database Setup Instructions

## 1. Create Vercel PostgreSQL Database

1. **Go to Vercel Dashboard** → Select your project
2. **Click "Storage" tab** → **"Create Database"**
3. **Select "Postgres"** → Choose a name (e.g., "taskmanager-db")
4. **Click "Create"** → Wait for database to be provisioned

## 2. Get Database Connection String

1. **In Vercel Dashboard** → Go to your database
2. **Click ".env.local" tab** → Copy the connection strings
3. **You'll see something like:**
   ```
   POSTGRES_URL="postgresql://..."
   POSTGRES_PRISMA_URL="postgresql://..."
   POSTGRES_URL_NON_POOLING="postgresql://..."
   ```

## 3. Set Environment Variables

### For Local Development:
Create `.env.local` file in your project root:
```bash
POSTGRES_URL="your-postgres-url-here"
```

### For Production (Vercel):
The environment variables are automatically set when you create the database in Vercel.

## 4. Install Dependencies and Set Up Database

```bash
# Install new dependencies
npm install

# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push
```

## 5. Deploy Updated App

```bash
# Commit changes
git add .
git commit -m "Add PostgreSQL database integration"
git push

# Deploy to Vercel
vercel --prod
```

## 6. Migrate Existing Data

1. **Open your deployed app**
2. **You'll see a migration popup** if you have existing localStorage data
3. **Click "Migrate to Database"** to transfer your tasks and templates
4. **Done!** Your data is now in the cloud and will sync across devices

## Database Schema

### Tasks Table
- `id` (text, primary key)
- `title` (text, required)
- `description` (text, optional)
- `category` (text, required)
- `priority` (text, required)
- `completed` (boolean, default false)
- `due_date` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Templates Table
- `id` (text, primary key)
- `title` (text, required)
- `description` (text, optional)
- `category` (text, required)
- `priority` (text, required)
- `due_day_of_month` (integer, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Monthly Generation Table
- `id` (text, primary key)
- `last_generated` (timestamp)
- `month` (text)

## Benefits

✅ **Automatic sync** across all devices
✅ **No manual export/import** needed
✅ **Real-time updates** 
✅ **Cloud backup** of all your data
✅ **Better performance** with proper database indexing
✅ **Scalable** for future features
