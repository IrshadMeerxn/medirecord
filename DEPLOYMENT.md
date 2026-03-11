# Free Deployment Guide

Deploy your MediRecord app to production for $0/month!

## Option 1: Railway + Vercel (Recommended)

### Backend on Railway (Free)

1. **Sign up at https://railway.app**
   - Connect your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `src/backend` as root directory

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically creates a free Postgres instance

4. **Configure Environment Variables**
   - Click on your backend service
   - Go to "Variables" tab
   - Railway auto-adds DATABASE_URL
   - Add these variables:
     ```
     SUPABASE_URL=${{Postgres.DATABASE_URL}}
     PORT=3001
     ```
   - Note: Railway's Postgres replaces Supabase in production

5. **Deploy**
   - Railway auto-deploys on git push
   - Copy your backend URL (looks like: https://your-app.railway.app)

### Frontend on Vercel (Free)

1. **Sign up at https://vercel.com**
   - Connect your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory to `src/frontend`

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable**
   - Add: `VITE_API_URL=https://your-app.railway.app/api`
   - (Use your Railway backend URL from step 5 above)

5. **Deploy**
   - Click "Deploy"
   - Your app will be live at https://your-app.vercel.app

## Option 2: Render (All-in-One)

### Backend + Database on Render

1. **Sign up at https://render.com**

2. **Create PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Name: medirecord-db
   - Free tier selected
   - Click "Create Database"
   - Copy the "Internal Database URL"

3. **Deploy Backend**
   - Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Root Directory: `src/backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables:
     ```
     SUPABASE_URL=<your-internal-database-url>
     PORT=3001
     ```
   - Click "Create Web Service"
   - Copy your backend URL

4. **Deploy Frontend**
   - Dashboard → "New" → "Static Site"
   - Connect your GitHub repository
   - Root Directory: `src/frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     ```
   - Click "Create Static Site"

## Option 3: Fly.io (Advanced)

### Backend on Fly.io

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login and Launch**
   ```bash
   fly auth login
   cd src/backend
   fly launch
   ```

3. **Add PostgreSQL**
   ```bash
   fly postgres create
   fly postgres attach <postgres-app-name>
   ```

4. **Set Secrets**
   ```bash
   fly secrets set PORT=3001
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

### Frontend on Cloudflare Pages

1. **Sign up at https://pages.cloudflare.com**
2. Connect GitHub repository
3. Build settings:
   - Build command: `cd src/frontend && npm install && npm run build`
   - Build output: `src/frontend/dist`
4. Environment variable:
   - `VITE_API_URL=https://your-app.fly.dev/api`
5. Deploy

## Free Tier Limits

### Railway
- 500 hours/month (enough for 1 app)
- 512MB RAM
- 1GB disk
- Shared CPU

### Vercel
- Unlimited bandwidth
- 100GB bandwidth/month
- Automatic SSL
- Global CDN

### Render
- 750 hours/month (enough for 1 app)
- 512MB RAM
- Automatic SSL
- Free PostgreSQL (90 days, then $7/month)

### Fly.io
- 3 shared VMs
- 256MB RAM each
- 3GB storage
- 160GB bandwidth/month

## Database Migration

If using Railway or Render Postgres instead of Supabase:

1. Connect to your database
2. Run the SQL from `src/backend/schema.sql`
3. Update backend `.env` with new database URL

## Custom Domain (Optional)

All platforms support free custom domains:
- Vercel: Project Settings → Domains
- Railway: Service Settings → Networking
- Render: Dashboard → Custom Domain

## Monitoring

- **Railway**: Built-in logs and metrics
- **Vercel**: Analytics dashboard
- **Render**: Logs in dashboard
- **Fly.io**: `fly logs` command

## Cost Optimization

To stay within free tiers:
- Use Railway's sleep mode (auto-sleeps after 5 min inactivity)
- Optimize database queries
- Enable caching where possible
- Monitor usage in dashboards

## Production Checklist

- [ ] Change default admin password
- [ ] Enable HTTPS (automatic on all platforms)
- [ ] Set up database backups
- [ ] Configure CORS for your domain
- [ ] Add error monitoring (Sentry free tier)
- [ ] Set up uptime monitoring (UptimeRobot free)

Your app is now live and costs $0/month! 🎉
