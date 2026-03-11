# Quick Setup Guide

## 1. Create Supabase Account (2 minutes)
1. Go to https://supabase.com and sign up (free, no credit card)
2. Click "New Project"
3. Choose a name, password, and region
4. Wait for project to be created

## 2. Setup Database (1 minute)
1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy all content from `src/backend/schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

## 3. Get API Credentials (30 seconds)
1. Click "Settings" (gear icon) in left sidebar
2. Click "API" under Project Settings
3. Copy these two values:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - anon/public key (long string starting with "eyJ...")

## 4. Configure Backend (1 minute)
```bash
cd src/backend
cp .env.example .env
```

Edit `.env` file and paste your credentials:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...your-key-here
PORT=3001
```

## 5. Install & Run Backend (2 minutes)
```bash
npm install
npm start
```

You should see: "Server running on port 3001" and "Default admin created"

## 6. Configure Frontend (30 seconds)
Open a new terminal:
```bash
cd src/frontend
cp .env.example .env
```

The default `.env` should work:
```
VITE_API_URL=http://localhost:3001/api
```

## 7. Install & Run Frontend (2 minutes)
```bash
npm install
npm run dev
```

Open browser to http://localhost:5173

## 8. Login
- Username: `admin`
- Password: `admin123`

## Done! 🎉

Total time: ~10 minutes

## Troubleshooting

**Backend won't start?**
- Make sure you copied the correct Supabase URL and key
- Check that port 3001 is not already in use

**Frontend can't connect?**
- Make sure backend is running on port 3001
- Check browser console for errors
- Verify VITE_API_URL in frontend/.env

**Database errors?**
- Make sure you ran the schema.sql in Supabase SQL Editor
- Check Supabase dashboard > Table Editor to verify tables exist

## Deploy to Production (Optional)

**Backend** - Deploy to Railway (free):
1. Go to https://railway.app
2. Sign up and create new project
3. Add PostgreSQL database (Railway provides free Postgres)
4. Deploy from GitHub or upload code
5. Add environment variables in Railway dashboard

**Frontend** - Deploy to Vercel (free):
1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
4. Deploy

Both platforms have generous free tiers perfect for this app!
