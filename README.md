# MediRecord - Free Backend Setup

## Backend: Supabase (100% Free)

This application now uses Supabase as a completely free backend solution.

### Setup Instructions

1. **Create a Supabase Account** (Free tier - no credit card required)
   - Go to https://supabase.com
   - Sign up for a free account
   - Create a new project

2. **Set Up Database**
   - In your Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `src/backend/schema.sql`
   - Run the SQL to create tables

3. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy your `Project URL` and `anon/public` key

4. **Configure Backend**
   ```bash
   cd src/backend
   cp .env.example .env
   ```
   - Edit `.env` and add your Supabase credentials:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key-here
     PORT=3001
     ```

5. **Install Backend Dependencies**
   ```bash
   cd src/backend
   npm install
   ```

6. **Start Backend Server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Configure Frontend**
   ```bash
   cd src/frontend
   cp .env.example .env
   ```
   - Edit `.env`:
     ```
     VITE_API_URL=http://localhost:3001/api
     ```

8. **Install Frontend Dependencies**
   ```bash
   cd src/frontend
   npm install
   ```

9. **Start Frontend**
   ```bash
   npm run dev
   ```

### Default Credentials

- **Hospital Admin**
  - Username: `admin`
  - Password: `admin123`

### Free Tier Limits (Supabase)

- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth per month
- 50,000 monthly active users
- Unlimited API requests

Perfect for development and small production apps!

### Deployment Options (All Free)

**Backend:**
- Railway.app (free tier)
- Render.com (free tier)
- Fly.io (free tier)

**Frontend:**
- Vercel (free tier)
- Netlify (free tier)
- Cloudflare Pages (free tier)

### Architecture

- **Backend**: Node.js + Express REST API
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: bcrypt password hashing
- **Frontend**: React + TypeScript + Vite

No blockchain, no canisters, no complex setup - just simple, free, and reliable!
