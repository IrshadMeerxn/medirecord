# 🏥 MediRecord - 100% Free Backend

Your medical records app now runs on completely free infrastructure!

## What Changed?

✅ Replaced Internet Computer (ICP) with Supabase PostgreSQL  
✅ Replaced Motoko with Node.js + Express  
✅ Removed all blockchain dependencies  
✅ Simple REST API instead of canisters  
✅ 100% free to run and deploy  

## Quick Start (10 minutes)

### Step 1: Supabase Setup (3 min)
1. Go to https://supabase.com (free signup, no credit card)
2. Create new project
3. Go to SQL Editor → Run `src/backend/schema.sql`
4. Copy Project URL and anon key from Settings → API

### Step 2: Backend Setup (2 min)
```bash
cd src/backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm start
```

### Step 3: Frontend Setup (2 min)
```bash
cd src/frontend
cp .env.example .env
npm install
npm run dev
```

### Step 4: Login
Open http://localhost:5173
- Username: `admin`
- Password: `admin123`

## Full Documentation

- **SETUP.md** - Detailed setup instructions
- **README.md** - Architecture and deployment info
- **src/backend/README.md** - API documentation

## What You Get Free

- **Database**: 500MB PostgreSQL (Supabase)
- **Backend**: Unlimited requests (Railway/Render free tier)
- **Frontend**: Unlimited bandwidth (Vercel/Netlify free tier)
- **No credit card required anywhere!**

## Need Help?

Check SETUP.md for troubleshooting and deployment guides.

Enjoy your free medical records system! 🎉
